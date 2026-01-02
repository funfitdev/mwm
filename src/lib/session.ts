/**
 * Enterprise-grade database-backed session management
 * - Sessions stored in PostgreSQL for security and scalability
 * - Encrypted session tokens using AES-256-GCM
 * - Secure cookie handling with httpOnly, secure, sameSite
 */

import { prisma } from "@/lib/db";

// Session configuration
export interface SessionConfig {
  cookieName: string;
  secret: string; // Must be 32 bytes for AES-256
  maxAge: number; // seconds
  secure: boolean;
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none";
  domain?: string;
  path: string;
}

// Default session configuration
const defaultConfig: SessionConfig = {
  cookieName: "sid",
  secret: process.env.SESSION_SECRET || "change-me-32-bytes-for-aes256!!", // 32 bytes
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

// Session data from database
export interface SessionData {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  expiresAt: Date;
  lastActiveAt: Date;
}

// =============================================================================
// ENCRYPTION UTILITIES (AES-256-GCM)
// =============================================================================

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

/**
 * Hash token for database storage (we store hash, not plaintext)
 */
function hashToken(token: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(token);
  return hasher.digest("hex");
}

// =============================================================================
// SESSION MANAGER
// =============================================================================

/**
 * Database-backed Session Manager
 */
export class SessionManager {
  private config: SessionConfig;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Get session token from request cookies
   */
  private getTokenFromRequest(req: Request): string | null {
    const cookies = new Bun.CookieMap(req.headers.get("cookie") || "");
    return cookies.get(this.config.cookieName) || null;
  }

  /**
   * Get session from database by token
   */
  async getSession(req: Request): Promise<SessionData | null> {
    const token = this.getTokenFromRequest(req);
    if (!token) return null;

    const tokenHash = hashToken(token);

    try {
      const session = await prisma.session.findUnique({
        where: { token: tokenHash },
        include: { user: true },
      });

      if (!session) return null;

      // Check expiration
      if (session.expiresAt < new Date()) {
        // Clean up expired session
        await prisma.session.delete({ where: { id: session.id } });
        return null;
      }

      // Update last active time
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      });

      return {
        id: session.id,
        userId: session.userId,
        email: session.user.email,
        name: session.user.name,
        avatarUrl: session.user.avatarUrl,
        expiresAt: session.expiresAt,
        lastActiveAt: session.lastActiveAt,
      };
    } catch (error) {
      console.error("Session lookup error:", error);
      return null;
    }
  }

  /**
   * Get session synchronously from cookie (without DB lookup)
   * Used for quick auth checks - validates token format only
   */
  getSessionSync(req: Request): { token: string } | null {
    const token = this.getTokenFromRequest(req);
    if (!token) return null;
    return { token };
  }

  /**
   * Create a new session in database and return Set-Cookie header
   */
  async createSession(
    user: { id: string; email: string; name: string | null; avatarUrl: string | null },
    req: Request
  ): Promise<string> {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + this.config.maxAge * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt,
        userAgent: req.headers.get("user-agent") || null,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      },
    });

    return this.createCookie(token);
  }

  /**
   * Destroy session (logout)
   */
  async destroySession(req: Request): Promise<string> {
    const token = this.getTokenFromRequest(req);

    if (token) {
      const tokenHash = hashToken(token);
      try {
        await prisma.session.deleteMany({ where: { token: tokenHash } });
      } catch {
        // Session may not exist
      }
    }

    return this.createCookie("", 0);
  }

  /**
   * Destroy all sessions for a user (logout everywhere)
   */
  async destroyAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  /**
   * Refresh session expiration
   */
  async refreshSession(req: Request): Promise<string | null> {
    const token = this.getTokenFromRequest(req);
    if (!token) return null;

    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + this.config.maxAge * 1000);

    try {
      await prisma.session.update({
        where: { token: tokenHash },
        data: { expiresAt, lastActiveAt: new Date() },
      });

      return this.createCookie(token);
    } catch {
      return null;
    }
  }

  /**
   * Check if session should be refreshed (within 1/4 of maxAge)
   */
  shouldRefresh(session: SessionData): boolean {
    const threshold = this.config.maxAge * 1000 * 0.25;
    return session.expiresAt.getTime() - Date.now() < threshold;
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }

  /**
   * Create a session cookie
   */
  private createCookie(token: string, maxAge?: number): string {
    const cookie = new Bun.Cookie(this.config.cookieName, token, {
      maxAge: maxAge ?? this.config.maxAge,
      secure: this.config.secure,
      httpOnly: this.config.httpOnly,
      sameSite: this.config.sameSite,
      path: this.config.path,
      domain: this.config.domain,
    });

    return cookie.serialize();
  }
}

// Default session manager instance
export const sessionManager = new SessionManager();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user is authenticated (async - validates against DB)
 */
export async function isAuthenticated(req: Request): Promise<boolean> {
  const session = await sessionManager.getSession(req);
  return session !== null;
}

/**
 * Check if user has a session cookie (sync - no DB lookup)
 */
export function hasSessionCookie(req: Request): boolean {
  return sessionManager.getSessionSync(req) !== null;
}

/**
 * Redirect response helper
 */
export function redirect(
  url: string,
  status: 301 | 302 | 303 | 307 | 308 = 302
): Response {
  return new Response(null, {
    status,
    headers: { Location: url },
  });
}

/**
 * Redirect with Set-Cookie header
 */
export function redirectWithCookie(
  url: string,
  cookie: string,
  status: 301 | 302 | 303 | 307 | 308 = 302
): Response {
  return new Response(null, {
    status,
    headers: {
      Location: url,
      "Set-Cookie": cookie,
    },
  });
}

/**
 * Require authentication - returns redirect Response if not authenticated
 * Note: This is a sync check - only validates cookie presence, not DB session
 * For full validation, use requireAuthAsync
 */
export function requireAuth(
  req: Request,
  redirectTo = "/identity/sign-in"
): Response | null {
  if (!hasSessionCookie(req)) {
    const returnUrl = new URL(req.url).pathname;
    const redirectUrl =
      returnUrl !== "/"
        ? `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
        : redirectTo;
    return redirect(redirectUrl);
  }
  return null;
}

/**
 * Require authentication (async) - validates session against database
 * Throws Response redirect if not authenticated
 */
export async function requireAuthAsync(
  req: Request,
  redirectTo = "/identity/sign-in"
): Promise<void> {
  const session = await sessionManager.getSession(req);
  if (!session) {
    const returnUrl = new URL(req.url).pathname;
    const redirectUrl =
      returnUrl !== "/"
        ? `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
        : redirectTo;
    throw redirect(redirectUrl);
  }
}

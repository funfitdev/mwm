import { AsyncLocalStorage } from "async_hooks";
import { sessionManager, type SessionData } from "./session";

// Auth session type - expand as needed based on your auth system
export type AuthSession = {
  userId: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  isAuthenticated: boolean;
};

// Request context available to all components
export type RequestContext = {
  request: Request;
  url: URL;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  session: AuthSession;
};

// AsyncLocalStorage instance for request context
export const requestContext = new AsyncLocalStorage<RequestContext>();

// Helper to get the current request context
export function getRequestContext(): RequestContext {
  const ctx = requestContext.getStore();
  if (!ctx) {
    throw new Error(
      "Request context is not available. Make sure you are calling this within a request handler."
    );
  }
  return ctx;
}

// Convenience helpers
export function getRequest(): Request {
  return getRequestContext().request;
}

export function getSession(): AuthSession {
  return getRequestContext().session;
}

export function getSearchParams(): URLSearchParams {
  return getRequestContext().searchParams;
}

export function getParams(): Record<string, string> {
  return getRequestContext().params;
}

// Check if this is a partial request (HTMX or ?partial=yes)
export function isPartialRequest(): boolean {
  const ctx = getRequestContext();
  return (
    ctx.searchParams.get("partial") === "yes" ||
    ctx.request.headers.get("HX-Request") === "true"
  );
}

// Run a function within a request context
export function runWithContext<T>(
  context: RequestContext,
  fn: () => T | Promise<T>
): T | Promise<T> {
  return requestContext.run(context, fn);
}

// Create a default unauthenticated session
export function createGuestSession(): AuthSession {
  return {
    userId: null,
    user: null,
    isAuthenticated: false,
  };
}

// Create auth session from cookie session data
export function createAuthSessionFromCookie(
  sessionData: SessionData | null
): AuthSession {
  if (!sessionData) {
    return createGuestSession();
  }

  return {
    userId: sessionData.userId,
    user: {
      id: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name,
      avatarUrl: sessionData.avatarUrl,
    },
    isAuthenticated: true,
  };
}

// Get auth session from request cookies (async - validates against DB)
export async function getAuthSessionFromRequest(req: Request): Promise<AuthSession> {
  const sessionData = await sessionManager.getSession(req);
  return createAuthSessionFromCookie(sessionData);
}

// Get auth session from request cookies (sync - checks cookie only, no DB validation)
export function getAuthSessionFromRequestSync(req: Request): AuthSession {
  const hasSession = sessionManager.getSessionSync(req);
  if (!hasSession) {
    return createGuestSession();
  }
  // Return a placeholder session - actual user data needs async DB lookup
  return {
    userId: null,
    user: null,
    isAuthenticated: true, // Cookie exists but user data not loaded
  };
}

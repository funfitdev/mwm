import { prisma } from "@/lib/db";
import { sessionManager, redirectWithCookie } from "@/lib/session";
import { getSearchParams } from "@/lib/context";
import { Button } from "@/components/mwm-ui/button";
import { Input } from "@/components/mwm-ui/input";
import { Label } from "@/components/mwm-ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/mwm-ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/mwm-ui/alert";
import { AlertCircle } from "lucide-react";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const returnUrl = (formData.get("returnUrl") as string) || "/";

  if (!email || !password) {
    return <SignInForm error="Email and password are required" returnUrl={returnUrl} />;
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { credentials: true },
  });

  if (!user || !user.credentials) {
    return <SignInForm error="Invalid email or password" returnUrl={returnUrl} />;
  }

  // Verify password using Bun.password.verify
  const isValidPassword = await Bun.password.verify(
    password,
    user.credentials.hashedPassword
  );

  if (!isValidPassword) {
    return <SignInForm error="Invalid email or password" returnUrl={returnUrl} />;
  }

  // Check if user is active
  if (!user.isActive) {
    return <SignInForm error="Your account has been deactivated" returnUrl={returnUrl} />;
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Create session and get cookie
  const cookie = await sessionManager.createSession(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    req
  );

  // Redirect to return URL with session cookie
  return redirectWithCookie(returnUrl, cookie, 303);
}

function SignInForm({
  error,
  returnUrl = "/",
}: {
  error?: string;
  returnUrl?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="POST" className="flex flex-col gap-4">
            <input type="hidden" name="returnUrl" value={returnUrl} />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/identity/sign-up" className="text-primary hover:underline ml-1">
            Sign up
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  const searchParams = getSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  return <SignInForm returnUrl={returnUrl} />;
}

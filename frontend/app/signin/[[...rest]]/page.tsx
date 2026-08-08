import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Header } from '@/components/header';

// Clerk's <SignIn /> owns several sub-routes (factor-two, sso-callback, reset
// password). The optional catch-all segment is what lets it route inside this
// page instead of 404ing on them.
export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-6">
        <SignIn
          routing="path"
          path="/signin"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
        />
        <p className="text-xs text-muted-foreground text-center">
          You can{' '}
          <Link href="/generate" className="text-primary hover:text-accent">
            generate code without an account
          </Link>{' '}
          — signing in only adds saved history.
        </p>
      </div>
    </div>
  );
}

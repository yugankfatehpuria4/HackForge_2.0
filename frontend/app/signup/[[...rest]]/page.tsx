import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-6">
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/signin"
          fallbackRedirectUrl="/dashboard"
        />
        <p className="text-xs text-muted-foreground text-center">
          You can{' '}
          <Link href="/generate" className="text-primary hover:text-accent">
            generate code without an account
          </Link>{' '}
          — signing up only adds saved history.
        </p>
      </div>
    </div>
  );
}

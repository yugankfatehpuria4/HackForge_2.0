'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-provider';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send people back where they came from, defaulting somewhere useful.
  const next = searchParams.get('next') || '/dashboard';
  const isRegister = mode === 'register';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isRegister && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (isRegister) {
        await register(email, password, name);
        toast.success('Account created');
      } else {
        await login(email, password);
        toast.success('Signed in');
      }
      router.push(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="glass-effect border-white/10 w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRegister ? <UserPlus className="h-5 w-5 text-primary" /> : <LogIn className="h-5 w-5 text-primary" />}
              {isRegister ? 'Create your account' : 'Sign in'}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? 'Your projects are saved to your account and only visible to you.'
                : 'Sign in to see the projects you have saved.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? 'At least 8 characters' : ''}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full neon-glow">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isRegister ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : isRegister ? (
                  'Create account'
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(isRegister ? 'login' : 'register');
                  setError(null);
                }}
                className="text-primary hover:text-accent transition-colors"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </p>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              You can{' '}
              <Link href="/generate" className="text-primary hover:text-accent">
                generate code without an account
              </Link>{' '}
              — signing in only adds saved history.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

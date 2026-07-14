"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Globe, Eye, EyeOff, AlertCircle
} from 'lucide-react';
// Added otpApi and isApiError to imports
import { authApi, otpApi, isApiError } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  useEffect(() => {
    const isValid = identifier.trim().length >= 5 && password.length >= 6;
    setIsFormValid(isValid);
  }, [identifier, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setError('');
    setUnverifiedEmail('');

    try {
      const result = await authApi.login(identifier, password);
      if (result.token) {
        if (result.user.role === 'recycler') {
          setError('This account is registered as a Recycler. Please use the Recycler login portal.');
          setLoading(false);
          return;
        }
        setToken(result.token);
        if (result.user) setUser(result.user);
        
        if (result.user.role === 'recycler') {
          router.push('/dashboard/recyclers');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      // FIX: Use isApiError type guard
      if (isApiError(err)) {
        if (err.code === 'email_not_verified') {
          const data = err.data as { email?: string } | undefined;
          setUnverifiedEmail(data?.email || identifier.trim());
          setError('Please verify your email before signing in.');
          return;
        }
        setError(err.message || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setLoading(true);
    setError('');
    try {
      await otpApi.send('email', unverifiedEmail, 'email-verification');
      router.push(`/auth/individual/verify-email?email=${encodeURIComponent(unverifiedEmail)}&purpose=signup`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of your component remains unchanged)
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      {/* Wave Background */}
      <div className="absolute top-0 left-0 w-full h-48 md:h-64 lg:h-72 bg-[#f6fcf4] z-0">
         <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12 md:h-20 lg:h-24 block" fill="#ffffff">
           <path d="M0,120 L1200,120 L1200,0 Q600,140 0,0 Z" />
         </svg>
      </div>

      <header className="relative z-20 w-full flex justify-between items-center px-6 md:px-12 lg:px-24 pt-6 pb-4">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full">
          <Image src="/images/logo.png" alt="EcoSmart AI" width={130} height={38} className="h-8 w-auto md:h-9 object-contain" />
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        <div className="text-center mb-8 md:mb-12 w-full">
          <h1 className="text-[32px] md:text-4xl lg:text-5xl leading-tight font-bold text-[#1b5030] mb-2 md:mb-4">Welcome Back</h1>
          <p className="text-[14px] md:text-lg text-gray-500 font-medium px-4">Sign in to continue</p>
        </div>

        <div className="w-full max-w-xl bg-white md:bg-gray-50/30 md:border md:border-gray-100 md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] md:p-10 lg:p-12 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#eaf4e7] rounded-full px-4 py-1.5 md:py-2 md:px-5 transition-all">
              <span className="text-[13px] md:text-sm font-medium text-[#1b5030]">Signing in as an Individual</span>
              <Link href="/auth/recycler/sign-in" className="text-[13px] md:text-sm font-medium text-gray-500 hover:text-gray-800 ml-2 transition-colors underline-offset-2 hover:underline">Change</Link>
            </div>
          </div>

          <form className="w-full flex flex-col gap-5 md:gap-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] md:text-sm text-red-600 font-medium">{error}</p>
                  {unverifiedEmail && (
                    <button type="button" onClick={handleResendVerification} className="mt-2 text-[13px] font-bold text-[#1b5030] hover:underline">
                      Send verification code
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* ... Rest of your input fields ... */}
          </form>
        </div>
      </main>
    </div>
  );
}
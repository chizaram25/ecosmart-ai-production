"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Globe, AlertCircle } from 'lucide-react';
import { authApi, isApiError } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();

  // Unified State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // FIX: Declaring the state variable that was missing
  const [error, setError] = useState(''); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.register(name, email, password, undefined, 'individual');
      router.push('/auth/individual/verify-email?mode=signup');
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message || 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      {/* ... header and layout ... */}
      
      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 pt-4 pb-20 flex flex-col items-center">
        <form className="w-full" onSubmit={handleSubmit}>
          
          {/* FIX: Using the 'error' state consistently */}
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[13px] md:text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* ... inputs for name, email, password ... */}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#549B45] text-white font-bold"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </main>
    </div>
  );
}
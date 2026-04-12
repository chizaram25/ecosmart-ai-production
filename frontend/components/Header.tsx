'use client'
import { useRouter } from 'next/navigation';



export function Header() {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between border-b border-[#eef1eb] px-5 py-5 sm:px-8">
      <div className="flex items-center gap-2">
        <img
          src="/images/logo.png"
          alt="EcoSmart AI Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <button 
      onClick={() => router.push('/auth/sign-in')}
      className="text-sm font-semibold text-[#599432] transition hover:opacity-80">
        Sign In
      </button>
    </header>
  );
}
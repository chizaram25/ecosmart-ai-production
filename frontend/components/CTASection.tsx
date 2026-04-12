'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function CTASection() {
  return (
    <section className="px-5 py-8 sm:px-8 sm:py-10">
      <div className="relative overflow-hidden rounded-[30px] bg-[#5c8e3b37] px-6 py-10 text-center shadow-[0_18px_40px_rgba(76,122,58,0.12)] sm:px-10">
        <div className="absolute -left-7.5 -top-2.5 h-28 w-28 rounded-full bg-[#7b95732e] opacity-80" />
        <div className="absolute -bottom-10 right-8 h-40 w-40 rounded-full bg-[#7b95732e] opacity-80" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <Image
            src="/images/Leaf.png"
            alt="Leaf"
            width={80}
            height={80}
            className="h-80 w-80 object-contain"
          />
        </div>

        <h3 className="relative z-10 mx-auto mt-6 max-w-110 text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-4xl">
          Start making smarter eco decisions today
        </h3>

        <Link
          href="/auth/sign-up"
          className="relative z-10 mt-7 inline-flex w-full max-w-107.5 items-center justify-center rounded-full bg-[#599432] px-6 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(94,159,47,0.28)] transition hover:-translate-y-px hover:bg-[#548f2a]"
        >
          Get Started
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 w-full bg-[#f1f8ee] border-t border-green-50 mt-10">
      <div className="absolute top-[-30px] left-0 w-full overflow-hidden leading-[0]">
         <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[30px] block" fill="#f1f8ee">
           <path d="M0,120 L1200,120 L1200,0 Q600,60 0,0 Z" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-1.5 cursor-pointer md:mr-auto">
          <Leaf className="w-5 h-5 text-[#449339]" />
          <span className="font-bold text-[#449339] text-sm">EcoSmart AI</span>
        </div>

        <div className="flex gap-6 text-[13px] md:text-sm font-bold text-[#1b5030]">
          <Link href="#" className="hover:text-[#449339] transition-colors">{t("landing.terms")}</Link>
          <Link href="#" className="hover:text-[#449339] transition-colors">{t("landing.privacy")}</Link>
          <Link href="#" className="hover:text-[#449339] transition-colors">{t("landing.contact")}</Link>
        </div>

        <p className="text-[12px] md:text-sm text-gray-500 font-medium md:ml-auto text-center md:text-right">
          {t("landing.copyright")}
        </p>
      </div>
    </footer>
  );
}

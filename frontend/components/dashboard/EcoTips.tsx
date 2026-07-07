"use client";

import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EcoTipCard() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#dff0dc] p-4 shadow-sm ring-1 ring-black/5 sm:rounded-[26px] sm:p-5">
      <div className="absolute -bottom-4 right-0 h-24 w-24 rounded-full bg-[#cde6c7]" />
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5c9d35] shadow-sm">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {t("dashboard.ecoTip")}
          </h3>
          <p className="mt-1 text-base text-slate-600 sm:text-lg">
            {t("dashboard.ecoTipText")}
          </p>
        </div>
      </div>
    </section>
  );
}
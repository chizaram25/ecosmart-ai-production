import Image from 'next/image';
import { Header } from '@/components/Header';
import {Hero} from '@/components/Hero';
import { FeaturesStrip } from '@/components/FeatureStrip';
import { FeatureCards } from '@/components/FeatureCards';
import { HowItWorks } from '@/components/HowItWorks';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
  <section className="w-full px-5 py-6 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-4xl border border-[#e8ece5] bg-white shadow-[0_20px_60px_rgba(54,78,42,0.08)]">
      <Header />
      <Hero />
      <FeaturesStrip />
      <FeatureCards />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  </section>
</main>
  );
}

























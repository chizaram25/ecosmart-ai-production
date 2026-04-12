'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type Slide =
  | {
      id: number;
      type: 'custom';
    }
  | {
      id: number;
      type: 'image';
      src: string;
      alt: string;
    };

const slides: Slide[] = [
  {
    id: 1,
    type: 'custom',
  },
  {
    id: 2,
    type: 'image',
    src: '/images/CarouselScan.png',
    alt: 'EcoSmart carousel second slide',
  },
  {
    id: 3,
    type: 'image',
    src: '/images/Plant.png',
    alt: 'EcoSmart carousel third slide',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = slides[currentSlide];

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
      <div className="absolute -left-7.5 top-28 h-28 w-28 rounded-full bg-[#dfe9dd] opacity-70" />
      <div className="absolute -right-2.5 top-12 h-36 w-36 rounded-full bg-[#e8efe1] opacity-90" />

      <div className="relative z-10 text-center">
        <h1 className="mx-auto max-w-[320px] text-4xl font-bold leading-tight tracking-[-0.03em] text-[#0f172a] sm:max-w-105 sm:text-5xl">
          Turn Your Waste Into Value
        </h1>

        <p className="mx-auto mt-5 max-w-105 text-base leading-7 text-slate-800 sm:text-lg">
          Scan, identify, and earn from recyclable waste while helping the
          environment
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/auth/sign-up"
            className="inline-flex w-full max-w-107.5 items-center justify-center rounded-full bg-[#5e9f2f] px-6 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(94,159,47,0.28)] transition hover:-translate-y-px hover:bg-[#548f2a]"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>

          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center text-base font-semibold text-[#3f8341] transition hover:opacity-80"
          >
            See how it works
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex justify-center">
        <div className="relative h-80 w-full max-w-110 sm:h-90">
          {current.type === 'custom' ? (
            <>
              <div className="absolute left-1/2 top-1/2 h-55 w-55 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#edf2ea]" />
              <div className="absolute left-1/2 top-1/2 h-42.5 w-42.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dfe8db]" />

              <div className="absolute left-1/2 top-1/2 flex h-23 w-23 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#5b9636]">
                <Image
                    src="/images/Leaf.png"
                    alt="leaf"
                     width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                    />
              </div>

              <div className="absolute right-[18%] top-[28%] flex h-14 w-14 items-center justify-center rounded-full bg-[#20ba4f]">
                <Image
                  src="/images/Scan.png"
                  alt="scan"
                   width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                />
              </div>

              <div className="absolute left-[28%] top-[58%] flex h-14 w-14 items-center justify-center rounded-full bg-[#104f26]">
                <Image
                  src="/images/Naira.png"
                  alt="naira"
                   width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                />
              </div>
            </>
          ) : (
            <div className="absolute left-1/2 top-1/2 flex h-55 w-55 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[28px] bg-[#edf2ea]">
              <Image
                src={current.src}
                alt={current.alt}
                width={220}
                height={220}
                className="object-contain"
              />
            </div>
          )}

          <div className="absolute left-[18%] top-[18%] rounded-[20px] bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e7f5e5]">
                <Image
                  src="/images/Tick.png"
                  alt="check"
                   width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Plastic Bottle</p>
                <p className="text-sm text-gray-500">Recyclable</p>
              </div>
            </div>
          </div>

          <div className="absolute right-[10%] top-[60%] rounded-[20px] bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0c7]">
                <Image
                  src="/images/Dollarsign.png"
                  alt="money"
                   width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Your Earnings</p>
                <p className="text-2xl font-bold text-[#5a9a2d]">₦2,400</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={
                  index === currentSlide
                    ? 'h-2.5 w-8 rounded-full bg-[#6ca63c]'
                    : 'h-2.5 w-2.5 rounded-full bg-gray-300'
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
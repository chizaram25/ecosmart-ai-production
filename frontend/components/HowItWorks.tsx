import Image from 'next/image';

export function HowItWorks() {
  const steps = [
    { number: '1', title: 'Scan or upload waste', image: '/images/ScanIcon.png' },
    { number: '2', title: 'Get instant analysis', image: '/images/Bolt.png' },
    { number: '3', title: 'Recycle and earn', image: '/images/TrendUp.png' },
  ];

  return (
    <section id="how-it-works" className="px-5 py-10 sm:px-8">
      <h2 className="text-center text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[2.5rem]">
        How It Works
      </h2>

      <div className="relative mx-auto mt-8 max-w-125 space-y-5">
        <div className="absolute left-5.5 top-6 h-[calc(100%-48px)] w-0.5 bg-[#dfe8da]" />

        {steps.map((step) => (
          <div key={step.number} className="relative flex items-center gap-4">
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3f8a3b] text-lg font-bold text-white shadow-[0_10px_24px_rgba(63,138,59,0.24)]">
              {step.number}
            </div>

            <div className="flex min-h-21.5 flex-1 items-center gap-4 rounded-[22px] border border-[#eef1eb] bg-white px-5 shadow-[0_10px_26px_rgba(18,25,38,0.05)]">
              <Image
                src={step.image}
                alt={step.title}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <p className="text-lg font-semibold text-slate-800">{step.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
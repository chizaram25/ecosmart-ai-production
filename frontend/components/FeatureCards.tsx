import Image from 'next/image';
import { CheckCircleIcon as ScanIcon, CurrencyDollarIcon as DollarIcon, SparklesIcon as LeafIcon } from '@heroicons/react/24/outline';




export function FeatureCards() {
  const cards = [
    {
      title: 'Scan Waste',
      description: 'Use AI to identify waste instantly',
      icon: ScanIcon,
    },
    {
      title: 'Earn Money',
      description: 'Get value from recyclable items',
      icon: DollarIcon,
    },
    {
      title: 'Reduce Climate Impact',
      description: 'Make smarter eco decisions',
      icon: LeafIcon,
    },
  ];

  return (
    <section className="space-y-4 px-5 py-8 sm:px-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="flex items-start gap-4 rounded-3xl border border-[#eef1eb] bg-white p-5 shadow-[0_10px_26px_rgba(18,25,38,0.05)] transition hover:-translate-y-0.5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5e6] text-[#3f8742]">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-slate-800 sm:text-xl">
                {card.title}
              </h3>
              <p className="mt-1 text-base text-slate-500">{card.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}




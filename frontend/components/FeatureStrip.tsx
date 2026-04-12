import Image from "next/image";




export function FeaturesStrip() {
  const items = [
    { img: "/images/Starsign.png", label: "AI-powered detection" },
    { img: "/images/Whitedollar.png", label: "Earn from waste" },
    { img: "/images/Leaficon.png", label: "Eco-friendly impact" },
  ];

  return (
    <section className="border-t border-[#f1f3ef] bg-[#fbfcfa] px-5 py-6 sm:px-8">
      <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-3">
        {items.map((item) => {
          return (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4e3]">
                <Image
                  src={item.img}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>

              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
import { Camera, Upload } from "lucide-react";

type ScanCardProps = {
  handleQuickAction: (actionId: string) => void;
};

export default function ScanCard({ handleQuickAction }: ScanCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#4d973a] via-[#398736] to-[#1f6f33] p-4 text-white shadow-[0_20px_40px_rgba(74,143,67,0.25)] sm:rounded-[28px] sm:p-5">
      <div className="absolute -left-10 top-16 h-28 w-28 rounded-full bg-white/10" />
      <div className="absolute -right-6 top-0 h-32 w-32 rounded-full bg-white/10" />

      <div className="relative z-10">
        <h2 className="text-[1.55rem] font-bold leading-tight sm:text-[1.9rem]">
          Scan Your Waste
        </h2>
        <p className="mt-1 text-sm text-white/80 sm:text-base">
          Identify and earn from recyclable waste
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
          <button
            onClick={() => handleQuickAction("scan")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-semibold text-[#4d973a] transition hover:scale-[1.02] sm:py-4"
          >
            <Camera className="h-5 w-5" />
            Scan Now
          </button>

          <button
            onClick={() => handleQuickAction("upload")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:py-4"
          >
            <Upload className="h-5 w-5" />
            Upload
          </button>
        </div>
      </div>
    </section>
  );
}
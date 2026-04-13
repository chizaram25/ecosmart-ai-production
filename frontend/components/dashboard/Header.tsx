import { Leaf, Menu } from "lucide-react";

type DashboardHeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DashboardHeader({
  isMenuOpen,
  setIsMenuOpen,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-center gap-2 font-semibold text-[#2f7d32]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7bbf71] bg-white">
          <Leaf className="h-4 w-4" />
        </span>
        <span className="text-lg">EcoSmart AI</span>
      </div>

      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="rounded-xl p-2 text-slate-700 transition hover:bg-white"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
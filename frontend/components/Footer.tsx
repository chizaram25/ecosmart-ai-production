

export function Footer() {
  return (
    <footer className="border-t border-[#eef1eb] px-5 py-8 text-center sm:px-8">
      <nav className="flex items-center justify-center gap-6 text-base font-medium text-[#3f8341] sm:gap-10 sm:text-lg">
        <a href="#" className="transition hover:opacity-80">
          Terms
        </a>
        <a href="#" className="transition hover:opacity-80">
          Privacy
        </a>
        <a href="#" className="transition hover:opacity-80">
          Contact
        </a>
      </nav>

      <p className="mt-5 text-sm text-slate-800">© 2026 EcoSmart AI. All rights reserved.</p>
    </footer>
  );
}
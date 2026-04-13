import {
  X,
  Home,
  ScanLine,
  Activity,
  User,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

type ProfileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: "home" | "scan" | "activity" | "profile") => void;
};

export default function ProfileSidebar({
  isOpen,
  onClose,
  onNavigate,
}: ProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="absolute inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      <aside className="absolute bottom-0 right-0 z-50 h-full w-[82%] max-w-[320px] bg-white px-5 py-6 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2f7d32] text-xl font-semibold text-white">
              M
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Maryam</h3>
              <p className="text-sm text-slate-500">Eco User</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              onNavigate("home");
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl bg-[#eef7ea] px-4 py-3 text-left text-[#4f8b3a]"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => {
              onNavigate("scan");
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
          >
            <ScanLine className="h-5 w-5" />
            <span>Scan Waste</span>
          </button>

          <button
            onClick={() => {
              onNavigate("activity");
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
          >
            <Activity className="h-5 w-5" />
            <span>Activity</span>
          </button>

          <button
            onClick={() => {
              onNavigate("profile");
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </div>

        <div className="my-8 border-t border-slate-200" />

        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50">
            <CircleHelp className="h-5 w-5" />
            <span>Help & Support</span>
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#e57373] hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
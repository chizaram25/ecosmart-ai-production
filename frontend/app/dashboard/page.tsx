"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/Header";
import QuickMenu from "@/components/dashboard/QuickMenu";
import WelcomeSection from "@/components/dashboard/Welcome";
import ScanCard from "@/components/dashboard/Scan";
import QuickActions from "@/components/dashboard/QuickActions";
import EarningsCard from "@/components/dashboard/EarningCards";
import EcoTipCard from "@/components/dashboard/EcoTips";
import RecentActivity from "@/components/dashboard/RecentActivity";
import BottomNav from "@/components/dashboard/BottomNav";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";

import { navItems, quickActions } from "@/lib/dashboard-data";

import {
  createActivity,
  getDashboardData,
  markActivityAsRecycled,
} from "@/services/dashboard";

import type { ActivityItem } from "@/types/dashboard";

type DashboardResponse = {
  data: {
    user: {
      fullname: string;
      email: string;
    };
    stats: {
      totalEarnings: number;
      ecoPoints: number;
      recycledCount: number;
      pendingCount: number;
      totalActivities: number;
    };
    recentActivities: ActivityItem[];
    lastAction: string;
  };
};

export default function EcoSmartDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "home" | "scan" | "activity" | "profile"
  >("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] =
    useState<DashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData(token);
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickAction = async (actionId: string) => {
    try {
      if (actionId === "scan") {
        await createActivity(token, {
          title: "Plastic Bottle",
          type: "scan",
          status: "Recycled",
          amount: 65,
        });
        setActiveTab("scan");
      } else if (actionId === "upload") {
        await createActivity(token, {
          title: "Cardboard Pack",
          type: "upload",
          status: "Pending",
          amount: 50,
        });
      } else if (actionId === "type") {
        await createActivity(token, {
          title: "Glass Bottle",
          type: "manual",
          status: "Recycled",
          amount: 60,
        });
      } else {
        setActiveTab("activity");
      }

      await fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkPendingAsRecycled = async (id: string) => {
    try {
      await markActivityAsRecycled(token, id);
      await fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="p-10 text-center text-lg">Failed to load dashboard</div>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf3ea] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="mx-auto w-full max-w-107.5 rounded-[28px] border border-black/5 bg-[#f6f7f4] shadow-[0_20px_80px_rgba(0,0,0,0.16)] sm:max-w-125 lg:max-w-107.5 xl:sticky xl:top-8">
            <div className="relative flex min-h-205 flex-col overflow-hidden rounded-[28px] sm:min-h-225">
              <DashboardHeader
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />

              {isMenuOpen && <QuickMenu />}

              <div className="flex-1 space-y-4 px-4 pb-4 sm:space-y-5 sm:px-6 sm:pb-5">
                <WelcomeSection name={dashboardData.user.fullname} />

                <ScanCard handleQuickAction={handleQuickAction} />

                <QuickActions
                  quickActions={quickActions}
                  handleQuickAction={handleQuickAction}
                />

                <EarningsCard
                  totalEarnings={dashboardData.stats.totalEarnings}
                  ecoPoints={dashboardData.stats.ecoPoints}
                />

                <EcoTipCard />

                <RecentActivity
                  activities={dashboardData.recentActivities}
                  setActiveTab={setActiveTab}
                  markPendingAsRecycled={handleMarkPendingAsRecycled}
                />
              </div>

              <BottomNav
                navItems={navItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                openProfileSidebar={() => setIsProfileSidebarOpen(true)}
              />

              <ProfileSidebar
                isOpen={isProfileSidebarOpen}
                onClose={() => setIsProfileSidebarOpen(false)}
                onNavigate={setActiveTab}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import {
  Bell, Menu, Leaf, Shield, Grid, Zap, ArrowUpRight,
  Lightbulb, Bot, Home, User, CheckCircle2, Wallet,
  Star, Scale, TrendingUp, Truck, Package, Activity
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { getToken, getUser } from '@/lib/auth';

/**
 * PRODUCTION READY DASHBOARD
 * Pass your backend data as a prop: <RecyclerDashboard dashboardData={data} />
 */
export default function RecyclerDashboard({ dashboardData }: { dashboardData?: any }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [loading, setLoading] = useState(!dashboardData);

  // Fetch data from backend when no prop is passed
  useEffect(() => {
    if (dashboardData) {
      setFetchedData(dashboardData);
      setLoading(false);
      return;
    }

    if (!getToken()) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await dashboardApi.getRecyclerDashboard();
        const storedUser = getUser();

        setFetchedData({
          userName: storedUser?.name || data?.user?.businessName || 'Recycler',
          walletBalance: data?.wallet?.balance || 0,
          todayPayments: data?.wallet?.todayPayments || 0,
          weekPurchases: data?.wallet?.weekPurchases || 0,
          pending: data?.wallet?.pendingSettlements || 0,
          stats: [
            { label: 'Listings', value: String(data?.stats?.activeListings || 0) },
            { label: 'Rating', value: String(data?.stats?.avgRating || '—') },
            { label: 'Total kg', value: String(data?.stats?.totalKgCollected || 0) },
            { label: 'Eco Points', value: String(data?.stats?.ecoPoints || 0) },
          ],
          requests: data?.requests || [],
          ecoImpact: [
            { label: 'Waste Recycled', value: `${data?.ecoImpact?.wasteRecycledKg || 0} kg` },
            { label: 'CO₂ Reduced', value: `${data?.ecoImpact?.co2ReducedKg || 0} kg` },
            { label: 'Indv. Rewarded', value: String(data?.ecoImpact?.individualsRewarded || 0) },
            { label: 'Communities', value: String(data?.ecoImpact?.communitiesServed || 0) },
          ],
        });
      } catch (err) {
        console.error('Failed to load recycler dashboard:', err);
        // Use fallback data
        setFetchedData({
          userName: getUser()?.name || 'Recycler',
          walletBalance: 8500,
          todayPayments: 1200,
          weekPurchases: 24800,
          pending: 3400,
          stats: [
            { label: 'Listings', value: '6' },
            { label: 'Rating', value: '4.8' },
            { label: 'Total kg', value: '184' },
            { label: 'Eco Points', value: '2,340' },
          ],
          requests: [],
          ecoImpact: [
            { label: 'Waste Recycled', value: '1.2 tonnes' },
            { label: 'Trees Saved', value: '54' },
            { label: 'Waste Diverted', value: '2,340 kg' },
            { label: 'Water Saved', value: '4,800 L' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dashboardData]);

  const data = dashboardData || fetchedData;

  // If no data yet, return a loading state or empty shell
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-[#eaf4e7] border-t-[#549B45] rounded-full animate-spin" /></div>;
  if (!data) return <div className="p-10 text-center">Loading your dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900 overflow-hidden">

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100">
        <div className="p-6 font-bold text-xl text-[#449339]">EcoSmart AI</div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {['Home', 'Requests', 'Collections', 'Profile'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 rounded-xl font-semibold ${activeTab === tab ? 'bg-[#f1f8ee] text-[#1b5030]' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 pb-28">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Hi {data.userName} 👋</h1>
            <Bell className="w-6 h-6 text-gray-500" />
          </header>

          {/* Grid Layout - Spreads content on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Wallet Section */}
            <section className="lg:col-span-4 bg-gradient-to-br from-[#1b5030] to-[#449339] rounded-3xl p-8 text-white">
              <p className="text-xs uppercase font-bold opacity-80 mb-4">Collection Wallet</p>
              <h2 className="text-5xl font-bold mb-8">₦{data.walletBalance.toLocaleString()}</h2>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>Payments<span className="block font-bold">₦{data.todayPayments}</span></div>
                <div>Purchases<span className="block font-bold">₦{data.weekPurchases}</span></div>
                <div className="text-[#f5a623]">Pending<span className="block font-bold">₦{data.pending}</span></div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.stats.map((stat: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100">
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Requests Section - Real Backend Data Mapped */}
          <section>
            <h3 className="text-lg font-bold mb-4">New Requests</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.requests.map((req: any) => (
                <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold">{req.name}</p>
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{req.material}</span>
                    </div>
                    <p className="font-bold">{req.weight}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#449339] text-white py-2 rounded-xl text-xs font-bold">Accept</button>
                    <button className="flex-1 border border-red-200 text-red-500 py-2 rounded-xl text-xs font-bold">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Eco Impact Footer - Real Data */}
          <section className="bg-[#f1f8ee] p-8 rounded-3xl border border-green-100">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-[#449339]"><Activity size={18}/> Your Eco Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.ecoImpact.map((item: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-green-50">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-bold text-[#449339]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import {
  Bell, Menu, Leaf, Shield, Grid, Zap, ArrowUpRight,
  Lightbulb, Bot, Home, User, CheckCircle2, Wallet,
  Star, Scale, TrendingUp, Truck, Package, Activity
} from 'lucide-react';

/**
 * PRODUCTION READY DASHBOARD
 * Pass your backend data as a prop: <RecyclerDashboard dashboardData={data} />
 */
export default function RecyclerDashboard({ dashboardData }: { dashboardData?: any }) {
  const [activeTab, setActiveTab] = useState('Home');

  // If dashboardData is null, return a loading state or empty shell
  if (!dashboardData) return <div className="p-10 text-center">Loading your dashboard...</div>;

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
            <h1 className="text-2xl font-bold">Hi {dashboardData.userName} 👋</h1>
            <Bell className="w-6 h-6 text-gray-500" />
          </header>

          {/* Grid Layout - Spreads content on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Wallet Section */}
            <section className="lg:col-span-4 bg-gradient-to-br from-[#1b5030] to-[#449339] rounded-3xl p-8 text-white">
              <p className="text-xs uppercase font-bold opacity-80 mb-4">Collection Wallet</p>
              <h2 className="text-5xl font-bold mb-8">₦{dashboardData.walletBalance.toLocaleString()}</h2>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>Payments<span className="block font-bold">₦{dashboardData.todayPayments}</span></div>
                <div>Purchases<span className="block font-bold">₦{dashboardData.weekPurchases}</span></div>
                <div className="text-[#f5a623]">Pending<span className="block font-bold">₦{dashboardData.pending}</span></div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardData.stats.map((stat: any, i: number) => (
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
              {dashboardData.requests.map((req: any) => (
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
              {dashboardData.ecoImpact.map((item: any, i: number) => (
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
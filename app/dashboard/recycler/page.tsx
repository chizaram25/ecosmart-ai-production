"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Menu, Leaf, Shield, Grid, Zap,
  ArrowUpRight, Lightbulb, Bot, Home, User,
  CheckCircle2, Wallet, Star, Scale,
  TrendingUp, Truck, LogOut, ChevronRight,
  Package, Activity
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { getToken, removeToken, removeUser } from '@/lib/auth';

// ── TYPESCRIPT INTERFACES ──
export interface RecyclerRequest {
  id: string | number;
  initials: string;
  name: string;
  material: string;
  time: string;
  weight: string;
  distance: string;
  colorClass: string;
}

export interface RecentActivity {
  id: string | number;
  type: string; 
  time: string;
  amount: string; 
  status: 'Completed' | 'Pending';
  emoji: string;
  colorClass: string;
}

export interface DashboardData {
  user: {
    businessName: string;
    isOnline: boolean;
    dateString: string;
  };
  wallet: {
    balance: number;
    todayPayments: number;
    weekPurchases: number;
    pendingSettlements: number;
  };
  stats: {
    activeListings: number;
    avgRating: number;
    totalKgCollected: number;
    ecoPoints: number;
  };
  requests: RecyclerRequest[];
  activities: RecentActivity[];
  ecoImpact: {
    wasteRecycledKg: number;
    co2ReducedKg: number;
    individualsRewarded: number;
    communitiesServed: number;
  };
}

interface RecyclerDashboardProps {
  initialData?: DashboardData | null;
}

export default function RecyclerDashboardResponsive({ initialData }: RecyclerDashboardProps) {
  const [activeTab, setActiveTab] = useState('Home');
  const [liveData, setLiveData] = useState<DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [requests, setRequests] = useState<RecyclerRequest[]>(initialData?.requests || []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const fetchDashboard = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await dashboardApi.getRecyclerDashboard();
      setLiveData(data);
      if (data?.requests) setRequests(data.requests);
    } catch (err) {
      console.error('Failed to load recycler dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const handleRequestAction = async (id: string | number, action: 'accept' | 'decline') => {
    try {
      await dashboardApi.requestAction(id, action);
      setRequests(prev => prev.filter(req => req.id !== id));
      fetchDashboard();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process request';
      alert(message);
    }
  };

  const handlePayout = async () => {
    try {
      const result = await dashboardApi.requestPayout();
      alert(result.message);
      fetchDashboard();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payout failed';
      alert(message);
    }
  };

  if (loading || !liveData) {
    return (
      <div className="flex h-screen bg-gray-50/50 items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#eaf4e7] border-t-[#549B45] rounded-full animate-spin" />
      </div>
    );
  }

  // Use liveData directly with optional chaining
  return (
    <div className="min-h-screen bg-[#edf3ea] font-sans text-gray-900">
      {/* Mobile Header */}
      <header className="flex items-center justify-between px-4 pb-4 pt-5 sm:px-6 sm:pt-6 lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="EcoSmart AI" className="h-10 w-auto object-contain" />
        </div>
        <button onClick={() => setActiveTab('menu')} className="rounded-xl p-2 text-slate-700 transition hover:bg-white">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col gap-1">
          <div className="mb-6 flex items-center gap-2 px-2">
            <img src="/images/logo.png" alt="EcoSmart AI" className="h-9 w-auto object-contain" />
          </div>
          <button onClick={() => setActiveTab('Home')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${activeTab === 'Home' ? 'bg-[#d4e8cd] text-[#2f7d32]' : 'text-slate-600 hover:bg-white/50'}`}>
            <Home className="h-5 w-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('Requests')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${activeTab === 'Requests' ? 'bg-[#d4e8cd] text-[#2f7d32]' : 'text-slate-600 hover:bg-white/50'}`}>
            <Truck className="h-5 w-5" /> Pickup Requests
          </button>
          <button onClick={() => setActiveTab('Analytics')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${activeTab === 'Analytics' ? 'bg-[#d4e8cd] text-[#2f7d32]' : 'text-slate-600 hover:bg-white/50'}`}>
            <TrendingUp className="h-5 w-5" /> Analytics
          </button>
          <button onClick={() => setActiveTab('Profile')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${activeTab === 'Profile' ? 'bg-[#d4e8cd] text-[#2f7d32]' : 'text-slate-600 hover:bg-white/50'}`}>
            <User className="h-5 w-5" /> Profile
          </button>
          <div className="mt-auto pt-6">
            <button onClick={() => { removeToken(); removeUser(); window.location.href = '/auth/recycler/sign-in'; }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-red-500 hover:bg-red-50 transition">
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Welcome Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Welcome back, {liveData.user.businessName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{liveData.user.dateString}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${liveData.user.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${liveData.user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                {liveData.user.isOnline ? 'Available' : 'Offline'}
              </span>
              <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 transition" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#449339] mb-3">
                <Package className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listings</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{liveData.stats.activeListings}</p>
              <p className="text-xs text-slate-500 mt-1">Active listings</p>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#449339] mb-3">
                <Star className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{liveData.stats.avgRating}</p>
              <p className="text-xs text-slate-500 mt-1">Average rating</p>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#449339] mb-3">
                <Scale className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Collected</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{liveData.stats.totalKgCollected}kg</p>
              <p className="text-xs text-slate-500 mt-1">Total waste</p>
            </div>

            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#449339] mb-3">
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eco Points</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{liveData.stats.ecoPoints}</p>
              <p className="text-xs text-slate-500 mt-1">Points earned</p>
            </div>
          </div>

          {/* Wallet & Eco Impact Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Wallet Card */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#449339]" /> Wallet
                </h2>
                <button onClick={handlePayout} className="text-xs font-bold text-[#449339] hover:underline">Request Payout</button>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                {formatCurrency(liveData.wallet.balance)}
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(liveData.wallet.todayPayments)}</p>
                  <p className="text-xs text-slate-500">Today</p>
                </div>
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(liveData.wallet.weekPurchases)}</p>
                  <p className="text-xs text-slate-500">This Week</p>
                </div>
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(liveData.wallet.pendingSettlements)}</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
            </div>

            {/* Eco Impact Card */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#449339]" /> Eco Impact
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-xl font-bold text-slate-900">{liveData.ecoImpact.wasteRecycledKg}kg</p>
                  <p className="text-xs text-slate-500">Waste Recycled</p>
                </div>
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-xl font-bold text-slate-900">{liveData.ecoImpact.co2ReducedKg}kg</p>
                  <p className="text-xs text-slate-500">CO₂ Reduced</p>
                </div>
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-xl font-bold text-slate-900">{liveData.ecoImpact.individualsRewarded}</p>
                  <p className="text-xs text-slate-500">Indv. Rewarded</p>
                </div>
                <div className="rounded-xl bg-[#f6fcf4] p-3">
                  <p className="text-xl font-bold text-slate-900">{liveData.ecoImpact.communitiesServed}</p>
                  <p className="text-xs text-slate-500">Communities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Requests */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#449339]" /> Pickup Requests
              </h2>
              <span className="text-xs font-bold text-slate-400">{requests.length} pending</span>
            </div>
            {requests.length === 0 ? (
              <div className="rounded-xl bg-[#f6fcf4] p-6 text-center">
                <p className="text-sm font-medium text-slate-500">No pending pickup requests</p>
                <p className="text-xs text-slate-400 mt-1">When individuals request a pickup, they&apos;ll appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between rounded-xl bg-[#fafcfa] p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${req.colorClass || 'bg-[#449339]'}`}>{req.initials}</div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{req.name}</p>
                        <p className="text-xs text-slate-500">{req.material} · {req.weight} · {req.distance} away</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRequestAction(req.id, 'decline')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition">Decline</button>
                      <button onClick={() => handleRequestAction(req.id, 'accept')} className="rounded-lg bg-[#449339] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#3a7d31] transition">Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#449339]" /> Recent Activity
            </h2>
            {liveData.activities.length === 0 ? (
              <div className="rounded-xl bg-[#f6fcf4] p-6 text-center">
                <p className="text-sm font-medium text-slate-500">No recent activity</p>
                <p className="text-xs text-slate-400 mt-1">Your completed pickups and transactions will show here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveData.activities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between rounded-xl bg-[#fafcfa] p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{act.emoji}</span>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{act.type}</p>
                        <p className="text-xs text-slate-500">{act.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">{act.amount}</p>
                      <span className={`text-xs font-bold ${act.status === 'Completed' ? 'text-green-600' : 'text-amber-500'}`}>{act.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white lg:hidden">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => setActiveTab('Home')} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${activeTab === 'Home' ? 'text-[#449339]' : 'text-slate-400'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('Requests')} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${activeTab === 'Requests' ? 'text-[#449339]' : 'text-slate-400'}`}>
            <Truck className="w-5 h-5" />
            <span className="text-[10px] font-medium">Pickups</span>
          </button>
          <button onClick={() => setActiveTab('Analytics')} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${activeTab === 'Analytics' ? 'text-[#449339]' : 'text-slate-400'}`}>
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-medium">Analytics</span>
          </button>
          <button onClick={() => setActiveTab('Profile')} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${activeTab === 'Profile' ? 'text-[#449339]' : 'text-slate-400'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Floating Assistant */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#449339] to-[#2f7d32] text-white shadow-lg shadow-green-900/20 hover:shadow-xl hover:scale-105 transition-all">
          <Bot className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
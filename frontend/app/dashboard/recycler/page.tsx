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
import { getToken } from '@/lib/auth';

// ==========================================
// TYPESCRIPT INTERFACES FOR BACKEND DATA
// ==========================================
export interface RecyclerRequest {
  id: string | number;
  initials: string;
  name: string;
  material: string;
  time: string;
  weight: string;
  distance: string;
  colorClass: string; // e.g., 'bg-[#eaf4e7] text-[#449339]'
}

export interface RecentActivity {
  id: string | number;
  type: string; // e.g., 'Plastic Bottles'
  time: string;
  amount: string; // e.g., '₦1,250'
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

// Props interface for the component
interface RecyclerDashboardProps {
  initialData?: DashboardData | null;
}

export default function RecyclerDashboardResponsive({ initialData }: RecyclerDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Home');

  // Live data state (populated from API on mount)
  const [liveData, setLiveData] = useState<DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  // ── Fetch dashboard data from live backend API ──
  const fetchDashboard = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await dashboardApi.getRecyclerDashboard();
      setLiveData(data);
    } catch (err) {
      console.error('Failed to load recycler dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // State for Dynamic Requests (Initialized from backend data)
  const [requests, setRequests] = useState<RecyclerRequest[]>(
    (initialData || liveData)?.requests || []
  );

  // Sync requests whenever liveData changes
  useEffect(() => {
    if (liveData?.requests) {
      setRequests(liveData.requests);
    }
  }, [liveData]);

  // Actions — call real backend API
  const handleRequestAction = async (id: string | number, action: 'accept' | 'decline') => {
    try {
      await dashboardApi.requestAction(id, action);
      // Optimistic UI update — remove the request from the list
      setRequests(prev => prev.filter(req => req.id !== id));
      // Refresh full dashboard to sync wallet/activity
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || `Failed to ${action} request`);
    }
  };

  const handlePayout = async () => {
    try {
      const result = await dashboardApi.requestPayout();
      alert(result.message);
      // Refresh dashboard to reflect cleared wallet
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Payout failed');
    }
  };

  // ── Loading screen while API hasn't returned ──
  if (loading || !liveData) {
    return (
      <div className="flex h-screen bg-gray-50/50 font-sans items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-[#eaf4e7] border-t-[#549B45] rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Safe data fallbacks — every field uses ?? so null or undefined never reaches the render tree
  const data = {
    user: {
      businessName: liveData?.user?.businessName ?? '',
      isOnline: liveData?.user?.isOnline ?? false,
      dateString: liveData?.user?.dateString ?? '',
    },
    wallet: {
      balance: liveData?.wallet?.balance ?? 0,
      todayPayments: liveData?.wallet?.todayPayments ?? 0,
      weekPurchases: liveData?.wallet?.weekPurchases ?? 0,
      pendingSettlements: liveData?.wallet?.pendingSettlements ?? 0,
    },
    stats: {
      activeListings: liveData?.stats?.activeListings ?? 0,
      avgRating: liveData?.stats?.avgRating ?? 0.0,
      totalKgCollected: liveData?.stats?.totalKgCollected ?? 0,
      ecoPoints: liveData?.stats?.ecoPoints ?? 0,
    },
    requests: liveData?.requests ?? [],
    activities: liveData?.activities ?? [],
    ecoImpact: {
      wasteRecycledKg: liveData?.ecoImpact?.wasteRecycledKg ?? 0,
      co2ReducedKg: liveData?.ecoImpact?.co2ReducedKg ?? 0,
      individualsRewarded: liveData?.ecoImpact?.individualsRewarded ?? 0,
      communitiesServed: liveData?.ecoImpact?.communitiesServed ?? 0,
    },
  };

  // --- SUB-VIEWS FOR TABS --- //
  const renderPlaceholderView = (title: string) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
        {title === 'Requests' && <Truck className="w-10 h-10 text-[#549B45]" />}
        {title === 'Collections' && <Package className="w-10 h-10 text-[#549B45]" />}
        {title === 'Profile' && <User className="w-10 h-10 text-[#549B45]" />}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title} Dashboard</h2>
      <p className="text-gray-500">This module will be populated by the backend.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900 overflow-hidden selection:bg-green-100">

      {/* ========================================= */}
      {/* DESKTOP SIDEBAR (Hidden on Mobile)        */}
      {/* ========================================= */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-6 flex items-center gap-2 border-b border-gray-50">
          <div className="bg-green-50 p-1.5 rounded-full">
            <Leaf className="w-6 h-6 text-[#449339]" />
          </div>
          <div className="text-xl tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-0.5">AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {[
            { id: 'Home', icon: Home },
            { id: 'Requests', icon: Truck },
            { id: 'Collections', icon: Package },
            { id: 'Profile', icon: User }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                activeTab === item.id
                  ? 'bg-[#f1f8ee] text-[#1b5030]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#549B45]' : 'text-gray-400'}`} />
              {item.id}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold">
            <LogOut className="w-5 h-5 text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ========================================= */}
      {/* MAIN CONTENT AREA                         */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* Header */}
        <header className="flex justify-between items-center px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-1.5">
            <div className="bg-green-50 p-1.5 rounded-full">
              <Leaf className="w-5 h-5 text-[#449339]" />
            </div>
            <div className="text-[17px] tracking-tight">
              <span className="font-bold text-[#449339]">EcoSmart</span>
              <span className="font-bold text-gray-900 ml-0.5">AI</span>
            </div>
          </div>

          {/* Desktop Greeting */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Hi {data.user.businessName} 👋
            </h1>
            <div className="flex items-center text-[13px] text-gray-500 mt-1 gap-2 font-medium">
              <span>{data.user.dateString}</span>
              <span>•</span>
              <span className={`flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-full ${data.user.isOnline ? 'text-[#549B45] bg-[#eaf4e7]' : 'text-gray-500 bg-gray-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${data.user.isOnline ? 'bg-[#549B45]' : 'bg-gray-400'}`}></div>
                {data.user.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative cursor-pointer bg-gray-50 p-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {requests.length > 0 && (
                <div className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <Menu className="w-6 h-6 text-gray-800 cursor-pointer lg:hidden" />
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#1b5030] font-bold">
                {data.user.businessName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 pb-28 lg:pb-10 scroll-smooth">

          {activeTab !== 'Home' ? renderPlaceholderView(activeTab) : (
            <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-500">

              {/* Mobile Greeting */}
              <div className="lg:hidden mb-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  Hi {data.user.businessName} 👋
                </h1>
                <div className="flex items-center text-[12px] text-gray-500 mt-1 gap-1.5 font-medium">
                  <span>{data.user.dateString}</span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-semibold ${data.user.isOnline ? 'text-[#549B45]' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${data.user.isOnline ? 'bg-[#549B45]' : 'bg-gray-400'}`}></div>
                    {data.user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* ========================================= */}
              {/* ROW 1: Wallet & Stats Grid                */}
              {/* ========================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Wallet Card (Spans 4 cols on desktop) */}
                <div className="lg:col-span-5 xl:col-span-4 bg-gradient-to-br from-[#1b5030] to-[#449339] rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-green-900/10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-2 text-white/90 text-[13px] font-semibold uppercase tracking-wider">
                      <Wallet className="w-4 h-4" /> Collection Wallet
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Verified
                    </div>
                  </div>

                  <div className="mb-6 relative z-10">
                    <p className="text-white/80 text-[14px] mb-1 font-medium">Available to spend on pickups</p>
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{formatCurrency(data.wallet.balance)}</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
                    <div>
                      <p className="text-white/70 text-[10px] lg:text-[11px] uppercase font-bold mb-1">Today's Payout</p>
                      <p className="font-bold text-sm lg:text-base">{formatCurrency(data.wallet.todayPayments)}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-[10px] lg:text-[11px] uppercase font-bold mb-1">Week's Volume</p>
                      <p className="font-bold text-sm lg:text-base">{formatCurrency(data.wallet.weekPurchases)}</p>
                    </div>
                    <div>
                      <p className="text-[#f5a623] text-[10px] lg:text-[11px] uppercase font-bold mb-1">Pending</p>
                      <p className="font-bold text-[#f5a623] text-sm lg:text-base">{formatCurrency(data.wallet.pendingSettlements)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-5 border-t border-white/10 relative z-10 mt-auto">
                    <p className="text-[12px] text-white/70 font-medium">Min. ₦2,000 to withdraw</p>
                    <button
                      onClick={handlePayout}
                      className="bg-white hover:bg-gray-50 text-[#1b5030] transition-colors px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      Request Payout <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats Grid (Spans 8 cols on desktop) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-4">
                        <Grid className="w-5 h-5 text-[#549B45]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">{data.stats.activeListings}</h3>
                      <p className="text-[13px] text-gray-500 font-medium mt-1">Active Listings</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-5 h-5 text-[#f5a623]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight flex items-center gap-1.5">
                        {data.stats.avgRating.toFixed(1)} <Star className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" />
                      </h3>
                      <p className="text-[13px] text-gray-500 font-medium mt-1">Avg Rating</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-4">
                        <Scale className="w-5 h-5 text-[#549B45]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">{data.stats.totalKgCollected} kg</h3>
                      <p className="text-[13px] text-gray-500 font-medium mt-1">Total kg Collected</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#eaf4e7] rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-5 h-5 text-[#549B45]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">{data.stats.ecoPoints.toLocaleString()}</h3>
                      <p className="text-[13px] text-gray-500 font-medium mt-1">Eco Points</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-3 lg:gap-4">
                      <button className="bg-white border border-gray-100 rounded-2xl py-4 lg:py-5 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-[#549B45]/30 transition-all group">
                        <div className="bg-[#eaf4e7] p-2.5 rounded-xl group-hover:bg-[#549B45] transition-colors">
                          <Shield className="w-5 h-5 text-[#549B45] group-hover:text-white" />
                        </div>
                        <span className="text-[12px] lg:text-[13px] font-bold text-gray-700">Requests</span>
                      </button>
                      <button className="bg-white border border-gray-100 rounded-2xl py-4 lg:py-5 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-[#549B45]/30 transition-all group">
                        <div className="bg-[#eaf4e7] p-2.5 rounded-xl group-hover:bg-[#549B45] transition-colors">
                          <Grid className="w-5 h-5 text-[#549B45] group-hover:text-white" />
                        </div>
                        <span className="text-[12px] lg:text-[13px] font-bold text-gray-700">Collections</span>
                      </button>
                      <button className="bg-white border border-gray-100 rounded-2xl py-4 lg:py-5 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-[#549B45]/30 transition-all group">
                        <div className="bg-[#eaf4e7] p-2.5 rounded-xl group-hover:bg-[#549B45] transition-colors">
                          <Wallet className="w-5 h-5 text-[#549B45] group-hover:text-white" />
                        </div>
                        <span className="text-[12px] lg:text-[13px] font-bold text-gray-700">Wallet</span>
                      </button>
                      <button className="bg-white border border-[#f5a623]/30 rounded-2xl py-4 lg:py-5 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:bg-[#fffcf5] transition-all">
                        <div className="bg-[#fff8e6] p-2.5 rounded-xl">
                          <Zap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-[12px] lg:text-[13px] font-bold text-[#f5a623] flex items-center gap-0.5">
                          Boost <Zap className="w-3 h-3 fill-[#f5a623]" />
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* ========================================= */}
              {/* ROW 2: Requests & Activity                */}
              {/* ========================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* Dynamic New Requests Section */}
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
                      New Requests
                      {requests.length > 0 && (
                        <span className="bg-red-500 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                          {requests.length}
                        </span>
                      )}
                    </h3>
                    <button className="text-[13px] font-bold text-[#549B45] hover:text-[#1b5030] transition-colors flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 lg:gap-4 flex-1">
                    {requests.length > 0 ? requests.map((req) => (
                      <div key={req.id} className="bg-white border-l-[4px] border-l-[#f5a623] border border-y-gray-100 border-r-gray-100 rounded-r-2xl rounded-l-md p-5 shadow-sm hover:shadow-md transition-all animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#eaf4e7] text-[#549B45] font-bold flex items-center justify-center text-sm lg:text-base shrink-0">
                              {req.initials}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-[15px]">{req.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${req.colorClass}`}>
                                  {req.material}
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium">{req.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-gray-900 text-[15px]">{req.weight}</p>
                            <p className="text-[12px] text-gray-400 font-medium mt-0.5">{req.distance}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRequestAction(req.id, 'accept')}
                            className="flex-1 bg-[#549B45] hover:bg-[#458237] text-white py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'decline')}
                            className="flex-1 bg-white border border-red-400 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <CheckCircle2 className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">All caught up! No new requests.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Activity & Eco Tip */}
                <div className="flex flex-col gap-6 lg:gap-8">

                  {/* Market Ticker & Eco Tip Block */}
                  <div className="flex flex-col gap-3">
                    <div className="bg-[#f1f8ee] border border-green-100 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 text-[13px] md:text-[14px] font-bold text-gray-700">
                        <span className="text-2xl">🍾</span>
                        <span>Glass - 4.8 kg - Buying ₦10 - Mid ₦12</span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] font-bold text-[#549B45] bg-green-100 px-2.5 py-1 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5" /> 1%
                      </div>
                    </div>

                    <div className="bg-[#f1f8ee] border border-green-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Lightbulb className="w-5 h-5 text-[#549B45]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-gray-900 mb-1">Eco Tip</h4>
                        <p className="text-[13px] text-gray-600 leading-relaxed">
                          Accepting requests within 30 minutes increases your rating by 40%.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Recent Activity */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[18px] font-bold text-gray-900">Recent Activity</h3>
                      <button className="text-[13px] font-bold text-[#549B45] hover:text-[#1b5030] transition-colors flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
                      {data.activities && data.activities.length > 0 ? (
                        data.activities.map((activity, index) => (
                          <div key={activity.id} className={`flex justify-between items-center p-5 hover:bg-gray-50/50 transition-colors cursor-pointer ${index !== data.activities.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activity.colorClass}`}>
                                <span className="text-xl">{activity.emoji}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-[14px] text-gray-900">{activity.type}</h4>
                                <p className="text-[12px] text-gray-400 font-medium mt-0.5">{activity.time}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[14px] text-gray-900 mb-1">{activity.amount}</p>
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${activity.status === 'Completed' ? 'bg-[#eaf4e7] text-[#449339]' : 'bg-[#fff4d2] text-[#f5a623]'}`}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">No recent activity found.</div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* ========================================= */}
              {/* ROW 3: Bottom Full-Width Sections           */}
              {/* ========================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* Ask Mina Section */}
                <div className="bg-[#eaf4e7] rounded-[2rem] p-6 lg:p-8 shadow-sm border border-[#549B45]/10 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm relative mt-1">
                      <Bot className="w-7 h-7 text-[#549B45]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] lg:text-[16px] text-gray-900 mb-1 flex items-center gap-1.5">
                        Eco Assistant <Lightbulb className="w-4 h-4 text-[#549B45]" />
                      </h4>
                      <p className="text-[13px] lg:text-[14px] text-gray-700 leading-relaxed mb-3">
                        Need help identifying materials, estimating payments, checking market prices, or planning pickup routes?
                      </p>
                      <button className="text-[14px] font-bold text-[#1b5030] hover:text-[#549B45] flex items-center gap-1 transition-colors">
                        Ask Mina <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <button className="bg-white text-[#1b5030] text-[12px] lg:text-[13px] font-bold px-4 py-2 rounded-full shadow-sm border border-green-100 hover:bg-[#549B45] hover:text-white transition-colors cursor-pointer">Estimate Payment</button>
                    <button className="bg-white text-[#1b5030] text-[12px] lg:text-[13px] font-bold px-4 py-2 rounded-full shadow-sm border border-green-100 hover:bg-[#549B45] hover:text-white transition-colors cursor-pointer">Identify Material</button>
                    <button className="bg-white text-[#1b5030] text-[12px] lg:text-[13px] font-bold px-4 py-2 rounded-full shadow-sm border border-green-100 hover:bg-[#549B45] hover:text-white transition-colors cursor-pointer">Market Prices</button>
                    <button className="bg-white text-[#1b5030] text-[12px] lg:text-[13px] font-bold px-4 py-2 rounded-full shadow-sm border border-green-100 hover:bg-[#549B45] hover:text-white transition-colors cursor-pointer">Nearby Pickups</button>
                    <button className="bg-white text-[#1b5030] text-[12px] lg:text-[13px] font-bold px-4 py-2 rounded-full shadow-sm border border-green-100 hover:bg-[#549B45] hover:text-white transition-colors cursor-pointer">Optimize Route</button>
                  </div>
                </div>

                {/* Eco Impact (Updated "Coming Soon" View) */}
                <div className="bg-[#f1f8ee] rounded-[2rem] p-6 lg:p-8 shadow-sm border border-[#549B45]/10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6 lg:mb-8">
                      <h3 className="text-[16px] lg:text-[18px] font-bold text-[#549B45] flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#549B45]" /> Your Eco Impact
                      </h3>
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full flex items-center gap-1">
                        <User className="w-3 h-3" /> Coming Soon
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-extrabold text-[16px] lg:text-[18px] text-[#549B45] leading-tight">{data.ecoImpact.wasteRecycledKg / 1000} tonnes</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">CO₂ Avoided</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-extrabold text-[16px] lg:text-[18px] text-[#549B45] leading-tight">54 trees</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">Trees Equivalent</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-extrabold text-[16px] lg:text-[18px] text-[#549B45] leading-tight">{data.ecoImpact.wasteRecycledKg.toLocaleString()} kg</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">Waste Diverted</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-extrabold text-[16px] lg:text-[18px] text-[#549B45] leading-tight">4,800 L</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">Water Saved</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] lg:text-[12px] text-[#549B45] font-medium italic leading-relaxed pt-2">
                    🌱 Live impact data coming soon. These estimates are based on your collection history.
                  </p>
                </div>

              </div>

            </div>
          )}
        </main>

        {/* ========================================= */}
        {/* MOBILE BOTTOM NAVIGATION                  */}
        {/* ========================================= */}
        <nav className="lg:hidden bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center absolute bottom-0 w-full z-40 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setActiveTab('Home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Home' ? 'text-[#549B45]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('Requests')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Requests' ? 'text-[#549B45]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Truck className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('Collections')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Collections' ? 'text-[#549B45]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Package className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Collections</span>
          </button>
          <button
            onClick={() => setActiveTab('Profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Profile' ? 'text-[#549B45]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </nav>

        {/* Floating Bot Button */}
        <div className="absolute bottom-20 lg:bottom-10 right-4 lg:right-10 z-40">
          <button className="w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <Bot className="w-7 h-7 text-[#549B45]" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#549B45] rounded-full border-2 border-white"></div>
          </button>
        </div>

      </div>
    </div>
  );
}

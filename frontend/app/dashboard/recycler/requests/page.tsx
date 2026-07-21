"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Shield, Bell, Menu, ArrowLeft, Search,
  MapPin, Clock, ChevronRight, Home, Truck, Package, User
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

export default function WasteRequestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Requests' | 'Collections' | 'Profile'>('Requests');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Real dynamic states initialized to empty arrays/zeros with no hardcoded fallback mock data
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, totalThisWeek: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch real data exclusively from backend API
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await dashboardApi.getRecyclerDashboard();

        if (data) {
          // Set live requests from backend response
          setRequests(data.requests || []);

          // Calculate or extract live stats dynamically from the API payload
          const pendingCount = (data.requests || []).filter((r: any) => r.status?.toLowerCase() === 'pending').length;
          const acceptedCount = (data.requests || []).filter((r: any) => r.status?.toLowerCase() === 'accepted').length;

          setStats({
            pending: pendingCount,
            accepted: acceptedCount,
            totalThisWeek: data.wallet?.weekPurchases || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load waste requests from backend API:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Handle Bottom Navigation tab switching dynamically
  const handleTabChange = (tabId: 'Home' | 'Requests' | 'Collections' | 'Profile') => {
    setActiveTab(tabId);
    if (tabId === 'Home') router.push('/dashboard/recycler');
    else if (tabId === 'Requests') router.push('/dashboard/recycler/requests');
    else if (tabId === 'Collections') router.push('/dashboard/recycler/collections');
    else if (tabId === 'Profile') router.push('/dashboard/recycler/profile');
  };

  // Filter real requests dynamically based on search and selected tab
  const filteredRequests = requests.filter(req => {
    const matchesTab = activeFilter === 'All' || req.status?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = req.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.id?.toString().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col pb-24">

      {/* Top Header Section */}
      <header className="bg-gradient-to-b from-[#1b5030] to-[#449339] text-white px-6 pt-5 pb-8 relative overflow-hidden">
        {/* Navigation & Branding */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full">
              <Image
                src="/images/logo.png"
                alt="EcoSmart AI"
                width={110}
                height={32}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
              <Shield className="w-5 h-5 text-white" />
            </button>
            <div className="relative">
              <button className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                <Bell className="w-5 h-5 text-white" />
              </button>
              {stats.pending > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#449339]"></span>
              )}
            </div>
            <button className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Title & Back Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Waste Requests</h1>
        </div>

        {/* Top Metric Cards Grid - Driven entirely by live API states */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center">
            <span className="text-2xl lg:text-3xl font-extrabold text-white mb-0.5">{stats.pending}</span>
            <span className="text-[12px] text-white/80 font-medium">Pending</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center">
            <span className="text-2xl lg:text-3xl font-extrabold text-white mb-0.5">{stats.accepted}</span>
            <span className="text-[12px] text-white/80 font-medium">Accepted</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center">
            <span className="text-xl lg:text-2xl font-extrabold text-white mb-0.5">₦{stats.totalThisWeek.toLocaleString()}</span>
            <span className="text-[12px] text-white/80 font-medium">This Week</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer or material..."
            className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-all"
          />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar bg-gray-50 border-b border-gray-100">
        {[
          { id: 'All', label: 'All', count: requests.length },
          { id: 'Pending', label: 'Pending', count: requests.filter(r => r.status?.toLowerCase() === 'pending').length },
          { id: 'Accepted', label: 'Accepted', count: requests.filter(r => r.status?.toLowerCase() === 'accepted').length },
          { id: 'Completed', label: 'Completed', count: requests.filter(r => r.status?.toLowerCase() === 'completed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#449339] text-white shadow-md shadow-green-900/10'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests Feed List */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-[#449339] rounded-full animate-spin" />
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id || req._id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Top Row: Avatar, Name, ID & Status Badge */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-[#1b5030]">
                    {req.initials || req.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{req.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">{req.requestId || req.id || 'REQ-001'}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  req.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                  req.status?.toLowerCase() === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                  'bg-gray-100 text-gray-600 border border-gray-200/50'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{req.address}</span>
              </div>

              {/* Material Tags & Weight */}
              <div className="flex items-center gap-2 flex-wrap">
                {Array.isArray(req.materials) ? (
                  req.materials.map((mat: string, idx: number) => (
                    <span key={idx} className="bg-blue-50/60 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-md border border-blue-100/50">
                      {mat}
                    </span>
                  ))
                ) : (
                  <span className="bg-blue-50/60 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-md border border-blue-100/50">
                    {req.material || 'Recyclable Material'}
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-3 py-1 rounded-md">
                  {req.weight}
                </span>
              </div>

              {/* Divider */}
              <hr className="border-gray-50 my-1" />

              {/* Bottom Row: Time, Distance & Price */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{req.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{req.distance}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-base font-extrabold text-gray-900">
                    {req.amount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 text-center px-4">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No requests found</h3>
            <p className="text-xs text-gray-400">There are no waste requests matching your current filter or search query from the server.</p>
          </div>
        )}
      </main>

      {/* Exact Functional Bottom Navigation Bar matching Container (24).png */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-2.5 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">

        {/* Home Tab */}
        <button
          onClick={() => handleTabChange('Home')}
          className="flex flex-col items-center gap-1 transition-all group py-1 px-4 cursor-pointer"
        >
          <div className={`p-1 rounded-full transition-all ${
            activeTab === 'Home'
              ? 'bg-[#eaf4e7] text-[#449339]'
              : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold transition-colors ${
            activeTab === 'Home' ? 'text-[#449339]' : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            Home
          </span>
        </button>

        {/* Requests Tab (Active Pill Style matching reference image) */}
        <button
          onClick={() => handleTabChange('Requests')}
          className="flex flex-col items-center gap-1 transition-all group py-1 px-4 cursor-pointer"
        >
          <div className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
            activeTab === 'Requests'
              ? 'bg-[#eaf4e7] text-[#449339]'
              : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            <Truck className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold transition-colors ${
            activeTab === 'Requests' ? 'text-[#449339]' : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            Requests
          </span>
        </button>

        {/* Collections Tab */}
        <button
          onClick={() => handleTabChange('Collections')}
          className="flex flex-col items-center gap-1 transition-all group py-1 px-4 cursor-pointer"
        >
          <div className={`p-1 rounded-full transition-all ${
            activeTab === 'Collections'
              ? 'bg-[#eaf4e7] text-[#449339]'
              : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold transition-colors ${
            activeTab === 'Collections' ? 'text-[#449339]' : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            Collections
          </span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => handleTabChange('Profile')}
          className="flex flex-col items-center gap-1 transition-all group py-1 px-4 cursor-pointer"
        >
          <div className={`p-1 rounded-full transition-all ${
            activeTab === 'Profile'
              ? 'bg-[#eaf4e7] text-[#449339]'
              : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            <User className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold transition-colors ${
            activeTab === 'Profile' ? 'text-[#449339]' : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            Profile
          </span>
        </button>

      </nav>

    </div>
  );
}

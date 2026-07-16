"use client";

import React, { useState } from 'react';
import {
  Bell, Menu, Leaf, Shield, Grid, Zap, ArrowUpRight,
  Lightbulb, Bot, Home, User, CheckCircle2, Wallet,
  Star, Scale, TrendingUp, Truck, Package, Activity
} from 'lucide-react';

export default function RecyclerDashboard() {
  // Functional State for requests
  const [requests, setRequests] = useState([
    { id: 1, initials: 'AO', name: 'Amaka Obi', material: 'Plastic Bottles', time: '5 min ago', weight: '2.5 kg', dist: '1.2 km' },
    { id: 2, initials: 'BU', name: 'Bello Usman', material: 'Aluminium Cans', time: '12 min ago', weight: '4.0 kg', dist: '0.8 km' },
    { id: 3, initials: 'CE', name: 'Chidi Eze', material: 'Paper & Cardboard', time: '28 min ago', weight: '6.2 kg', dist: '2.1 km' }
  ]);

  const removeRequest = (id: number) => setRequests(requests.filter(r => r.id !== id));

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* Dashboard Grid - Spreads out on desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Wallet, Stats, & Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[#1b5030] to-[#449339] rounded-3xl p-6 text-white shadow-xl">
            <p className="text-xs uppercase font-bold opacity-80 mb-4">Collection Wallet</p>
            <h2 className="text-4xl font-bold mb-6">₦8,500</h2>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase opacity-70">
              <div>Payments <span className="block text-white text-sm">₦1,200</span></div>
              <div>Purchases <span className="block text-white text-sm">₦24.8k</span></div>
              <div>Pending <span className="block text-[#f5a623] text-sm">₦3,400</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[ {label: 'Listings', val: '6'}, {label: 'Rating', val: '4.8'}, {label: 'Total kg', val: '184'}, {label: 'Eco Points', val: '2,340'} ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                <p className="text-xl font-bold">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Requests & Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold">New Requests ({requests.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">{req.initials}</div>
                    <div>
                      <p className="font-bold text-sm">{req.name}</p>
                      <p className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full w-fit">{req.material}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold">{req.weight}</p>
                    <p className="text-gray-400">{req.dist}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => removeRequest(req.id)} className="flex-1 bg-[#449339] text-white py-2 rounded-lg font-bold text-xs">Accept</button>
                  <button onClick={() => removeRequest(req.id)} className="flex-1 border border-red-200 text-red-500 py-2 rounded-lg font-bold text-xs">Decline</button>
                </div>
              </div>
            ))}
          </div>

          {/* Eco Impact Footer Grid */}
          <div className="bg-[#f1f8ee] p-6 rounded-3xl border border-green-100 mt-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-[#449339]"><Activity size={18}/> Your Eco Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[ {l: 'Waste Recycled', v: '1.2 tonnes'}, {l: 'Trees Saved', v: '54'}, {l: 'Waste Diverted', v: '2,340 kg'}, {l: 'Water Saved', v: '4,800 L'} ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-green-50">
                  <p className="text-xs text-gray-400">{item.l}</p>
                  <p className="font-bold text-[#449339]">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
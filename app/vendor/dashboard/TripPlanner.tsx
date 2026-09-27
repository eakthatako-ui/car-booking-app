'use client';

import React, { useState } from 'react';
import { CalendarCheck, Compass, Sun, MapPin, Car } from 'lucide-react';
import PackageTourManager from './PackageTourManager';
import PrivateCharterManager from './PrivateCharterManager';
import DayTourManager from './DayTourManager';
import TransferServiceManager from './TransferServiceManager';

export default function TripPlannerHub() {
  const [activeTab, setActiveTab] = useState<'package' | 'charter' | 'daytour' | 'transfer'>('package');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER & TAB NAVIGATION --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span>ระบบจัดการทริปและบริการการเดินทาง (Trip & Service Management)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">เลือกประเภทบริการที่ต้องการจัดการด้านล่างได้เลยครับ</p>
        </div>

        {/* --- ปุ่มเลือกหมวดหมู่บริการ (Tabs) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('package')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'package'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>แพ็กเกจทัวร์</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('charter')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'charter'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Car className="w-3.5 h-3.5 shrink-0" />
            <span>เที่ยวเหมาคัน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('daytour')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'daytour'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sun className="w-3.5 h-3.5 shrink-0" />
            <span>เดย์ทัวร์</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'transfer'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>บริการรับ-ส่ง</span>
          </button>
        </div>
      </div>

      {/* --- RENDER ACTIVE COMPONENT --- */}
      <div className="transition-all duration-300">
        {activeTab === 'package' && <PackageTourManager />}
        {activeTab === 'charter' && <PrivateCharterManager />}
        {activeTab === 'daytour' && <DayTourManager />}
        {activeTab === 'transfer' && <TransferServiceManager />}
      </div>

    </div>
  );
}
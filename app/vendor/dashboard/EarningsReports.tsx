'use client';

import React from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

interface EarningsReportsProps {
  reportData: {
    totalRevenue: string;
    netEarnings: string;
    platformFee: string;
    totalJobs: number;
    charterJobsCount: number;
    avgRating: string;
  };
}

export default function EarningsReports({ reportData }: EarningsReportsProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400">รายได้สุทธิ (Net Earnings)</span>
          <div className="text-2xl sm:text-3xl font-black text-white">{reportData.netEarnings}</div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% จากช่วงก่อนหน้า
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400">ยอดขายรวม (Gross Revenue)</span>
          <div className="text-2xl sm:text-3xl font-black text-white">{reportData.totalRevenue}</div>
          <p className="text-[11px] text-slate-400">หักค่าธรรมเนียมระบบ {reportData.platformFee}</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400">งานทริปเหมาคันสำเร็จ</span>
          <div className="text-2xl sm:text-3xl font-black text-white">{reportData.charterJobsCount} <span className="text-xs font-normal text-slate-400">ทริป</span></div>
          <p className="text-[11px] text-slate-300">🚐 บริการรถตู้เหมาคัน VIP 100%</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400">คะแนนรีวิวเฉลี่ย</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1.5">
            <span>{reportData.avgRating}</span> <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-sky-400 font-bold">👑 รักษามาตรฐานระดับ Elite</p>
        </div>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-sky-400" /> <span>สัดส่วนบริการรถตู้เหมาคัน VIP (Charter Services)</span>
        </h3>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">รถตู้เหมาคัน VIP / ท่องเที่ยวส่วนตัว</span>
              <span className="text-white">฿124,500 (100%)</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
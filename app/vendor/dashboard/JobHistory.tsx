'use client';

import React, { useState } from 'react';
import { History, Layers, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function JobHistory() {
  const [historyTab, setHistoryTab] = useState<'all' | 'ongoing' | 'completed' | 'cancelled'>('all');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-4">
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>ประวัติงานและสถานะการให้บริการ</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">ติดตามงานทั้งหมด งานที่กำลังดำเนินงาน งานที่เสร็จสิ้น และรายการที่ถูกยกเลิก</p>
          </div>

          <div className="flex flex-wrap items-center bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              onClick={() => setHistoryTab('all')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                historyTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>งานทั้งหมด (14)</span>
            </button>

            <button
              onClick={() => setHistoryTab('ongoing')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                historyTab === 'ongoing' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>กำลังดำเนินงาน (1)</span>
            </button>

            <button
              onClick={() => setHistoryTab('completed')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                historyTab === 'completed' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>งานเสร็จสิ้น (12)</span>
            </button>

            <button
              onClick={() => setHistoryTab('cancelled')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                historyTab === 'cancelled' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>ยกเลิก (1)</span>
            </button>
          </div>
        </div>

        {historyTab === 'all' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">วันที่</th>
                    <th className="py-3 px-4">ประเภทงาน</th>
                    <th className="py-3 px-4">เส้นทาง</th>
                    <th className="py-3 px-4">รถ / คนขับ</th>
                    <th className="py-3 px-4">ยอดเงิน / รายได้</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">15 มี.ค. 2026 (08:00)</td>
                    <td className="py-3.5 px-4"><span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800/50 font-bold">Intercity Seat</span></td>
                    <td className="py-3.5 px-4 font-black text-white">กรุงเทพฯ ➔ พัทยา</td>
                    <td className="py-3.5 px-4 text-slate-400">รถตู้ประจำทาง (ฮก-9988) / สมศักดิ์</td>
                    <td className="py-3.5 px-4 font-black text-sky-400">฿3,640</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/40 font-bold animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังวิ่งงาน
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => alert("ติดตามสถานะงาน")} className="text-sky-400 font-bold hover:underline cursor-pointer">ติดตาม</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">10 มี.ค. 2026</td>
                    <td className="py-3.5 px-4"><span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800/50 font-bold">VIP Charter</span></td>
                    <td className="py-3.5 px-4 font-black text-white">กรุงเทพฯ ➔ เขาใหญ่</td>
                    <td className="py-3.5 px-4 text-slate-400">รถตู้ VIP (ฮอ-1234) / สมชาย</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400">฿4,500</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> สำเร็จ
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => alert("ดูรายละเอียดประวัติงาน")} className="text-sky-400 font-bold hover:underline cursor-pointer">เรียกดู</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {historyTab === 'ongoing' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">วันที่เดินทาง</th>
                    <th className="py-3 px-4">ประเภทงาน</th>
                    <th className="py-3 px-4">เส้นทาง</th>
                    <th className="py-3 px-4">รถ / คนขับ</th>
                    <th className="py-3 px-4">ยอดเงิน</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">15 มี.ค. 2026 (08:00)</td>
                    <td className="py-3.5 px-4"><span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800/50 font-bold">Intercity Seat</span></td>
                    <td className="py-3.5 px-4 font-black text-white">กรุงเทพฯ ➔ พัทยา</td>
                    <td className="py-3.5 px-4 text-slate-400">รถตู้ประจำทาง (ฮก-9988) / สมศักดิ์</td>
                    <td className="py-3.5 px-4 font-black text-sky-400">฿3,640</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/40 font-bold animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> กำลังวิ่งงาน
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => alert("ติดตามสถานะงาน")} className="text-sky-400 font-bold hover:underline cursor-pointer">ติดตาม</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {historyTab === 'completed' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">วันที่เสร็จสิ้น</th>
                    <th className="py-3 px-4">ประเภทงาน</th>
                    <th className="py-3 px-4">เส้นทาง</th>
                    <th className="py-3 px-4">รถ / คนขับ</th>
                    <th className="py-3 px-4">รายได้สุทธิ</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-right">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">10 มี.ค. 2026</td>
                    <td className="py-3.5 px-4"><span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800/50 font-bold">VIP Charter</span></td>
                    <td className="py-3.5 px-4 font-black text-white">กรุงเทพฯ ➔ เขาใหญ่</td>
                    <td className="py-3.5 px-4 text-slate-400">รถตู้ VIP (ฮอ-1234) / สมชาย</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400">฿4,500</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> สำเร็จ
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => alert("ดูรายละเอียดประวัติงาน")} className="text-sky-400 font-bold hover:underline cursor-pointer">เรียกดู</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {historyTab === 'cancelled' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">วันที่ยกเลิก</th>
                    <th className="py-3 px-4">ประเภทงาน</th>
                    <th className="py-3 px-4">เส้นทาง</th>
                    <th className="py-3 px-4">สาเหตุการยกเลิก</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-right">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">05 มี.ค. 2026</td>
                    <td className="py-3.5 px-4"><span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800/50 font-bold">VIP Charter</span></td>
                    <td className="py-3.5 px-4 font-black text-white">กรุงเทพฯ ➔ อยุธยา</td>
                    <td className="py-3.5 px-4 text-slate-400">ลูกค้ายกเลิกเนื่องจากเปลี่ยนแผนเดินทาง</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800/40 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> ยกเลิกแล้ว
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => alert("ดูรายละเอียดการยกเลิก")} className="text-sky-400 font-bold hover:underline cursor-pointer">เรียกดู</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
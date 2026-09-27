'use client';

import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, DollarSign, ArrowLeft, Bus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  // State สำหรับระบบค้นหาและจำลองการใช้งาน
  const [origin, setOrigin] = useState('กรุงเทพฯ');
  const [destination, setDestination] = useState('หัวหิน');
  const [passengers, setPassengers] = useState(2);

  // ข้อมูลจำลองรายการทริป / รถตู้ที่มีให้บริการ
  const availableTrips = [
    { id: 1, route: 'กรุงเทพฯ - หัวหิน (สายตรง)', time: '08:30 น.', price: 350, seatsLeft: 4, vanType: 'Toyota Commuter VIP' },
    { id: 2, route: 'กรุงเทพฯ - ชะอำ - ปราณบุรี', time: '10:00 น.', price: 380, seatsLeft: 2, vanType: 'Toyota Majesty' },
    { id: 3, route: 'กรุงเทพฯ - สวนน้ำวานา นาวา', time: '12:30 น.', price: 400, seatsLeft: 6, vanType: 'Toyota Commuter Standard' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      
      {/* Header & Back Button */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">ระบบจองตั๋วรถตู้ & ค้นหาทริป</h1>
            <p className="text-xs text-sky-400">Customer Dashboard — VanPro Thailand</p>
          </div>
        </div>
        <div className="bg-sky-500/10 border border-sky-500/20 text-sky-300 px-4 py-2 rounded-xl text-xs font-semibold">
          สถานะ: พร้อมให้บริการจอง
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ฝั่งซ้าย: ค้นหาทริป & จองตั๋ว */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Box Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-sky-300">
              <Search className="w-5 h-5" /> ค้นหาเส้นทางรถตู้ / เหมาคัน
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">ต้นทาง</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 mr-2" />
                  <input 
                    type="text" 
                    value={origin} 
                    onChange={(e) => setOrigin(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">ปลายทาง</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-rose-400 mr-2" />
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm text-white" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1">วันที่เดินทาง</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                  <input type="date" className="bg-transparent w-full outline-none text-sm text-white" defaultValue="2026-09-18" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">จำนวนที่นั่ง</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
                  <Users className="w-4 h-4 text-emerald-400 mr-2" />
                  <input 
                    type="number" 
                    value={passengers} 
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="bg-transparent w-full outline-none text-sm text-white" 
                    min={1} 
                    max={15}
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30">
              ค้นหารอบรถตู้และราคา
            </button>
          </div>

          {/* Available Trips List */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-sky-300">
              <Bus className="w-5 h-5" /> รายการรอบรถตู้ที่เปิดให้บริการ
            </h2>

            <div className="space-y-4">
              {availableTrips.map((trip) => (
                <div key={trip.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all">
                  <div>
                    <h3 className="font-bold text-base text-white">{trip.route}</h3>
                    <p className="text-xs text-slate-400 mt-1">ประเภทรถ: {trip.vanType} | ออกเดินทาง: <span className="text-sky-300 font-semibold">{trip.time}</span></p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">฿{trip.price}</span>
                      <p className="text-[10px] text-slate-400">เหลือ {trip.seatsLeft} ที่นั่ง</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                      จองที่นั่ง
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ฝั่งขวา: ระบบคำนวณราคา / คอมมิชชัน (ส่วนเสริมที่คุณเอกเคยทำไว้) */}
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-300">
              <DollarSign className="w-5 h-5" /> สรุปข้อมูลการจอง & ค่าบริการ
            </h2>
            
            <div className="space-y-3 text-sm text-slate-300 mb-6 border-b border-slate-700 pb-4">
              <div className="flex justify-between">
                <span>จำนวนผู้โดยสาร:</span>
                <span className="font-bold text-white">{passengers} ท่าน</span>
              </div>
              <div className="flex justify-between">
                <span>ราคาตั๋วเฉลี่ย:</span>
                <span className="font-bold text-white">฿350 / ท่าน</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าธรรมเนียมระบบ:</span>
                <span className="font-bold text-emerald-400">ฟรี</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold">ยอดชำระสุทธิ:</span>
              <span className="text-2xl font-black text-emerald-400">฿{passengers * 350}</span>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> ยืนยันการจองและชำระเงิน
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 border border-blue-500/20 p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-sky-300 mb-2">💡 ทริปตามใจฉัน (Custom Trip)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ต้องการเหมาคันไปเที่ยวต่างจังหวัด หรือจัดทริปพิเศษเฉพาะกลุ่ม? สามารถสร้างคำขอเหมาคันเพื่อให้คนขับรถตู้เข้ามาเสนอราคาแข่งกันได้ที่ระบบผู้ให้บริการ
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
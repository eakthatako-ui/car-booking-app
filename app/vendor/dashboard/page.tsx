'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  Car, 
  UserCheck, 
  CalendarCheck, 
  MapPin, 
  User, 
  Bell, 
  FileText, 
  LogOut,
  Bus,
  Trophy,
  Award,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download
} from 'lucide-react';

// นำเข้าไฟล์คอมโพเนนต์ย่อยครบถ้วน
import VendorProfile from './VendorProfile';
import FleetManager from './FleetManager';
import JobHistory from './JobHistory';
import EarningsReports from './EarningsReports';
import DriverManager from './DriverManager';
import TripPlanner from './TripPlanner';

export default function VendorDashboardPage() {
  const [activeMenu, setActiveMenu] = useState<'home' | 'history' | 'reports' | 'profile' | 'fleet' | 'drivers' | 'trips'>('home');
  const [biddingTab, setBiddingTab] = useState<'pending' | 'history'>('pending');
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // ฟังก์ชันบังคับเปลี่ยนหน้าสำหรับมือถือโดยเฉพาะ (ตัดปัญหา Event บล็อก)
  const handleMobileMenuClick = (menu: 'home' | 'history' | 'reports' | 'profile' | 'fleet' | 'drivers' | 'trips') => {
    setActiveMenu(menu);
  };

  const getReportData = () => {
    if (timeFilter === 'today') {
      return { totalRevenue: '฿4,500', netEarnings: '฿4,050', platformFee: '฿450', totalJobs: 2, charterJobsCount: 2, avgRating: '4.95' };
    } else if (timeFilter === 'week') {
      return { totalRevenue: '฿32,000', netEarnings: '฿28,800', platformFee: '฿3,200', totalJobs: 12, charterJobsCount: 12, avgRating: '4.95' };
    } else if (timeFilter === 'year') {
      return { totalRevenue: '฿1,450,000', netEarnings: '฿1,305,000', platformFee: '฿145,000', totalJobs: 560, charterJobsCount: 560, avgRating: '4.95' };
    } else {
      return { totalRevenue: '฿124,500', netEarnings: '฿112,050', platformFee: '฿12,450', totalJobs: 48, charterJobsCount: 48, avgRating: '4.95' };
    }
  };

  const reportData = getReportData();
  const progressData = { current: 42, target: 100, unit: 'ทริปเหมาคัน', label: 'ทริปเหมาคันสำเร็จ' };
  const progressPercent = Math.min(Math.round((progressData.current / progressData.target) * 100), 100);

  const playCharterAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, startTime: number, duration: number, vol: number = 0.3) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + startTime);
        osc.stop(audioCtx.currentTime + startTime + duration);
      };
      playTone(293.66, 0, 0.35, 0.35);    
      playTone(440.00, 0.25, 0.40, 0.35); 
      playTone(587.33, 0.50, 0.70, 0.40); 
    } catch (e) {
      console.log("Audio Context blocked");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans pb-28 md:pb-0">
      
      {/* --- SIDEBAR (สำหรับจอคอมพิวเตอร์ Desktop) --- */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl flex items-center justify-center text-white shadow-md">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white">VanPro</span>
                <span className="text-[10px] text-sky-400 block font-bold uppercase tracking-wider">Vendor Center</span>
              </div>
            </Link>
          </div>

          <nav className="p-4 space-y-1.5">
            <button onClick={() => setActiveMenu('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <Home className="w-4 h-4" />
              <span>หน้าแรก</span>
            </button>
            <button onClick={() => setActiveMenu('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <FileText className="w-4 h-4 text-sky-400" />
              <span>ประวัติงาน (Job History)</span>
            </button>
            <button onClick={() => setActiveMenu('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>รายงานผลประกอบการ</span>
            </button>
            <button onClick={() => setActiveMenu('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>โปรไฟล์ & ผลงาน</span>
            </button>
            <button onClick={() => setActiveMenu('fleet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'fleet' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <Car className="w-4 h-4 text-sky-400" />
              <span>รถยนต์ (Fleet)</span>
            </button>
            <button onClick={() => setActiveMenu('drivers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'drivers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>พนักงานขับรถ (Drivers)</span>
            </button>
            <button onClick={() => setActiveMenu('trips')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeMenu === 'trips' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}>
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>จัดทริปเหมาคัน</span>
            </button>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold transition-colors">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>แหล่งท่องเที่ยวแนะนำ</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold transition-colors">
              <User className="w-4 h-4 text-purple-400" />
              <span>บัญชีส่วนตัว</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors">
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* HEADER */}
        <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-sm sm:text-lg font-black text-white">
                {activeMenu === 'home' && 'แผงควบคุมผู้ให้บริการรถเหมาคัน VIP'}
                {activeMenu === 'history' && 'ประวัติงานและสถานะการให้บริการ (Job History)'}
                {activeMenu === 'reports' && 'รายงานผลประกอบการและรายได้ (Earnings Analytics)'}
                {activeMenu === 'profile' && 'โปรไฟล์และผลงานพาร์ทเนอร์ (Vendor Profile)'}
                {activeMenu === 'fleet' && 'ระบบจัดการรถยนต์ในสังกัด (Fleet Management)'}
                {activeMenu === 'drivers' && 'ระบบจัดการพนักงานขับรถ (Drivers Management)'}
                {activeMenu === 'trips' && 'ระบบจัดทริปเหมาคัน (Charter Trip Planner)'}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {activeMenu === 'home' && 'ยินดีต้อนรับกลับสู่ระบบจัดการทริปและงานเหมาคันของคุณ Ek'}
                {activeMenu === 'history' && 'ติดตามงานที่กำลังดำเนินงานและตรวจสอบงานที่เสร็จสิ้นแล้ว'}
                {activeMenu === 'reports' && 'ตรวจสอบยอดรายรับ สถิติการให้บริการ และสรุปผลกำไรแบบเรียลไทม์'}
                {activeMenu === 'profile' && 'จัดการข้อมูลส่วนตัว รายละเอียดบริษัท และแกลเลอรีผลงานบริการของคุณ'}
                {activeMenu === 'fleet' && 'เพิ่ม ตรวจสอบสถานะ และจัดการรถยนต์ที่ใช้ให้บริการรับส่งผู้โดยสารทั้งหมด'}
                {activeMenu === 'drivers' && 'เพิ่ม ตรวจสอบใบอนุญาตขับขี่ และจับคู่พนักงานขับรถกับยานพาหนะ'}
                {activeMenu === 'trips' && 'สร้างและจัดการแพ็กเกจทริปท่องเที่ยวส่วนตัว เชื่อมต่อฐานข้อมูล Supabase'}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {activeMenu === 'reports' ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button onClick={() => setTimeFilter('today')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeFilter === 'today' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>วันนี้</button>
                    <button onClick={() => setTimeFilter('week')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeFilter === 'week' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>สัปดาห์นี้</button>
                    <button onClick={() => setTimeFilter('month')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeFilter === 'month' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>เดือนนี้</button>
                    <button onClick={() => setTimeFilter('year')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeFilter === 'year' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>ปีนี้</button>
                  </div>
                  <button onClick={() => alert("ดาวน์โหลดรายงานสำเร็จ")} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer">
                    <Download className="w-4 h-4 text-sky-400" /> <span className="hidden sm:inline">ส่งออกรายงาน</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={playCharterAlertSound} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">ทดสอบเสียงแจ้งเตือน</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800/95 px-3 py-1.5 rounded-2xl shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
                  EK
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white tracking-tight">Siam Transport VIP</span>
                    <button onClick={() => setIsTierModalOpen(true)} className="bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-0.5 transition-all cursor-pointer">
                      <Award className="w-2.5 h-2.5 text-amber-400" /> Elite <ChevronRight className="w-2 h-2" />
                    </button>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">★ 4.95 (142 รีวิว)</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* แสดงผลหน้าแรก (Home) */}
          {activeMenu === 'home' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shrink-0">
                        <Trophy className="w-5 h-5 font-black" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded border border-amber-700/60 shadow">
                            ELITE PARTNER (ระดับ 3)
                          </span>
                          <span className="text-xs text-sky-400 font-bold">
                            ⚡ กำลังดันชื่อขึ้น <span className="underline">อันดับ 1</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setIsTierModalOpen(true)} className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/40 rounded-xl text-[11px] font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> ดูเกณฑ์การเลื่อนขั้น
                    </button>
                  </div>

                  <div className="space-y-1.5 bg-slate-950/70 border border-slate-800/90 p-3 rounded-xl shadow-inner">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> 
                        เป้าหมาย: <strong className="text-purple-400">Diamond Ambassador (ระดับ 4)</strong>
                      </span>
                      <span className="text-amber-400">{progressData.current} / {progressData.target} {progressData.unit} ({progressPercent}%)</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${progressPercent}%` }}></div>
                    </div>

                    <p className="text-[10px] text-slate-300 flex items-center gap-1 pt-0.5">
                      <span className="text-amber-400 font-bold shrink-0">💡 คำแนะนำ:</span> 
                      เหลืออีก <strong className="text-white">{progressData.target - progressData.current} {progressData.unit}</strong> สู่ระดับสูงสุด รับงาน VIP และลดค่าธรรมเนียม สู้ๆ ครับ! 🚀
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-950 to-sky-950/40 border border-sky-500/30 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shadow-inner shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">แจ้งเตือนงานด่วนผ่าน Telegram</h4>
                      <p className="text-[10px] text-slate-400">รับออร์เดอร์ใหม่ทันที ไม่มีพลาด</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">สถานะการเชื่อมต่อ:</span>
                    {isTelegramConnected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                        <CheckCircle className="w-3 h-3" /> เชื่อมต่อแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-950/80 px-2.5 py-0.5 rounded-md border border-rose-800/50">
                        <AlertCircle className="w-3 h-3" /> ยังไม่เชื่อมต่อ
                      </span>
                    )}
                  </div>

                  <button onClick={() => setIsTelegramModalOpen(true)} className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${isTelegramConnected ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-600/30'}`}>
                    <Send className="w-3 h-3" />
                    <span>{isTelegramConnected ? 'จัดการการเชื่อมต่อ Telegram' : 'เชื่อมต่อ Telegram รับงานด่วน'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-4 border-b border-slate-800/80 gap-3">
                    <div>
                      <h2 className="text-sm font-black text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-400" />
                        <span>คำขอประเมินราคาเหมาคัน (Smart Bidding Requests)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">ลูกค้าส่งรายละเอียดทริปมาให้คุณเสนอราคาแข่ง</p>
                    </div>

                    <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button onClick={() => setBiddingTab('pending')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${biddingTab === 'pending' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        รอดำเนินการ (2)
                      </button>
                      <button onClick={() => setBiddingTab('history')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${biddingTab === 'history' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        ประวัติการเสนอราคา
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-sky-950 text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-sky-800/50">VIP Van Charter</span>
                          <span className="text-xs text-slate-400">📅 15-18 มี.ค. 2026 (4 วัน)</span>
                        </div>
                        <h4 className="text-sm font-black text-white">กรุงเทพฯ ➔ เชียงใหม่ / ดอยอินทนนท์</h4>
                        <p className="text-xs text-slate-300">จำนวนผู้โดยสาร: <strong className="text-white">8 ท่าน</strong> | งบประมาณคาดหวัง: <strong className="text-sky-400">฿14,000</strong></p>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                        <button onClick={() => alert("เปิดหน้าจอเสนอราคาแข่ง")} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer">
                          เสนอราคาแข่ง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div className="mb-5 pb-4 border-b border-slate-800/80">
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-amber-400" />
                      <span>ตารางงานทริปเหมาคันที่ได้รับการยืนยันแล้ว (Charter Schedule)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">รายการงานทริปส่วนตัวที่จองและชำระเงินเรียบร้อยแล้ว</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="py-3 px-4">วันที่เดินทาง</th>
                          <th className="py-3 px-4">เส้นทาง</th>
                          <th className="py-3 px-4">รถ / คนขับ</th>
                          <th className="py-3 px-4">สถานะ</th>
                          <th className="py-3 px-4 text-right">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        <tr>
                          <td className="py-3.5 px-4 font-semibold">20 มี.ค. 2026</td>
                          <td className="py-3.5 px-4">กรุงเทพฯ ➔ พัทยา</td>
                          <td className="py-3.5 px-4 text-slate-400">รถตู้ VIP (ฮอ-1234) / สมชาย</td>
                          <td className="py-3.5 px-4"><span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40">ยืนยันแล้ว</span></td>
                          <td className="py-3.5 px-4 text-right">
                            <button className="text-sky-400 font-bold hover:underline cursor-pointer">ดูรายละเอียด</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- แสดงผลหน้าอื่นๆ ตามเมนูที่เลือก --- */}
          {activeMenu === 'history' && (
            <div className="animate-in fade-in duration-300">
              <JobHistory />
            </div>
          )}

          {activeMenu === 'reports' && (
            <div className="animate-in fade-in duration-300">
              <EarningsReports reportData={reportData} />
            </div>
          )}

          {activeMenu === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <VendorProfile />
            </div>
          )}

          {activeMenu === 'fleet' && (
            <div className="animate-in fade-in duration-300">
              <FleetManager />
            </div>
          )}

          {activeMenu === 'drivers' && (
            <div className="animate-in fade-in duration-300">
              <DriverManager />
            </div>
          )}

          {activeMenu === 'trips' && (
            <div className="animate-in fade-in duration-300">
              <TripPlanner />
            </div>
          )}

        </div>
      </main>

      {/* --- FORCE TOUCH FLOATING BOTTOM NAVIGATION BAR --- */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-[2147483647] bg-slate-950 border-t border-slate-800 px-2 py-2 flex items-center justify-around gap-1 shadow-2xl"
        style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
      >
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('home')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('home'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'home' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <Home className="w-4 h-4 mb-0.5" /> หน้าแรก
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('history')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('history'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'history' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <FileText className="w-4 h-4 mb-0.5 text-sky-400" /> ประวัติ
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('reports')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('reports'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'reports' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <Zap className="w-4 h-4 mb-0.5 text-emerald-400" /> รายงาน
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('profile')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('profile'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'profile' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <Trophy className="w-4 h-4 mb-0.5 text-amber-400" /> โปรไฟล์
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('fleet')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('fleet'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'fleet' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <Car className="w-4 h-4 mb-0.5 text-sky-400" /> รถยนต์
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('drivers')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('drivers'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'drivers' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <UserCheck className="w-4 h-4 mb-0.5 text-sky-400" /> คนขับ
        </button>
        <button 
          type="button"
          onClick={() => handleMobileMenuClick('trips')}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileMenuClick('trips'); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-bold cursor-pointer select-none ${activeMenu === 'trips' ? 'text-blue-400 bg-blue-950' : 'text-slate-400'}`}
          style={{ pointerEvents: 'auto' }}
        >
          <CalendarCheck className="w-4 h-4 mb-0.5 text-amber-400" /> จัดทริป
        </button>
      </div>

      {/* --- MODAL: เกณฑ์การเลื่อนขั้น --- */}
      {isTierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto no-scrollbar space-y-6">
            <button onClick={() => setIsTierModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">เกณฑ์การเลื่อนขั้น & เงื่อนไขการแสดงผลพาร์ทเนอร์</h3>
                <p className="text-xs text-slate-400">ระบบประเมินประสิทธิภาพเฉพาะบริการรถเหมาคัน VIP (Charter Trips)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    👑 Diamond Ambassador (ระดับ 4) <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">สูงสุด</span>
                  </span>
                  <span className="text-slate-300">เป้าหมาย: 100 ทริปเหมาคันขึ้นไป</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  <strong>สิทธิพิเศษ & การแสดงผล:</strong> แสดงผลอยู่อันดับบนสุดของการค้นหาตลอด 24 ชม., ได้รับป้ายพรีเมียมพิเศษ, ลดค่าธรรมเนียมแพลตฟอร์มสูงสุด และได้รับสิทธิ์รับงาน VIP ก่อนใคร
                </p>
              </div>

              <div className="bg-blue-950/30 p-4 rounded-2xl border border-blue-800/60 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sky-300 flex items-center gap-1.5">
                    ⭐ Elite Partner (ระดับ 3) <span className="text-[10px] bg-blue-900 text-sky-300 px-2 py-0.5 rounded border border-blue-700">สถานะปัจจุบันของคุณ Ek</span>
                  </span>
                  <span className="text-slate-300">30 - 99 ทริปเหมาคัน</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong>สิทธิพิเศษ & การแสดงผล:</strong> ดันผลการค้นหาอันดับต้นๆ, ป้ายการันตีคุณภาพมาตรฐานสูง, ระบบแจ้งเตือนงานด่วนผ่าน Telegram ทันที
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-300">🛡️ Standard Partner (ระดับ 1-2)</span>
                  <span className="text-slate-400">0 - 29 ทริปเหมาคัน</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  <strong>สิทธิพิเศษ & การแสดงผล:</strong> แสดงผลในระบบปกติ สามารถรับงานและเสนอราคาแข่ง (Bidding) ได้ตามปกติ
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button onClick={() => setIsTierModalOpen(false)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">
                เข้าใจและรับทราบเงื่อนไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Telegram --- */}
      {isTelegramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5">
            <button onClick={() => setIsTelegramModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">ตั้งค่าการแจ้งเตือน Telegram</h3>
                <p className="text-xs text-slate-400">รับงานไว ไม่พลาดทุกออร์เดอร์สำคัญ (ฟรี ไม่มีค่าใช้จ่าย)</p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button onClick={() => setIsTelegramModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                ปิดหน้าต่าง
              </button>
              <button onClick={() => { setIsTelegramConnected(true); setIsTelegramModalOpen(false); alert("เชื่อมต่อ Telegram สำเร็จ"); }} className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <span>เปิด Telegram Bot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
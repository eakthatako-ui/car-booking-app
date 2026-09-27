'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Phone, 
  CheckCircle2, 
  Car, 
  Shield, 
  X, 
  Trash2, 
  Search, 
  Edit3, 
  AlertTriangle, 
  AlertCircle,
  Loader2,
  MapPin,
  Languages,
  Ban,
  FileText,
  Sparkles,
  Calendar,
  DollarSign,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Hash,
  History,
  Users
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface Driver {
  id: number | string;
  empCode: string;
  name: string;
  phone: string;
  driverImage: string;
  licenseNo: string;
  licenseExp: string;
  status: 'available' | 'on-trip' | 'off-duty';
  noDrinking: boolean;
  noSmoking: boolean;
  languages: string;
  routeExpertise: string;
  bio: string;
}

export default function DriverManager() {
  const [activeMainTab, setActiveMainTab] = useState<'profiles' | 'history'>('profiles');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDriverForHistory, setSelectedDriverForHistory] = useState<Driver | null>(null);

  const [newDriver, setNewDriver] = useState({
    empCode: 'EMP-001',
    name: '',
    phone: '',
    driverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    licenseNo: '',
    licenseExp: '2027-12-31',
    status: 'available' as 'available' | 'on-trip' | 'off-duty',
    noDrinking: true,
    noSmoking: true,
    languages: 'ไทย, อังกฤษ, จีน',
    routeExpertise: 'ชำนาญเส้นทาง กรุงเทพฯ-ต่างจังหวัด',
    bio: '• ประสบการณ์ขับรถผู้บริหาร 5 ปี\n• สุภาพเรียบร้อย ตรงต่อเวลา\n• ใส่ใจความปลอดภัยสูงสุด'
  });

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const formatBioText = (rawText: string) => {
    if (!rawText) return '• พนักงานขับรถ VIP มาตรฐานมืออาชีพ';
    const items = rawText
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return items.map(item => (item.startsWith('•') ? item : `• ${item}`)).join('\n');
  };

  useEffect(() => {
    fetchDriversAndSyncStatus();
  }, []);

  const fetchDriversAndSyncStatus = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: driversData, error: dError } = await supabase.from('drivers').select('*').order('id', { ascending: false });
      const { data: tripsData, error: tError } = await supabase.from('driver_trips').select('*');

      if (dError) throw dError;

      if (driversData) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayDate = new Date(todayStr);

        const formattedData: Driver[] = await Promise.all(driversData.map(async (item: any, index: number) => {
          let currentStatus = item.status || 'available';

          if (currentStatus !== 'off-duty' && tripsData) {
            const driverTrips = tripsData.filter((t: any) => t.driver_name === item.name);
            let isOnActiveTrip = false;

            for (const trip of driverTrips) {
              if (trip.trip_date) {
                const tripStartDate = new Date(trip.trip_date);
                const tripEndDate = new Date(tripStartDate);
                tripEndDate.setDate(tripEndDate.getDate() + 3);

                if (todayDate >= tripStartDate && todayDate < tripEndDate) {
                  isOnActiveTrip = true;
                  break;
                }
              }
            }

            if (isOnActiveTrip && currentStatus !== 'on-trip') {
              currentStatus = 'on-trip';
              await supabase.from('drivers').update({ status: 'on-trip' }).eq('id', item.id);
            } else if (!isOnActiveTrip && currentStatus === 'on-trip') {
              currentStatus = 'available';
              await supabase.from('drivers').update({ status: 'available' }).eq('id', item.id);
            }
          }

          return {
            id: item.id,
            empCode: item.emp_code || `EMP-00${driversData.length - index}`,
            name: item.name || '',
            phone: item.phone || '',
            driverImage: item.driver_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            licenseNo: item.license_no || '',
            licenseExp: item.license_exp || '2027-12-31',
            status: currentStatus,
            noDrinking: item.no_drinking ?? true,
            noSmoking: item.no_smoking ?? true,
            languages: item.languages || 'ไทย',
            routeExpertise: item.route_expertise || 'กรุงเทพฯ และปริมณฑล',
            bio: item.bio || ''
          };
        }));

        setDrivers(formattedData);
        setNewDriver(prev => ({ ...prev, empCode: `EMP-00${driversData.length + 1}` }));
      }
    } catch (error) {
      console.error('Error fetching drivers and syncing status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChangeInline = async (driverId: number | string, newStatus: 'available' | 'on-trip' | 'off-duty') => {
    setDrivers(drivers.map(d => d.id === driverId ? { ...d, status: newStatus } : d));

    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status: newStatus })
        .eq('id', driverId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(`ไม่สามารถอัปเดตสถานะได้: ${err.message}`);
      fetchDriversAndSyncStatus();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        const safeImage = resultStr && resultStr.length < 500000 ? resultStr : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        
        if (isEdit && editingDriver) {
          setEditingDriver({ ...editingDriver, driverImage: safeImage });
        } else {
          setNewDriver({ ...newDriver, driverImage: safeImage });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์พนักงานขับรถ');
      return;
    }

    const formattedBio = formatBioText(newDriver.bio);

    if (!supabase) {
      alert('ยังไม่ได้เชื่อมต่อ Supabase');
      return;
    }

    try {
      const payload = {
        emp_code: String(newDriver.empCode).trim(),
        name: String(newDriver.name).trim(),
        phone: String(newDriver.phone).trim(),
        driver_image: String(newDriver.driverImage),
        license_no: String(newDriver.licenseNo).trim(),
        license_exp: String(newDriver.licenseExp),
        status: String(newDriver.status),
        no_drinking: Boolean(newDriver.noDrinking),
        no_smoking: Boolean(newDriver.noSmoking),
        languages: String(newDriver.languages),
        route_expertise: String(newDriver.routeExpertise),
        bio: String(formattedBio)
      };

      const { error } = await supabase.from('drivers').insert([payload]);
      if (error) throw error;

      alert('เพิ่มพนักงานขับรถสำเร็จ!');
      setIsAddModalOpen(false);
      fetchDriversAndSyncStatus();
    } catch (err: any) {
      console.error('Error adding driver:', err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setIsEditModalOpen(true);
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver || !supabase) return;

    const formattedBio = formatBioText(editingDriver.bio);

    try {
      const payload = {
        emp_code: String(editingDriver.empCode).trim(),
        name: String(editingDriver.name).trim(),
        phone: String(editingDriver.phone).trim(),
        driver_image: String(editingDriver.driverImage),
        license_no: String(editingDriver.licenseNo).trim(),
        license_exp: String(editingDriver.licenseExp),
        status: String(editingDriver.status),
        no_drinking: Boolean(editingDriver.noDrinking),
        no_smoking: Boolean(editingDriver.noSmoking),
        languages: String(editingDriver.languages),
        route_expertise: String(editingDriver.routeExpertise),
        bio: String(formattedBio)
      };

      const { error } = await supabase
        .from('drivers')
        .update(payload)
        .eq('id', editingDriver.id);

      if (error) throw error;

      alert('อัปเดตข้อมูลพนักงานสำเร็จ!');
      setIsEditModalOpen(false);
      setEditingDriver(null);
      fetchDriversAndSyncStatus();
    } catch (err: any) {
      console.error('Error updating driver:', err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (confirm('คุณต้องการลบพนักงานขับรถคนนี้ออกจากระบบใช่หรือไม่?')) {
      if (supabase) {
        try {
          const { error } = await supabase.from('drivers').delete().eq('id', id);
          if (error) throw error;
          fetchDriversAndSyncStatus();
        } catch (err: any) {
          console.error('Supabase delete error:', err);
          alert(`เกิดข้อผิดพลาดในการลบ: ${err.message}`);
        }
      }
    }
  };

  const getLicenseDiffDays = (expDateStr: string) => {
    if (!expDateStr) return 999;
    const expDate = new Date(expDateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const checkLicenseStatus = (expDateStr: string) => {
    const diffDays = getLicenseDiffDays(expDateStr);
    if (diffDays < 0) {
      return <span className="text-rose-400 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> ใบขับขี่หมดอายุ</span>;
    } else if (diffDays <= 30) {
      return <span className="text-amber-400 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> ใกล้หมด ({diffDays} วัน)</span>;
    }
    return <span className="text-slate-400">{expDateStr}</span>;
  };

  // คำนวณจำนวนพนักงานในแต่ละหมวดหมู่
  const countAll = drivers.length;
  const countAvailable = drivers.filter(d => d.status === 'available').length;
  const countOnTrip = drivers.filter(d => d.status === 'on-trip').length;
  const countOffDuty = drivers.filter(d => d.status === 'off-duty').length;

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = (driver.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (driver.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (driver.licenseNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (driver.empCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const urgentAlerts = drivers.filter(d => getLicenseDiffDays(d.licenseExp) <= 30);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <span>ระบบจัดการพนักงานขับรถ VIP (Drivers Management)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">บริหารโปรไฟล์พนักงานขับรถ สถานะอัจฉริยะอัตโนมัติ และประวัติการทำงาน</p>
        </div>

        <button
          onClick={() => {
            setNewDriver(prev => ({ ...prev, empCode: `EMP-00${drivers.length + 1}` }));
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มพนักงาน</span>
        </button>
      </div>

      {/* --- PROACTIVE ALERT BANNER --- */}
      {urgentAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-950 to-slate-950 border border-amber-500/40 p-4 rounded-2xl shadow-xl flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">แจ้งเตือนใบอนุญาตขับขี่หมดอายุ ({urgentAlerts.length} คน)</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              พนักงานขับรถ <strong className="text-white">{urgentAlerts.map(d => d.name).join(', ')}</strong> มีใบขับขี่หมดอายุหรือใกล้หมดอายุภายใน 30 วันนี้ กรุณาตรวจสอบด่วน
            </p>
          </div>
        </div>
      )}

      {/* --- SEARCH & CATEGORY FILTERS WITH COUNTERS --- */}
      <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3.5 shadow-inner">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหารหัสพนักงาน, ชื่อคนขับ, เบอร์โทร..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* --- แท็บตัวกรองแยกตามหมวดหมู่ พร้อมตัวเลขจำนวน --- */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
            <button 
              onClick={() => setStatusFilter('ALL')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              ทั้งหมด ({countAll})
            </button>
            <button 
              onClick={() => setStatusFilter('available')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'available' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              พร้อมรับงาน ({countAvailable})
            </button>
            <button 
              onClick={() => setStatusFilter('on-trip')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'on-trip' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              กำลังปฏิบัติงาน ({countOnTrip})
            </button>
            <button 
              onClick={() => setStatusFilter('off-duty')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'off-duty' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              พักผ่อน ({countOffDuty})
            </button>
          </div>
        </div>

        {/* --- ปุ่มสลับมุมมอง --- */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
          <button 
            onClick={() => setActiveMainTab('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'profiles' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> รายชื่อพนักงานขับรถ
          </button>
          <button 
            onClick={() => setActiveMainTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'history' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" /> ประวัติการทำงาน
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="text-xs text-slate-400">กำลังโหลดข้อมูลคนขับและตรวจสอบสถานะอัจฉริยะ...</p>
        </div>
      ) : activeMainTab === 'profiles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="p-5 pb-3 flex items-center gap-4 border-b border-slate-800/60">
                    <img src={driver.driverImage} alt={driver.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shrink-0 shadow" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-sky-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow border border-sky-500/50">
                          {driver.empCode || 'EMP-001'}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white truncate">{driver.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-emerald-400" /> {driver.phone}</p>
                      
                      {/* --- Dropdown เมนูลัดเปลี่ยนสถานะ --- */}
                      <div className="mt-1.5">
                        <select
                          value={driver.status}
                          onChange={(e) => handleStatusChangeInline(driver.id, e.target.value as any)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition-all ${
                            driver.status === 'available' 
                              ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800/80' 
                              : driver.status === 'on-trip' 
                              ? 'bg-sky-950/90 text-sky-400 border-sky-800/80 animate-pulse' 
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="available" className="bg-slate-900 text-emerald-400 font-bold">🟢 พร้อมรับงาน</option>
                          <option value="on-trip" className="bg-slate-900 text-sky-400 font-bold">🔵 กำลังปฏิบัติงาน</option>
                          <option value="off-duty" className="bg-slate-900 text-slate-300 font-bold">⚪ พักผ่อน (ลาพักร้อน)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {driver.noDrinking && <span className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> ไม่ดื่มแอลกอฮอล์</span>}
                      {driver.noSmoking && <span className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"><Ban className="w-3 h-3 text-emerald-400" /> ไม่สูบบุหรี่</span>}
                      <span className="bg-blue-950/40 text-blue-300 border border-blue-900/50 px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"><Languages className="w-3 h-3 text-blue-400" /> {driver.languages}</span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center"><span className="text-slate-400">เลขใบขับขี่:</span><strong className="text-slate-200 font-mono">{driver.licenseNo || '-'}</strong></div>
                      <div className="flex justify-between items-center"><span className="text-slate-400">วันหมดอายุ:</span><span>{checkLicenseStatus(driver.licenseExp)}</span></div>
                      {driver.routeExpertise && (
                        <div className="pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400 block mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> ความชำนาญเส้นทาง:</span>
                          <p className="text-[11px] text-amber-200 font-semibold">{driver.routeExpertise}</p>
                        </div>
                      )}
                    </div>

                    {driver.bio && (
                      <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-2xl text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                        <strong className="text-sky-400 block mb-1 font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> ประวัติ & จุดเด่นคนขับ:</strong>
                        {driver.bio}
                      </div>
                    )}

                    <button 
                      onClick={() => { setSelectedDriverForHistory(driver); setIsHistoryModalOpen(true); }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>ประวัติการทำงาน</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-2">
                  <button onClick={() => openEditModal(driver)} className="text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> แก้ไข</button>
                  <button onClick={() => handleDelete(driver.id)} className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> ลบ</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-950/50 rounded-3xl border border-slate-800"><p className="text-slate-400 text-xs">ไม่พบข้อมูลพนักงานขับรถในหมวดหมู่นี้</p></div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> ประวัติเที่ยววิ่งและค่ารอบพนักงานทั้งหมด
            </h3>
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-500">
              ยังไม่มีบันทึกประวัติเที่ยววิ่งในระบบ
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ประวัติการทำงาน (เฉพาะบุคคล) --- */}
      {isHistoryModalOpen && selectedDriverForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsHistoryModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            
            <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
              <img src={selectedDriverForHistory.driverImage} alt={selectedDriverForHistory.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>ประวัติการทำงาน</span>
                  <span className="text-sky-400 font-bold">({selectedDriverForHistory.name})</span>
                </h3>
                <p className="text-xs text-slate-400">รหัสพนักงาน: <span className="text-amber-400 font-mono font-bold">{selectedDriverForHistory.empCode}</span></p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> ประวัติเที่ยววิ่งและค่ารอบล่าสุด
                </h4>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center py-6 text-slate-500">
                  ยังไม่มีประวัติเที่ยววิ่งในระบบ
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: เพิ่มคนขับใหม่ --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            <h3 className="text-base font-black text-white flex items-center gap-2"><UserCheck className="w-5 h-5 text-sky-400" /><span>เพิ่มพนักงานขับรถใหม่</span></h3>
            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">รูปถ่ายพนักงานขับรถ</label>
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <img src={newDriver.driverImage} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="w-full text-[11px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-sky-400" /> รหัสพนักงาน (Auto ID)
                  </label>
                  <input
                    type="text"
                    value={newDriver.empCode}
                    onChange={(e) => setNewDriver({ ...newDriver, empCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <div><label className="block font-bold text-slate-300 mb-1">ชื่อ-นามสกุล</label><input type="text" value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold" required /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">เบอร์โทรศัพท์</label><input type="text" value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold" required /></div>
                <div><label className="block font-bold text-slate-300 mb-1">เลขที่ใบขับขี่</label><input type="text" value={newDriver.licenseNo} onChange={(e) => setNewDriver({ ...newDriver, licenseNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">วันหมดอายุใบขับขี่</label><input type="date" value={newDriver.licenseExp} onChange={(e) => setNewDriver({ ...newDriver, licenseExp: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white [color-scheme:dark]" /></div>
                <div><label className="block font-bold text-slate-300 mb-1">ภาษาที่สื่อสารได้</label><input type="text" value={newDriver.languages} onChange={(e) => setNewDriver({ ...newDriver, languages: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              </div>
              <div><label className="block font-bold text-slate-300 mb-1">ความชำนาญเส้นทาง</label><input type="text" value={newDriver.routeExpertise} onChange={(e) => setNewDriver({ ...newDriver, routeExpertise: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              <div><label className="block font-bold text-slate-300 mb-1">ประวัติ & จุดเด่นคนขับ</label><textarea rows={3} value={newDriver.bio} onChange={(e) => setNewDriver({ ...newDriver, bio: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"></textarea></div>
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold"><input type="checkbox" checked={newDriver.noDrinking} onChange={(e) => setNewDriver({ ...newDriver, noDrinking: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 text-blue-600" /><span>ไม่ดื่มแอลกอฮอล์ 🚫🍺</span></label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold"><input type="checkbox" checked={newDriver.noSmoking} onChange={(e) => setNewDriver({ ...newDriver, noSmoking: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 text-blue-600" /><span>ไม่สูบบุหรี่ 🚫🚬</span></label>
              </div>
              <div className="pt-3 flex items-center gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 cursor-pointer">บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: แก้ไขข้อมูลคนขับ --- */}
      {isEditModalOpen && editingDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            <h3 className="text-base font-black text-white flex items-center gap-2"><Edit3 className="w-5 h-5 text-sky-400" /><span>แก้ไขข้อมูลพนักงาน ({editingDriver.name})</span></h3>
            <form onSubmit={handleUpdateDriver} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">เปลี่ยนรูปถ่าย</label>
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <img src={editingDriver.driverImage} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="w-full text-[11px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-sky-400" /> รหัสพนักงาน (Auto ID)
                  </label>
                  <input
                    type="text"
                    value={editingDriver.empCode}
                    onChange={(e) => setEditingDriver({ ...editingDriver, empCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <div><label className="block font-bold text-slate-300 mb-1">ชื่อ-นามสกุล</label><input type="text" value={editingDriver.name} onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold" required /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">เบอร์โทรศัพท์</label><input type="text" value={editingDriver.phone} onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold" required /></div>
                <div><label className="block font-bold text-slate-300 mb-1">เลขที่ใบขับขี่</label><input type="text" value={editingDriver.licenseNo} onChange={(e) => setEditingDriver({ ...editingDriver, licenseNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">วันหมดอายุ</label><input type="date" value={editingDriver.licenseExp} onChange={(e) => setEditingDriver({ ...editingDriver, licenseExp: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white [color-scheme:dark]" /></div>
                <div><label className="block font-bold text-slate-300 mb-1">สถานะ</label><select value={editingDriver.status} onChange={(e) => setEditingDriver({ ...editingDriver, status: e.target.value as any })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"><option value="available">พร้อมรับงาน</option><option value="on-trip">กำลังปฏิบัติงาน</option><option value="off-duty">พักผ่อน</option></select></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">ภาษา</label><input type="text" value={editingDriver.languages} onChange={(e) => setEditingDriver({ ...editingDriver, languages: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
                <div><label className="block font-bold text-slate-300 mb-1">ความชำนาญเส้นทาง</label><input type="text" value={editingDriver.routeExpertise} onChange={(e) => setEditingDriver({ ...editingDriver, routeExpertise: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              </div>
              <div><label className="block font-bold text-slate-300 mb-1">ประวัติ & จุดเด่น</label><textarea rows={3} value={editingDriver.bio} onChange={(e) => setEditingDriver({ ...editingDriver, bio: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"></textarea></div>
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold"><input type="checkbox" checked={editingDriver.noDrinking} onChange={(e) => setEditingDriver({ ...editingDriver, noDrinking: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 text-blue-600" /><span>ไม่ดื่มแอลกอฮอล์ 🚫🍺</span></label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold"><input type="checkbox" checked={editingDriver.noSmoking} onChange={(e) => setEditingDriver({ ...editingDriver, noSmoking: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 text-blue-600" /><span>ไม่สูบบุหรี่ 🚫🚬</span></label>
              </div>
              <div className="pt-3 flex items-center gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 cursor-pointer">บันทึกการแก้ไข</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
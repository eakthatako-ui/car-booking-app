'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Trash2, 
  Search,
  X,
  AlertTriangle,
  Gauge,
  Loader2,
  Edit3,
  Sparkles,
  Hash,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface Vehicle {
  id: number | string;
  carCode: string;
  plate: string;
  brand: string;
  seats: number;
  status: 'available' | 'on-trip' | 'maintenance';
  insuranceExp: string;
  nextServiceMileage: number;
  carImages: string[];
  features: string;
}

export default function FleetManager() {
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State สำหรับ Lightbox ขยายดูรูปภาพหลายรูป
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // State สำหรับเก็บบันทึก index ของรูปที่กำลังสไลด์โชว์ในแต่ละการ์ดรถ
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: string]: number }>({});

  const [newVehicle, setNewVehicle] = useState({
    carCode: 'CAR-001',
    plate: '',
    brand: 'Toyota Commuter VIP',
    seats: 13,
    status: 'available' as 'available' | 'on-trip' | 'maintenance',
    insuranceExp: '2026-12-31',
    nextServiceMileage: 50000,
    carImages: [] as string[],
    features: '• เบาะนวดไฟฟ้า\n• สมาร์ททีวี\n• Wi-Fi 5G'
  });

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const formatFeaturesText = (rawText: string) => {
    if (!rawText) return '• รถตู้สภาพพร้อมใช้งานมาตรฐาน VIP';
    const items = rawText
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return items.map(item => (item.startsWith('•') ? item : `• ${item}`)).join('\n');
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  // ระบบสไลด์รูปภาพอัตโนมัติทุกๆ 3 วินาทีสำหรับรถที่มีหลายรูป
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndices(prevIndices => {
        const nextIndices = { ...prevIndices };
        fleet.forEach(car => {
          if (car.carImages && car.carImages.length > 1) {
            const currentIndex = nextIndices[car.id] || 0;
            nextIndices[car.id] = (currentIndex + 1) % car.carImages.length;
          }
        });
        return nextIndices;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fleet]);

  const fetchFleetData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fleet')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData: Vehicle[] = data.map((item: any, index: number) => {
          let imgs: string[] = [];
          if (Array.isArray(item.car_images) && item.car_images.length > 0) {
            imgs = item.car_images;
          } else if (item.car_image) {
            imgs = [item.car_image];
          } else {
            imgs = ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'];
          }

          return {
            id: item.id,
            carCode: item.car_code || `CAR-00${data.length - index}`,
            plate: item.plate || '',
            brand: item.brand || '',
            seats: item.seats || 13,
            status: item.status || 'available',
            insuranceExp: item.insurance_exp || '2026-12-31',
            nextServiceMileage: item.next_service_mileage || 50000,
            carImages: imgs,
            features: item.features || '• รถตู้ VIP มาตรฐาน'
          };
        });
        setFleet(formattedData);
        setNewVehicle(prev => ({ ...prev, carCode: `CAR-00${data.length + 1}` }));
      }
    } catch (error) {
      console.error('Error fetching fleet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onload = (ev) => {
            if (ev.target?.result) {
              uploadedUrls.push(ev.target.result as string);
            }
            resolve(true);
          };
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrls.length > 0) {
        if (isEdit && editingVehicle) {
          setEditingVehicle({
            ...editingVehicle,
            carImages: [...editingVehicle.carImages, ...uploadedUrls]
          });
        } else {
          setNewVehicle({
            ...newVehicle,
            carImages: [...newVehicle.carImages, ...uploadedUrls]
          });
        }
      }
    } catch (err: any) {
      console.error('Error uploading fleet images:', err);
      alert('เกิดข้อผิดพลาดในการโหลดรูปภาพ: ' + err.message);
    }
  };

  const handleRemoveImage = (indexToRemove: number, isEdit: boolean = false) => {
    if (isEdit && editingVehicle) {
      setEditingVehicle({
        ...editingVehicle,
        carImages: editingVehicle.carImages.filter((_, idx) => idx !== indexToRemove)
      });
    } else {
      setNewVehicle({
        ...newVehicle,
        carImages: newVehicle.carImages.filter((_, idx) => idx !== indexToRemove)
      });
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.plate) {
      alert('กรุณากรอกป้ายทะเบียนรถ');
      return;
    }

    const formattedFeatures = formatFeaturesText(newVehicle.features);

    if (!supabase) {
      alert('ยังไม่ได้เชื่อมต่อ Supabase');
      return;
    }

    try {
      const mainImg = newVehicle.carImages.length > 0 ? newVehicle.carImages[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

      const payload = {
        car_code: String(newVehicle.carCode).trim(),
        plate: String(newVehicle.plate).trim(),
        brand: String(newVehicle.brand).trim(),
        seats: Number(newVehicle.seats),
        status: String(newVehicle.status),
        insurance_exp: String(newVehicle.insuranceExp),
        next_service_mileage: Number(newVehicle.nextServiceMileage),
        car_image: mainImg,
        car_images: newVehicle.carImages,
        features: String(formattedFeatures)
      };

      const { error } = await supabase.from('fleet').insert([payload]);
      if (error) throw error;

      alert('บันทึกข้อมูลรถยนต์สำเร็จ!');
      setIsAddModalOpen(false);
      setNewVehicle({
        carCode: `CAR-00${fleet.length + 2}`,
        plate: '',
        brand: 'Toyota Commuter VIP',
        seats: 13,
        status: 'available',
        insuranceExp: '2026-12-31',
        nextServiceMileage: 50000,
        carImages: [],
        features: '• เบาะนวดไฟฟ้า\n• สมาร์ททีวี\n• Wi-Fi 5G'
      });
      fetchFleetData();
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${err.message}`);
    }
  };

  const openEditModal = (car: Vehicle) => {
    setEditingVehicle(car);
    setIsEditModalOpen(true);
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !supabase) return;

    const formattedFeatures = formatFeaturesText(editingVehicle.features);

    try {
      const mainImg = editingVehicle.carImages.length > 0 ? editingVehicle.carImages[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

      const payload = {
        car_code: String(editingVehicle.carCode).trim(),
        plate: String(editingVehicle.plate).trim(),
        brand: String(editingVehicle.brand).trim(),
        seats: Number(editingVehicle.seats),
        status: String(editingVehicle.status),
        insurance_exp: String(editingVehicle.insuranceExp),
        next_service_mileage: Number(editingVehicle.nextServiceMileage),
        car_image: mainImg,
        car_images: editingVehicle.carImages,
        features: String(formattedFeatures)
      };

      const { error } = await supabase
        .from('fleet')
        .update(payload)
        .eq('id', editingVehicle.id);

      if (error) throw error;

      alert('อัปเดตข้อมูลรถยนต์สำเร็จ!');
      setIsEditModalOpen(false);
      setEditingVehicle(null);
      fetchFleetData();
    } catch (err: any) {
      console.error('Error updating vehicle:', err);
      alert(`เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ${err.message}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (confirm('คุณต้องการลบรถคันนี้ออกจากระบบใช่หรือไม่?')) {
      if (supabase) {
        try {
          const { error } = await supabase.from('fleet').delete().eq('id', id);
          if (error) throw error;
          fetchFleetData();
        } catch (err: any) {
          console.error('Supabase delete error:', err);
          alert(`เกิดข้อผิดพลาดในการลบ: ${err.message}`);
        }
      }
    }
  };

  const filteredFleet = fleet.filter((car) => {
    const matchesSearch = (car.plate || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (car.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (car.carCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInsuranceDiffDays = (expDateStr: string) => {
    if (!expDateStr) return 999;
    const expDate = new Date(expDateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const checkInsuranceStatus = (expDateStr: string) => {
    const diffDays = getInsuranceDiffDays(expDateStr);
    if (diffDays < 0) {
      return <span className="text-rose-400 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> ประกันหมดอายุแล้ว</span>;
    } else if (diffDays <= 30) {
      return <span className="text-amber-400 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> ใกล้หมด ({diffDays} วัน)</span>;
    }
    return <span className="text-slate-400">{expDateStr}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <Car className="w-5 h-5 text-sky-400" />
            <span>ระบบจัดการรถยนต์ในสังกัด (Fleet Management)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">จัดการข้อมูลรถยนต์ในสังกัดอย่างอิสระ พร้อมระบบแจ้งเตือนประกัน</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มรถยนต์ใหม่ใน Fleet</span>
        </button>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหารหัสรถ, ทะเบียน, ยี่ห้อ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          <button onClick={() => setStatusFilter('ALL')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>ทั้งหมด ({fleet.length})</button>
          <button onClick={() => setStatusFilter('available')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'available' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>พร้อมใช้งาน</button>
          <button onClick={() => setStatusFilter('on-trip')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'on-trip' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>กำลังวิ่งงาน</button>
          <button onClick={() => setStatusFilter('maintenance')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'maintenance' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>ซ่อมบำรุง</button>
        </div>
      </div>

      {/* --- FLEET CARDS --- */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="text-xs text-slate-400">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFleet.length > 0 ? (
            filteredFleet.map((car) => {
              const insuranceDays = getInsuranceDiffDays(car.insuranceExp);
              const isInsuranceExpired = insuranceDays < 0;
              const isInsuranceWarning = insuranceDays >= 0 && insuranceDays <= 30;
              
              const carImages = car.carImages && car.carImages.length > 0 ? car.carImages : ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'];
              const activeIndex = currentImageIndices[car.id] || 0;
              const currentDisplayImg = carImages[activeIndex] || carImages[0];

              return (
                <div key={car.id} className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between">
                  <div>
                    {/* --- แถบแจ้งเตือนประกันบนการ์ด --- */}
                    {(isInsuranceExpired || isInsuranceWarning) && (
                      <div className={`px-4 py-2 text-[11px] font-black flex items-center justify-between border-b ${
                        isInsuranceExpired 
                          ? 'bg-rose-950/90 text-rose-300 border-rose-900/80 animate-pulse' 
                          : 'bg-amber-950/90 text-amber-300 border-amber-900/80'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isInsuranceExpired ? '🚨 ประกันภัยรถยนต์หมดอายุแล้ว!' : `⚠️ ประกันใกล้หมดอายุ (${insuranceDays} วัน)`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* --- ส่วนรูปภาพสไลด์อัตโนมัติ & คลิกเพื่อดูรูปทั้งหมด --- */}
                    <div 
                      className="relative h-48 bg-slate-900 overflow-hidden group cursor-pointer"
                      onClick={() => {
                        setLightboxImages(carImages);
                        setLightboxIndex(activeIndex);
                      }}
                      title="คลิกเพื่อดูรูปภาพทั้งหมด"
                    >
                      <img src={currentDisplayImg} alt={car.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                      
                      <div className="absolute top-3 left-3 bg-sky-600/90 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-500/50 text-white font-black text-xs shadow-lg">
                        {car.carCode || 'CAR-001'}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {carImages.length > 1 && (
                          <span className="bg-slate-900/80 text-amber-400 border border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                            📷 {carImages.length} รูป
                          </span>
                        )}
                        {car.status === 'available' && <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow">พร้อมรับงาน</span>}
                        {car.status === 'on-trip' && <span className="bg-sky-950/90 text-sky-400 border border-sky-800/60 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow animate-pulse">กำลังวิ่งงาน</span>}
                        {car.status === 'maintenance' && <span className="bg-amber-950/90 text-amber-400 border border-amber-800/60 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow">เข้าศูนย์ซ่อม</span>}
                      </div>

                      {/* จุดบอกสถานะสไลด์ (Dots Indicator) */}
                      {carImages.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                          {carImages.map((_, dotIdx) => (
                            <span 
                              key={dotIdx} 
                              className={`h-1.5 rounded-full transition-all ${dotIdx === activeIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50'}`}
                            ></span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-black text-white">{car.brand}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">ทะเบียน: <strong className="text-sky-300">{car.plate}</strong> ({car.seats} ที่นั่ง)</p>
                      </div>

                      {car.features && (
                        <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-2xl text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                          <strong className="text-sky-400 block mb-1 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" /> สิ่งอำนวยความสะดวก & ไฮไลต์รถ:
                          </strong>
                          {car.features}
                        </div>
                      )}

                      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-sky-400" /> เช็กระยะรอบถัดไป:</span>
                          <strong className="text-sky-400">{(car.nextServiceMileage || 0).toLocaleString()} กม.</strong>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">ประกันภัย:</span>
                          <span>{checkInsuranceStatus(car.insuranceExp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-2">
                    <button onClick={() => openEditModal(car)} className="text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> แก้ไขข้อมูลรถ
                    </button>
                    <button onClick={() => handleDelete(car.id)} className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> ลบรถคันนี้
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-950/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-xs">ไม่พบข้อมูลรถยนต์ในตาราง fleet</p>
            </div>
          )}
        </div>
      )}

      {/* --- LIGHTBOX GALLERY MODAL (สำหรับคลิกดูรูปทั้งหมดของรถ) --- */}
      {lightboxImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-lg p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImages([])}
        >
          <div className="relative max-w-6xl max-h-[92vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setLightboxImages([])}
              className="absolute top-2 right-2 sm:-top-10 sm:right-0 text-slate-300 hover:text-white bg-slate-800/80 p-2.5 rounded-2xl transition-all cursor-pointer z-20 shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-2 left-2 sm:-top-10 sm:left-0 bg-slate-800/80 text-amber-400 text-xs font-black px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl z-20">
              รูปที่ {lightboxIndex + 1} จาก {lightboxImages.length}
            </div>

            <div className="relative flex items-center justify-center w-full h-full max-h-[82vh]">
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt={`Gallery ${lightboxIndex}`} 
                className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-slate-800/80"
              />

              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}

              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>

            {lightboxImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full p-2 no-scrollbar">
                {lightboxImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${idx === lightboxIndex ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL: เพิ่มรถใหม่เข้าตาราง fleet --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-sky-400" />
              <span>เพิ่มรถยนต์ใหม่เข้าตาราง fleet</span>
            </h3>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              
              <div className="space-y-2">
                <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-400" /> รูปภาพรถยนต์ (เลือกได้หลายรูป)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> + เลือกรูปภาพ
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultipleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">อัปโหลดแล้ว {newVehicle.carImages.length} รูป</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  {newVehicle.carImages.map((img, idx) => (
                    <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx, false)}
                        className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full text-[10px] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded">รูปหลัก</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-sky-400" /> รหัสรถ (Auto ID)
                  </label>
                  <input
                    type="text"
                    value={newVehicle.carCode}
                    onChange={(e) => setNewVehicle({ ...newVehicle, carCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ทะเบียนรถ</label>
                  <input
                    type="text"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 font-bold"
                    placeholder="ฮอ-1234"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">รุ่นรถ / ยี่ห้อ VIP</label>
                  <input
                    type="text"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 font-bold"
                    placeholder="เช่น Toyota Commuter VIP"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    value={newVehicle.seats}
                    onChange={(e) => setNewVehicle({ ...newVehicle, seats: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">วันหมดอายุประกันภัย</label>
                  <input
                    type="date"
                    value={newVehicle.insuranceExp}
                    onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">กำหนดเลขไมล์เช็กระยะ (กม.)</label>
                  <input
                    type="number"
                    value={newVehicle.nextServiceMileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, nextServiceMileage: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                    placeholder="เช่น 50000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">สิ่งอำนวยความสะดวก & ไฮไลต์รถ VIP</label>
                <textarea
                  rows={3}
                  value={newVehicle.features}
                  onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  placeholder="เช่น เบาะนวดไฟฟ้า, สมาร์ททีวี, Wi-Fi 5G"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  บันทึกข้อมูลรถ (ตาราง fleet)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: แก้ไขข้อมูลรถ --- */}
      {isEditModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-sky-400" />
              <span>แก้ไขข้อมูลรถยนต์ ({editingVehicle.carCode})</span>
            </h3>

            <form onSubmit={handleUpdateVehicle} className="space-y-4 text-xs">
              
              <div className="space-y-2">
                <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-400" /> จัดการรูปภาพรถยนต์ (เลือกเพิ่มได้หลายรูป)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> + เพิ่มรูปภาพ
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultipleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">ทั้งหมด {editingVehicle.carImages.length} รูป</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  {editingVehicle.carImages.map((img, idx) => (
                    <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx, true)}
                        className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full text-[10px] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded">รูปหลัก</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-sky-400" /> รหัสรถ (Auto ID)
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.carCode}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, carCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ทะเบียนรถ</label>
                  <input
                    type="text"
                    value={editingVehicle.plate}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, plate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">รุ่นรถ / ยี่ห้อ VIP</label>
                  <input
                    type="text"
                    value={editingVehicle.brand}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    value={editingVehicle.seats}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">วันหมดอายุประกันภัย</label>
                  <input
                    type="date"
                    value={editingVehicle.insuranceExp}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, insuranceExp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">กำหนดเลขไมล์เช็กระยะ (กม.)</label>
                  <input
                    type="number"
                    value={editingVehicle.nextServiceMileage}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, nextServiceMileage: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">สิ่งอำนวยความสะดวก & ไฮไลต์รถ VIP</label>
                <textarea
                  rows={3}
                  value={editingVehicle.features}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, features: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
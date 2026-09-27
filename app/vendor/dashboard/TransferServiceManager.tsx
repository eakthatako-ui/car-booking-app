'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarCheck, Plus, MapPin, Calendar, Star, Edit, Trash2, CheckCircle2, X, Check, Image as ImageIcon, Hash, Car, Clock, Sparkles, Eye, Upload, Loader2, BookmarkCheck, User, Phone, Users, ChevronLeft, ChevronRight, Gauge, BookOpen, Clock3, CheckCircle, Backpack, AlertCircle, PlaneTakeoff, Navigation, ArrowLeftRight } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function TransferServiceManager() {
  const [services, setServices] = useState<any[]>([]);
  const [fleetList, setFleetList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchFleetData();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfer_services')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching transfer services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFleetData = async () => {
    try {
      const { data, error } = await supabase.from('fleet').select('*');
      if (error) throw error;
      if (data) {
        setFleetList(data);
      }
    } catch (error) {
      console.error('Error fetching fleet:', error);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCarDetailModalOpen, setIsCarDetailModalOpen] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState<any>(null);
  
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<any>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<any>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    phone: '',
    travel_date: '',
    return_date: '',
    trip_type: 'one_way' as 'one_way' | 'round_trip',
    flight_number: '',
    pickup_location: '',
    dropoff_location: '',
  });
  
  const [newService, setNewService] = useState({
    serviceCode: 'TRANSFER-001',
    title: '',
    advanceDays: '1',
    transferType: 'รับจากสนามบิน (Airport Pickup)',
    origin: 'สนามบินสุวรรณภูมิ (BKK)',
    destination: 'โรงแรมในพัทยา',
    serviceClass: 'Toyota Commuter VIP (13 ที่นั่ง)',
    
    onewayPrice: '1,500',
    roundtripPrice: '2,800',
    duration: 'ประมาณ 2 ชั่วโมง',

    itineraryDetails: 'บริการรับส่งสนามบิน-โรงแรม พร้อมป้ายต้อนรับโดยคนขับมืออาชีพ',
    inclusions: '• ค่าบริการรถตู้ VIP และคนขับ\n• ค่าน้ำมันและค่าทางด่วน',
    exclusions: '• ค่าใช้จ่ายส่วนตัวอื่นๆ',
    whatToBring: '• แจ้งหมายเลขเที่ยวบินและเวลาลงเครื่อง',
    termsConditions: '• ชำระเงินเต็มจำนวนหรือมัดจำล่วงหน้า',

    images: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractMaxSeats = (serviceClass: string) => {
    if (!serviceClass) return 13;
    const match = serviceClass.match(/\((\d+)\s*ที่นั่ง\)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 13;
  };

  const handleOpenCarDetail = (serviceClassText: string) => {
    const cleanTarget = (serviceClassText || '').toLowerCase().trim();
    const foundCar = fleetList.find(car => {
      const brandLower = (car.brand || '').toLowerCase().trim();
      const fullCarName = `${brandLower} (${car.seats} ที่นั่ง)`.toLowerCase();
      return cleanTarget === brandLower || 
             cleanTarget === fullCarName ||
             cleanTarget.includes(brandLower) ||
             brandLower.includes(cleanTarget);
    });

    if (foundCar) {
      setSelectedCarDetail(foundCar);
    } else {
      setSelectedCarDetail({
        car_code: 'CAR-VIP',
        brand: serviceClassText,
        plate: 'รถตู้มาตรฐาน VIP',
        seats: extractMaxSeats(serviceClassText),
        status: 'available',
        next_service_mileage: 50000,
        car_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        features: '• เบาะนวดไฟฟ้า\n• สมาร์ททีวี\n• Wi-Fi 5G'
      });
    }
    setIsCarDetailModalOpen(true);
  };

  const openLightbox = (imagesList: string[], index: number = 0) => {
    setLightboxImages(imagesList);
    setLightboxIndex(index);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.serviceCode || !newService.title || !newService.origin || !newService.destination) {
      alert('กรุณากรอกข้อมูลรหัสบริการ ชื่อ และเส้นทางรับ-ส่งให้ครบถ้วน');
      return;
    }

    const formattedRoute = `${newService.origin} ➔ ${newService.destination}`;
    const mainImage = newService.images.length > 0 ? newService.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';

    const servicePayload = {
      service_code: newService.serviceCode,
      title: newService.title,
      advance_days: newService.advanceDays,
      route: formattedRoute,
      service_class: newService.serviceClass,
      transfer_type: newService.transferType,
      price: newService.onewayPrice,
      roundtrip_price: newService.roundtripPrice,
      duration: newService.duration,
      itinerary_details: newService.itineraryDetails,
      inclusions: newService.inclusions,
      exclusions: newService.exclusions,
      what_to_bring: newService.whatToBring,
      terms_conditions: newService.termsConditions,
      image: mainImage,
      images: newService.images,
      status: 'active',
    };

    try {
      const { data, error } = await supabase
        .from('transfer_services')
        .insert([servicePayload])
        .select();

      if (error) throw error;

      if (data) {
        setServices([data[0], ...services]);
        setIsAddModalOpen(false);
        alert('บันทึกข้อมูลบริการรับส่งสำเร็จ!');
      }
    } catch (error: any) {
      console.error('Error adding transfer service:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    }
  };

  const openEditModal = (service: any) => {
    setEditingServiceId(service.id);
    const routeParts = service.route ? service.route.split('➔').map((s: string) => s.trim()) : ['กรุงเทพฯ', 'สนามบิน'];
    setNewService({
      serviceCode: service.service_code || 'TRANSFER-001',
      title: service.title || '',
      advanceDays: service.advance_days || '1',
      transferType: service.transfer_type || 'รับจากสนามบิน (Airport Pickup)',
      origin: routeParts[0] || 'กรุงเทพฯ',
      destination: routeParts[1] || 'สนามบิน',
      serviceClass: service.service_class || 'Toyota Commuter VIP (13 ที่นั่ง)',
      onewayPrice: service.price || '1,500',
      roundtripPrice: service.roundtrip_price || '2,800',
      duration: service.duration || 'ประมาณ 2 ชั่วโมง',
      itineraryDetails: service.itinerary_details || '',
      inclusions: service.inclusions || '',
      exclusions: service.exclusions || '',
      whatToBring: service.what_to_bring || '',
      termsConditions: service.terms_conditions || '',
      images: service.images && service.images.length > 0 ? service.images : [service.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;

    const formattedRoute = `${newService.origin} ➔ ${newService.destination}`;
    const mainImage = newService.images.length > 0 ? newService.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';

    const servicePayload = {
      service_code: newService.serviceCode,
      title: newService.title,
      advance_days: newService.advanceDays,
      route: formattedRoute,
      service_class: newService.serviceClass,
      transfer_type: newService.transferType,
      price: newService.onewayPrice,
      roundtrip_price: newService.roundtripPrice,
      duration: newService.duration,
      itinerary_details: newService.itineraryDetails,
      inclusions: newService.inclusions,
      exclusions: newService.exclusions,
      what_to_bring: newService.whatToBring,
      terms_conditions: newService.termsConditions,
      image: mainImage,
      images: newService.images,
    };

    try {
      const { error } = await supabase
        .from('transfer_services')
        .update(servicePayload)
        .eq('id', editingServiceId);

      if (error) throw error;

      alert('อัปเดตข้อมูลบริการรับส่งสำเร็จ!');
      setIsEditModalOpen(false);
      setEditingServiceId(null);
      fetchServices();
    } catch (error: any) {
      console.error('Error updating transfer service:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('คุณต้องการลบบริการรับส่งนี้ออกจากระบบฐานข้อมูลใช่หรือไม่?')) {
      try {
        const { error } = await supabase
          .from('transfer_services')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setServices(services.filter((item) => item.id !== id));
      } catch (error: any) {
        console.error('Error deleting transfer service:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
      }
    }
  };

  const matchedFleetCar = fleetList.find(c => {
    const cleanTarget = (newService.serviceClass || '').toLowerCase().trim();
    const brandLower = (c.brand || '').toLowerCase().trim();
    return cleanTarget === brandLower || cleanTarget.includes(brandLower) || brandLower.includes(cleanTarget);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <PlaneTakeoff className="w-5 h-5" />
            </div>
            <span>จัดการบริการรับส่ง (Transfer Service Manager)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">ระบบจัดการรถรับ-ส่งสนามบินและระหว่างเมือง พร้อมเรตราคาเที่ยวเดียว/ไป-กลับ</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewService({
              serviceCode: `TRANSFER-00${services.length + 1}`,
              title: '',
              advanceDays: '1',
              transferType: 'รับจากสนามบิน (Airport Pickup)',
              origin: 'สนามบินสุวรรณภูมิ (BKK)',
              destination: 'โรงแรมในกรุงเทพฯ',
              serviceClass: fleetList.length > 0 ? `${fleetList[0].brand} (${fleetList[0].seats} ที่นั่ง)` : 'Toyota Commuter VIP (13 ที่นั่ง)',
              onewayPrice: '1,200',
              roundtripPrice: '2,300',
              duration: 'ประมาณ 1 ชั่วโมง',
              itineraryDetails: 'บริการรับส่งสนามบินพร้อมป้ายต้อนรับโดยคนขับสุภาพ',
              inclusions: '• รถ VIP และคนขับ',
              exclusions: '• ค่าใช้จ่ายส่วนตัว',
              whatToBring: '• แจ้งหมายเลขเที่ยวบิน',
              termsConditions: '• ชำระเงินเมื่อทำการจอง',
              images: [],
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 rounded-2xl text-xs font-black shadow-xl shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 font-black" />
          <span>+ สร้างบริการรับส่งใหม่</span>
        </button>
      </div>

      {/* --- SERVICES LIST GRID --- */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลบริการรับส่ง...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">ยังไม่มีข้อมูลบริการรับส่งในระบบ กดสร้างบริการใหม่ด้านบนได้เลยครับ</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const maxSeats = extractMaxSeats(service.service_class);
            const serviceImagesList = service.images && service.images.length > 0 ? service.images : [service.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'];
            const serviceMainImage = serviceImagesList[0];

            return (
              <div key={service.id} className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-sky-500/40 transition-all group backdrop-blur-md">
                
                {/* --- รูปภาพหลัก --- */}
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img 
                    src={serviceMainImage} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => openLightbox(serviceImagesList, 0)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-sky-600/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow border border-sky-500/50 flex items-center gap-1">
                      <Hash className="w-2.5 h-2.5" /> {service.service_code}
                    </span>
                    <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-lg shadow">
                      {service.transfer_type}
                    </span>
                  </div>
                </div>

                {/* --- เนื้อหาการ์ด --- */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-black bg-gradient-to-r from-sky-300 via-blue-400 to-sky-500 bg-clip-text text-transparent tracking-wide truncate flex items-center gap-1.5 drop-shadow">
                      <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">{service.title}</span>
                    </h3>
                    
                    <div className="text-xs text-sky-400 font-extrabold pt-0.5 tracking-wide">
                      <span>⏱️ จองล่วงหน้า ≥ {service.advance_days || 1} วัน</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-sky-950/85 via-slate-900 to-slate-900 border-2 border-sky-500/60 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/40 shrink-0 shadow-md">
                        <Navigation className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[10px] text-sky-300 block font-black uppercase tracking-wider">เส้นทางรับ - ส่ง</span>
                        <strong className="text-xs text-white font-black tracking-tight block truncate">{service.route}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2 flex-nowrap overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleOpenCarDetail(service.service_class)}
                      className="inline-flex items-center gap-1 bg-sky-950/90 hover:bg-sky-900 text-sky-400 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-sky-700/60 shadow transition-all cursor-pointer group/car shrink-0"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{service.service_class}</span> 🔍
                    </button>

                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800/60 shrink-0">
                      👥 ไม่เกิน {maxSeats} ท่าน
                    </span>
                  </div>
                </div>

                {/* --- ส่วนราคา & ปุ่ม --- */}
                <div className="p-4 pt-2.5 space-y-3 border-t border-slate-800/80 bg-slate-900/40">
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/90 space-y-1.5 shadow-inner">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">เรตราคา (เที่ยวเดียว / ไป-กลับ)</span>
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-sky-400">เที่ยวเดียว: <strong className="text-amber-400">฿{Number(String(service.price || '0').replace(/,/g, '')).toLocaleString()}</strong></span>
                      {service.roundtrip_price && (
                        <span className="text-slate-300">ไป-กลับ: <strong className="text-amber-400">฿{Number(String(service.roundtrip_price).replace(/,/g, '')).toLocaleString()}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button type="button" onClick={() => { setSelectedServiceDetail(service); setIsDetailModalOpen(true); }} className="flex-1 py-2.5 bg-sky-950/80 hover:bg-sky-900 text-sky-400 rounded-xl border border-sky-800/80 shadow transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-bold">
                      <Eye className="w-3.5 h-3.5" /> <span>รายละเอียด</span>
                    </button>
                    <button type="button" onClick={() => openEditModal(service)} className="p-2.5 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="แก้ไข">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(service.id)} className="p-2.5 bg-slate-900 hover:bg-rose-950/40 text-rose-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="ลบ">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServiceForBooking(service);
                      setBookingForm({ customer_name: '', phone: '', travel_date: new Date().toISOString().split('T')[0], return_date: '', trip_type: 'one_way', flight_number: '', pickup_location: service.route.split('➔')[0].trim(), dropoff_location: service.route.split('➔')[1].trim() });
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <BookmarkCheck className="w-4 h-4 font-black" />
                    <span>จองบริการรับส่งนี้</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL: ดูรายละเอียดเชิงลึก (Detail Modal) --- */}
      {isDetailModalOpen && selectedServiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl">
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">{selectedServiceDetail.service_code}</span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg">{selectedServiceDetail.transfer_type}</span>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  ⏱️ ต้องจองล่วงหน้าอย่างน้อย {selectedServiceDetail.advance_days || 1} วัน
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{selectedServiceDetail.title}</h3>
              <p className="text-xs text-sky-400 font-semibold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                📍 เส้นทาง: {selectedServiceDetail.route}
              </p>
            </div>

            {/* --- แสดงข้อมูลรถยนต์แบบเต็ม (Fleet Full Profile) --- */}
            {(() => {
              const target = (selectedServiceDetail.service_class || '').toLowerCase().trim();
              const carInfo = fleetList.find(c => {
                const brand = (c.brand || '').toLowerCase().trim();
                const full = `${brand} (${c.seats} ที่นั่ง)`.toLowerCase();
                return target === brand || target === full || target.includes(brand) || brand.includes(target);
              });

              return (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Car className="w-4 h-4" /> ข้อมูลยานพาหนะ (Fleet Profile)
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      ทะเบียน: {carInfo?.plate || 'รถตู้มาตรฐาน VIP'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="relative h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow">
                      <img 
                        src={carInfo?.car_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'} 
                        alt="Car Fleet" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2 text-xs">
                      <h4 className="text-white font-black text-sm">{carInfo?.brand || selectedServiceDetail.service_class}</h4>
                      <p className="text-slate-300 flex items-center gap-1.5 font-bold">
                        <Users className="w-3.5 h-3.5 text-emerald-400" /> รองรับผู้โดยสารสูงสุด: {carInfo?.seats || extractMaxSeats(selectedServiceDetail.service_class)} ที่นั่ง VIP
                      </p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {carInfo?.features || '• รถมาตรฐาน VIP พร้อมเบาะนั่งปรับเอนสะดวกสบาย ระบบปรับอากาศทั่วคัน และพนักงานขับรถสุภาพชำนาญเส้นทาง'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {selectedServiceDetail.itinerary_details && (
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-sky-500/30 space-y-1 text-xs">
                <span className="text-sky-400 font-bold block">จุดนัดพบ & รายละเอียดบริการ</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedServiceDetail.itinerary_details}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedServiceDetail.inclusions && (
                <div className="bg-slate-950/85 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-400 font-bold block">✅ ราคารวม (Inclusions)</span>
                  <p className="text-slate-200 whitespace-pre-line">{selectedServiceDetail.inclusions}</p>
                </div>
              )}
              {selectedServiceDetail.terms_conditions && (
                <div className="bg-slate-950/85 p-3.5 rounded-2xl border border-amber-500/30 space-y-1">
                  <span className="text-amber-400 font-bold block">⚠️ เงื่อนไขการให้บริการ</span>
                  <p className="text-slate-200 whitespace-pre-line">{selectedServiceDetail.terms_conditions}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">เรตราคาบริการ</span>
                <div className="text-sm font-black text-amber-400">
                  เที่ยวเดียว ฿{Number(String(selectedServiceDetail.price || '0').replace(/,/g, '')).toLocaleString()} 
                  {selectedServiceDetail.roundtrip_price ? ` | ไป-กลับ ฿{Number(String(selectedServiceDetail.roundtrip_price).replace(/,/g, '')).toLocaleString()}` : ''}
                </div>
              </div>
              <button type="button" onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl text-xs">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: แสดงรายละเอียดรถตามดีไซน์ที่คุณ Ek ต้องการ (Car Detail Modal ตรง 100%) --- */}
      {isCarDetailModalOpen && selectedCarDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button type="button" onClick={() => setIsCarDetailModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            {/* ส่วนหัวชื่อและทะเบียนรถ */}
            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                ข้อมูลรถในสังกัด (Fleet Detail)
              </span>
              <h3 className="text-lg font-black text-white pt-1">{selectedCarDetail.brand}</h3>
              <p className="text-xs text-slate-400">
                รหัสรถ: <strong className="text-sky-400">{selectedCarDetail.car_code || selectedCarDetail.carCode || 'CAR-VIP'}</strong> | ทะเบียน: <strong className="text-amber-400">{selectedCarDetail.plate || 'ไม่ระบุทะเบียน'}</strong>
              </p>
            </div>

            {/* รูปภาพรถ */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-950">
              <img 
                src={selectedCarDetail.car_image || selectedCarDetail.carImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'} 
                alt="Car Fleet" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* กล่องข้อมูลความจุและเลขไมล์ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 shadow-inner">
                <span className="text-slate-400 font-bold block">ความจุผู้โดยสาร</span>
                <p className="text-white font-black flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-emerald-400" /> {selectedCarDetail.seats} ที่นั่ง VIP
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 shadow-inner">
                <span className="text-slate-400 font-bold block">เลขไมล์เช็กระยะรอบถัดไป</span>
                <p className="text-white font-black flex items-center gap-1.5 text-sm">
                  <Gauge className="w-4 h-4 text-sky-400" /> {(selectedCarDetail.next_service_mileage || selectedCarDetail.nextServiceMileage || 50000).toLocaleString()} กม.
                </p>
              </div>
            </div>

            {/* สิ่งอำนวยความสะดวก & ไฮไลต์รถ */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 font-bold block">สิ่งอำนวยความสะดวก & ไฮไลต์รถ</span>
              <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                {selectedCarDetail.features || '• เบาะนวดไฟฟ้า\n• สมาร์ททีวี\n• Wi-Fi 5G'}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCarDetailModalOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black rounded-2xl text-xs shadow-lg cursor-pointer transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX GALLERY MODAL --- */}
      {lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-lg p-4" onClick={() => setLightboxImages([])}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setLightboxImages([])} className="absolute top-2 right-2 text-white bg-slate-800 p-2 rounded-xl z-20"><X className="w-5 h-5" /></button>
            <img src={lightboxImages[lightboxIndex]} alt="Gallery" className="max-w-full max-h-[82vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* --- MODAL: ฟอร์มจองบริการรับส่ง --- */}
      {isBookingModalOpen && selectedServiceForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            <h3 className="text-lg font-black text-white">จองบริการรับส่ง: {selectedServiceForBooking.title}</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              alert('จองบริการรับส่งสำเร็จเรียบร้อยแล้ว!');
              setIsBookingModalOpen(false);
            }} className="space-y-4 text-xs">
              
              {selectedServiceForBooking.roundtrip_price && (
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBookingForm({ ...bookingForm, trip_type: 'one_way' })}
                    className={`py-2 rounded-xl font-bold transition-all ${bookingForm.trip_type === 'one_way' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    เที่ยวเดียว (One-Way)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingForm({ ...bookingForm, trip_type: 'round_trip' })}
                    className={`py-2 rounded-xl font-bold transition-all ${bookingForm.trip_type === 'round_trip' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    รอบไป-กลับ (Round-Trip)
                  </button>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">ชื่อ-นามสกุล ผู้จอง</label>
                <input type="text" required value={bookingForm.customer_name} onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })} placeholder="คุณสมชาย" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">เบอร์โทรศัพท์</label>
                <input type="tel" required value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="0891234567" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">วันที่เดินทาง (ขาไป)</label>
                  <input type="date" required value={bookingForm.travel_date} onChange={(e) => setBookingForm({ ...bookingForm, travel_date: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white [color-scheme:dark] font-bold" />
                </div>
                {bookingForm.trip_type === 'round_trip' && (
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">วันที่เดินทางกลับ (ขากลับ)</label>
                    <input type="date" required value={bookingForm.return_date} onChange={(e) => setBookingForm({ ...bookingForm, return_date: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white [color-scheme:dark] font-bold" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">หมายเลขเที่ยวบิน / รายละเอียดจุดรับเพิ่มเติม (ถ้ามี)</label>
                <input type="text" value={bookingForm.flight_number} onChange={(e) => setBookingForm({ ...bookingForm, flight_number: e.target.value })} placeholder="เช่น TG652 หรือ ล็อบบี้โรงแรม" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold" />
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">ยอดชำระสุทธิ ({bookingForm.trip_type === 'round_trip' ? 'ไป-กลับ' : 'เที่ยวเดียว'})</span>
                  <span className="text-base font-black text-amber-400">
                    ฿{bookingForm.trip_type === 'round_trip' && selectedServiceForBooking.roundtrip_price 
                      ? Number(String(selectedServiceForBooking.roundtrip_price).replace(/,/g, '')).toLocaleString() 
                      : Number(String(selectedServiceForBooking.price).replace(/,/g, '')).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-bold">ชำระเงินหน้างาน</span>
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black">ยืนยันการจองบริการ</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: สร้าง หรือ แก้ไขบริการรับส่ง --- */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white">{isEditModalOpen ? 'แก้ไขบริการรับส่ง' : 'สร้างบริการรับส่งใหม่'}</h3>
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateService : handleAddService} className="space-y-4 text-xs">
              
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">รหัสบริการ</label>
                    <input type="text" value={newService.serviceCode} onChange={(e) => setNewService({ ...newService, serviceCode: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ต้องจองล่วงหน้า (วัน)</label>
                    <input type="text" value={newService.advanceDays} onChange={(e) => setNewService({ ...newService, advanceDays: e.target.value })} placeholder="เช่น 1" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ประเภทรับส่ง</label>
                    <input 
                      type="text" 
                      list="transferTypesList"
                      value={newService.transferType} 
                      onChange={(e) => setNewService({ ...newService, transferType: e.target.value })} 
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold" 
                      required
                    />
                    <datalist id="transferTypesList">
                      <option value="รับจากสนามบิน (Airport Pickup)" />
                      <option value="ส่งสนามบิน (Airport Dropoff)" />
                      <option value="ระหว่างเมือง (Intercity Transfer)" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ชื่อบริการรับส่ง</label>
                  <input type="text" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} placeholder="เช่น รับจากสนามบินสุวรรณภูมิ ➔ พัทยา" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold" required />
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">จุดรับ (Origin)</label>
                    <input type="text" value={newService.origin} onChange={(e) => setNewService({ ...newService, origin: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white" required />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">จุดส่ง (Destination)</label>
                    <input type="text" value={newService.destination} onChange={(e) => setNewService({ ...newService, destination: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white" required />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ประเภทรถ (เชื่อมโยงจาก Fleet)</label>
                  <select 
                    value={newService.serviceClass} 
                    onChange={(e) => setNewService({ ...newService, serviceClass: e.target.value })} 
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sky-400 font-bold"
                  >
                    {fleetList.length === 0 ? (
                      <option value="Toyota Commuter VIP (13 ที่นั่ง)">Toyota Commuter VIP (13 ที่นั่ง)</option>
                    ) : (
                      fleetList.map(c => <option key={c.id} value={`${c.brand} (${c.seats} ที่นั่ง)`}>{c.brand} ({c.seats} ที่นั่ง)</option>)
                    )}
                  </select>
                </div>

                {matchedFleetCar && (
                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <img src={matchedFleetCar.car_image} alt="Fleet" className="w-16 h-12 object-cover rounded-xl" />
                    <div>
                      <p className="text-white font-bold text-xs">{matchedFleetCar.brand} (ทะเบียน: {matchedFleetCar.plate || 'รถใหม่'})</p>
                      <p className="text-[10px] text-emerald-400">ความจุสูงสุด: {matchedFleetCar.seats} ที่นั่ง พร้อมสิ่งอำนวยความสะดวกครบครัน</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-amber-950/30 p-3 rounded-2xl border border-amber-500/40">
                    <label className="block font-bold text-amber-300 mb-1 text-[11px]">ราคาเที่ยวเดียว (One-Way ฿)</label>
                    <input type="text" value={newService.onewayPrice} onChange={(e) => setNewService({ ...newService, onewayPrice: e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-black text-sm text-center" required />
                  </div>
                  <div className="bg-blue-950/30 p-3 rounded-2xl border border-blue-500/40">
                    <label className="block font-bold text-blue-300 mb-1 text-[11px]">ราคารอบไป-กลับ (Round-Trip ฿)</label>
                    <input type="text" value={newService.roundtripPrice} onChange={(e) => setNewService({ ...newService, roundtripPrice: e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 font-black text-sm text-center" placeholder="เช่น 2,800" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">รายละเอียดบริการ (Itinerary Details / จุดนัดพบ)</label>
                  <textarea rows={2} value={newService.itineraryDetails} onChange={(e) => setNewService({ ...newService, itineraryDetails: e.target.value })} placeholder="เช่น พนักงานชูป้ายต้อนรับบริเวณทางออก ประตู 3" className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ราคารวม (Inclusions)</label>
                    <textarea rows={2} value={newService.inclusions} onChange={(e) => setNewService({ ...newService, inclusions: e.target.value })} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white"></textarea>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">เงื่อนไข (Terms)</label>
                    <textarea rows={2} value={newService.termsConditions} onChange={(e) => setNewService({ ...newService, termsConditions: e.target.value })} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white"></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-3 bg-slate-800 text-white rounded-2xl font-bold">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 bg-sky-500 text-slate-950 rounded-2xl font-black">บันทึกบริการรับส่ง</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
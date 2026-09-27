'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarCheck, Plus, MapPin, Calendar, Star, Edit, Trash2, CheckCircle2, X, Check, Smile, Image as ImageIcon, Hash, Car, Clock, Fuel, ShieldAlert, DollarSign, Sparkles, Eye, Upload, Loader2, BookmarkCheck, User, Phone, Users, ChevronLeft, ChevronRight, Gauge, Layers, CheckSquare, FileText, Baby, BookOpen, Clock3, Hotel, BedDouble, CheckCircle, Backpack, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function DayTourManager() {
  const [trips, setTrips] = useState<any[]>([]);
  const [fleetList, setFleetList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSlipUploading, setIsSlipUploading] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchFleetData();
    fetchBookingsData();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('day_tours')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) {
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching day tours:', error);
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

  const fetchBookingsData = async () => {
    try {
      const { data, error } = await supabase.from('charter_bookings').select('id, trip_id, passengers_count, status');
      if (error) throw error;
      if (data) {
        setBookingsList(data);
      }
    } catch (error) {
      console.error('Error fetching bookings for capacity:', error);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [isCarDetailModalOpen, setIsCarDetailModalOpen] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState<any>(null);
  
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  
  const [selectedTripDetail, setSelectedTripDetail] = useState<any>(null);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<any>(null);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [slipUrl, setSlipUrl] = useState<string>('');
  const [editingTripId, setEditingTripId] = useState<number | null>(null);

  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    phone: '',
    travel_date: '',
    adults_count: 1,
    child_count: 0,
  });
  
  const [newTrip, setNewTrip] = useState({
    tripCode: 'DAYTOUR-001',
    title: '',
    advanceDays: '2',
    origin: 'กรุงเทพฯ',
    destinations: ['ตลาดน้ำอัมพวา', 'ตลาดแม่กลอง'],
    tierBadge: '',
    serviceClass: 'Toyota Commuter VIP (13 ที่นั่ง)',
    isEveryday: false,
    tourDate: new Date().toISOString().split('T')[0],
    pickupTime: '08:00 น.',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isCustomDuration: false,
    customDays: '1',
    customNights: '0',
    priceDisplayType: 'per_person',
    totalPackagePrice: '2,900',
    minPackagePax: '1',
    adultPrice: '2900',
    childPrice: '1900',
    infantPrice: '500',
    minBookingPax: '1',
    rentalHours: '10 ชั่วโมง',
    driverAccommodationFee: '0',
    fuelPolicy: '',
    tollPolicy: '',
    hotelName: '',
    roomType: '',
    hotelLocation: '',
    hotelImages: [] as string[],
    itineraryDetails: 'ทริปเที่ยววันเดียว 1 Day Trip ดื่มด่ำวิถีชีวิตริมน้ำและตลาดร่มหุบ',
    inclusions: '• รถตู้ VIP และคนขับสุภาพ',
    exclusions: '• ค่าเข้าชมสถานที่และอาหารกลางวัน',
    whatToBring: '• แว่นกันแดด, ครีมกันแดด',
    termsConditions: '• ชำระเงินเต็มจำนวนเมื่อทำการจอง',

    itineraryHours: [
      { time: '08:00 น.', title: 'ออกเดินทางจากจุดนัดพบ', description: '• รับท่านจากจุดนัดหมายในกรุงเทพฯ' },
      { time: '10:00 น.', title: 'ถึงตลาดแม่กลอง (ตลาดร่มหุบ)', description: '• ชมขบวนรถไฟวิ่งผ่านตลาด' }
    ] as { time: string; title: string; description: string }[],

    images: [] as string[],
  });

  const handleUploadSlipAndFinish = () => {
    setIsSlipModalOpen(false);
    alert('บันทึกการจองและแนบสลิปเรียบร้อยแล้ว!');
  };

  const formatThaiDateShort = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const thaiMonthsShort = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonthsShort[date.getMonth()];
    const year = String(date.getFullYear() + 543).slice(-2);

    return `${day} ${month} '${year}`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slipFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItineraryHour = () => {
    setNewTrip({
      ...newTrip,
      itineraryHours: [...newTrip.itineraryHours, { time: '13:00 น.', title: 'กิจกรรมช่วงบ่าย', description: '• รายละเอียดกิจกรรม' }]
    });
  };

  const handleRemoveItineraryHour = (index: number) => {
    const updated = newTrip.itineraryHours.filter((_, idx) => idx !== index);
    setNewTrip({ ...newTrip, itineraryHours: updated });
  };

  const handleItineraryChange = (index: number, field: 'time' | 'title' | 'description', value: string) => {
    const updated = [...newTrip.itineraryHours];
    updated[index][field] = value;
    setNewTrip({ ...newTrip, itineraryHours: updated });
  };

  const extractMaxSeats = (serviceClass: string) => {
    if (!serviceClass) return 13;
    const match = serviceClass.match(/\((\d+)\s*ที่นั่ง\)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 13;
  };

  const getBookedSeatsForTrip = (tripId: any) => {
    return bookingsList
      .filter((b) => Number(b.trip_id) === Number(tripId))
      .reduce((sum, b) => sum + (Number(b.passengers_count) || 0), 0);
  };

  const handleOpenCarDetail = (serviceClassText: string) => {
    const foundCar = fleetList.find(car => 
      serviceClassText.toLowerCase().includes((car.brand || '').toLowerCase()) ||
      (car.brand || '').toLowerCase().includes(serviceClassText.toLowerCase())
    );

    if (foundCar) {
      setSelectedCarDetail(foundCar);
    } else {
      setSelectedCarDetail({
        car_code: 'CAR-VIP',
        brand: serviceClassText,
        plate: 'ไม่ระบุทะเบียน',
        seats: extractMaxSeats(serviceClassText),
        status: 'available',
        insurance_exp: '2026-12-31',
        next_service_mileage: 50000,
        car_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        features: '• รถมาตรฐาน VIP พร้อมให้บริการ'
      });
    }
    setIsCarDetailModalOpen(true);
  };

  const openLightbox = (imagesList: string[], index: number = 0) => {
    setLightboxImages(imagesList);
    setLightboxIndex(index);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImages.length === 0) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setLightboxImages([]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImages]);

  const handleUploadFromComputer = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `daytour_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `trip-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('trips')
          .upload(filePath, file);

        if (uploadError) {
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (ev) => {
              if (ev.target?.result) uploadedUrls.push(ev.target.result as string);
              resolve(true);
            };
            reader.readAsDataURL(file);
          });
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('trips')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        setNewTrip(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
      }
    } catch (err: any) {
      console.error('Error uploading images:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ: ' + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewTrip(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsSlipUploading(true);
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `slip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `trip-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trips')
        .upload(filePath, file);

      if (uploadError) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (ev) => {
            if (ev.target?.result) {
              setSlipUrl(ev.target?.result as string);
            }
            resolve(true);
          };
          reader.readAsDataURL(file);
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('trips')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setSlipUrl(publicUrlData.publicUrl);
        }
      }
    } catch (err: any) {
      console.error('Error uploading slip:', err);
      alert('เกิดข้อผิดพลาดในการอัปโหลดสลิป: ' + err.message);
    } finally {
      setIsSlipUploading(false);
      if (slipFileInputRef.current) slipFileInputRef.current.value = '';
    }
  };

  const [destInput, setDestInput] = useState('');

  const handleAddDestination = () => {
    if (destInput.trim() && !newTrip.destinations.includes(destInput.trim())) {
      setNewTrip({ ...newTrip, destinations: [...newTrip.destinations, destInput.trim()] });
      setDestInput('');
    }
  };

  const handleRemoveDestination = (index: number) => {
    const updated = newTrip.destinations.filter((_, i) => i !== index);
    setNewTrip({ ...newTrip, destinations: updated });
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.tripCode || !newTrip.title || newTrip.destinations.length === 0) {
      alert('กรุณากรอกรหัสทริป, ชื่อทริป และระบุสถานที่ท่องเที่ยวอย่างน้อย 1 แห่ง');
      return;
    }

    const formattedRoute = `${newTrip.origin} ➔ ${newTrip.destinations.join(' / ')}`;
    const formattedDateRange = newTrip.isEveryday 
      ? `บริการทุกวัน (Everyday)\n(รอบเวลารับ ${newTrip.pickupTime})`
      : `วันที่: ${formatThaiDateShort(newTrip.tourDate)}\n(รอบเวลารับ ${newTrip.pickupTime})`;

    const mainImage = newTrip.images.length > 0 ? newTrip.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';

    const tripPayload = {
      trip_code: newTrip.tripCode,
      title: newTrip.title,
      advance_days: newTrip.advanceDays,
      route: formattedRoute,
      service_class: newTrip.serviceClass,
      date_range: formattedDateRange,
      adult_price: newTrip.adultPrice,
      child_price: newTrip.childPrice,
      total_days: 1,
      rental_hours: newTrip.rentalHours,
      itinerary_details: newTrip.itineraryDetails,
      inclusions: newTrip.inclusions,
      exclusions: newTrip.exclusions,
      what_to_bring: newTrip.whatToBring,
      terms_conditions: newTrip.termsConditions,
      itinerary_days: newTrip.itineraryHours,
      image: mainImage,
      images: newTrip.images,
      status: 'active',
    };

    try {
      const { data, error } = await supabase
        .from('day_tours')
        .insert([tripPayload])
        .select();

      if (error) throw error;

      if (data) {
        setTrips([data[0], ...trips]);
        setIsAddModalOpen(false);
        alert('บันทึกข้อมูลเดย์ทัวร์สำเร็จ!');
      }
    } catch (error: any) {
      console.error('Error adding day tour:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    }
  };

  const openEditModal = (trip: any) => {
    setEditingTripId(trip.id);
    const isEverydayTrip = trip.date_range?.includes('บริการทุกวัน');
    setNewTrip({
      tripCode: trip.trip_code || 'DAYTOUR-001',
      title: trip.title || '',
      advanceDays: trip.advance_days || '2',
      origin: trip.route ? trip.route.split('➔')[0].trim() : 'กรุงเทพฯ',
      destinations: trip.route && trip.route.includes('➔') ? trip.route.split('➔')[1].trim().split('/').map((s: string) => s.trim()) : [],
      tierBadge: '',
      serviceClass: trip.service_class || 'Toyota Commuter VIP (13 ที่นั่ง)',
      isEveryday: isEverydayTrip,
      tourDate: new Date().toISOString().split('T')[0],
      pickupTime: '08:00 น.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      isCustomDuration: false,
      customDays: '1',
      customNights: '0',
      priceDisplayType: 'per_person',
      totalPackagePrice: '2,900',
      minPackagePax: '1',
      adultPrice: trip.adult_price || '2900',
      childPrice: trip.child_price || '1900',
      infantPrice: '500',
      minBookingPax: '1',
      rentalHours: trip.rental_hours || '10 ชั่วโมง',
      driverAccommodationFee: '0',
      fuelPolicy: '',
      tollPolicy: '',
      hotelName: '',
      roomType: '',
      hotelLocation: '',
      hotelImages: [],
      itineraryDetails: trip.itinerary_details || 'รายละเอียดโปรแกรมทัวร์...',
      inclusions: trip.inclusions || '• รถ VIP และคนขับ',
      exclusions: trip.exclusions || '• ค่าใช้จ่ายส่วนตัว',
      whatToBring: trip.what_to_bring || '• เสื้อผ้า, ยาส่วนตัว',
      termsConditions: trip.terms_conditions || '• ชำระเงินเมื่อจอง',
      itineraryHours: trip.itinerary_days || [
        { time: '08:00 น.', title: 'ออกเดินทาง', description: '• ออกเดินทางจากจุดนัดพบ' }
      ],
      images: trip.images && trip.images.length > 0 ? trip.images : [trip.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'],
    });
    setIsEditModalOpen(true);
  };

  const openDetailModal = (trip: any) => {
    setSelectedTripDetail(trip);
    setIsDetailModalOpen(true);
  };

  const openBookingModal = (trip: any) => {
    setSelectedTripForBooking(trip);
    setBookingForm({
      customer_name: '',
      phone: '',
      travel_date: new Date().toISOString().split('T')[0],
      adults_count: 1,
      child_count: 0,
    });
    setIsBookingModalOpen(true);
  };

  const calculateBookingTotal = (trip: any) => {
    if (!trip) return 0;
    const adultP = Number(String(trip.adult_price || '0').replace(/,/g, '')) || 0;
    const childP = Number(String(trip.child_price || '0').replace(/,/g, '')) || 0;
    return (bookingForm.adults_count * adultP) + (bookingForm.child_count * childP);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripForBooking) return;

    const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
    const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
    const availableSeats = Math.max(0, maxSeats - bookedSeats);
    const totalPax = bookingForm.adults_count + bookingForm.child_count;

    if (totalPax > availableSeats) {
      alert(`ขออภัยครับ ที่นั่งว่างไม่เพียงพอ (เหลือที่นั่งว่าง ${availableSeats} ท่านเท่านั้น)`);
      return;
    }

    const totalPrice = calculateBookingTotal(selectedTripForBooking);

    const bookingPayload = {
      trip_id: selectedTripForBooking.id,
      customer_name: bookingForm.customer_name,
      phone: bookingForm.phone,
      travel_date: bookingForm.travel_date,
      passengers_count: totalPax,
      total_price: totalPrice.toLocaleString(),
      status: 'รอดำเนินการ',
    };

    try {
      const { error } = await supabase
        .from('charter_bookings')
        .insert([bookingPayload]);

      if (error) throw error;

      alert('จองเดย์ทัวร์สำเร็จ! ข้อมูลถูกบันทึกลงระบบเรียบร้อยแล้ว');
      setIsBookingModalOpen(false);
      setIsSlipModalOpen(true);
    } catch (error: any) {
      console.error('Error saving booking:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการจอง: ' + error.message);
    }
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTripId) return;

    const formattedRoute = `${newTrip.origin} ➔ ${newTrip.destinations.join(' / ')}`;
    const formattedDateRange = newTrip.isEveryday 
      ? `บริการทุกวัน (Everyday)\n(รอบเวลารับ ${newTrip.pickupTime})`
      : `วันที่: ${formatThaiDateShort(newTrip.tourDate)}\n(รอบเวลารับ ${newTrip.pickupTime})`;

    const mainImage = newTrip.images.length > 0 ? newTrip.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';

    const tripPayload = {
      trip_code: newTrip.tripCode,
      title: newTrip.title,
      advance_days: newTrip.advanceDays,
      route: formattedRoute,
      service_class: newTrip.serviceClass,
      date_range: formattedDateRange,
      adult_price: newTrip.adultPrice,
      child_price: newTrip.childPrice,
      total_days: 1,
      rental_hours: newTrip.rentalHours,
      itinerary_details: newTrip.itineraryDetails,
      inclusions: newTrip.inclusions,
      exclusions: newTrip.exclusions,
      what_to_bring: newTrip.whatToBring,
      terms_conditions: newTrip.termsConditions,
      itinerary_days: newTrip.itineraryHours,
      image: mainImage,
      images: newTrip.images,
    };

    try {
      const { error } = await supabase
        .from('day_tours')
        .update(tripPayload)
        .eq('id', editingTripId);

      if (error) throw error;

      alert('อัปเดตข้อมูลเดย์ทัวร์สำเร็จ!');
      setIsEditModalOpen(false);
      setEditingTripId(null);
      fetchTrips();
    } catch (error: any) {
      console.error('Error updating day tour:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('คุณต้องการลบเดย์ทัวร์นี้ออกจากระบบฐานข้อมูลใช่หรือไม่?')) {
      try {
        const { error } = await supabase
          .from('day_tours')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setTrips(trips.filter((item) => item.id !== id));
      } catch (error: any) {
        console.error('Error deleting day tour:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <CalendarCheck className="w-5 h-5"/>
            </div>
            <span>จัดการเดย์ทัวร์ (1-Day Tour Manager)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">ระบบจัดการทัวร์ท่องเที่ยวแบบ 1 วัน แยกตารางฐานข้อมูลอิสระ 100%</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTrip({
              tripCode: `DAYTOUR-00${trips.length + 1}`,
              title: '',
              advanceDays: '2',
              origin: 'กรุงเทพฯ',
              destinations: ['ตลาดน้ำอัมพวา', 'ตลาดแม่กลอง'],
              tierBadge: '',
              serviceClass: fleetList.length > 0 ? `${fleetList[0].brand} (${fleetList[0].seats} ที่นั่ง)` : 'Toyota Commuter VIP (13 ที่นั่ง)',
              isEveryday: false,
              tourDate: new Date().toISOString().split('T')[0],
              pickupTime: '08:00 น.',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              isCustomDuration: false,
              customDays: '1',
              customNights: '0',
              priceDisplayType: 'per_person',
              totalPackagePrice: '2,900',
              minPackagePax: '1',
              adultPrice: '2900',
              childPrice: '1900',
              infantPrice: '500',
              minBookingPax: '1',
              rentalHours: '10 ชั่วโมง',
              driverAccommodationFee: '0',
              fuelPolicy: '',
              tollPolicy: '',
              hotelName: '',
              roomType: '',
              hotelLocation: '',
              hotelImages: [],
              itineraryDetails: 'ทริปเที่ยววันเดียว 1 Day Trip ดื่มด่ำวิถีชีวิตริมน้ำและตลาดร่มหุบ',
              inclusions: '• รถตู้ VIP และคนขับสุภาพ',
              exclusions: '• ค่าเข้าชมสถานที่และอาหาร',
              whatToBring: '• แว่นกันแดด, ครีมกันแดด',
              termsConditions: '• ชำระเงินเมื่อทำการจอง',
              itineraryHours: [
                { time: '08:00 น.', title: 'ออกเดินทาง', description: '• ออกเดินทางจากจุดนัดพบ' }
              ],
              images: [],
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-2xl text-xs font-black shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 font-black"/>
          <span>+ สร้างเดย์ทัวร์ใหม่</span>
        </button>
      </div>

      {/* --- TRIPS LIST GRID --- */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลจากฐานข้อมูล...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">ยังไม่มีข้อมูลเดย์ทัวร์ในระบบ กดสร้างเดย์ทัวร์ใหม่ด้านบนได้เลยครับ</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => {
            const adultP = trip.adult_price || '2900';
            const childP = trip.child_price || '1900';
            const maxSeats = extractMaxSeats(trip.service_class);
            const bookedSeats = getBookedSeatsForTrip(trip.id);
            const availableSeats = Math.max(0, maxSeats - bookedSeats);
            const seatPercentage = Math.min(100, Math.round((bookedSeats / maxSeats) * 100));
            const isFull = availableSeats <= 0;

            const tripImagesList = trip.images && trip.images.length > 0 ? trip.images : [trip.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'];
            const tripMainImage = tripImagesList[0];

            return (
              <div key={trip.id} className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-sky-500/40 transition-all group backdrop-blur-md">
                
                {/* --- รูปภาพหลัก --- */}
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img 
                    src={tripMainImage} 
                    alt={trip.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => openLightbox(tripImagesList, 0)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    {trip.trip_code && (
                      <span className="bg-sky-600/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow border border-sky-500/50 flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5"/> {trip.trip_code}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700/80 shadow flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400"/>
                    <span>{trip.rating || 5.0}</span>
                  </div>
                </div>

                {/* --- เนื้อหาการ์ด --- */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent tracking-wide truncate flex items-center gap-1.5 drop-shadow">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0"/>
                      <span className="truncate">{trip.title}</span>
                    </h3>
                    
                    {trip.advance_days && (
                      <div className="text-xs text-sky-400 font-extrabold pt-0.5 tracking-wide">
                        <span>⏱️ จองล่วงหน้า ≥ {trip.advance_days} วัน</span>
                      </div>
                    )}
                  </div>

                  {/* --- แสดงสถานะจำนวนการจอง --- */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-sky-400"/> สถานะการจอง:
                      </span>
                      <span className="font-black text-white">
                        จองแล้ว <strong className="text-amber-400">{bookedSeats}</strong> / <strong className="text-sky-400">{maxSeats}</strong> ท่าน 
                        <span className="ml-1 text-[10px] text-emerald-400">(ว่าง {availableSeats})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${seatPercentage >= 100 ? 'bg-rose-500' : seatPercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${seatPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/70 p-3.5 rounded-2xl shadow-xl flex items-start gap-3">
                      <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0 shadow-md mt-0.5">
                        <Calendar className="w-4 h-4 animate-pulse"/>
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[10px] text-amber-300 block font-black uppercase tracking-wider">วันเดินทาง (1 DAY TOUR)</span>
                        <div className="text-xs text-amber-400 font-black tracking-tight leading-relaxed whitespace-pre-line break-words">
                          {trip.date_range}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 bg-slate-900/60 px-2.5 py-2 rounded-xl border border-slate-800/80">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0"/> <span className="truncate">{trip.route}</span>
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2 flex-nowrap overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleOpenCarDetail(trip.service_class)}
                      className="inline-flex items-center gap-1 bg-sky-950/90 hover:bg-sky-900 text-sky-400 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-sky-700/60 shadow transition-all cursor-pointer group/car shrink-0"
                      title="คลิกเพื่อดูรายละเอียดรถ"
                    >
                      <Car className="w-3.5 h-3.5 group-hover/car:scale-110 transition-transform"/>
                      <span className="truncate max-w-[120px]">{trip.service_class}</span> 🔍
                    </button>

                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800/60 shrink-0 truncate max-w-[140px]">
                      👥 ไม่เกิน {maxSeats} ท่าน
                    </span>
                  </div>
                </div>

                {/* --- ส่วนราคา & ปุ่ม --- */}
                <div className="p-4 pt-2.5 space-y-2.5 border-t border-slate-800/80 bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">ราคา (ผู้ใหญ่ / เด็ก)</span>
                      <div className="text-sm font-black text-amber-400 tracking-tight">
                        ผู้ใหญ่ ฿{Number(String(adultP).replace(/,/g, '')).toLocaleString()} | เด็ก ฿{Number(String(childP).replace(/,/g, '')).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => openDetailModal(trip)} className="px-3 py-2 bg-sky-950/80 hover:bg-sky-900 text-sky-400 rounded-xl border border-sky-800/80 shadow transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold" title="ดูรายละเอียด">
                        <Eye className="w-3.5 h-3.5"/> <span>รายละเอียด</span>
                      </button>
                      <button type="button" onClick={() => openEditModal(trip)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="แก้ไข">
                        <Edit className="w-3.5 h-3.5"/>
                      </button>
                      <button type="button" onClick={() => handleDelete(trip.id)} className="p-2 bg-slate-900 hover:bg-rose-950/40 text-rose-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="ลบ">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>

                  {isFull ? (
                    <button type="button" disabled className="w-full py-2.5 bg-slate-800 text-slate-500 font-black rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
                      <X className="w-4 h-4"/> <span>เต็มแล้ว (Full)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openBookingModal(trip)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                    >
                      <BookmarkCheck className="w-4 h-4 font-black"/>
                      <span>จองเดย์ทัวร์นี้</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL: แสดงรายละเอียดรถจากตาราง fleet --- */}
      {isCarDetailModalOpen && selectedCarDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              type="button"
              onClick={() => setIsCarDetailModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4"/>
            </button>

            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                ข้อมูลรถในสังกัด (Fleet Detail)
              </span>
              <h3 className="text-lg font-black text-white">{selectedCarDetail.brand}</h3>
              <p className="text-xs text-slate-400">รหัสรถ: <strong className="text-sky-400">{selectedCarDetail.car_code || selectedCarDetail.carCode}</strong> | ทะเบียน: <strong className="text-amber-400">{selectedCarDetail.plate || 'ไม่ระบุทะเบียน'}</strong></p>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-950">
              <img 
                src={selectedCarDetail.car_image || selectedCarDetail.carImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'} 
                alt="Car Fleet" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">ความจุผู้โดยสาร</span>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400"/> {selectedCarDetail.seats} ที่นั่ง VIP
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">เลขไมล์เช็กระยะรอบถัดไป</span>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-400"/> {(selectedCarDetail.next_service_mileage || selectedCarDetail.nextServiceMileage || 50000).toLocaleString()} กม.
                </p>
              </div>
            </div>

            {selectedCarDetail.features && (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-bold block">สิ่งอำนวยความสะดวก & ไฮไลต์รถ</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedCarDetail.features}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCarDetailModalOpen(false)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl text-xs shadow-lg cursor-pointer transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX GALLERY MODAL --- */}
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
              <X className="w-5 h-5"/>
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
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform"/>
                </button>
              )}

              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform"/>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ฟอร์มจองบริการ --- */}
      {isBookingModalOpen && selectedTripForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4"/>
            </button>

            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                แบบฟอร์มจองเดย์ทัวร์ (1-Day Tour Booking)
              </span>
              <h3 className="text-lg font-black text-white">{selectedTripForBooking.title}</h3>
              <p className="text-xs text-slate-400">รหัสทริป: <strong className="text-sky-400">{selectedTripForBooking.trip_code}</strong> | เส้นทาง: {selectedTripForBooking.route}</p>
              
              {(() => {
                const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
                const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
                const availableSeats = Math.max(0, maxSeats - bookedSeats);
                return (
                  <p className="text-[11px] text-emerald-400 font-bold pt-1">
                    💺 ที่นั่งว่างขณะนี้: <strong className="text-amber-400">{availableSeats}</strong> / {maxSeats} ท่าน
                  </p>
                );
              })()}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400"/> ชื่อ-นามสกุล ผู้จอง
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.customer_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                  placeholder="เช่น คุณสมชาย ใจดี"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400"/> เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="เช่น 089-123-4567"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400"/> วันที่ต้องการเดินทางจริง
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.travel_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, travel_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white [color-scheme:dark] font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    {(() => {
                      const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
                      const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
                      const availableSeats = Math.max(0, maxSeats - bookedSeats);
                      const maxAdultAllowed = Math.max(1, availableSeats - bookingForm.child_count);

                      return (
                        <>
                          <label className="block font-bold text-slate-300 mb-1 text-[10px]">ผู้ใหญ่ (฿{selectedTripForBooking.adult_price || '2,900'})</label>
                          <input
                            type="number"
                            min="1"
                            max={maxAdultAllowed}
                            required
                            value={bookingForm.adults_count}
                            onChange={(e) => {
                              const inputVal = parseInt(e.target.value) || 1;
                              const validAdult = Math.min(maxAdultAllowed, Math.max(1, inputVal));
                              setBookingForm({ ...bookingForm, adults_count: validAdult });
                            }}
                            className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-amber-400 font-black text-center text-sm shadow-inner"
                          />
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    {(() => {
                      const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
                      const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
                      const availableSeats = Math.max(0, maxSeats - bookedSeats);
                      const maxChildAllowed = Math.max(0, availableSeats - bookingForm.adults_count);

                      return (
                        <>
                          <label className="block font-bold text-slate-300 mb-1 text-[10px]">เด็ก (฿{selectedTripForBooking.child_price || '1,900'})</label>
                          <input
                            type="number"
                            min="0"
                            max={maxChildAllowed}
                            value={bookingForm.child_count}
                            onChange={(e) => {
                              const inputVal = parseInt(e.target.value) || 0;
                              const validChild = Math.min(maxChildAllowed, Math.max(0, inputVal));
                              setBookingForm({ ...bookingForm, child_count: validChild });
                            }}
                            className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sky-400 font-black text-center text-sm shadow-inner"
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">ยอดชำระสุทธิทั้งสิ้น</span>
                  <span className="text-lg font-black text-amber-400">
                    ฿{calculateBookingTotal(selectedTripForBooking).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                  บันทึกเพื่อแนบสลิป
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold cursor-pointer transition-colors shadow"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4 font-black"/>
                  <span>บันทึกการจอง (ไปหน้าแนบสลิป)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: แนบสลิปชำระเงิน --- */}
      {isSlipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-6 h-6"/>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">บันทึกข้อมูลการจองสำเร็จ!</h3>
              <p className="text-xs text-slate-400">กรุณาแนบสลิปหลักฐานการโอนเงินเพื่อยืนยันคำขอจองของคุณ หรือกดข้ามไปก่อนได้</p>
            </div>

            <input
              type="file"
              ref={slipFileInputRef}
              onChange={handleSlipUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <button
                type="button"
                disabled={isSlipUploading}
                onClick={() => slipFileInputRef.current?.click()}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isSlipUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>}
                <span>คลิกเลือกรูปภาพสลิปโอนเงิน</span>
              </button>

              {slipUrl ? (
                <div className="relative h-40 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                  <img src={slipUrl} alt="Slip Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setSlipUrl('')}
                    className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 text-[10px]"
                  >
                    <X className="w-4 h-4"/>
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 py-3 border border-dashed border-slate-800 rounded-xl">
                  ยังไม่ได้อัปโหลดสลิป
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSlipModalOpen(false);
                  alert('บันทึกการจองสำเร็จ (ไม่ได้แนบสลิป)');
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs cursor-pointer"
              >
                ข้ามไปก่อน
              </button>
              <button
                type="button"
                disabled={isSlipUploading}
                onClick={handleUploadSlipAndFinish}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4"/>
                <span>ยืนยันการแนบสลิป</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL: ดูรายละเอียดทริปเชิงลึก --- */}
      {isDetailModalOpen && selectedTripDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              type="button"
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4"/>
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                  {selectedTripDetail.trip_code}
                </span>
                {selectedTripDetail.advance_days && (
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    ⏱️ ต้องจองล่วงหน้าอย่างน้อย {selectedTripDetail.advance_days} วัน
                  </span>
                )}
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  👥 รับผู้โดยสารไม่เกิน {extractMaxSeats(selectedTripDetail.service_class)} ท่าน
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                {selectedTripDetail.title}
              </h2>
              <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0"/> {selectedTripDetail.route}
              </p>
            </div>

            {selectedTripDetail.itinerary_details && (
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
                <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4"/> รายละเอียดโปรแกรมภาพรวม
                </span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.itinerary_details}</p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Clock3 className="w-4 h-4"/> กำหนดการรายชั่วโมง (Hourly Itinerary)
              </h4>
              
              <div className="space-y-3">
                {selectedTripDetail.itinerary_days && selectedTripDetail.itinerary_days.length > 0 ? (
                  selectedTripDetail.itinerary_days.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl relative pl-6 sm:pl-8 space-y-1.5">
                      <div className="absolute left-2.5 sm:left-3.5 top-4 bottom-0 w-0.5 bg-amber-500/30"></div>
                      <div className="absolute left-1.5 sm:left-2.5 top-4 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950"></div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-black">
                          {item.time || 'รอบเวลา'}
                        </span>
                        <h5 className="text-xs font-black text-white">{item.title}</h5>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pt-1">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">ไม่มีข้อมูลกำหนดการ</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {selectedTripDetail.inclusions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4"/> ราคารวม (Inclusions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.inclusions}</p>
                </div>
              )}

              {selectedTripDetail.exclusions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                    <X className="w-4 h-4"/> ราคาไม่รวม (Exclusions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.exclusions}</p>
                </div>
              )}

              {selectedTripDetail.what_to_bring && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-sky-500/30 space-y-2">
                  <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                    <Backpack className="w-4 h-4"/> สิ่งที่ต้องเตรียมไป (What to Bring)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.what_to_bring}</p>
                </div>
              )}

              {selectedTripDetail.terms_conditions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                  <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4"/> เงื่อนไขต่างๆ (Terms & Conditions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.terms_conditions}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">เรตราคา</span>
                <div className="text-base font-black text-amber-400">
                  <span>ผู้ใหญ่ ฿{selectedTripDetail.adult_price || '2,900'} | เด็ก ฿{selectedTripDetail.child_price || '1,900'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL: สร้าง หรือ แก้ไขเดย์ทัวร์ --- */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shadow-inner">
                  <CalendarCheck className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">{isEditModalOpen ? 'แก้ไขเดย์ทัวร์' : 'สร้างเดย์ทัวร์ใหม่'}</h3>
                  <p className="text-[11px] text-slate-400">ระบบจัดการทัวร์ 1 วัน พร้อมเรตราคาผู้ใหญ่และเด็ก</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="text-slate-400 hover:text-white bg-slate-800/80 p-2.5 rounded-2xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateTrip : handleAddTrip} className="space-y-5 text-xs">
              
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5"/> 1. ข้อมูลพื้นฐาน (รหัส, ชื่อทริป และกำหนดจองล่วงหน้า)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-sky-400"/> รหัสทริป
                    </label>
                    <input
                      type="text"
                      value={newTrip.tripCode}
                      onChange={(e) => setNewTrip({ ...newTrip, tripCode: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-mono font-bold focus:outline-none focus:border-sky-500 shadow"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400"/> ต้องจองล่วงหน้า (วัน)
                    </label>
                    <input
                      type="text"
                      value={newTrip.advanceDays}
                      onChange={(e) => setNewTrip({ ...newTrip, advanceDays: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น 2"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-300 mb-1.5">ชื่อเดย์ทัวร์</label>
                    <input
                      type="text"
                      value={newTrip.title}
                      onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น วันเดียวเที่ยวอัมพวา ตลาดร่มหุบ"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-3 shadow-inner">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5"/> 2. รูปภาพประกอบทริป
                    </span>
                    <p className="text-[11px] text-slate-300 font-medium">💡 อัปโหลดรูปภาพเพื่อดึงดูดลูกค้า</p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadFromComputer}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Upload className="w-3.5 h-3.5"/>}
                    <span>+ เลือกรูปภาพ</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-h-[90px] p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
                  {newTrip.images.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-slate-500 text-xs py-4 gap-1">
                      <ImageIcon className="w-5 h-5 text-slate-600"/>
                      <span>ยังไม่มีรูปภาพที่อัปโหลด</span>
                    </div>
                  ) : (
                    newTrip.images.map((imgUrl, idx, arr) => (
                      <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 group shadow bg-slate-950">
                        <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" onClick={() => openLightbox(arr, idx)} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-[9px] hover:bg-rose-500 cursor-pointer shadow"
                        >
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5"/> 3. เส้นทางท่องเที่ยว (ต้นทาง & จุดหมาย)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">จุดรับ (ต้นทาง)</label>
                    <input
                      type="text"
                      value={newTrip.origin}
                      onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-emerald-500 shadow"
                      placeholder="เช่น กรุงเทพฯ (จุดนัดพบ)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">เพิ่มสถานที่ท่องเที่ยว</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={destInput}
                        onChange={(e) => setDestInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDestination(); }}}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-semibold focus:outline-none focus:border-rose-500 shadow"
                        placeholder="เช่น ตลาดน้ำอัมพวา"
                      />
                      <button
                        type="button"
                        onClick={handleAddDestination}
                        className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shrink-0 cursor-pointer shadow-lg transition-all"
                      >
                        + เพิ่ม
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">สถานที่ที่เลือก:</span>
                    <div className="flex flex-wrap gap-2 min-h-[38px] p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                      {newTrip.destinations.length === 0 ? (
                        <span className="text-slate-500 text-xs">ยังไม่ได้ระบุสถานที่</span>
                      ) : (
                        newTrip.destinations.map((dest, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-sky-950 text-sky-300 px-3 py-1.5 rounded-xl border border-sky-800/80 text-xs font-bold shadow">
                            {dest}
                            <button type="button" onClick={() => handleRemoveDestination(idx)} className="text-rose-400 hover:text-rose-300 ml-0.5 p-0.5 rounded-full hover:bg-rose-950 transition-colors">×</button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. วันเดินทาง, บริการทุกวัน และรอบเวลารับ */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-3 shadow-inner">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5"/> 4. วันเดินทาง และรอบเวลารับ
                  </span>

                  <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${newTrip.isEveryday ? 'bg-amber-950/40 border-amber-500 shadow' : 'bg-slate-900 border-slate-800'}`}>
                    <input
                      type="checkbox"
                      checked={newTrip.isEveryday}
                      onChange={(e) => setNewTrip({ ...newTrip, isEveryday: e.target.checked })}
                      className="w-4 h-4 text-amber-500 cursor-pointer accent-amber-500 rounded"
                    />
                    <span className="text-xs font-bold text-amber-400">📅 บริการทุกวัน (Everyday)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {!newTrip.isEveryday ? (
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">วันที่จัดทริป (1 Day Tour)</label>
                      <input
                        type="date"
                        value={newTrip.tourDate}
                        onChange={(e) => setNewTrip({ ...newTrip, tourDate: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white text-xs [color-scheme:dark] font-bold shadow"
                      />
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex items-center text-amber-300 font-bold text-xs">
                      ✨ เปิดให้บริการทุกวันตลอดทั้งปี (ไม่จำกัดวันที่เฉพาะเจาะจง)
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">เวลารับออกเดินทาง</label>
                    <input
                      type="text"
                      value={newTrip.pickupTime}
                      onChange={(e) => setNewTrip({ ...newTrip, pickupTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold shadow"
                      placeholder="เช่น 08:00 น."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-3 shadow-inner">
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5"/> 5. รายละเอียดโปรแกรมภาพรวม (Overview)
                </span>
                <textarea
                  rows={3}
                  value={newTrip.itineraryDetails}
                  onChange={(e) => setNewTrip({ ...newTrip, itineraryDetails: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 leading-relaxed"
                  placeholder="รายละเอียดสั้นๆ เกี่ยวกับทริป..."
                ></textarea>
              </div>

              {/* 6. ประเภทรถ และราคาแยก (ผู้ใหญ่ / เด็ก) */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5"/> 6. ประเภทรถและความจุ & เรตราคา (ผู้ใหญ่ / เด็ก)
                </span>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">ประเภทรถ (Fleet)</label>
                  <select
                    value={newTrip.serviceClass}
                    onChange={(e) => setNewTrip({ ...newTrip, serviceClass: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold text-sky-400 cursor-pointer text-xs shadow"
                  >
                    {fleetList.length === 0 ? (
                      <option value="Toyota Commuter VIP (13 ที่นั่ง)">Toyota Commuter VIP (13 ที่นั่ง)</option>
                    ) : (
                      fleetList.map((car) => (
                        <option key={car.id} value={`${car.brand} (${car.seats} ที่นั่ง)`}>
                          {car.brand} ({car.seats} ที่นั่ง)
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl border bg-amber-950/40 border-amber-500/60 shadow">
                    <span className="text-xs font-bold text-amber-300 block mb-1.5">🧑 ราคาผู้ใหญ่ (฿)</span>
                    <input
                      type="text"
                      value={newTrip.adultPrice}
                      onChange={(e) => setNewTrip({ ...newTrip, adultPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-black text-sm text-center shadow"
                      placeholder="2900"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl border bg-sky-950/40 border-sky-500/60 shadow">
                    <span className="text-xs font-bold text-sky-300 block mb-1.5">👶 ราคาเด็ก (฿)</span>
                    <input
                      type="text"
                      value={newTrip.childPrice}
                      onChange={(e) => setNewTrip({ ...newTrip, childPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sky-300 font-black text-sm text-center shadow"
                      placeholder="1900"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5"/> 7. ราคารวม, ไม่รวม, สิ่งที่ต้องเตรียม และเงื่อนไข
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">✅ ราคารวม (Inclusions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.inclusions}
                      onChange={(e) => setNewTrip({ ...newTrip, inclusions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                      placeholder="• รถตู้ VIP และคนขับ"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">❌ ราคาไม่รวม (Exclusions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.exclusions}
                      onChange={(e) => setNewTrip({ ...newTrip, exclusions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-rose-500 leading-relaxed"
                      placeholder="• ค่าเข้าชมสถานที่และอาหาร"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">🎒 สิ่งที่ต้องเตรียมไป (What to Bring)</label>
                    <textarea
                      rows={3}
                      value={newTrip.whatToBring}
                      onChange={(e) => setNewTrip({ ...newTrip, whatToBring: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-sky-500 leading-relaxed"
                      placeholder="• แว่นกันแดด, ครีมกันแดด"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">⚠️ เงื่อนไขต่างๆ (Terms & Conditions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.termsConditions}
                      onChange={(e) => setNewTrip({ ...newTrip, termsConditions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                      placeholder="• ชำระเงินเมื่อทำการจอง"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* ปุ่มบันทึก / ยกเลิก */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold cursor-pointer transition-colors shadow"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 disabled:opacity-50 text-slate-950 rounded-2xl font-black shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 transition-all"
                >
                  <Check className="w-4 h-4 font-black"/>
                  <span>{isEditModalOpen ? 'บันทึกการแก้ไข' : 'บันทึกและเผยแพร่'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
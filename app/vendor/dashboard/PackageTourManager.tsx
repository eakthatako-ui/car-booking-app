'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarCheck, Plus, MapPin, Calendar, Star, Edit, Trash2, CheckCircle2, X, Check, Smile, Image as ImageIcon, Hash, Car, Clock, Fuel, ShieldAlert, DollarSign, Sparkles, Eye, Upload, Loader2, BookmarkCheck, User, Phone, Users, ChevronLeft, ChevronRight, Gauge, Layers, CheckSquare, FileText, Baby, BookOpen, Clock3, Hotel, BedDouble, CheckCircle, Backpack, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function PackageTourManager() {
  const [trips, setTrips] = useState<any[]>([]);
  const [fleetList, setFleetList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isHotelUploading, setIsHotelUploading] = useState(false);
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
        .from('trips')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) {
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
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
      const { data, error } = await supabase.from('bookings').select('id, trip_id, passengers_count, status');
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
    infants_count: 0,
  });
  
  const [newTrip, setNewTrip] = useState({
    tripCode: 'TRIP-001',
    title: '',
    advanceDays: '15',
    origin: 'กรุงเทพฯ',
    destinations: ['พัทยา', 'เกาะล้าน'],
    tierBadge: '',
    serviceClass: 'Toyota Commuter VIP (13 ที่นั่ง)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
    isEveryday: false,
    isTBD: false,
    isCustomDuration: false,
    customDays: '3',
    customNights: '2',
    
    priceDisplayType: 'package' as 'package' | 'per_person',
    totalPackagePrice: '6,500',
    minPackagePax: '1',
    adultPrice: '2,500',
    childPrice: '1,800',
    infantPrice: '500',
    minBookingPax: '1',

    rentalHours: '10 ชั่วโมง / วัน',
    driverAccommodationFee: '500',
    fuelPolicy: 'ผู้เช่ารับผิดชอบน้ำมันเชื้อเพลิงตลอดการเดินทาง (Self-Fueling)',
    tollPolicy: 'ผู้เช่ารับผิดชอบค่าทางด่วนและค่าจอดรถ (Tolls & Parking by Client)',
    
    hotelName: '555555',
    roomType: 'Deluxe Room (รวมอาหารเช้า)',
    hotelLocation: 'พัทยา จังหวัดชลบุรี',
    hotelImages: [] as string[],

    itineraryDetails: 'แพ็กเกจทัวร์ท่องเที่ยวพัทยา เกาะล้านสุดคุ้ม',
    inclusions: '• รถตู้ VIP, โรงแรม, อาหารเช้า',
    exclusions: '• ค่าใช้จ่ายส่วนตัว',
    whatToBring: '• เสื้อผ้า, ยาส่วนตัว',
    termsConditions: '• ชำระมัดจำ 50%',

    itineraryDays: [
      { day: 1, title: 'เดินทางสู่พัทยา', description: '• ออกเดินทาง' }
    ] as { day: number; title: string; description: string }[],

    images: [] as string[],
  });

  const formatNumberInput = (val: string) => {
    const cleanNum = val.replace(/[^0-9]/g, '');
    if (!cleanNum) return '';
    return Number(cleanNum).toLocaleString('en-US');
  };

  // ฟังก์ชันแปลงวันที่ให้แสดงเป็นรูปแบบตัวย่อ (เช่น 26 ก.ย. '69)
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

  const formatThaiDateRangeShort = (dateRangeText: string) => {
    if (!dateRangeText) return '';
    if (dateRangeText.includes('ถึง')) {
      const parts = dateRangeText.split('ถึง').map(s => s.trim());
      if (parts.length === 2) {
        const startFormatted = formatThaiDateShort(parts[0].substring(0, 10));
        const endPart = parts[1];
        const endDateStr = endPart.substring(0, 10);
        const endFormatted = formatThaiDateShort(endDateStr);

        return `${startFormatted} - ${endFormatted}`;
      }
    }
    return dateRangeText;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hotelFileInputRef = useRef<HTMLInputElement>(null);
  const slipFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItineraryDay = () => {
    const nextDayNum = newTrip.itineraryDays.length + 1;
    setNewTrip({
      ...newTrip,
      itineraryDays: [...newTrip.itineraryDays, { day: nextDayNum, title: `วันที่ ${nextDayNum} - โปรแกรมท่องเที่ยว`, description: '• กิจกรรมและสถานที่ท่องเที่ยว' }]
    });
  };

  const handleRemoveItineraryDay = (index: number) => {
    const updated = newTrip.itineraryDays.filter((_, idx) => idx !== index);
    const reindexed = updated.map((item, idx) => ({ ...item, day: idx + 1 }));
    setNewTrip({ ...newTrip, itineraryDays: reindexed });
  };

  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...newTrip.itineraryDays];
    updated[index][field] = value;
    setNewTrip({ ...newTrip, itineraryDays: updated });
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
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
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

  const handleHotelUploadFromComputer = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsHotelUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `hotel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `trip-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('trips')
          .upload(filePath, file);

        if (uploadError) {
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (ev) => {
              if (ev.target?.result) uploadedUrls.push(ev.target?.result as string);
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
          hotelImages: [...prev.hotelImages, ...uploadedUrls]
        }));
      }
    } catch (err: any) {
      console.error('Error uploading hotel images:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตรูปโรงแรม: ' + err.message);
    } finally {
      setIsHotelUploading(false);
      if (hotelFileInputRef.current) hotelFileInputRef.current.value = '';
    }
  };

  const handleRemoveHotelImage = (indexToRemove: number) => {
    setNewTrip(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.filter((_, idx) => idx !== indexToRemove)
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

  const calculateTotalDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDaysCount = calculateTotalDays(newTrip.startDate, newTrip.endDate);
  const totalNightsCount = Math.max(0, totalDaysCount - 1);

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
      alert('กรุณากรอกรหัสทริป, ชื่อทริป และระบุสถานที่ปลายทางอย่างน้อย 1 แห่ง');
      return;
    }

    const formattedRoute = `${newTrip.origin} ➔ ${newTrip.destinations.join(' / ')}`;
    let formattedDateRange = `${newTrip.startDate} ถึง ${newTrip.endDate}`;
    if (newTrip.isCustomDuration) {
      formattedDateRange = `ระยะเวลา ${newTrip.customDays} วัน ${newTrip.customNights} คืน (เลือกวันเดินทางเอง)`;
    } else if (newTrip.isTBD) {
      formattedDateRange = 'ยังไม่กำหนดวันเวลา (TBD)';
    } else if (newTrip.isEveryday) {
      formattedDateRange = 'เดินทางทุกวัน (Everyday)';
    }

    const mainImage = newTrip.images.length > 0 ? newTrip.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
    const displayPriceVal = newTrip.priceDisplayType === 'package' ? newTrip.totalPackagePrice : `${newTrip.adultPrice} (ผู้ใหญ่)`;

    const tripPayload = {
      trip_code: newTrip.tripCode,
      title: newTrip.title,
      advance_days: newTrip.advanceDays,
      route: formattedRoute,
      tier_badge: '',
      service_class: newTrip.serviceClass,
      date_range: formattedDateRange,
      rating: 5.0,
      reviews_count: 1,
      price: displayPriceVal,
      price_display_type: newTrip.priceDisplayType,
      total_package_price: newTrip.totalPackagePrice,
      adult_price: newTrip.adultPrice,
      child_price: newTrip.childPrice,
      infant_price: newTrip.infantPrice,
      min_booking_pax: newTrip.minBookingPax,
      min_package_pax: newTrip.minPackagePax,
      total_days: newTrip.isEveryday || newTrip.isTBD ? 1 : (newTrip.isCustomDuration ? parseInt(newTrip.customDays) || 1 : totalDaysCount),
      rental_hours: newTrip.rentalHours,
      driver_accommodation_fee: newTrip.driverAccommodationFee,
      fuel_policy: newTrip.fuelPolicy,
      toll_policy: newTrip.tollPolicy,
      hotel_name: newTrip.hotelName,
      room_type: newTrip.roomType,
      hotel_location: newTrip.hotelLocation,
      hotel_images: newTrip.hotelImages,
      itinerary_details: newTrip.itineraryDetails,
      inclusions: newTrip.inclusions,
      exclusions: newTrip.exclusions,
      what_to_bring: newTrip.whatToBring,
      terms_conditions: newTrip.termsConditions,
      itinerary_days: newTrip.itineraryDays,
      image: mainImage,
      images: newTrip.images,
      status: 'active',
    };

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([tripPayload])
        .select();

      if (error) throw error;

      if (data) {
        setTrips([data[0], ...trips]);
        setIsAddModalOpen(false);
        alert('บันทึกแพ็กเกจทัวร์สำเร็จ!');
      }
    } catch (error: any) {
      console.error('Error adding trip:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    }
  };

  const openEditModal = (trip: any) => {
    setEditingTripId(trip.id);
    const isEverydayTrip = trip.date_range?.includes('เดินทางทุกวัน');
    const isTBDTrip = trip.date_range?.includes('ยังไม่กำหนดวันเวลา');
    const isCustomDur = trip.date_range?.includes('ระยะเวลา');

    let cDays = '3';
    let cNights = '2';
    if (isCustomDur) {
      const matchDays = trip.date_range.match(/(\d+)\s*วัน/);
      const matchNights = trip.date_range.match(/(\d+)\s*คืน/);
      if (matchDays) cDays = matchDays[1];
      if (matchNights) cNights = matchNights[1];
    }

    setNewTrip({
      tripCode: trip.trip_code || 'TRIP-001',
      title: trip.title || '',
      advanceDays: trip.advance_days || '3',
      origin: trip.route ? trip.route.split('➔')[0].trim() : 'กรุงเทพฯ',
      destinations: trip.route && trip.route.includes('➔') ? trip.route.split('➔')[1].trim().split('/').map((s: string) => s.trim()) : [],
      tierBadge: '',
      serviceClass: trip.service_class || 'Toyota Commuter VIP (13 ที่นั่ง)',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
      isEveryday: isEverydayTrip,
      isTBD: isTBDTrip,
      isCustomDuration: isCustomDur,
      customDays: cDays,
      customNights: cNights,
      priceDisplayType: trip.price_display_type || 'package',
      totalPackagePrice: trip.total_package_price ? Number(String(trip.total_package_price).replace(/,/g, '')).toLocaleString('en-US') : '5,000',
      minPackagePax: trip.min_package_pax || '1',
      adultPrice: trip.adult_price ? Number(String(trip.adult_price).replace(/,/g, '')).toLocaleString('en-US') : '2,500',
      childPrice: trip.child_price ? Number(String(trip.child_price).replace(/,/g, '')).toLocaleString('en-US') : '1,800',
      infantPrice: trip.infant_price ? Number(String(trip.infant_price).replace(/,/g, '')).toLocaleString('en-US') : '500',
      minBookingPax: trip.min_booking_pax || '1',
      rentalHours: trip.rental_hours || '10 ชั่วโมง / วัน',
      driverAccommodationFee: trip.driver_accommodation_fee || '500',
      fuelPolicy: trip.fuel_policy || 'ผู้เช่ารับผิดชอบน้ำมันเชื้อเพลิงตลอดการเดินทาง (Self-Fueling)',
      tollPolicy: trip.toll_policy || 'ผู้เช่ารับผิดชอบค่าทางด่วนและค่าจอดรถ (Tolls & Parking by Client)',
      hotelName: trip.hotel_name || 'The Imperial Chiang Mai Resort & Spa',
      roomType: trip.room_type || 'Deluxe Room (รวมอาหารเช้า)',
      hotelLocation: trip.hotel_location || 'อำเภอเมือง จังหวัดเชียงใหม่',
      hotelImages: trip.hotel_images || [],
      itineraryDetails: trip.itinerary_details || 'รายละเอียดโปรแกรมท่องเที่ยว...',
      inclusions: trip.inclusions || '• รถ VIP และที่พัก',
      exclusions: trip.exclusions || '• ค่าใช้จ่ายส่วนตัว',
      whatToBring: trip.what_to_bring || '• เสื้อผ้าและยาส่วนตัว',
      termsConditions: trip.terms_conditions || '• ชำระมัดจำ 50%',
      itineraryDays: trip.itinerary_days || [
        { day: 1, title: 'เดินทางสู่เชียงใหม่', description: '• รายละเอียดโปรแกรมวันแรก' }
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
    const maxSeats = extractMaxSeats(trip.service_class);
    const bookedSeats = getBookedSeatsForTrip(trip.id);
    const availableSeats = Math.max(1, maxSeats - bookedSeats);

    const isPackage = (trip.price_display_type || 'package') === 'package';
    const minPax = isPackage ? (parseInt(trip.min_package_pax) || 1) : (parseInt(trip.min_booking_pax) || 1);
    
    setBookingForm({
      customer_name: '',
      phone: '',
      travel_date: new Date().toISOString().split('T')[0],
      adults_count: Math.min(minPax, availableSeats),
      child_count: 0,
      infants_count: 0,
    });
    setIsBookingModalOpen(true);
  };

  const calculateBookingTotal = (trip: any) => {
    if (!trip) return 0;
    const isPackage = (trip.price_display_type || 'package') === 'package';
    if (isPackage) {
      const pricePerPerson = Number(String(trip.total_package_price || '0').replace(/,/g, '')) || 0;
      return bookingForm.adults_count * pricePerPerson;
    } else {
      const adultP = Number(String(trip.adult_price || '0').replace(/,/g, '')) || 0;
      const childP = Number(String(trip.child_price || '0').replace(/,/g, '')) || 0;
      const infantP = Number(String(trip.infant_price || '0').replace(/,/g, '')) || 0;
      return (bookingForm.adults_count * adultP) + (bookingForm.child_count * childP) + (bookingForm.infants_count * infantP);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripForBooking) return;

    const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
    const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
    const availableSeats = Math.max(0, maxSeats - bookedSeats);

    const isPackage = (selectedTripForBooking.price_display_type || 'package') === 'package';
    const minPax = isPackage ? (parseInt(selectedTripForBooking.min_package_pax) || 1) : (parseInt(selectedTripForBooking.min_booking_pax) || 1);
    const totalPassengers = isPackage ? bookingForm.adults_count : bookingForm.adults_count + bookingForm.child_count + bookingForm.infants_count;

    if (bookingForm.adults_count < minPax) {
      alert(`แพ็กเกจนี้กำหนดจำนวนผู้เดินทางขั้นต่ำ ${minPax} ท่านขึ้นไป`);
      return;
    }

    if (totalPassengers > availableSeats) {
      alert(`ขออภัยครับ ที่นั่งว่างไม่เพียงพอ (เหลือที่นั่งว่าง ${availableSeats} ท่านเท่านั้น)`);
      return;
    }

    const totalPrice = calculateBookingTotal(selectedTripForBooking);

    const bookingPayload = {
      trip_id: selectedTripForBooking.id,
      customer_name: bookingForm.customer_name,
      phone: bookingForm.phone,
      travel_date: bookingForm.travel_date,
      passengers_count: totalPassengers,
      total_price: totalPrice.toLocaleString(),
      status: 'รอดำเนินการ',
    };

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentBookingId(data[0].id);
      }

      setIsBookingModalOpen(false);
      setSlipUrl('');
      setIsSlipModalOpen(true);
      fetchBookingsData();
    } catch (error: any) {
      console.error('Error saving booking:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการจอง: ' + error.message);
    }
  };

  const handleUploadSlipAndFinish = async () => {
    if (!currentBookingId) {
      setIsSlipModalOpen(false);
      return;
    }

    try {
      if (slipUrl) {
        const { error } = await supabase
          .from('bookings')
          .update({ payment_slip: slipUrl, status: 'รอดำเนินการ (แนบสลิปแล้ว)' })
          .eq('id', currentBookingId);

        if (error) throw error;
      }

      alert('บันทึกการจองและแนบสลิปสำเร็จเรียบร้อยแล้ว!');
      setIsSlipModalOpen(false);
      setCurrentBookingId(null);
      setSlipUrl('');
      fetchBookingsData();
    } catch (error: any) {
      console.error('Error updating slip:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกสลิป: ' + error.message);
    }
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTripId) return;

    const formattedRoute = `${newTrip.origin} ➔ ${newTrip.destinations.join(' / ')}`;
    let formattedDateRange = `${newTrip.startDate} ถึง ${newTrip.endDate}`;
    if (newTrip.isCustomDuration) {
      formattedDateRange = `ระยะเวลา ${newTrip.customDays} วัน ${newTrip.customNights} คืน (เลือกวันเดินทางเอง)`;
    } else if (newTrip.isTBD) {
      formattedDateRange = 'ยังไม่กำหนดวันเวลา (TBD)';
    } else if (newTrip.isEveryday) {
      formattedDateRange = 'เดินทางทุกวัน (Everyday)';
    }

    const mainImage = newTrip.images.length > 0 ? newTrip.images[0] : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
    const displayPriceVal = newTrip.priceDisplayType === 'package' ? newTrip.totalPackagePrice : `${newTrip.adultPrice} (ผู้ใหญ่)`;

    const tripPayload = {
      trip_code: newTrip.tripCode,
      title: newTrip.title,
      advance_days: newTrip.advanceDays,
      route: formattedRoute,
      tier_badge: '',
      service_class: newTrip.serviceClass,
      date_range: formattedDateRange,
      price: displayPriceVal,
      price_display_type: newTrip.priceDisplayType,
      total_package_price: newTrip.totalPackagePrice,
      adult_price: newTrip.adultPrice,
      child_price: newTrip.childPrice,
      infant_price: newTrip.infantPrice,
      min_booking_pax: newTrip.minBookingPax,
      min_package_pax: newTrip.minPackagePax,
      total_days: newTrip.isEveryday || newTrip.isTBD ? 1 : (newTrip.isCustomDuration ? parseInt(newTrip.customDays) || 1 : totalDaysCount),
      rental_hours: newTrip.rentalHours,
      driver_accommodation_fee: newTrip.driverAccommodationFee,
      fuel_policy: newTrip.fuelPolicy,
      toll_policy: newTrip.tollPolicy,
      hotel_name: newTrip.hotelName,
      room_type: newTrip.roomType,
      hotel_location: newTrip.hotelLocation,
      hotel_images: newTrip.hotelImages,
      itinerary_details: newTrip.itineraryDetails,
      inclusions: newTrip.inclusions,
      exclusions: newTrip.exclusions,
      what_to_bring: newTrip.whatToBring,
      terms_conditions: newTrip.termsConditions,
      itinerary_days: newTrip.itineraryDays,
      image: mainImage,
      images: newTrip.images,
    };

    try {
      const { error } = await supabase
        .from('trips')
        .update(tripPayload)
        .eq('id', editingTripId);

      if (error) throw error;

      alert('อัปเดตข้อมูลแพ็กเกจทัวร์สำเร็จ!');
      setIsEditModalOpen(false);
      setEditingTripId(null);
      fetchTrips();
    } catch (error: any) {
      console.error('Error updating trip:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('คุณต้องการลบแพ็กเกจทัวร์นี้ออกจากระบบฐานข้อมูลใช่หรือไม่?')) {
      try {
        const { error } = await supabase
          .from('trips')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setTrips(trips.filter((item) => item.id !== id));
      } catch (error: any) {
        console.error('Error deleting trip:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
      }
    }
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span>จัดการแพ็กเกจทัวร์ (Multi-Day Package Tour)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">ระบบจัดทัวร์ท่องเที่ยว พร้อมแสดงผลช่องกรอกราคาและเงื่อนไขเหมาคันครบถ้วน</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTrip({
              tripCode: `TRIP-00${trips.length + 1}`,
              title: '',
              advanceDays: '15',
              origin: 'กรุงเทพฯ',
              destinations: ['พัทยา', 'เกาะล้าน'],
              tierBadge: '',
              serviceClass: fleetList.length > 0 ? `${fleetList[0].brand} (${fleetList[0].seats} ที่นั่ง)` : 'Toyota Commuter VIP (13 ที่นั่ง)',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
              isEveryday: false,
              isTBD: false,
              isCustomDuration: false,
              customDays: '3',
              customNights: '2',
              priceDisplayType: 'package',
              totalPackagePrice: '6,500',
              minPackagePax: '1',
              adultPrice: '2,500',
              childPrice: '1,800',
              infantPrice: '500',
              minBookingPax: '1',
              rentalHours: '10 ชั่วโมง / วัน',
              driverAccommodationFee: '500',
              fuelPolicy: 'ผู้เช่ารับผิดชอบน้ำมันเชื้อเพลิงตลอดการเดินทาง (Self-Fueling)',
              tollPolicy: 'ผู้เช่ารับผิดชอบค่าทางด่วนและค่าจอดรถ (Tolls & Parking by Client)',
              hotelName: '555555',
              roomType: 'Deluxe Room (รวมอาหารเช้า)',
              hotelLocation: 'พัทยา จังหวัดชลบุรี',
              hotelImages: [],
              itineraryDetails: 'แพ็กเกจทัวร์ท่องเที่ยวพัทยา เกาะล้านสุดคุ้ม',
              inclusions: '• รถตู้ VIP, โรงแรม, อาหารเช้า',
              exclusions: '• ค่าใช้จ่ายส่วนตัว',
              whatToBring: '• เสื้อผ้า, ยาส่วนตัว',
              termsConditions: '• ชำระมัดจำ 50%',
              itineraryDays: [
                { day: 1, title: 'เดินทางสู่พัทยา', description: '• ออกเดินทาง' }
              ],
              images: [],
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-2xl text-xs font-black shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 font-black" />
          <span>+ สร้างแพ็กเกจทัวร์ใหม่</span>
        </button>
      </div>

      {/* --- TRIPS LIST GRID --- */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลจากฐานข้อมูล...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">ยังไม่มีแพ็กเกจทัวร์ในระบบ กดสร้างแพ็กเกจใหม่ด้านบนได้เลยครับ</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => {
            const isPackage = (trip.price_display_type || 'package') === 'package';
            const pricePerPersonNum = Number(String(trip.total_package_price || '5000').replace(/,/g, '')) || 0;
            const minPkgPaxNum = parseInt(trip.min_package_pax) || 1;

            const displayPrice = isPackage 
              ? pricePerPersonNum.toLocaleString() 
              : `${trip.adult_price || '2,500'} (ผู้ใหญ่)`;
            const priceLabel = isPackage ? 'ราคาเหมาคัน' : 'ราคาต่อท่าน (Join Tour)';

            const tripImagesList = trip.images && trip.images.length > 0 ? trip.images : [trip.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'];
            const tripMainImage = tripImagesList[0];

            const maxSeats = extractMaxSeats(trip.service_class);
            const bookedSeats = getBookedSeatsForTrip(trip.id);
            const availableSeats = Math.max(0, maxSeats - bookedSeats);
            const seatPercentage = Math.min(100, Math.round((bookedSeats / maxSeats) * 100));
            const isFull = availableSeats <= 0;

            const isEverydayTrip = trip.date_range?.includes('เดินทางทุกวัน');
            const isTBDTrip = trip.date_range?.includes('ยังไม่กำหนดวันเวลา');
            const isCustomDur = trip.date_range?.includes('ระยะเวลา');

            let durationText = trip.date_range;
            if (isCustomDur) {
              durationText = `⏱️ ${trip.date_range}`;
            } else if (isTBDTrip) {
              durationText = '⏳ ยังไม่กำหนดวันเวลา (เลือกวันเอง)';
            } else if (!isEverydayTrip && trip.date_range?.includes('ถึง')) {
              durationText = formatThaiDateRangeShort(trip.date_range);
            } else if (isEverydayTrip) {
              durationText = '📅 เดินทางทุกวัน (Everyday)';
            }

            return (
              <div key={trip.id} className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-sky-500/40 transition-all group backdrop-blur-md">
                
                {/* --- รูปภาพหลัก --- */}
                <div className="relative h-40 bg-slate-900 overflow-hidden">
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
                        <Hash className="w-2.5 h-2.5" /> {trip.trip_code}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700/80 shadow flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{trip.rating || 5.0}</span>
                  </div>
                </div>

                {/* --- เนื้อหาการ์ด --- */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent tracking-wide truncate flex items-center gap-1.5 drop-shadow">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{trip.title}</span>
                    </h3>
                  </div>

                  {/* ปรับตำแหน่ง จองล่วงหน้า ให้อยู่เหนือช่วงเวลาเดินทาง ตรงตามรูป */}
                  {trip.advance_days && (
                    <div className="text-xs text-sky-400 font-extrabold pt-0.5 tracking-wide flex items-center gap-1">
                      <span>⏱️ จองล่วงหน้า ≥ {trip.advance_days} วัน</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* ช่วงเวลาเดินทางดีไซน์ใหม่ แสดงผลเดือนเป็นตัวย่อ อ่านง่าย กระชับ */}
                    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500/70 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0 shadow-md">
                        <Calendar className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[10px] text-amber-300 block font-black uppercase tracking-wider">ช่วงเวลาเดินทาง</span>
                        <strong className="text-xs sm:text-sm text-amber-400 font-black tracking-tight block truncate">{durationText}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 bg-slate-900/60 px-2.5 py-2 rounded-xl border border-slate-800/80">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" /> <span className="truncate">{trip.route}</span>
                    </p>

                    {trip.hotel_name && (
                      <p className="text-[11px] text-teal-300 font-semibold flex items-center gap-1.5 bg-teal-950/40 px-2.5 py-2 rounded-xl border border-teal-800/60">
                        <Hotel className="w-3.5 h-3.5 text-teal-400 shrink-0" /> <span className="truncate">ที่พัก: {trip.hotel_name}</span>
                      </p>
                    )}
                  </div>

                  {/* จัดวางประเภทรถกับป้ายบอกจำนวนผู้โดยสารไม่เกิน ให้อยู่ในบรรทัดเดียวกันตามรูป */}
                  <div className="pt-1 flex items-center justify-between gap-2 flex-nowrap overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleOpenCarDetail(trip.service_class)}
                      className="inline-flex items-center gap-1 bg-sky-950/90 hover:bg-sky-900 text-sky-400 text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-sky-700/60 shadow transition-all cursor-pointer group/car shrink-0"
                      title="คลิกเพื่อดูรายละเอียดรถจาก Fleet"
                    >
                      <Car className="w-3.5 h-3.5 group-hover/car:scale-110 transition-transform" />
                      <span className="truncate max-w-[120px]">{trip.service_class}</span> 🔍
                    </button>

                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-800/60 shrink-0 truncate max-w-[150px]">
                      👥 ไม่เกิน {maxSeats} ท่าน
                    </span>
                  </div>
                </div>

                {/* --- ส่วนราคา & ปุ่ม --- */}
                <div className="p-4 pt-2.5 space-y-2.5 border-t border-slate-800/80 bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">{priceLabel}</span>
                      <div className={`text-xl font-black ${isPackage ? 'text-amber-400' : 'text-sky-400'} tracking-tight`}>
                        ฿{displayPrice}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => openDetailModal(trip)} className="px-3 py-2 bg-sky-950/80 hover:bg-sky-900 text-sky-400 rounded-xl border border-sky-800/80 shadow transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold" title="ดูรายละเอียด">
                        <Eye className="w-3.5 h-3.5" /> <span>รายละเอียด</span>
                      </button>
                      <button type="button" onClick={() => openEditModal(trip)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="แก้ไข">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDelete(trip.id)} className="p-2 bg-slate-900 hover:bg-rose-950/40 text-rose-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer" title="ลบ">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isFull ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 bg-slate-800 text-slate-500 font-black rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5 shadow-inner"
                    >
                      <X className="w-4 h-4 font-black" />
                      <span>เต็มแล้ว (Full)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openBookingModal(trip)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                    >
                      <BookmarkCheck className="w-4 h-4 font-black" />
                      <span>จองบริการนี้</span>
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
              <X className="w-4 h-4" />
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
                  <Users className="w-4 h-4 text-emerald-400" /> {selectedCarDetail.seats} ที่นั่ง VIP
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold block">เลขไมล์เช็กระยะรอบถัดไป</span>
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-400" /> {(selectedCarDetail.next_service_mileage || selectedCarDetail.nextServiceMileage || 50000).toLocaleString()} กม.
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
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}

              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700/80 shadow-2xl transition-all cursor-pointer z-20 group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ฟอร์มจองทริป --- */}
      {isBookingModalOpen && selectedTripForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/60 p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                แบบฟอร์มจองทัวร์ ({(selectedTripForBooking.price_display_type || 'package') === 'package' ? 'เหมาคัน Private' : 'ต่อท่าน Join Tour'})
              </span>
              <h3 className="text-lg font-black text-white">{selectedTripForBooking.title}</h3>
              <p className="text-xs text-slate-400">รหัสทริป: <strong className="text-sky-400">{selectedTripForBooking.trip_code}</strong> | เส้นทาง: {selectedTripForBooking.route}</p>
              
              {(() => {
                const maxSeats = extractMaxSeats(selectedTripForBooking.service_class);
                const bookedSeats = getBookedSeatsForTrip(selectedTripForBooking.id);
                const availableSeats = Math.max(0, maxSeats - bookedSeats);
                return (
                  <div className="text-[11px] text-sky-400 font-bold pt-0.5">
                    💺 ที่นั่งว่างขณะนี้: <strong className="text-emerald-400">{availableSeats}</strong> / {maxSeats} ที่นั่ง
                  </div>
                );
              })()}

              {(selectedTripForBooking.price_display_type || 'package') === 'package' && (
                <div className="text-[11px] text-amber-400 font-bold pt-1">
                  💰 อัตราค่าบริการ: ฿{Number(String(selectedTripForBooking.total_package_price || '0').replace(/,/g, '')).toLocaleString()} / ท่าน {Number(selectedTripForBooking.min_package_pax || 1) > 1 ? `(บังคับจองขั้นต่ำ ${selectedTripForBooking.min_package_pax} ท่านขึ้นไป)` : ''}
                </div>
              )}

              {selectedTripForBooking.advance_days && (
                <p className="text-[11px] text-sky-400 font-bold">⏱️ หมายเหตุ: กรุณาจองล่วงหน้าอย่างน้อย {selectedTripForBooking.advance_days} วัน</p>
              )}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" /> ชื่อ-นามสกุล ผู้จอง
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
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> เบอร์โทรศัพท์ติดต่อ
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
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> วันที่ต้องการเดินทางจริง
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.travel_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, travel_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white [color-scheme:dark] font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>

                {(selectedTripForBooking.price_display_type || 'package') === 'package' ? (
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-rose-400" /> จำนวนผู้เดินทาง {Number(selectedTripForBooking.min_package_pax || 1) > 1 ? `(จองขั้นต่ำ ${selectedTripForBooking.min_package_pax} ท่าน)` : ''}
                    </label>
                    <input
                      type="number"
                      min={selectedTripForBooking.min_package_pax || 1}
                      max={Math.max(1, extractMaxSeats(selectedTripForBooking.service_class) - getBookedSeatsForTrip(selectedTripForBooking.id))}
                      required
                      value={bookingForm.adults_count}
                      onChange={(e) => {
                        const maxAvail = Math.max(1, extractMaxSeats(selectedTripForBooking.service_class) - getBookedSeatsForTrip(selectedTripForBooking.id));
                        const val = Math.min(maxAvail, Math.max(parseInt(selectedTripForBooking.min_package_pax) || 1, parseInt(e.target.value) || 1));
                        setBookingForm({ ...bookingForm, adults_count: val });
                      }}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-amber-400 font-black text-center text-sm shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="sm:col-span-2 grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[10px]">ผู้ใหญ่ (ขั้นต่ำ {selectedTripForBooking.min_booking_pax || 1} ท่าน)</label>
                      <input
                        type="number"
                        min={selectedTripForBooking.min_booking_pax || 1}
                        required
                        value={bookingForm.adults_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, adults_count: Math.max(parseInt(selectedTripForBooking.min_booking_pax) || 1, parseInt(e.target.value) || 1) })}
                        className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-center text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[10px]">เด็กโต 3-11 ปี (฿{selectedTripForBooking.child_price || '1,800'})</label>
                      <input
                        type="number"
                        min="0"
                        value={bookingForm.child_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, child_count: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-center text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[10px]">เด็ก 0-2 ปี (฿{selectedTripForBooking.infant_price || '500'})</label>
                      <input
                        type="number"
                        min="0"
                        value={bookingForm.infants_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, infants_count: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-center text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">ยอดชำระสุทธิทั้งสิ้น</span>
                  <span className="text-lg font-black text-amber-400">
                    ฿{calculateBookingTotal(selectedTripForBooking).toLocaleString()}
                  </span>
                  {(selectedTripForBooking.price_display_type || 'package') === 'package' && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      (เรท ฿{Number(String(selectedTripForBooking.total_package_price || '0').replace(/,/g, '')).toLocaleString()} / ท่าน × {bookingForm.adults_count} ท่าน)
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                  บันทึกการจองเพื่อแนบสลิป
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
                  <Check className="w-4 h-4 font-black" />
                  <span>บันทึกการจอง (ไปหน้าแนบสลิป)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: แนบสลิปชำระเงิน (ขั้นตอนที่ 2: หลังจากจองแล้ว) --- */}
      {isSlipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
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
                {isSlipUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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
                    <X className="w-4 h-4" />
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
                <Check className="w-4 h-4" />
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
              <X className="w-4 h-4" />
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
                {selectedTripDetail.price_display_type === 'package' && selectedTripDetail.min_package_pax && Number(selectedTripDetail.min_package_pax) > 1 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    👥 จองขั้นต่ำ {selectedTripDetail.min_package_pax} ท่านขึ้นไป
                  </span>
                )}
                {selectedTripDetail.min_booking_pax && selectedTripDetail.price_display_type !== 'package' && Number(selectedTripDetail.min_booking_pax) > 1 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    👥 จองขั้นต่ำ {selectedTripDetail.min_booking_pax} ท่านขึ้นไป
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                {selectedTripDetail.title}
              </h2>
              <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" /> {selectedTripDetail.route}
              </p>
            </div>

            {/* รายละเอียดโปรแกรมภาพรวม */}
            {selectedTripDetail.itinerary_details && (
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
                <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> รายละเอียดโปรแกรมภาพรวม
                </span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.itinerary_details}</p>
              </div>
            )}

            {/* ตารางการเดินทางรายวัน */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Clock3 className="w-4 h-4" /> ตารางการเดินทางรายวัน (Day-by-Day Itinerary)
              </h4>
              
              <div className="space-y-3">
                {selectedTripDetail.itinerary_days && selectedTripDetail.itinerary_days.length > 0 ? (
                  selectedTripDetail.itinerary_days.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl relative pl-6 sm:pl-8 space-y-1.5">
                      <div className="absolute left-2.5 sm:left-3.5 top-4 bottom-0 w-0.5 bg-amber-500/30"></div>
                      <div className="absolute left-1.5 sm:left-2.5 top-4 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950"></div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black">
                          วันที่ {item.day}
                        </span>
                        <h5 className="text-xs font-black text-white">{item.title}</h5>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pt-1">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">ไม่มีข้อมูลตารางการเดินทาง</p>
                )}
              </div>
            </div>

            {/* ข้อมูลโรงแรมที่พัก */}
            {selectedTripDetail.hotel_name && (
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-teal-500/30 space-y-3 text-xs">
                <span className="text-teal-400 font-bold block flex items-center gap-2 text-sm">
                  <Hotel className="w-4 h-4 text-teal-400" /> ข้อมูลโรงแรมที่พัก (Accommodation)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                  <p>🏨 <strong>ชื่อโรงแรม:</strong> {selectedTripDetail.hotel_name}</p>
                  <p>🛏️ <strong>ประเภทห้อง:</strong> {selectedTripDetail.room_type || 'มาตรฐาน'}</p>
                  <p className="sm:col-span-2">📍 <strong>ทำเลที่ตั้ง:</strong> {selectedTripDetail.hotel_location || 'ไม่ระบุ'}</p>
                </div>

                {selectedTripDetail.hotel_images && selectedTripDetail.hotel_images.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block">แกลเลอรีรูปภาพโรงแรมที่พัก:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {selectedTripDetail.hotel_images.map((hImg: string, hIdx: number, hArr: string[]) => (
                        <div key={hIdx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 shadow bg-slate-950 group">
                          <img src={hImg} alt={`Hotel ${hIdx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer" onClick={() => openLightbox(hArr, hIdx)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ราคารวม, ไม่รวม, สิ่งที่ต้องเตรียม, เงื่อนไข */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {selectedTripDetail.inclusions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> ราคารวม (Inclusions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.inclusions}</p>
                </div>
              )}

              {selectedTripDetail.exclusions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                    <X className="w-4 h-4" /> ราคาไม่รวม (Exclusions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.exclusions}</p>
                </div>
              )}

              {selectedTripDetail.what_to_bring && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-sky-500/30 space-y-2">
                  <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                    <Backpack className="w-4 h-4" /> สิ่งที่ต้องเตรียมไป (What to Bring)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.what_to_bring}</p>
                </div>
              )}

              {selectedTripDetail.terms_conditions && (
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                  <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> เงื่อนไขต่างๆ (Terms & Conditions)
                  </span>
                  <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedTripDetail.terms_conditions}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">โครงสร้างเรทราคา</span>
                <div className="text-base font-black text-amber-400">
                  {(selectedTripDetail.price_display_type || 'package') === 'package' ? (
                    <span>ราคาต่อท่าน: ฿{selectedTripDetail.total_package_price}</span>
                  ) : (
                    <span>ผู้ใหญ่ ฿{selectedTripDetail.adult_price} | เด็กโต ฿{selectedTripDetail.child_price || '1,800'} | เด็กเล็ก ฿{selectedTripDetail.infant_price} / ท่าน</span>
                  )}
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

      {/* --- MODAL: สร้าง หรือ แก้ไขแพ็กเกจทัวร์ --- */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shadow-inner">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">{isEditModalOpen ? 'แก้ไขแพ็กเกจทัวร์' : 'สร้างแพ็กเกจทัวร์ใหม่'}</h3>
                  <p className="text-[11px] text-slate-400">ระบบเหมาคันพร้อมกำหนดเงื่อนไขการจองขั้นต่ำพร้อมใช้งานแล้ว</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="text-slate-400 hover:text-white bg-slate-800/80 p-2.5 rounded-2xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateTrip : handleAddTrip} className="space-y-5 text-xs">
              
              {/* 1. ข้อมูลพื้นฐานทริป */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1. ข้อมูลพื้นฐานทริป (รหัสทริป, ชื่อแพ็กเกจ และกำหนดจองล่วงหน้า)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-sky-400" /> รหัสทริป
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
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> ต้องจองล่วงหน้า (วัน)
                    </label>
                    <input
                      type="text"
                      value={newTrip.advanceDays}
                      onChange={(e) => setNewTrip({ ...newTrip, advanceDays: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น 15"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-300 mb-1.5">ชื่อแพ็กเกจทริป / ชื่อบริการ</label>
                    <input
                      type="text"
                      value={newTrip.title}
                      onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น ทัวร์เชียงใหม่ ดอยอินทนนท์ 3 วัน 2 คืน"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 2. รูปภาพหลักและแกลเลอรีทริป */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-3 shadow-inner">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> 2. รูปภาพหลักและแกลเลอรีทริป
                    </span>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      💡 <strong className="text-amber-400 font-bold">รูปแรก</strong> จะถูกแสดงเป็นภาพปกหน้าแรก <span className="text-slate-400">(อัปโหลดได้หลายรูป)</span>
                    </p>
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
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>+ เลือกรูปภาพ</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-h-[100px] p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
                  {newTrip.images.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-slate-500 text-xs py-5 gap-1">
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                      <span>ยังไม่มีรูปภาพที่อัปโหลด</span>
                    </div>
                  ) : (
                    newTrip.images.map((imgUrl, idx, arr) => (
                      <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-slate-700 group shadow bg-slate-950">
                        <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" onClick={() => openLightbox(arr, idx)} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-[9px] hover:bg-rose-500 cursor-pointer shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow">รูปปกหลัก</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. เส้นทางและสถานที่ปลายทาง */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> 3. เส้นทางและสถานที่ปลายทาง (ต้นทาง & ปลายทาง)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ต้นทาง</label>
                    <input
                      type="text"
                      value={newTrip.origin}
                      onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-emerald-500 shadow"
                      placeholder="เช่น กรุงเทพฯ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">เพิ่มสถานที่ปลายทาง</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={destInput}
                        onChange={(e) => setDestInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDestination(); }}}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-semibold focus:outline-none focus:border-rose-500 shadow"
                        placeholder="เช่น เชียงใหม่, ดอยอินทนนท์"
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
                    <span className="text-[10px] text-slate-400 block mb-1 font-bold">รายการปลายทางที่เลือก:</span>
                    <div className="flex flex-wrap gap-2 min-h-[38px] p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                      {newTrip.destinations.length === 0 ? (
                        <span className="text-slate-500 text-xs">ยังไม่ได้ระบุสถานที่ปลายทาง</span>
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

              {/* 4. ช่วงเวลาการเดินทาง & ระยะเวลา */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 4. ช่วงเวลาการเดินทาง & ระยะเวลา
                    </span>
                    <p className="text-[10px] text-slate-400">เลือกรูปแบบการกำหนดวันเดินทาง หรือกำหนดระยะเวลาทริปตามความต้องการ</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1">
                    <label className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${newTrip.isCustomDuration ? 'bg-sky-950/60 border-sky-500 shadow' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={newTrip.isCustomDuration}
                          onChange={(e) => setNewTrip({ 
                            ...newTrip, 
                            isCustomDuration: e.target.checked, 
                            isTBD: e.target.checked ? false : newTrip.isTBD, 
                            isEveryday: e.target.checked ? false : newTrip.isEveryday 
                          })}
                          className="w-4 h-4 text-sky-500 cursor-pointer accent-sky-500 rounded"
                        />
                        <span className="text-xs font-bold text-sky-300">กำหนดระยะเวลาเอง</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight pl-6">ระบุจำนวนวันและคืน เช่น 3 วัน 2 คืน โดยไม่กำหนดวันที่จริง</span>
                    </label>

                    <label className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${newTrip.isTBD ? 'bg-sky-950/60 border-sky-500 shadow' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={newTrip.isTBD}
                          onChange={(e) => setNewTrip({ ...newTrip, isTBD: e.target.checked, isCustomDuration: false, isEveryday: false })}
                          className="w-4 h-4 text-sky-500 cursor-pointer accent-sky-500 rounded"
                        />
                        <span className="text-xs font-bold text-sky-300">ยังไม่กำหนดวันเวลา</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight pl-6">รอให้ลูกค้าเลือกวันเดินทางและเวลาเองเมื่อทำรายการจอง</span>
                    </label>

                    <label className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${newTrip.isEveryday ? 'bg-amber-950/40 border-amber-500 shadow' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={newTrip.isEveryday}
                          onChange={(e) => setNewTrip({ ...newTrip, isEveryday: e.target.checked, isCustomDuration: false, isTBD: false })}
                          className="w-4 h-4 text-amber-500 cursor-pointer accent-amber-500 rounded"
                        />
                        <span className="text-xs font-bold text-amber-400">เดินทางทุกวัน</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight pl-6">เปิดให้บริการทุกวันตลอดทั้งปี ไม่มีวันหยุดประจำ</span>
                    </label>
                  </div>
                </div>

                {newTrip.isCustomDuration && (
                  <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11px] text-slate-300 block mb-1 font-bold">จำนวนวัน:</span>
                      <input
                        type="text"
                        value={newTrip.customDays}
                        onChange={(e) => setNewTrip({ ...newTrip, customDays: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold text-center"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-300 block mb-1 font-bold">จำนวนคืน:</span>
                      <input
                        type="text"
                        value={newTrip.customNights}
                        onChange={(e) => setNewTrip({ ...newTrip, customNights: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold text-center"
                        placeholder="2"
                      />
                    </div>
                  </div>
                )}

                {!newTrip.isEveryday && !newTrip.isTBD && !newTrip.isCustomDuration && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-inner">
                      <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                        <span>💡 คำแนะนำ: เลือกวันเริ่มต้นและวันสิ้นสุดการเดินทางจริง ระบบจะคำนวณจำนวนวันและคืนให้อัตโนมัติ</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-slate-300 block mb-1 font-bold">ตั้งแต่วันที่:</span>
                          <input
                            type="date"
                            value={newTrip.startDate}
                            onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white text-xs [color-scheme:dark] shadow focus:outline-none focus:border-amber-500 font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-300 block mb-1 font-bold">ถึงวันที่:</span>
                          <input
                            type="date"
                            value={newTrip.endDate}
                            onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white text-xs [color-scheme:dark] shadow focus:outline-none focus:border-amber-500 font-bold"
                          />
                        </div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-amber-400 font-bold">
                        <span>คำนวณระยะเวลาอัตโนมัติ:</span>
                        <span className="font-black text-sm">{totalDaysCount} วัน ({totalNightsCount} คืน)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. รายละเอียดโปรแกรมภาพรวม */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-3 shadow-inner">
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> 5. รายละเอียดโปรแกรมภาพรวม (Tour Overview)
                </span>
                <textarea
                  rows={4}
                  value={newTrip.itineraryDetails}
                  onChange={(e) => setNewTrip({ ...newTrip, itineraryDetails: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 leading-relaxed"
                  placeholder="เช่น แพ็กเกจทัวร์เชียงใหม่ 3 วัน 2 คืน พิชิตยอดดอยอินทนนท์..."
                ></textarea>
              </div>

              {/* 6. ข้อมูลโรงแรมที่พัก */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5" /> 6. ข้อมูลโรงแรมที่พัก (Accommodation Details)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ชื่อโรงแรม / รีสอร์ท</label>
                    <input
                      type="text"
                      value={newTrip.hotelName}
                      onChange={(e) => setNewTrip({ ...newTrip, hotelName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น The Imperial Chiang Mai Resort"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ประเภทห้องพัก / เงื่อนไข</label>
                    <input
                      type="text"
                      value={newTrip.roomType}
                      onChange={(e) => setNewTrip({ ...newTrip, roomType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น Deluxe Room (รวมอาหารเช้า)"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1.5">ทำเลที่ตั้ง / โซนที่พัก</label>
                    <input
                      type="text"
                      value={newTrip.hotelLocation}
                      onChange={(e) => setNewTrip({ ...newTrip, hotelLocation: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold focus:outline-none focus:border-amber-500 shadow"
                      placeholder="เช่น อำเภอเมือง จังหวัดเชียงใหม่"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-300">รูปภาพโรงแรมที่พัก (อัปโหลดได้หลายรูป)</label>
                      
                      <input
                        type="file"
                        ref={hotelFileInputRef}
                        onChange={handleHotelUploadFromComputer}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />

                      <button
                        type="button"
                        disabled={isHotelUploading}
                        onClick={() => hotelFileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow cursor-pointer flex items-center gap-1.5"
                      >
                        {isHotelUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>+ เลือกรูปโรงแรม</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 min-h-[80px] p-2.5 bg-slate-900 rounded-2xl border border-slate-800">
                      {newTrip.hotelImages.length === 0 ? (
                        <div className="col-span-full flex items-center justify-center text-slate-500 text-[11px] py-4">
                          ยังไม่มีรูปภาพโรงแรมที่อัปโหลด
                        </div>
                      ) : (
                        newTrip.hotelImages.map((hUrl, hIdx, hArr) => (
                          <div key={hIdx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 shadow bg-slate-950 group">
                            <img src={hUrl} alt={`Hotel ${hIdx}`} className="w-full h-full object-cover" onClick={() => openLightbox(hArr, hIdx)} />
                            <button
                              type="button"
                              onClick={() => handleRemoveHotelImage(hIdx)}
                              className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-[9px] hover:bg-rose-500 cursor-pointer shadow"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. ประเภทรถและรูปแบบเรตราคา */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> 7. ประเภทรถและรูปแบบเรตราคา (เหมาคัน หรือ ต่อท่าน)
                </span>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">ประเภทรถ (เชื่อมโยงจาก Fleet)</label>
                  <select
                    value={newTrip.serviceClass}
                    onChange={(e) => setNewTrip({ ...newTrip, serviceClass: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white font-bold text-sky-400 cursor-pointer text-xs shadow focus:outline-none focus:border-sky-500"
                  >
                    {fleetList.length === 0 ? (
                      <option value="VIP First Class 13 ที่นั่ง">VIP First Class 13 ที่นั่ง</option>
                    ) : (
                      fleetList.map((car) => (
                        <option key={car.id} value={`${car.brand} (${car.seats} ที่นั่ง)`}>
                          {car.brand} ({car.seats} ที่นั่ง)
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className={`p-4 rounded-2xl border transition-all ${newTrip.priceDisplayType === 'package' ? 'bg-amber-950/40 border-amber-500 shadow' : 'bg-slate-900/60 border-slate-800'}`}>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="radio"
                        name="priceDisplayType"
                        checked={newTrip.priceDisplayType === 'package'}
                        onChange={() => setNewTrip({ ...newTrip, priceDisplayType: 'package' })}
                        className="w-4 h-4 text-amber-500 cursor-pointer accent-amber-500"
                      />
                      <span className="text-xs font-bold text-amber-300">ราคาแพ็กเกจ (Private Charter)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold mb-1">ราคาต่อท่าน (฿)</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'package'}
                          value={newTrip.totalPackagePrice}
                          onChange={(e) => setNewTrip({ ...newTrip, totalPackagePrice: formatNumberInput(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-black text-xs shadow focus:outline-none focus:border-amber-500 disabled:opacity-50 text-center"
                          placeholder="5,000"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold mb-1">จองขั้นต่ำ (ท่าน)</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'package'}
                          value={newTrip.minPackagePax}
                          onChange={(e) => setNewTrip({ ...newTrip, minPackagePax: formatNumberInput(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-black text-xs shadow focus:outline-none disabled:opacity-50 text-center"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-all ${newTrip.priceDisplayType === 'per_person' ? 'bg-sky-950/40 border-sky-500 shadow' : 'bg-slate-900/60 border-slate-800'}`}>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="radio"
                        name="priceDisplayType"
                        checked={newTrip.priceDisplayType === 'per_person'}
                        onChange={() => setNewTrip({ ...newTrip, priceDisplayType: 'per_person' })}
                        className="w-4 h-4 text-sky-500 cursor-pointer accent-sky-500"
                      />
                      <span className="text-xs font-bold text-sky-300">ราคาต่อท่าน (Join Tour)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-1 truncate">ผู้ใหญ่</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'per_person'}
                          value={newTrip.adultPrice}
                          onChange={(e) => setNewTrip({ ...newTrip, adultPrice: formatNumberInput(e.target.value) })}
                          className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sky-400 font-black text-xs shadow focus:outline-none disabled:opacity-50 text-center"
                          placeholder="2,500"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-1 truncate">เด็กโต 3-11</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'per_person'}
                          value={newTrip.childPrice}
                          onChange={(e) => setNewTrip({ ...newTrip, childPrice: formatNumberInput(e.target.value) })}
                          className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sky-400 font-black text-xs shadow focus:outline-none disabled:opacity-50 text-center"
                          placeholder="1,800"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-1 truncate">เด็ก 0-2</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'per_person'}
                          value={newTrip.infantPrice}
                          onChange={(e) => setNewTrip({ ...newTrip, infantPrice: formatNumberInput(e.target.value) })}
                          className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sky-400 font-black text-xs shadow focus:outline-none disabled:opacity-50 text-center"
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-1 truncate">จองขั้นต่ำ (ท่าน)</span>
                        <input
                          type="text"
                          disabled={newTrip.priceDisplayType !== 'per_person'}
                          value={newTrip.minBookingPax}
                          onChange={(e) => setNewTrip({ ...newTrip, minBookingPax: formatNumberInput(e.target.value) })}
                          className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-black text-xs shadow focus:outline-none disabled:opacity-50 text-center"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. ราคารวม, ไม่รวม, สิ่งที่ต้องเตรียม และเงื่อนไข */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> 8. ราคารวม, ไม่รวม, สิ่งที่ต้องเตรียม และเงื่อนไข
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">✅ ราคารวม (Inclusions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.inclusions}
                      onChange={(e) => setNewTrip({ ...newTrip, inclusions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                      placeholder="• รถตู้ VIP, โรงแรม, อาหารเช้า"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">❌ ราคาไม่รวม (Exclusions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.exclusions}
                      onChange={(e) => setNewTrip({ ...newTrip, exclusions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-rose-500 leading-relaxed"
                      placeholder="• ค่าใช้จ่ายส่วนตัว, ตั๋วเครื่องบิน"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">🎒 สิ่งที่ต้องเตรียมไป (What to Bring)</label>
                    <textarea
                      rows={3}
                      value={newTrip.whatToBring}
                      onChange={(e) => setNewTrip({ ...newTrip, whatToBring: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-sky-500 leading-relaxed"
                      placeholder="• เสื้อกันหนาว, ยาส่วนตัว"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">⚠️ เงื่อนไขต่างๆ (Terms & Conditions)</label>
                    <textarea
                      rows={3}
                      value={newTrip.termsConditions}
                      onChange={(e) => setNewTrip({ ...newTrip, termsConditions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                      placeholder="• ชำระมัดจำ 50% เมื่อทำการจอง"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 9. จัดตารางการเดินทางรายวัน (Itinerary Builder) */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> 9. จัดตารางการเดินทางรายวัน (Itinerary Builder)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl font-black text-[11px] shadow cursor-pointer transition-all flex items-center gap-1"
                  >
                    + เพิ่มวันที่ท่องเที่ยว
                  </button>
                </div>

                <div className="space-y-3">
                  {newTrip.itineraryDays.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg">
                          วันที่ {item.day}
                        </span>
                        {newTrip.itineraryDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItineraryDay(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="ลบวันนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">หัวข้อโปรแกรมประจำวัน</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs"
                          placeholder="เช่น พิชิตยอดดอยอินทนนท์"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">รายละเอียดกิจกรรม / สถานที่ (ขึ้นบรรทัดใหม่ด้วย •)</label>
                        <textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs leading-relaxed"
                          placeholder="• ชมวิวทะเลหมอกยามเช้า&#10;• สักการะพระมหาธาตุเจดีย์"
                        ></textarea>
                      </div>
                    </div>
                  ))}
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
                  disabled={isUploading || isHotelUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 disabled:opacity-50 text-slate-950 rounded-2xl font-black shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 transition-all"
                >
                  <Check className="w-4 h-4 font-black" />
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
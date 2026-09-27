'use client';

import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Calendar, Phone, User, Users, CheckCircle, Clock, Trash2, ShieldCheck, Search } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function TripBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // ดึงข้อมูลการจอง พร้อม Join ข้อมูลชื่อทริปจากตาราง trips
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            title,
            trip_code,
            route
          )
        `)
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดตสถานะการจอง (เช่น เปลี่ยนเป็น 'ยืนยันแล้ว')
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setBookings(bookings.map(item => item.id === id ? { ...item, status: newStatus } : item));
      alert('อัปเดตสถานะการจองสำเร็จ!');
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต: ' + error.message);
    }
  };

  // ฟังก์ชันลบรายการจอง
  const handleDeleteBooking = async (id: number) => {
    if (confirm('คุณต้องการลบรายการจองนี้ออกจากระบบใช่หรือไม่?')) {
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setBookings(bookings.filter(item => item.id !== id));
      } catch (error: any) {
        console.error('Error deleting booking:', error);
        alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
      }
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone?.includes(searchTerm) ||
    b.trips?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span>ระบบจัดการรายการจองทริป (Booking Management)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">ตรวจสอบรายชื่อลูกค้าที่ทำการจองแพ็กเกจทริปและสถานะการชำระเงิน</p>
        </div>

        {/* ช่องค้นหา */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อ, เบอร์โทร, ชื่อทริป..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
          />
        </div>
      </div>

      {/* --- BOOKINGS LIST --- */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลการจอง...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
          ยังไม่มีรายการจองทริปในระบบ
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'ยืนยันแล้ว';

            return (
              <div key={booking.id} className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all backdrop-blur-md">
                
                {/* Header การ์ดจอง */}
                <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="bg-sky-600/90 text-white text-[9px] font-black px-2.5 py-1 rounded-lg">
                    {booking.trips?.trip_code || 'TRIP-00X'}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border flex items-center gap-1 ${isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                    {isConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{booking.status}</span>
                  </span>
                </div>

                {/* รายละเอียดการจอง */}
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <h3 className="text-sm font-black text-white truncate">{booking.trips?.title || 'แพ็กเกจทริป'}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{booking.trips?.route}</p>
                  </div>

                  <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-200">
                      <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="font-bold truncate">{booking.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>เดินทาง: {booking.travel_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Users className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>จำนวนผู้เดินทาง: {booking.passengers_count} ท่าน</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 font-bold">ยอดรวมสุทธิ:</span>
                    <span className="text-base font-black text-amber-400">฿{booking.total_price}</span>
                  </div>
                </div>

                {/* ปุ่มจัดการสถานะ & ลบ */}
                <div className="p-4 pt-2.5 flex items-center justify-between border-t border-slate-800/80 bg-slate-900/40">
                  <div className="flex items-center gap-1.5">
                    {isConfirmed ? (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'รอดำเนินการ')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-700 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        เปลี่ยนเป็นรอดำเนินการ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'ยืนยันแล้ว')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl border border-emerald-500 text-[10px] font-bold cursor-pointer transition-all shadow"
                      >
                        ✓ ยืนยันการจอง
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="p-2 bg-slate-900 hover:bg-rose-950/40 text-rose-400 rounded-xl border border-slate-700/80 shadow transition-all cursor-pointer"
                    title="ลบรายการจอง"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
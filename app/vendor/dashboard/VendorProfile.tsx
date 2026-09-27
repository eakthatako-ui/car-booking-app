'use client';

import React, { useState } from 'react';
import { User, Building2, Phone, Mail, MapPin, FileText, Edit3, Plus, Star, Award, Check, X, Car } from 'lucide-react';

export default function VendorProfile() {
  // สถานะข้อมูลโปรไฟล์จำลอง (Mock Data)
  const [profile, setProfile] = useState({
    name: 'สมศักดิ์ ขนส่งดี',
    company: 'Somsak Van Service Co., Ltd.',
    phone: '081-234-5678',
    email: 'somsak.van@email.com',
    serviceArea: 'กรุงเทพฯ และปริมณฑล',
    vehicleCount: 5,
    rating: 4.8,
    bio: 'บริการรถตู้ VIP ให้เช่า พร้อมคนขับมืออาชีพ ประสบการณ์กว่า 10 ปี ตรงต่อเวลา สะอาด ปลอดภัย',
  });

  // สถานะสำหรับเปิด/ปิดโหมดแก้ไข
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  // จำลองรายการผลงานหรือรูปรถที่ให้บริการ
  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'บริการรับ-ส่งคณะผู้บริหาร VIP', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60' },
    { id: 2, title: 'ทริปท่องเที่ยวธรรมชาติ เชียงใหม่', image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&auto=format&fit=crop&q=60' },
    { id: 3, title: 'บริการรถตู้รับส่งสนามบิน', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&auto=format&fit=crop&q=60' },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    alert('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* --- HEADER TITLE & ACTION BUTTON --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <span>โปรไฟล์และผลงานพาร์ทเนอร์</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">จัดการข้อมูลส่วนตัว รายละเอียดบริษัท และแกลเลอรีผลงานบริการของคุณให้ทันสมัยอยู่เสมอ</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
            isEditing 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
              : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25'
          }`}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'ยกเลิกการแก้ไข' : 'แก้ไขข้อมูลโปรไฟล์'}</span>
        </button>
      </div>

      {/* --- STATS OVERVIEW CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
          <div className="p-3 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-xl text-xl font-bold shadow-inner">🚐</div>
          <div>
            <p className="text-xs text-slate-400 font-medium">จำนวนรถในสังกัด</p>
            <h3 className="text-xl font-black text-white">{profile.vehicleCount} คัน</h3>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
          <div className="p-3 bg-amber-950/80 text-amber-400 border border-amber-800/50 rounded-xl text-xl font-bold shadow-inner">⭐</div>
          <div>
            <p className="text-xs text-slate-400 font-medium">คะแนนรีวิวเฉลี่ย</p>
            <h3 className="text-xl font-black text-amber-400 flex items-center gap-1">
              <span>{profile.rating}</span> <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </h3>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
          <div className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-xl text-xl font-bold shadow-inner">📍</div>
          <div>
            <p className="text-xs text-slate-400 font-medium">พื้นที่ให้บริการ</p>
            <h3 className="text-sm font-black text-white truncate max-w-[200px]">{profile.serviceArea}</h3>
          </div>
        </div>

      </div>

      {/* --- PROFILE DETAILS SECTION --- */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <h3 className="text-sm font-black text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          <span>ข้อมูลผู้ให้บริการและรายละเอียดบริษัท</span>
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">ชื่อ-นามสกุล / ผู้ติดต่อ</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">ชื่อบริษัท / ทีมงาน</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-300 mb-1.5">พื้นที่ให้บริการ</label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 text-xs">แนะนำบริการ / ประวัติย่อ</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-sky-400" /> ชื่อผู้ติดต่อ</span>
                <span className="font-bold text-white text-sm">{profile.name}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-amber-400" /> ชื่อบริษัท / ทีมงาน</span>
                <span className="font-bold text-white text-sm">{profile.company}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> ช่องทางติดต่อ</span>
                <span className="font-bold text-slate-200">{profile.phone} &bull; {profile.email}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> พื้นที่ให้บริการหลัก</span>
                <span className="font-bold text-white text-sm">{profile.serviceArea}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-purple-400" /> แนะนำบริการ / ประวัติย่อ</span>
                <p className="font-normal text-slate-300 mt-1 leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- PORTFOLIO & GALLERY SECTION --- */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800/80">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-400" />
            <span>ผลงานและรูปรถที่ให้บริการ</span>
          </h3>
          <button 
            onClick={() => alert('ฟังก์ชันเพิ่มรูปผลงาน จะเปิดให้ใช้งานเร็วๆ นี้')}
            className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 bg-sky-950/60 px-3 py-1.5 rounded-xl border border-sky-800/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มผลงานใหม่</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-md transition-all hover:border-sky-500/40">
              <div className="h-44 overflow-hidden bg-slate-950 relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="p-3.5 bg-slate-900">
                <p className="text-xs font-bold text-slate-200 truncate">{item.title}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">อัปเดตล่าสุด: มี.ค. 2026</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
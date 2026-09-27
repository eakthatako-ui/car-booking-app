'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bus, MapPin, ArrowRight, UserCheck } from 'lucide-react';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin') || 'ALL';
  const dest = searchParams.get('dest') || 'ALL';

  // ข้อมูลจำลองผู้ให้บริการรถตู้ พร้อมระบุจังหวัดต้นทางและปลายทาง
  const allSearchResults = [
    {
      id: 1,
      name: 'Andaman Luxury Van & Yachting',
      category: 'รถตู้ VIP 13 ที่นั่ง (เบาะนวดไฟฟ้า)',
      route: 'กรุงเทพฯ ➔ ภูเก็ต / พังงา',
      origin: 'กรุงเทพฯ',
      destination: 'ภูเก็ต',
      pricePerDay: '3,500 บาท/วัน',
      rating: '4.9',
      reviews: 128,
      driver: 'คุณสมชาย ใจดี (ประสบการณ์ขับรถ 10 ปี)',
      features: ['Wi-Fi ฟรี', 'ทีวีจอส่วนตัว', 'น้ำดื่มฟรีตลอดทาง', 'ประกันภัยชั้น 1'],
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Lanna Smile Transport',
      category: 'รถตู้ VIP 9 ที่นั่ง (ทรงเบาะ First Class)',
      route: 'กรุงเทพฯ ➔ เชียงใหม่ / เชียงราย',
      origin: 'กรุงเทพฯ',
      destination: 'เชียงใหม่',
      pricePerDay: '3,200 บาท/วัน',
      rating: '4.8',
      reviews: 95,
      driver: 'คุณภัทร ชำนาญเส้นทาง',
      features: ['เบาะปรับนอนไฟฟ้า', 'เครื่องเสียงคาราโอเกะ', 'ช่อง USB ทุกที่นั่ง'],
      img: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80',
    }
  ];

  // แก้ไขเงื่อนไขการกรองให้แม่นยำยิ่งขึ้น: 
  // ถ้าผู้ใช้เลือกจังหวัดปลายทาง (dest) มา จะต้องตรงกับ destination ของผู้ให้บริการ หรือระบุเป็น 'ALL'
  const filteredResults = allSearchResults.filter(item => {
    const matchOrigin = origin === 'ALL' || item.origin.includes(origin);
    const matchDest = dest === 'ALL' || item.destination.includes(dest);
    return matchOrigin && matchDest;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ส่วนหัวย้อนกลับและชื่อหน้า */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-xs font-bold text-blue-600 hover:underline mb-1 inline-block">
              ← กลับไปหน้าค้นหาหลัก
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              ผลการค้นหาผู้ให้บริการรถตู้ VIP (เหมาคัน)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {origin !== 'ALL' || dest !== 'ALL' ? (
                <span>เงื่อนไขการค้นหา: ต้นทาง <strong className="text-blue-600">{origin}</strong> | ปลายทาง <strong className="text-blue-600">{dest}</strong> (พบ {filteredResults.length} ราย)</span>
              ) : (
                <span>แสดงผู้ให้บริการทั้งหมดทั่วไทย</span>
              )}
            </p>
          </div>
        </div>

        {/* รายการผลลัพธ์ */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">ไม่พบผู้ให้บริการตามเส้นทางที่คุณเลือก</h3>
            <p className="text-slate-500 text-xs mb-6">ลองเปลี่ยนจังหวัดต้นทางหรือปลายทาง แล้วค้นหาใหม่อีกครั้งครับ</p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all">
              กลับไปเปลี่ยนเงื่อนไขการค้นหา
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResults.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-all">
                
                {/* รูปภาพรถ */}
                <div className="sm:w-2/5 relative h-56 sm:h-auto bg-slate-100">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                    ★ {item.rating} ({item.reviews} รีวิว)
                  </div>
                </div>

                {/* รายละเอียด */}
                <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">{item.name}</h3>
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.route}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> {item.driver}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.features.map((feat, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[10px] text-slate-500 font-medium">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">ราคาเริ่มต้น</span>
                      <span className="text-base font-black text-blue-600">{item.pricePerDay}</span>
                    </div>
                    <button 
                      onClick={() => alert(`คุณเลือกจองผู้ให้บริการ: ${item.name}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>ดูรายละเอียด & จองรถ</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
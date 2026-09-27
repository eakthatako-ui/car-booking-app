'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bus, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  Globe,
  Search,
  Users,
  Star,
  CheckCircle,
  Award,
  Flame,
  Clock,
  Compass,
  Lock,
  Eye,
  EyeOff,
  X,
  FileSpreadsheet,
  Send,
  Armchair,
  Map,
  BadgeCheck,
  Plus,
  Trash2,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';

const translations: Record<string, Record<string, string>> = {
  TH: {
    bannerHighlightTitle: 'VanPro Thailand Exclusive Fleet',
    bannerHighlightSub: 'ที่สุดแห่งความหรูหรา ปลอดภัย และตรงต่อเวลา',
    heroTitle1: 'ยกระดับทุกการเดินทาง',
    heroTitle2: 'เช่ารถตู้ VIP พร้อมคนขับมืออาชีพ',
    heroDesc: 'เชื่อมต่อตรงกับเจ้าของรถตู้และผู้ให้บริการท่องเที่ยวชั้นนำทั่วประเทศ ราคาโปร่งใส เลือกรถได้ตามต้องการ ท่องเที่ยวหรือติดต่องานอย่างมั่นใจ 100%',
    trustBadge1: 'คนขับผ่านการตรวจประวัติอาชญากรรม',
    trustBadge2: 'ประกันภัยคุ้มครองทุกที่นั่ง',
    trustBadge3: 'รับประกันราคาเป็นธรรม ไม่มีบวกเพิ่ม',
    labelPickupSpot: 'จุดรับเฉพาะ / สนามบิน / ที่พัก',
    placeholderPickupSpot: 'เช่น สนามบินสุวรรณภูมิ, รร.ใจกลางเมือง...',
    placeholderSearchProvince: 'พิมพ์ระบุสถานที่ หรือเลือกจากรายการ...',
    placeholderOrigin: 'ออกสตาร์ทจากที่ไหนดี...',
    placeholderDest: 'ทริปนี้จะไปเที่ยวที่ไหนดี...',
    labelOrigin: 'จุดเริ่มต้น / จังหวัดต้นทาง',
    labelDest: 'จุดหมายปลายทาง',
    labelDepDate: 'วันเดินทาง',
    labelDepTime: 'เวลารับ (โดยประมาณ)',
    labelRetDate: 'วันเดินทางกลับ',
    labelCarType: 'ประเภทรถ',
    labelPassengers: 'จำนวนผู้โดยสาร',
    labelCarQuantity: 'จำนวนรถที่ต้องการ (คัน)',
    labelWithDriver: 'พร้อมคนขับ',
    btnSearch: 'ค้นหารถว่างและดูราคา',
    btnQuote: 'ขอใบเสนอราคา / ประมูลราคา',
    sectionTripBadge: '🔥 ทริปฮิตติดเทรนด์',
    sectionTripTitle: 'เก็บกระเป๋าแล้วไปกัน! ทริปยอดฮิตที่ใครก็เลือก',
    sectionTripDesc: 'คัดมาให้แล้วกับเส้นทางสุดปัง รถตู้ VIP นั่งสบาย คนขับดูแลดี จองปุ๊บพร้อมล้อหมุนทันที',
    sectionTripLink: 'ดูผู้ให้บริการทั้งหมดทั่วประเทศ',
    searchTripPlaceholder: 'พิมพ์ค้นหาทริป หรือเส้นทาง...',
    filterAllProvinces: 'ทุกจังหวัดทั่วไทย',
    sectionPartnerBadge: '🤝 เครือข่ายพาร์ทเนอร์รถตู้ VIP ชั้นนำ',
    sectionPartnerTitle: 'ผู้ให้บริการรถตู้คุณภาพ การันตีความปลอดภัย',
    sectionPartnerDesc: 'พบกับเจ้าของรถและผู้ให้บริการตัวจริงที่ผ่านการตรวจสอบประวัติและมาตรฐานบริการระดับพรีเมียม',
    sectionDestBadge: '🌴 ปักหมุดจุดหมายยอดฮิต',
    sectionDestTitle: 'แหล่งท่องเที่ยวยอดฮิตทั่วไทย',
    sectionDestDesc: 'ปักหมุดจุดหมายในฝัน แล้วให้คนขับผู้ชำนาญเส้นทางพาคุณไปถึงที่หมายอย่างราบรื่น ปลอดภัย 100%',
    sectionDestLink: 'ค้นหาตามจังหวัดทั้งหมด',
    searchDestPlaceholder: 'พิมพ์ค้นหาแหล่งท่องเที่ยว หรือจังหวัด...',
    bannerTitle1: 'สัมผัสประสบการณ์เดินทางเหนือระดับ',
    bannerTitle2: 'รถตู้ VIP นำเที่ยวทั่วไทยครบวงจร',
    bannerDesc: 'VanPro Thailand ยกระดับมาตรฐานการเช่าเหมารถตู้ VIP พร้อมคนขับมืออาชีพ พาคุณและคณะท่องเที่ยวทั่วไทย 77 จังหวัด ไม่ว่าจะเป็นทริปครอบครัว รับรองแขก VIP สัมมนาองค์กร หรือทริปไหว้พระสายบุญ สะดวกสบาย ปลอดภัย ทุกเส้นทาง',
    bannerFeat1Title: 'ห้องโดยสาร First Class',
    bannerFeat1Desc: 'เบาะนวดไฟฟ้า ปรับนอน แอร์เย็นฉ่ำ Wi-Fi และระบบบันเทิงเต็มรูปแบบ',
    bannerFeat2Title: 'คนขับชำนาญทาง มารยาทเยี่ยม',
    bannerFeat2Desc: 'ผ่านการตรวจสอบประวัติอาชญากรรม ตรงต่อเวลา รู้จุดแวะท่องเที่ยวลับทั่วไทย',
    bannerFeat3Title: 'จัดทัวร์ตามใจ (Custom Tour)',
    bannerFeat3Desc: 'กำหนดจุดแวะพัก แวะชิมคาเฟ่ และเวลาออกเดินทางได้เองอย่างอิสระ 100%',
    bannerFeat4Title: 'ราคามาตรฐาน ปลอดภัย มั่นใจได้',
    bannerFeat4Desc: 'ราคาโปร่งใส ตกลงล่วงหน้า พร้อมประกันภัยคุ้มครองผู้โดยสารทุกที่นั่ง',
    btnQuoteTour: 'ขอใบเสนอราคาทริปท่องเที่ยว',
    btnExploreFleet: 'สำรวจรถว่างพร้อมเดินทาง',
    bannerSubBadge: 'เครือข่ายรถตู้ VIP',
    bannerSubText: 'ครอบคลุมทั่วไทย 77 จังหวัด',
    loginTitle: 'ยินดีต้อนรับสู่ VanPro',
    loginSubtitle: 'เข้าสู่ระบบเพื่อจัดการทริปและสิทธิพิเศษของคุณ',
    loginPlaceholder: '081-xxx-xxxx หรือ name@email.com',
    loginPass: 'รหัสผ่านความปลอดภัย',
    loginBtn: 'เข้าสู่ระบบอย่างปลอดภัย',
    loginFooter: 'ยังไม่มีบัญชีสมาชิก?',
    loginRegister: 'ลงทะเบียนฟรี',
    quoteModalTitle: 'ขอใบเสนอราคา / เปิดประมูลราคา',
    quoteModalDesc: 'ระบุแผนเดินทางพิเศษของคุณ เพื่อให้เจ้าของรถตู้ในเครือข่าย VanPro ร่วมเสนอราคาแข่งขัน',
    quoteOrigin: 'จุดเริ่มต้น / จังหวัดต้นทาง',
    quoteDest: 'จุดหมาย / จุดแวะปลายทาง',
    quoteAddStop: 'เพิ่มจุดแวะ',
    quoteCarType: 'ประเภทรถที่ต้องการ',
    quotePassengers: 'จำนวนผู้โดยสาร',
    quoteSpecialReq: 'ความต้องการพิเศษ',
    quoteBudget: 'งบประมาณที่คาดหวัง (บาท)',
    quoteSubmit: 'ส่งคำขอเปิดประมูลราคา (ฟรี 100%)',
    quoteSecurity: 'ข้อมูลของคุณจะส่งตรงถึงคนขับในระบบที่ผ่านการตรวจสอบประวัติเท่านั้น',
    footerText: 'VanPro Thailand — แพลตฟอร์มบริการรถตู้ VIP และการท่องเที่ยวอันดับ 1 © 2026 สงวนลิขสิทธิ์ทั้งหมด'
  },
  EN: {
    bannerHighlightTitle: 'VanPro Thailand Exclusive Fleet',
    bannerHighlightSub: 'The Ultimate Standard of Luxury, Safety & Punctuality',
    heroTitle1: 'Elevate Every Journey',
    heroTitle2: 'Premium VIP Vans with Professional Drivers',
    heroDesc: 'Direct access to verified top-tier fleet owners & tour operators across Thailand. Transparent pricing, pristine comfort, and 100% safety guaranteed.',
    trustBadge1: 'Background-Checked Drivers',
    trustBadge2: 'Full Passenger Insurance',
    trustBadge3: 'Guaranteed Fair Rates',
    labelPickupSpot: 'Pick-up Landmark / Airport',
    placeholderPickupSpot: 'e.g. Suvarnabhumi Airport, Hotel lobby...',
    placeholderSearchProvince: 'Type custom location or select...',
    placeholderOrigin: 'Origin / Start Point...',
    placeholderDest: 'Destination...',
    labelOrigin: 'Origin / Start Point',
    labelDest: 'Destination / End Point',
    labelDepDate: 'Departure Date',
    labelDepTime: 'Pick-up Time',
    labelRetDate: 'Return Date',
    labelCarType: 'Vehicle Type',
    labelPassengers: 'Passengers',
    labelCarQuantity: 'Vehicle Quantity (Units)',
    labelWithDriver: 'With Driver',
    btnSearch: 'Search Vehicles',
    btnQuote: 'Request Quotation',
    sectionTripBadge: '🔥 Trending Trips',
    sectionTripTitle: 'Pack Your Bags & Go! Most Loved Tours',
    sectionTripDesc: 'Handpicked top-rated routes with VIP comfort and verified friendly chauffeurs. Book and hit the road!',
    sectionTripLink: 'View All Fleet Providers',
    searchTripPlaceholder: 'Search trips or routes...',
    filterAllProvinces: 'All Provinces',
    sectionPartnerBadge: '🤝 Elite Fleet Partners',
    sectionPartnerTitle: 'Top-Rated VIP Van Operators',
    sectionPartnerDesc: 'Meet verified fleet owners and professional operators committed to premium service standards.',
    sectionDestBadge: '🌴 Top Destinations',
    sectionDestTitle: 'Top Destinations Across Thailand',
    sectionDestDesc: 'Choose your dream destination and let expert local chauffeurs guide your way with 100% peace of mind.',
    sectionDestLink: 'Search All Provinces',
    searchDestPlaceholder: 'Search destinations or provinces...',
    bannerTitle1: 'Elevate Every Journey',
    bannerTitle2: 'Premium VIP Vans & Tour Across Thailand',
    bannerDesc: 'VanPro Thailand elevates the standard of VIP van charters with professional drivers across all 77 provinces. Perfect for family trips, VIP receptions, corporate seminars, or merit-making tours. 100% safe and comfortable.',
    bannerFeat1Title: 'First Class Cabin',
    bannerFeat2Title: 'Expert & Courteous Drivers',
    bannerFeat3Title: 'Custom Tour Itinerary',
    bannerFeat4Title: 'Standard & Safe Pricing',
    bannerFeat1Desc: 'Reclining massage seats, cool AC, Wi-Fi, and full entertainment system.',
    bannerFeat2Desc: 'Background checked, punctual, and knowledgeable about hidden gems.',
    bannerFeat3Desc: 'Freely set your own stops, cafe visits, and departure times 100%.',
    bannerFeat4Desc: 'Transparent pricing with passenger insurance for every seat.',
    btnQuoteTour: 'Request Tour Quotation',
    btnExploreFleet: 'Explore Available Fleet',
    bannerSubBadge: 'VIP Van Network',
    bannerSubText: 'Covering All 77 Provinces',
    loginTitle: 'Welcome to VanPro',
    loginSubtitle: 'Log in to manage your trips and privileges.',
    loginPlaceholder: 'Phone or Email',
    loginPass: 'Security Password',
    loginBtn: 'Secure Login',
    loginFooter: 'Don\'t have an account?',
    loginRegister: 'Register Free',
    quoteModalTitle: 'Request Quotation / Smart Bidding',
    quoteModalDesc: 'Specify your custom travel plan for VanPro fleet owners to compete and offer the best rates.',
    quoteOrigin: 'Origin / Start Point',
    quoteDest: 'Destination / Waypoints',
    quoteAddStop: 'Add Stop',
    quoteCarType: 'Vehicle Type',
    quotePassengers: 'Passengers',
    quoteSpecialReq: 'Special Requirements',
    quoteBudget: 'Expected Budget (THB)',
    quoteSubmit: 'Submit Bidding Request (100% Free)',
    quoteSecurity: 'Your data goes directly to verified background-checked drivers.',
    footerText: 'VanPro Thailand — #1 VIP Van & Tour Platform © 2026 All Rights Reserved.'
  },
  CN: {
    bannerHighlightTitle: 'VanPro Thailand 尊贵车队',
    bannerHighlightSub: '奢华、安全与准时的至高标准',
    heroTitle1: '升级您的每一次出行',
    heroTitle2: '泰国全境 VIP 商务车与专业司导服务',
    heroDesc: '直接对接全泰优质认证车队与旅游运营商。价格公开透明，高品质车况与 100% 行程安全保障。',
    trustBadge1: '司机经过严格背景审核',
    trustBadge2: '全额乘客座位保险',
    trustBadge3: '公道透明报价 无隐形收费',
    labelPickupSpot: '具体接送地点 / 机场 / 酒店',
    placeholderPickupSpot: '如：素万那普机场、酒店大堂...',
    placeholderSearchProvince: '输入自定义地点或选择...',
    placeholderOrigin: '出发地...',
    placeholderDest: '目的地...',
    labelOrigin: '出发地 / 始发点',
    labelDest: '目的地 / 终点站',
    labelDepDate: '出发日期',
    labelDepTime: '出发时间',
    labelRetDate: '返程日期',
    labelCarType: '车型要求',
    labelPassengers: '出行人数',
    labelCarQuantity: '所需车辆数量 (辆)',
    labelWithDriver: '含司导',
    btnSearch: '查询可用车辆',
    btnQuote: '索取报价',
    sectionTripBadge: '🔥 当季热门精选',
    sectionTripTitle: '收拾行李出发！人人都在选的热门行程',
    sectionTripDesc: '为您严选高口碑路线，VIP商务座驾随行，专业司导贴心服务，随时轻松启程！',
    sectionTripLink: '查看全泰国车队服务商',
    searchTripPlaceholder: '搜索行程或路线...',
    filterAllProvinces: '全泰国各府',
    sectionPartnerBadge: '🤝 优质认证车队合作伙伴',
    sectionPartnerTitle: '专业认证车队 守护您的每一程安全',
    sectionPartnerDesc: '汇聚全泰资深车队 owner 与专业司机，提供高标准尊贵出行服务。',
    sectionDestBadge: '🌴 热门目的地',
    sectionDestTitle: '泰国热门度假目的地',
    sectionDestDesc: '挑选心仪的旅行圣地，由熟悉路况的专业司导带您轻松畅游，安心出行。',
    sectionDestLink: '按全部省份搜索',
    searchDestPlaceholder: '搜索目的地或省份...',
    bannerTitle1: '升级您的每一次出行',
    bannerTitle2: '泰国全境 VIP 商务车与旅游综合服务',
    bannerDesc: 'VanPro Thailand 提升泰国全境 77 府 VIP 商务包车服务标准。无论是家庭出游、VIP 接待、公司年会还是祈福之旅，皆可安心畅享舒适旅程。',
    bannerFeat1Title: '头等舱级舒适座舱',
    bannerFeat2Title: '专业认证优秀司导',
    bannerFeat3Title: '私家定制行程',
    bannerFeat4Title: '公开透明公道价格',
    bannerFeat1Desc: '豪华按摩躺椅、恒温冷气、高速 Wi-Fi 及全套娱乐系统。',
    bannerFeat2Desc: '严格背景审查，守时专业，带您玩转全泰宝藏景点。',
    bannerFeat3Desc: '100% 自主掌控停靠点、咖啡厅打卡及出发时间。',
    bannerFeat4Desc: '价格公开透明，每座均享安心乘客保险。',
    btnQuoteTour: '定制行程与索取报价',
    btnExploreFleet: '探索可用车队',
    bannerSubBadge: 'VIP 商务车网络',
    bannerSubText: '纵横全泰 77 府',
    loginTitle: '欢迎登录 VanPro',
    loginSubtitle: '登录以管理您的行程与专属特权。',
    loginPlaceholder: '手机号或邮箱',
    loginPass: '安全密码',
    loginBtn: '安全登录',
    loginFooter: '还没有账号？',
    loginRegister: '免费注册',
    quoteModalTitle: '定制行程 / 索取报价',
    quoteModalDesc: '详细说明您的专属出行计划，让 VanPro 认证车队为您竞标报价。',
    quoteOrigin: '出发地 / 始发点',
    quoteDest: '目的地 / 经停点',
    quoteAddStop: '添加经停点',
    quoteCarType: '所需车型',
    quotePassengers: '出行人数',
    quoteSpecialReq: '特殊需求',
    quoteBudget: '期望预算 (泰铢)',
    quoteSubmit: '提交竞标请求 (100% 免费)',
    quoteSecurity: '您的信息将直接发送至经过背景审核的认证司机。',
    footerText: 'VanPro Thailand — 泰国尊享 VIP 商务车与旅游综合服务平台 © 2026 版权所有'
  }
};

function CustomLocationInput({
  value,
  onChange,
  options,
  placeholder
}: {
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4.5 py-3.5 bg-slate-900/90 border border-slate-700 focus:border-sky-400 rounded-2xl text-sm sm:text-base font-semibold text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner pr-20"
        />
        <div className="absolute right-3.5 flex items-center gap-1.5 z-20">
          {value !== '' && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange('');
                setIsOpen(false);
              }}
              className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer shadow-sm"
              title="ล้างข้อมูล"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(opt.label);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-700/80 ${
                    value === opt.label ? 'text-sky-400 bg-slate-700/50 font-bold' : 'text-slate-200'
                  }`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                ใช้ข้อความที่พิมพ์: <span className="text-sky-400 font-bold">"{value}"</span> (กำหนดสถานที่เองได้อิสระ)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AutoFadeCarousel({ items, renderItem }: { items: any[]; renderItem: (item: any) => React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700">
        {[0, 1, 2].map((offset) => {
          const itemIndex = (currentIndex + offset) % items.length;
          const currentItem = items[itemIndex];
          if (!currentItem) return null;
          return (
            <div key={`${itemIndex}-${offset}`} className="w-full animate-in fade-in duration-500">
              {renderItem(currentItem)}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-sky-400' : 'w-2 bg-slate-700'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('TH');
  const [isLangOpen, setIsLangOpen] = useState(false);
   
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTripDetail, setQuoteTripDetail] = useState('');
  const [quoteBudget, setQuoteBudget] = useState('');
  const [quoteCarType, setQuoteCarType] = useState('Sedan (รถเก๋ง)');
  const [quotePassengers, setQuotePassengers] = useState('1');
  const [quoteCarQty, setQuoteCarQty] = useState(1);
  const [quoteDepDate, setQuoteDepDate] = useState('');
  const [quoteRetDate, setQuoteRetDate] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const [modalOrigin, setModalOrigin] = useState('');
  const [modalDestinations, setModalDestinations] = useState<string[]>(['']);

  const [pickupSpot, setPickupSpot] = useState('');
  const [originProvince, setOriginProvince] = useState('');
  const [destProvince, setDestProvince] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [returnDate, setReturnDate] = useState('');
  const [carType, setCarType] = useState('ALL');
  const [passengersCount, setPassengersCount] = useState('1');

  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');

  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [selectedDestProvinceFilter, setSelectedDestProvinceFilter] = useState('ALL');

  const t = translations[currentLang] || translations['TH'];

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return currentLang === 'TH' ? 'วัน/เดือน/ปี' : currentLang === 'CN' ? '年/月/日' : 'dd/mm/yyyy';
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;

    if (currentLang === 'TH') {
      const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const thaiYear = parseInt(year) + 543;
      return `${parseInt(day)} ${thaiMonths[parseInt(month) - 1]} ${thaiYear}`;
    } else if (currentLang === 'CN') {
      return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    }
    return `${day}/${month}/${year}`;
  };

  const allProvinces = [
    { id: 'กระบี่', label: 'กระบี่' },
    { id: 'กรุงเทพฯ', label: 'กรุงเทพฯ' },
    { id: 'กาญจนบุรี', label: 'กาญจนบุรี' },
    { id: 'กาฬสินธุ์', label: 'กาฬสินธุ์' },
    { id: 'กำแพงเพชร', label: 'กำแพงเพชร' },
    { id: 'ขอนแก่น', label: 'ขอนแก่น' },
    { id: 'จันทบุรี', label: 'จันทบุรี' },
    { id: 'ฉะเชิงเทรา', label: 'ฉะเชิงเทรา' },
    { id: 'ชลบุรี', label: 'ชลบุรี' },
    { id: 'ชัยนาท', label: 'ชัยนาท' },
    { id: 'ชัยภูมิ', label: 'ชัยภูมิ' },
    { id: 'ชุมพร', label: 'ชุมพร' },
    { id: 'ตรัง', label: 'ตรัง' },
    { id: 'ตราด', label: 'ตราด' },
    { id: 'ตาก', label: 'ตาก' },
    { id: 'นครนายก', label: 'นครนายก' },
    { id: 'นครปฐม', label: 'นครปฐม' },
    { id: 'นครพนม', label: 'นครพนม' },
    { id: 'นครราชสีมา', label: 'นครราชสีมา' },
    { id: 'นครศรีธรรมราช', label: 'นครศรีธรรมราช' },
    { id: 'นครสวรรค์', label: 'นครสวรรค์' },
    { id: 'นนทบุรี', label: 'นนทบุรี' },
    { id: 'นราธิวาส', label: 'นราธิวาส' },
    { id: 'น่าน', label: 'น่าน' },
    { id: 'บึงกาฬ', label: 'บึงกาฬ' },
    { id: 'บุรีรัมย์', label: 'บุรีรัมย์' },
    { id: 'ปทุมธานี', label: 'ปทุมธานี' },
    { id: 'ประจวบคีรีขันธ์', label: 'ประจวบคีรีขันธ์' },
    { id: 'ปราจีนบุรี', label: 'ปราจีนบุรี' },
    { id: 'ปัตตานี', label: 'ปัตตานี' },
    { id: 'พระนครศรีอยุธยา', label: 'พระนครศรีอยุธยา' },
    { id: 'พะเยา', label: 'พะเยา' },
    { id: 'พังงา', label: 'พังงา' },
    { id: 'พัทลุง', label: 'พัทลุง' },
    { id: 'พิจิตร', label: 'พิจิตร' },
    { id: 'พิษณุโลก', label: 'พิษณุโลก' },
    { id: 'เพชรบุรี', label: 'เพชรบุรี' },
    { id: 'เพชรบูรณ์', label: 'เพชรบูรณ์' },
    { id: 'แพร่', label: 'แพร่' },
    { id: 'ภูเก็ต', label: 'ภูเก็ต' },
    { id: 'มหาสารคาม', label: 'มหาสารคาม' },
    { id: 'มุกดาหาร', label: 'มุกดาหาร' },
    { id: 'แม่ฮ่องสอน', label: 'แม่ฮ่องสอน' },
    { id: 'ยโสธร', label: 'ยโสธร' },
    { id: 'ยะลา', label: 'ยะลา' },
    { id: 'ร้อยเอ็ด', label: 'ร้อยเอ็ด' },
    { id: 'ระนอง', label: 'ระนอง' },
    { id: 'ระยอง', label: 'ระยอง' },
    { id: 'ราชบุรี', label: 'ราชบุรี' },
    { id: 'ลพบุรี', label: 'ลพบุรี' },
    { id: 'ลำปาง', label: 'ลำปาง' },
    { id: 'ลำพูน', label: 'ลำพูน' },
    { id: 'เลย', label: 'เลย' },
    { id: 'ศรีสะเกษ', label: 'ศรีสะเกษ' },
    { id: 'สกลนคร', label: 'สกลนคร' },
    { id: 'สงขลา', label: 'สงขลา' },
    { id: 'สตูล', label: 'สตูล' },
    { id: 'สมุทรปราการ', label: 'สมุทรปราการ' },
    { id: 'สมุทรสงคราม', label: 'สมุทรสงคราม' },
    { id: 'สมุทรสาคร', label: 'สมุทรสาคร' },
    { id: 'สระแก้ว', label: 'สระแก้ว' },
    { id: 'สระบุรี', label: 'สระบุรี' },
    { id: 'สิงห์บุรี', label: 'สิงห์บุรี' },
    { id: 'สุโขทัย', label: 'สุโขทัย' },
    { id: 'สุพรรณบุรี', label: 'สุพรรณบุรี' },
    { id: 'สุราษฎร์ธานี', label: 'สุราษฎร์ธานี' },
    { id: 'สุรินทร์', label: 'สุรินทร์' },
    { id: 'หนองคาย', label: 'หนองคาย' },
    { id: 'หนองบัวลำภู', label: 'หนองบัวลำภู' },
    { id: 'อ่างทอง', label: 'อ่างทอง' },
    { id: 'อำนาจเจริญ', label: 'อำนาจเจริญ' },
    { id: 'อุดรธานี', label: 'อุดรธานี' },
    { id: 'อุตรดิตถ์', label: 'อุตรดิตถ์' },
    { id: 'อุทัยธานี', label: 'อุทัยธานี' },
    { id: 'อุบลราชธานี', label: 'อุบลราชธานี' },
    { id: 'เชียงราย', label: 'เชียงราย' },
    { id: 'เชียงใหม่', label: 'เชียงใหม่' },
  ];

  const destOptions = [
    { id: 'ทุกจังหวัดปลายทาง', label: currentLang === 'EN' ? 'All Destinations' : currentLang === 'CN' ? '全部目的地' : 'ทุกจังหวัดปลายทาง' },
    ...allProvinces
  ];

  const featuredTripsData = [
    {
      id: 1,
      name: currentLang === 'TH' ? 'Andaman Luxury Van & Yachting' : currentLang === 'EN' ? 'Andaman Luxury Van & Yachting' : '安达曼豪华商务车与游艇',
      province: 'ภูเก็ต',
      category: currentLang === 'TH' ? 'VIP First Class 13 ที่นั่ง' : currentLang === 'EN' ? 'VIP First Class 13 Seats' : 'VIP 头等舱 13座',
      route: currentLang === 'TH' ? 'กรุงเทพฯ ➔ ภูเก็ต / พังงา / กระบี่' : currentLang === 'EN' ? 'Bangkok ➔ Phuket / Phang Nga / Krabi' : '曼谷 ➔ 普吉 / 攀牙 / 甲米',
      price: '฿3,500',
      period: currentLang === 'TH' ? '/ วัน' : currentLang === 'EN' ? '/ Day' : '/ 天',
      rating: '4.95',
      reviews: '142',
      features: currentLang === 'TH' 
        ? ['เบาะนวดไฟฟ้าปรับเอนนอน', 'สมาร์ททีวี + Netflix / สตรีมมิ่ง', 'Wi-Fi 5G ความเร็วสูง & น้ำดื่มฟรี', 'คนขับชำนาญเส้นทางภาคใต้']
        : currentLang === 'EN'
        ? ['Reclining massage seats', 'Smart TV + Netflix / Streaming', 'High-speed 5G Wi-Fi & Free Water', 'Experienced Southern route driver']
        : ['电动按摩平躺座椅', '智能电视 + 奈飞/流媒体', '高速 5G Wi-Fi 与免费饮用水', '南部路线资深老司机'],
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      badge: currentLang === 'TH' ? 'คนขับยอดเยี่ยม 2026' : currentLang === 'EN' ? 'Top Driver 2026' : '2026 年度优秀司机',
      badgeColor: 'text-amber-300 bg-slate-900/90 border-amber-500/30'
    },
    {
      id: 2,
      name: currentLang === 'TH' ? 'Lanna Smile VIP Transport' : currentLang === 'EN' ? 'Lanna Smile VIP Transport' : '兰纳微笑 VIP 商务车',
      province: 'เชียงใหม่',
      category: currentLang === 'TH' ? 'VIP Captain Seat 9 ที่นั่ง' : currentLang === 'EN' ? 'VIP Captain Seat 9 Seats' : 'VIP 独立航空座椅 9座',
      route: currentLang === 'TH' ? 'กรุงเทพฯ ➔ เชียงใหม่ / ดอยอินทนนท์' : currentLang === 'EN' ? 'Bangkok ➔ Chiang Mai / Doi Inthanon' : '曼谷 ➔ 清迈 / 因他农山',
      price: '฿3,200',
      period: currentLang === 'TH' ? '/ วัน' : currentLang === 'EN' ? '/ Day' : '/ 天',
      rating: '4.90',
      reviews: '98',
      features: currentLang === 'TH'
        ? ['เบาะกัปตันเดี่ยวแยกส่วน สบายตัว', 'เครื่องฟอกอากาศ Plasmacluster', 'ช่องชาร์จ Type-C ครบทุกที่นั่ง', 'ผ่านการฝึกอบรมขับขี่ขึ้นดอยชัน']
        : currentLang === 'EN'
        ? ['Individual captain seats', 'Plasmacluster air purifier', 'Type-C charging for all seats', 'Mountain driving certified']
        : ['独立航空按摩座椅', '夏普净离子空气净化器', '每座配备 Type-C 充电口', '山区陡坡驾驶专业培训'],
      img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      badge: currentLang === 'TH' ? 'สายแอ่วเหนือการันตี' : currentLang === 'EN' ? 'Northern Route Expert' : '泰北路线专精',
      badgeColor: 'text-emerald-300 bg-slate-900/90 border-emerald-500/30'
    },
    {
      id: 3,
      name: currentLang === 'TH' ? 'Eastern Coast Premium Shuttle' : currentLang === 'EN' ? 'Eastern Coast Premium Shuttle' : '东海岸优质商务接送',
      province: 'ชลบุรี',
      category: currentLang === 'TH' ? 'VIP Commuter 10 ที่นั่ง' : currentLang === 'EN' ? 'VIP Commuter 10 Seats' : 'VIP 商务车 10座',
      route: currentLang === 'TH' ? 'กรุงเทพฯ ➔ ชลบุรี / พัทยา / ระยอง' : currentLang === 'EN' ? 'Bangkok ➔ Chonburi / Pattaya / Rayong' : '曼谷 ➔ 春武里 / 芭提雅 / 罗勇',
      price: '฿2,500',
      period: currentLang === 'TH' ? '/ วัน' : currentLang === 'EN' ? '/ Day' : '/ 天',
      rating: '4.88',
      reviews: '215',
      features: currentLang === 'TH'
        ? ['รับ-ส่งถึงล็อบบี้โรงแรม/สนามบิน', 'ชุดเครื่องเสียงคาราโอเกะ Hi-End', 'ประกันอุบัติเหตุคุ้มครองทุกที่นั่ง', 'ฟรีค่าน้ำมันและค่าผ่านทางด่วน']
        : currentLang === 'EN'
        ? ['Hotel/Airport lobby pickup', 'Hi-End Karaoke sound system', 'Full passenger accident insurance', 'Free fuel and expressway toll']
        : ['酒店/机场大堂无缝接送', '高端卡拉OK音响系统', '全座位意外伤害保险', '含油费及高速公路通行费'],
      img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      badge: currentLang === 'TH' ? 'ยอดจองสูงสุดสัปดาห์นี้' : currentLang === 'EN' ? 'Most Booked This Week' : '本周预订量最高',
      badgeColor: 'text-sky-300 bg-slate-900/90 border-sky-500/30'
    },
    {
      id: 4,
      name: currentLang === 'TH' ? 'Siam Heritage Tour Fleet' : currentLang === 'EN' ? 'Siam Heritage Tour Fleet' : '暹罗遗产文化包车',
      province: 'พระนครศรีอยุธยา',
      category: currentLang === 'TH' ? 'VIP Van 10 ที่นั่ง' : currentLang === 'EN' ? 'VIP Van 10 Seats' : 'VIP 商务车 10座',
      route: currentLang === 'TH' ? 'กรุงเทพฯ ➔ อยุธยา ไหว้พระ 9 วัด' : currentLang === 'EN' ? 'Bangkok ➔ Ayutthaya Temple Tour' : '曼谷 ➔ 大城府寺庙祈福游',
      price: '฿2,200',
      period: currentLang === 'TH' ? '/ วัน' : currentLang === 'EN' ? '/ Day' : '/ 天',
      rating: '4.92',
      reviews: '86',
      features: currentLang === 'TH'
        ? ['ไกด์ท้องถิ่นบรรยายกึ่งส่วนตัว', 'น้ำดื่มเย็นและผ้าเย็นบริการตลอดทาง', 'ฟรีจุดถ่ายรูปแลนด์มาร์กประวัติศาสตร์']
        : currentLang === 'EN'
        ? ['Semi-private local guide', 'Cold drinks and towels provided', 'Free historical landmark photo stops']
        : ['半私人导游服务', '全程提供冰饮及湿毛巾', '免费古迹地标拍照点'],
      img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
      badge: currentLang === 'TH' ? 'ทริปไหว้พระยอดฮิต' : currentLang === 'EN' ? 'Best Cultural Tour' : '最佳文化祈福游',
      badgeColor: 'text-rose-300 bg-slate-900/90 border-rose-500/30'
    }
  ];

  const filteredTrips = featuredTripsData.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(tripSearchQuery.toLowerCase()) || 
                          trip.route.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
                          trip.province.toLowerCase().includes(tripSearchQuery.toLowerCase());
    const matchesProvince = selectedProvinceFilter === 'ALL' || trip.province === selectedProvinceFilter;
    return matchesSearch && matchesProvince;
  });

  const partnersData = [
    {
      id: 1,
      name: 'Siam VIP Van Express',
      province: currentLang === 'TH' ? 'กรุงเทพฯ & ภาคกลาง' : currentLang === 'EN' ? 'Bangkok & Central' : '曼谷及中部',
      rating: '4.98',
      tripsCompleted: '1,450+',
      fleetSize: currentLang === 'TH' ? '18 คัน' : currentLang === 'EN' ? '18 Units' : '18 辆',
      specialty: currentLang === 'TH' ? 'รถตู้ VIP แต่งพิเศษ เบาะนวดไฟฟ้า พรีเมียม' : currentLang === 'EN' ? 'Custom VIP Van with massage seats' : '定制 VIP 商务车 按摩座椅',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      badge: 'Certified Partner'
    },
    {
      id: 2,
      name: 'Lanna Mountain Tour & Fleet',
      province: currentLang === 'TH' ? 'เชียงใหม่ & ภาคเหนือ' : currentLang === 'EN' ? 'Chiang Mai & North' : '清迈及北部',
      rating: '4.95',
      tripsCompleted: '980+',
      fleetSize: currentLang === 'TH' ? '12 คัน' : currentLang === 'EN' ? '12 Units' : '12 辆',
      specialty: currentLang === 'TH' ? 'ชำนาญเส้นทางขึ้นเขา ดอยอินทนนท์ ดอยสุเทพ' : currentLang === 'EN' ? 'Expert in mountain routes & Doi Inthanon' : '精通山区及因他农山路线',
      img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      badge: 'Top Rated 2026'
    },
    {
      id: 3,
      name: 'Andaman Blue Sea Transport',
      province: currentLang === 'TH' ? 'ภูเก็ต & ภาคใต้' : currentLang === 'EN' ? 'Phuket & South' : '普吉及南部',
      rating: '4.92',
      tripsCompleted: '1,120+',
      fleetSize: currentLang === 'TH' ? '15 คัน' : currentLang === 'EN' ? '15 Units' : '15 辆',
      specialty: currentLang === 'TH' ? 'รับส่งสนามบินภูเก็ต ทัวร์เกาะ และคณะ VIP' : currentLang === 'EN' ? 'Phuket airport transfer & island tours' : '普吉机场接送与海岛游',
      img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
      badge: 'Verified Expert'
    },
    {
      id: 4,
      name: 'Khon Kaen Isan VIP Fleet',
      province: currentLang === 'TH' ? 'ขอนแก่น & ภาคอีสาน' : currentLang === 'EN' ? 'Khon Kaen & Isan' : '孔敬及东北部',
      rating: '4.90',
      tripsCompleted: '760+',
      fleetSize: currentLang === 'TH' ? '10 คัน' : currentLang === 'EN' ? '10 Units' : '10 辆',
      specialty: currentLang === 'TH' ? 'บริการรับส่งประชุมสัมมนา ทัวร์อีสานตอนบน' : currentLang === 'EN' ? 'Corporate seminars & Upper Isan tours' : '商务会议与泰国东北部包车',
      img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      badge: 'Isan Region Leader'
    }
  ];

  const popularDestinationsData = [
    { 
      name: currentLang === 'EN' ? 'Chiang Mai' : currentLang === 'CN' ? '清迈 (Chiang Mai)' : 'เชียงใหม่ (Chiang Mai)', 
      provinceId: 'เชียงใหม่',
      tag: currentLang === 'EN' ? 'Mist & Mountain' : currentLang === 'CN' ? '雾海 山脉' : 'หมอก ดอย คาเฟ่', 
      priceStart: '฿2,800',
      trips: currentLang === 'EN' ? '35+ Vans Available' : currentLang === 'CN' ? '35+ 辆车可用' : '35+ คันพร้อมรับงาน',
      img: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: currentLang === 'EN' ? 'Phuket' : currentLang === 'CN' ? '普吉岛 (Phuket)' : 'ภูเก็ต (Phuket)', 
      provinceId: 'ภูเก็ต',
      tag: currentLang === 'EN' ? 'Andaman Island' : currentLang === 'CN' ? '安达曼海岛' : 'อันดามัน เที่ยวเกาะ', 
      priceStart: '฿3,200',
      trips: currentLang === 'EN' ? '28+ Vans Available' : currentLang === 'CN' ? '28+ 辆车可用' : '28+ คันพร้อมรับงาน',
      img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: currentLang === 'EN' ? 'Pattaya - Chonburi' : currentLang === 'CN' ? '芭提雅 - 春武里' : 'พัทยา - ชลบุรี (Pattaya)', 
      provinceId: 'ชลบุรี',
      tag: currentLang === 'EN' ? 'Beach Getaway' : currentLang === 'CN' ? '海滨度假' : 'ใกล้กรุง พักผ่อน', 
      priceStart: '฿2,200',
      trips: currentLang === 'EN' ? '45+ Vans Available' : currentLang === 'CN' ? '45+ 辆车可用' : '45+ คันพร้อมรับงาน',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: currentLang === 'EN' ? 'Kanchanaburi' : currentLang === 'CN' ? '北碧府 (Kanchanaburi)' : 'กาญจนบุรี (Kanchanaburi)', 
      provinceId: 'กาญจนบุรี',
      tag: currentLang === 'EN' ? 'Nature & River' : currentLang === 'CN' ? '自然 母亲河' : 'ธรรมชาติ แควใหญ่', 
      priceStart: '฿2,400',
      trips: currentLang === 'EN' ? '20+ Vans Available' : currentLang === 'CN' ? '20+ 辆车可用' : '20+ คันพร้อมรับงาน',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      name: currentLang === 'EN' ? 'Krabi' : currentLang === 'CN' ? '甲米 (Krabi)' : 'กระบี่ (Krabi)', 
      provinceId: 'กระบี่',
      tag: currentLang === 'EN' ? 'Emerald Pool' : currentLang === 'CN' ? '翡翠池 岛屿' : 'ทะเลแหวก สระมรกต', 
      priceStart: '฿3,400',
      trips: currentLang === 'EN' ? '18+ Vans Available' : currentLang === 'CN' ? '18+ 辆车可用' : '18+ คันพร้อมรับงาน',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' 
    }
  ];

  const filteredDestinations = popularDestinationsData.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(destSearchQuery.toLowerCase()) || 
                          dest.tag.toLowerCase().includes(destSearchQuery.toLowerCase()) ||
                          dest.provinceId.toLowerCase().includes(destSearchQuery.toLowerCase());
    const matchesProvince = selectedDestProvinceFilter === 'ALL' || dest.provinceId === selectedDestProvinceFilter;
    return matchesSearch && matchesProvince;
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      type: 'charter',
      origin: originProvince,
      dest: destProvince,
      depDate: departureDate,
      time: departureTime,
      ...(returnDate && { retDate: returnDate }),
      spot: pickupSpot,
      car: carType,
      pax: passengersCount
    });

    router.push(`/search-results?${queryParams.toString()}`);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setIsQuoteModalOpen(false);
      setQuoteTripDetail('');
      setQuoteBudget('');
      setQuoteCarQty(1);
      alert(currentLang === 'TH' ? 'ระบบบันทึกคำขอใบเสนอราคาของคุณเรียบร้อยแล้ว คนขับในพื้นที่จะเสนอราคาผ่านช่องทางบัญชีผู้ใช้ของคุณครับ' : 'Your quotation request has been saved successfully!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden w-full">

      {/* --- 1. HEADER NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 transition-all w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline tracking-tight">
                <span className="text-lg sm:text-2xl font-black text-white">VanPro</span>
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent ml-0.5">TH</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>VIP Van Fleet</span>
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700/80 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{currentLang}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 py-1.5 z-50 overflow-hidden">
                  {[
                    { code: 'TH', label: '🇹🇭 ไทย' },
                    { code: 'EN', label: '🇬🇧 English' },
                    { code: 'CN', label: '🇨🇳 中文' }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setCurrentLang(item.code); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-700/85 transition-colors cursor-pointer ${currentLang === item.code ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-300'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer shrink-0"
            >
              <Users className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden xs:inline">{currentLang === 'TH' ? 'เข้าสู่ระบบ' : currentLang === 'CN' ? '登录' : 'Login'}</span>
            </button>

            <Link
              href="/vendor/dashboard"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center gap-1.5 shrink-0"
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>พาร์ทเนอร์</span>
            </Link>

          </div>
        </div>
      </header>

      {/* --- 2. HERO SECTION & ADVANCED SEARCH ENGINE --- */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-28 overflow-hidden w-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[350px] blur-[150px] rounded-full pointer-events-none -z-10 transition-colors duration-500 bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-sky-400/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="text-center max-w-4xl mx-auto mb-10">
            
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl mb-6 group h-48 sm:h-64 flex flex-col items-center justify-center p-4 sm:p-6 text-center w-full">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80" 
                alt="VanPro Thailand Fleet Banner" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10 space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-slate-900/90 border border-sky-500/40 text-sky-300 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-extrabold shadow-xl shadow-blue-950/50 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin" />
                  <span className="tracking-wide">{t.bannerHighlightTitle}</span>
                </div>

                <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md px-2">
                  {t.heroTitle1} <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                    {t.heroTitle2}
                  </span>
                </h1>

                <p className="text-slate-300 text-[11px] sm:text-sm font-medium tracking-wide">
                  {t.bannerHighlightSub}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-3xl mx-auto font-normal text-center px-2">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6">
              <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 sm:px-4 py-2 rounded-2xl text-[11px] sm:text-xs font-bold text-slate-200 shadow-md backdrop-blur-sm">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>{t.trustBadge1}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 sm:px-4 py-2 rounded-2xl text-[11px] sm:text-xs font-bold text-slate-200 shadow-md backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                <span>{t.trustBadge2}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-3 sm:px-4 py-2 rounded-2xl text-[11px] sm:text-xs font-bold text-slate-200 shadow-md backdrop-blur-sm">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>{t.trustBadge3}</span>
              </div>
            </div>
          </div>

          {/* ADVANCED SEARCH BOX CARD */}
          <div className="max-w-5xl mx-auto bg-slate-800/90 backdrop-blur-2xl p-4 sm:p-9 rounded-3xl border border-blue-500/30 shadow-2xl shadow-black/70 transition-all duration-300 w-full">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
              
              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t.labelPickupSpot}</span>
                </label>
                <input
                  type="text"
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  placeholder={t.placeholderPickupSpot}
                  className="w-full px-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t.labelOrigin}</span>
                </label>
                <CustomLocationInput
                  value={originProvince}
                  onChange={setOriginProvince}
                  options={allProvinces}
                  placeholder={t.placeholderOrigin}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{t.labelDest}</span>
                </label>
                <CustomLocationInput
                  value={destProvince}
                  onChange={setDestProvince}
                  options={destOptions}
                  placeholder={t.placeholderDest}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{t.labelDepDate} & {t.labelDepTime}</span>
                </label>
                <div className="grid grid-cols-5 gap-2 relative">
                  <div className="col-span-3 relative flex items-center cursor-pointer group">
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                    />
                    <div className="w-full px-3 py-3.5 bg-slate-900/90 border border-slate-700 group-hover:border-sky-400 rounded-2xl text-xs sm:text-sm font-semibold text-white flex items-center justify-between shadow-inner transition-colors pointer-events-none">
                      <span className={departureDate ? 'text-white' : 'text-slate-400'}>
                        {formatDateDisplay(departureDate)}
                      </span>
                      <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                    </div>
                  </div>

                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="col-span-2 px-1 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-sky-400 transition-colors [color-scheme:dark] shadow-inner text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2">
                  {t.labelRetDate}
                </label>
                <div className="relative flex items-center cursor-pointer group">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        (e.target as HTMLInputElement).showPicker();
                      } catch (err) {}
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                  />
                  <div className="w-full px-4.5 py-3.5 bg-slate-900/90 border border-slate-700 group-hover:border-sky-400 rounded-2xl text-xs sm:text-sm font-semibold text-white flex items-center justify-between shadow-inner transition-colors pointer-events-none">
                    <span className={returnDate ? 'text-white' : 'text-slate-400'}>
                      {formatDateDisplay(returnDate)}
                    </span>
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-white mb-1.5 sm:mb-2 flex items-center justify-between">
                  <span>{t.labelCarType} & {t.labelPassengers}</span>
                  <span className="text-[11px] text-sky-400 font-bold">{t.labelWithDriver}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="px-2 sm:px-3 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-base font-semibold text-white focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
                  >
                    <option value="ALL">{currentLang === 'TH' ? 'ทุกประเภทรถ' : currentLang === 'CN' ? '所有车型' : 'All Types'}</option>
                    <option value="Sedan">{currentLang === 'TH' ? 'รถเก๋ง' : currentLang === 'CN' ? '轿车' : 'Sedan'}</option>
                    <option value="SUV">{currentLang === 'TH' ? 'SUV' : currentLang === 'CN' ? 'SUV' : 'SUV'}</option>
                    <option value="Van">{currentLang === 'TH' ? 'รถตู้' : currentLang === 'CN' ? '商务车' : 'Van'}</option>
                    <option value="VIP_Van">{currentLang === 'TH' ? 'รถตู้ VIP' : currentLang === 'CN' ? 'VIP 商务车' : 'VIP Van'}</option>
                  </select>
                  <select
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(e.target.value)}
                    className="px-2 sm:px-3 py-3.5 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs sm:text-base font-semibold text-white focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={String(num)}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5 pt-4 sm:pt-5 border-t border-slate-700/70">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs sm:text-sm font-bold text-sky-300 bg-sky-950/70 hover:bg-sky-900/90 border border-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{t.btnQuote}</span>
              </button>

              <button
                onClick={handleSearch}
                className="w-full sm:w-auto text-white px-8 py-4 rounded-2xl text-xs sm:text-sm font-black shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>{t.btnSearch}</span>
                <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* --- 3. SECTION: FEATURED TRIPS --- */}
      <section className="py-16 sm:py-20 bg-slate-950/70 border-t border-slate-800/80 relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-950 to-blue-950 border border-sky-500/30 text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-inner">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{t.sectionTripBadge}</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {currentLang === 'TH' ? 'เก็บกระเป๋าแล้วไปกัน! ' : currentLang === 'CN' ? '收拾行李出发！' : 'Pack & Go! '} 
                <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                  {currentLang === 'TH' ? 'ทริปยอดฮิตที่ใครก็เลือก' : currentLang === 'CN' ? '热门精选行程' : 'Most Loved Tours'}
                </span>
              </h2>
              <p className="text-xs sm:text-base text-slate-300 mt-2 font-normal">
                {t.sectionTripDesc}
              </p>
            </div>
            
            <Link 
              href="/search-results" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 transition-all group shrink-0"
            >
              <span>{t.sectionTripLink}</span> 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-slate-800 shadow-xl mb-10 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-sky-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={tripSearchQuery}
                  onChange={(e) => setTripSearchQuery(e.target.value)}
                  placeholder={t.searchTripPlaceholder}
                  className="w-full pl-12 pr-10 py-3 bg-slate-950/80 border border-slate-800 focus:border-sky-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                />
                {tripSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setTripSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-0.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="ล้างข้อมูล"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <div className="flex items-center absolute left-4 top-3.5 pointer-events-none text-sky-400">
                  <Filter className="w-4 h-4" />
                </div>
                <select
                  value={selectedProvinceFilter}
                  onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-sky-400 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none transition-colors shadow-inner appearance-none cursor-pointer"
                >
                  <option value="ALL">📍 {t.filterAllProvinces}</option>
                  {allProvinces.map((p) => (
                    <option key={`filter-prov-${p.id}`} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredTrips.length > 0 ? (
            <AutoFadeCarousel 
              items={filteredTrips} 
              renderItem={(item) => (
                <div className="group bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-sky-500/50 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-800">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                      <div className={`absolute top-4 left-4 backdrop-blur-md border text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg ${item.badgeColor}`}>
                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                        <span>{item.badge}</span>
                      </div>

                      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-black text-sm">{item.rating}</span>
                        <span className="text-slate-400 text-xs font-normal">({item.reviews})</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-7">
                      <div className="inline-block bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-bold px-3 py-1 rounded-xl">
                        {item.category}
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white mt-2.5 mb-1.5 group-hover:text-sky-300 transition-colors leading-snug">
                        {item.name}
                      </h3>

                      <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 mb-5">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="truncate">{item.route}</span>
                      </p>

                      <div className="space-y-2 border-t border-slate-800/90 pt-4">
                        {item.features.map((feat: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3">
                    <div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase font-extrabold tracking-wider">
                        {currentLang === 'TH' ? 'ราคาเหมาเริ่มต้น' : currentLang === 'CN' ? '包车起步价' : 'Starting Charter Price'}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl sm:text-3xl font-black bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                          {item.price}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 font-semibold">{item.period}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/search-results?origin=กรุงเทพฯ&dest=ALL`)}
                      className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                    >
                      <span>{currentLang === 'TH' ? 'จองทันที' : currentLang === 'CN' ? '立即预订' : 'Book Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">
                {currentLang === 'TH' ? 'ไม่พบทริปท่องเที่ยวที่ตรงกับการค้นหาของคุณ' : currentLang === 'CN' ? '未找到符合您搜索条件的行程' : 'No trips match your search.'}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* --- 4. SECTION: พาร์ทเนอร์รถตู้ VIP --- */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-900 relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-950 border border-sky-500/30 text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-inner">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.sectionPartnerBadge}</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {t.sectionPartnerTitle}
              </h2>
              <p className="text-xs sm:text-base text-slate-300 mt-2 max-w-2xl font-normal">
                {t.sectionPartnerDesc}
              </p>
            </div>
            
            <Link 
              href="/partners" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 transition-all group shrink-0"
            >
              <span>{currentLang === 'TH' ? 'ดูพาร์ทเนอร์ทั้งหมด' : 'View All Partners'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <AutoFadeCarousel 
            items={partnersData}
            renderItem={(partner) => (
              <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between p-5 sm:p-7 h-full">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="bg-sky-950 border border-sky-800/60 text-sky-300 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                      {partner.badge}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{partner.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 mb-3.5">
                    <img 
                      src={partner.img} 
                      alt={partner.name} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-white truncate">{partner.name}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{partner.province}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80 mb-4">
                    ✨ {partner.specialty}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Fleet Size</span>
                    <span className="text-xs font-black text-white">{partner.fleetSize} ({partner.tripsCompleted})</span>
                  </div>

                  <button
                    onClick={() => alert(`ดูรายละเอียดพาร์ทเนอร์: ${partner.name}`)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูรายละเอียด</span>
                  </button>
                </div>
              </div>
            )}
          />

        </div>
      </section>

      {/* --- 5. POPULAR DESTINATIONS --- */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-900 relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-inner">
                <span>{t.sectionDestBadge}</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {t.sectionDestTitle}
              </h2>
              <p className="text-xs sm:text-base text-slate-300 mt-2 max-w-2xl font-normal">
                {t.sectionDestDesc}
              </p>
            </div>
            
            <Link 
              href="/search-results" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 transition-all group shrink-0"
            >
              <span>{t.sectionDestLink}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-slate-800 shadow-xl mb-10 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-sky-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  placeholder={t.searchDestPlaceholder}
                  className="w-full pl-12 pr-10 py-3 bg-slate-900 border border-slate-800 focus:border-sky-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                />
                {destSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDestSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-0.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="ล้างข้อมูล"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <div className="flex items-center absolute left-4 top-3.5 pointer-events-none text-sky-400">
                  <Filter className="w-4 h-4" />
                </div>
                <select
                  value={selectedDestProvinceFilter}
                  onChange={(e) => setSelectedDestProvinceFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-sky-400 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none transition-colors shadow-inner appearance-none cursor-pointer"
                >
                  <option value="ALL">📍 {t.filterAllProvinces}</option>
                  {allProvinces.map((p) => (
                    <option key={`filter-dest-prov-${p.id}`} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredDestinations.length > 0 ? (
            <AutoFadeCarousel 
              items={filteredDestinations}
              renderItem={(dest) => (
                <div
                  onClick={() => router.push(`/search-results?origin=กรุงเทพฯ&dest=${encodeURIComponent(dest.provinceId)}`)}
                  className="group relative h-[360px] sm:h-[380px] rounded-3xl overflow-hidden border border-slate-800 hover:border-sky-500/60 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 flex flex-col justify-between p-5 sm:p-6 w-full"
                >
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 group-hover:via-slate-950/50 transition-colors"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-slate-900/85 backdrop-blur-md text-sky-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/70 shadow-md">
                      {dest.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block tracking-wider">
                        {currentLang === 'TH' ? 'ราคาเหมาวันเริ่มต้น' : currentLang === 'CN' ? '包车一日游起步价' : 'Daily Charter From'} {dest.priceStart}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 group-hover:text-sky-300 transition-colors">
                        {dest.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-sky-400" />
                        {dest.trips}
                      </span>
                      <span className="text-sky-400 font-bold group-hover:underline">
                        {currentLang === 'TH' ? 'จองรถด่วน' : currentLang === 'CN' ? '立即预订' : 'Quick Book'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">
                {currentLang === 'TH' ? 'ไม่พบแหล่งท่องเที่ยวที่ตรงกับการค้นหาของคุณ' : currentLang === 'CN' ? '未找到符合您搜索条件的目的地' : 'No destinations match your search.'}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* --- 6. SHOWCASE BANNER --- */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-950 relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[350px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl p-6 sm:p-12 lg:p-16 w-full">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/70 to-sky-900/50 border border-sky-500/30 text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-inner">
                  <Bus className="w-4 h-4 text-sky-400" />
                  <span>VIP Van Rental & Thailand Exclusive Tour</span>
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-snug tracking-tight">
                  <span className="block">{t.bannerTitle1}</span>
                  <span className="block mt-1.5 bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                    {t.bannerTitle2}
                  </span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                  {t.bannerDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="p-2.5 bg-blue-500/10 text-sky-400 rounded-xl shrink-0">
                      <Armchair className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.bannerFeat1Title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.bannerFeat1Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.bannerFeat2Title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.bannerFeat2Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.bannerFeat3Title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.bannerFeat3Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.bannerFeat4Title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.bannerFeat4Desc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{t.btnQuoteTour}</span>
                  </button>

                  <button
                    onClick={() => router.push('/search-results?origin=กรุงเทพฯ&dest=ALL')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.btnExploreFleet}</span>
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                  </button>
                </div>

              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl relative h-72 sm:h-96">
                    <img 
                      src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80" 
                      alt="Thailand VIP Tour and Van Travel" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3.5 sm:p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-sky-400 block">{t.bannerSubBadge}</span>
                        <span className="text-xs sm:text-sm font-black text-white">{t.bannerSubText}</span>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-sky-400 font-black text-xs">
                        77+
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- 7. FOOTER --- */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <p>{t.footerText}</p>
        </div>
      </footer>

      {/* --- 8. MODERN LOGIN MODAL POPUP --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
            
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">{t.loginTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.loginSubtitle}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert(`Login: ${identifier}`); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t.loginPlaceholder}
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="081-xxx-xxxx"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    {t.loginPass}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] cursor-pointer"
              >
                {t.loginBtn}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              {t.loginFooter}{' '}
              <button onClick={() => alert("Register")} className="text-sky-400 font-bold hover:underline cursor-pointer">
                {t.loginRegister}
              </button>
            </p>

          </div>
        </div>
      )}

      {/* --- 9. REQUEST QUOTATION & BIDDING MODAL --- */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 max-h-[95vh] overflow-y-auto no-scrollbar">
            
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3.5">
              <div className="inline-flex items-center gap-1.5 bg-sky-950 border border-sky-800/60 text-sky-400 px-3 py-1 rounded-full text-[11px] font-bold mb-1">
                <FileSpreadsheet className="w-3 h-3" />
                <span>Smart Bidding & Custom Tour</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">{t.quoteModalTitle}</h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
                {t.quoteModalDesc}
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-3">
              
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5">
                
                <div>
                  <label className="block text-xs font-bold text-sky-400 mb-1 uppercase tracking-wide">
                    {t.quoteOrigin}
                  </label>
                  <CustomLocationInput
                    value={modalOrigin}
                    onChange={setModalOrigin}
                    options={allProvinces}
                    placeholder={t.placeholderOrigin}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wide">
                      {t.quoteDest}
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalDestinations([...modalDestinations, ''])}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-800/60 transition-all"
                    >
                      <Plus className="w-3 h-3" /> {t.quoteAddStop}
                    </button>
                  </div>

                  {modalDestinations.map((dest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold w-12 shrink-0"># {index + 1}</span>
                      <div className="w-full">
                        <CustomLocationInput
                          value={dest}
                          onChange={(val) => {
                            const updated = [...modalDestinations];
                            updated[index] = val;
                            setModalDestinations(updated);
                          }}
                          options={allProvinces}
                          placeholder={t.placeholderDest}
                        />
                      </div>

                      {modalDestinations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setModalDestinations(modalDestinations.filter((_, i) => i !== index))}
                          className="p-2 text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-950 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                    {t.labelDepDate}
                  </label>
                  <div className="relative flex items-center cursor-pointer group">
                    <input
                      type="date"
                      required
                      value={quoteDepDate}
                      onChange={(e) => setQuoteDepDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                    />
                    <div className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 group-hover:border-sky-400 rounded-xl text-xs sm:text-sm text-white flex items-center justify-between transition-colors pointer-events-none">
                      <span className={quoteDepDate ? 'text-white' : 'text-slate-400'}>
                        {formatDateDisplay(quoteDepDate)}
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                    {t.labelRetDate}
                  </label>
                  <div className="relative flex items-center cursor-pointer group">
                    <input
                      type="date"
                      value={quoteRetDate}
                      onChange={(e) => setQuoteRetDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                    />
                    <div className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 group-hover:border-sky-400 rounded-xl text-xs sm:text-sm text-white flex items-center justify-between transition-colors pointer-events-none">
                      <span className={quoteRetDate ? 'text-white' : 'text-slate-400'}>
                        {formatDateDisplay(quoteRetDate)}
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                    {t.quoteCarType}
                  </label>
                  <select
                    value={quoteCarType}
                    onChange={(e) => setQuoteCarType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs sm:text-sm font-medium text-white focus:outline-none"
                  >
                    <option value="Sedan">{currentLang === 'TH' ? 'รถเก๋ง' : currentLang === 'CN' ? '轿车' : 'Sedan'}</option>
                    <option value="SUV">{currentLang === 'TH' ? 'SUV' : currentLang === 'CN' ? 'SUV' : 'SUV'}</option>
                    <option value="Van">{currentLang === 'TH' ? 'รถตู้' : currentLang === 'CN' ? '商务车' : 'Van'}</option>
                    <option value="VIP_Van">{currentLang === 'TH' ? 'รถตู้ VIP' : currentLang === 'CN' ? 'VIP 商务车' : 'VIP Van'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                    {t.quotePassengers}
                  </label>
                  <select
                    value={quotePassengers}
                    onChange={(e) => setQuotePassengers(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs sm:text-sm font-medium text-white focus:outline-none"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={String(num)}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                  {t.labelCarQuantity}
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setQuoteCarQty(Math.max(1, quoteCarQty - 1))}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-l-xl border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quoteCarQty}
                    onChange={(e) => setQuoteCarQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full py-2 bg-slate-950/70 border-y border-slate-800 text-center text-xs sm:text-sm font-semibold text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuoteCarQty(quoteCarQty + 1)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-r-xl border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                  {t.quoteSpecialReq}
                </label>
                <textarea
                  rows={2}
                  required
                  value={quoteTripDetail}
                  onChange={(e) => setQuoteTripDetail(e.target.value)}
                  placeholder="..."
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1">
                  {t.quoteBudget}
                </label>
                <input
                  type="text"
                  value={quoteBudget}
                  onChange={(e) => setQuoteBudget(e.target.value)}
                  placeholder="15,000"
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 focus:border-sky-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={quoteSubmitted}
                className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {quoteSubmitted ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.quoteSubmit}</span>
                  </>
                )}
              </button>

            </form>

            <p className="text-[10px] text-center text-slate-400 mt-2.5">
              {t.quoteSecurity}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
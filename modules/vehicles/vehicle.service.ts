// ไฟล์: modules/vehicles/vehicle.service.ts
export interface VehicleOption {
  id: string;
  vendorName: string;
  vehicleType: string; // เช่น รถเก๋ง, SUV, รถตู้ VIP
  price: number;
  rating: number;      // เรตติ้งดาว (เช่น 4.9)
  distanceKm: number;  // ระยะห่างจากจุดรับของลูกค้า
  routes: string[];    // เส้นทางที่รองรับ เช่น ["BKK-Pattaya", "BKK-ChiangMai"]
}

// ฟังก์ชันกรองและจัดลำดับรถตามเงื่อนไขที่ลูกค้าต้องการ
export function sortVehicleOptions(
  vehicles: VehicleOption[], 
  sortBy: 'distance' | 'rating' | 'price'
): VehicleOption[] {
  return vehicles.sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distanceKm - b.distanceKm; // เรียงจากตัวที่อยู่ใกล้ที่สุดมาก่อน
    } else if (sortBy === 'rating') {
      return b.rating - a.rating; // เรียงจากเรตติ้งดาวสูงสุดมาก่อน
    } else {
      return a.price - b.price; // เรียงจากราคาถูกที่สุดมาก่อน
    }
  });
}
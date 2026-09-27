// ไฟล์: modules/db/database.ts
import { UserProfile } from '../auth/auth.service';
import { VehicleOption } from '../vehicles/vehicle.service';
import { CustomTripRequest, VendorQuotation } from '../bidding/bidding.service';
import { TripWorkflowState } from '../bidding/workflow.service';

class MockDatabase {
  // ข้อมูลผู้ใช้งานจำลอง 4 ฝั่ง
  users: UserProfile[] = [
    { userId: 'u1', name: 'คุณลูกค้า สมชาย', role: 'customer', email: 'customer@test.com' },
    { userId: 'v1', name: 'พี่สมชายรถตู้', role: 'vehicle_owner', email: 'vendor1@test.com' },
    { userId: 'a1', name: 'โรงแรมพัทยาดี', role: 'agent', email: 'agent1@test.com' },
    { userId: 'p1', name: 'แอดมินแพลตฟอร์ม', role: 'platform', email: 'admin@test.com' },
  ];

  // ข้อมูลรถเช่าในระบบ
  vehicles: VehicleOption[] = [
    { id: '1', vendorName: 'พี่สมชายรถตู้', vehicleType: 'รถตู้ VIP', price: 2500, rating: 4.8, distanceKm: 3.5, routes: ['BKK-Pattaya'] },
    { id: '2', vendorName: 'เจ๊ Aom Car Rental', vehicleType: 'รถเก๋ง SUV', price: 1500, rating: 4.9, distanceKm: 1.2, routes: ['BKK-HuaHin'] },
  ];

  // ข้อมูลทริปตามใจฉัน, ใบเสนอราคา และสถานะเวิร์กโฟลว์
  tripRequests: CustomTripRequest[] = [];
  quotations: VendorQuotation[] = [];
  workflows: TripWorkflowState[] = [];
}

// สร้าง Instance กลางสำหรับแชร์ข้อมูลทั่วทั้งแอปพลิเคชัน
export const db = new MockDatabase();
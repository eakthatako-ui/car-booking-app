// ไฟล์: modules/auth/auth.service.ts
export type UserRole = 'customer' | 'vehicle_owner' | 'agent' | 'platform';

export interface UserProfile {
  userId: string;
  name: string;
  role: UserRole;
  email: string;
}

// ฟังก์ชันจำลองการตรวจสอบสิทธิ์เข้าใช้งานตาม 4 ฝั่งในตลาดของเรา
export function checkUserPermission(role: UserRole, action: string): boolean {
  switch (role) {
    case 'customer':
      return ['search_vehicle', 'book_trip', 'request_custom_trip'].includes(action);
    case 'vehicle_owner':
      return ['manage_vehicles', 'submit_quote', 'view_payout'].includes(action);
    case 'agent':
      return ['recommend_attraction', 'track_commission'].includes(action);
    case 'platform':
      return ['manage_all', 'view_revenue_report'].includes(action);
    default:
      return false;
  }
}
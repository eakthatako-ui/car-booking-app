// ไฟล์: modules/payments/split-payment.service.ts
export interface BookingPayment {
  totalAmount: number;         // ยอดเงินทั้งหมดที่ลูกค้าจ่าย (เช่น 1,500 บาท)
  agentCommissionRate: number; // เรทเปอร์เซ็นต์ของโรงแรม/ตัวแทน (เช่น 0.10 หรือ 10%)
  platformFeeRate: number;     // เรทเปอร์เซ็นต์ของแพลตฟอร์มเรา (เช่น 0.05 หรือ 5%)
}

export function calculateRevenueSplit(payment: BookingPayment) {
  const agentCommission = payment.totalAmount * payment.agentCommissionRate;
  const platformFee = payment.totalAmount * payment.platformFeeRate;
  const vendorPayout = payment.totalAmount - (agentCommission + platformFee);

  return {
    agentAmount: agentCommission,       // เงินโอนเข้ากระเป๋าโรงแรม/ตัวแทน
    platformAmount: platformFee,        // รายได้เข้าแพลตฟอร์มของเรา
    vendorPayoutAmount: vendorPayout    // เงินโอนให้เจ้าของรถ
  };
}
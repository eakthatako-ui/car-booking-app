// ไฟล์: modules/attractions/attraction.service.ts
export interface AttractionItem {
  id: string;
  province: string;
  title: string;
  imageUrl: string;
  submittedByVendorId: string;
  isApproved: boolean;
}

// ฟังก์ชันกรองสถานที่ท่องเที่ยวให้แสดงผลแบบไม่ซ้ำชื่อกัน
export function filterUniqueAttractions(attractions: AttractionItem[]): AttractionItem[] {
  const seenTitles = new Set<string>();
  return attractions.filter(item => {
    if (item.isApproved && !seenTitles.has(item.title)) {
      seenTitles.add(item.title);
      return true;
    }
    return false;
  });
}
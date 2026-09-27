// ไฟล์: modules/bidding/bidding.service.ts
export interface CustomTripRequest {
  tripId: string;
  customerId: string;
  route: string;       
  maxBudget: number;   
  createdAt: Date;
}

export interface VendorQuotation {
  quoteId: string;
  tripId: string;
  vendorId: string;
  quotedPrice: number;
  proposalDetails: string;
  createdAt: Date;
}

export function createTripRequest(customerId: string, route: string, maxBudget: number): CustomTripRequest {
  return {
    tripId: 'trip_' + Math.random().toString(36).substring(2, 9),
    customerId,
    route,
    maxBudget,
    createdAt: new Date(),
  };
}

export function submitVendorQuote(tripId: string, vendorId: string, quotedPrice: number, proposalDetails: string): VendorQuotation {
  return {
    quoteId: 'quote_' + Math.random().toString(36).substring(2, 9),
    tripId,
    vendorId,
    quotedPrice,
    proposalDetails,
    createdAt: new Date(),
  };
}
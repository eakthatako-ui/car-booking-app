// ไฟล์: modules/bidding/workflow.service.ts
import { CustomTripRequest, VendorQuotation } from './bidding.service';

export type TripWorkflowStatus = 'REQUESTED' | 'QUOTED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface TripWorkflowState {
  tripId: string;
  currentStatus: TripWorkflowStatus;
  selectedQuoteId?: string;
  updatedAt: Date;
}

// ฟังก์ชันอัปเดตสถานะขั้นตอนการจองและเสนอราคา
export function transitionTripStatus(
  currentState: TripWorkflowState, 
  action: 'SUBMIT_QUOTE' | 'ACCEPT_QUOTE' | 'COMPLETE_TRIP' | 'CANCEL'
): TripWorkflowState {
  let nextStatus = currentState.currentStatus;

  switch (action) {
    case 'SUBMIT_QUOTE':
      if (currentState.currentStatus === 'REQUESTED') nextStatus = 'QUOTED';
      break;
    case 'ACCEPT_QUOTE':
      if (currentState.currentStatus === 'QUOTED') nextStatus = 'ACCEPTED';
      break;
    case 'COMPLETE_TRIP':
      if (currentState.currentStatus === 'ACCEPTED') nextStatus = 'COMPLETED';
      break;
    case 'CANCEL':
      nextStatus = 'CANCELLED';
      break;
  }

  return {
    ...currentState,
    currentStatus: nextStatus,
    updatedAt: new Date()
  };
}
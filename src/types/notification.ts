export type NotificationType =
    | 'submission_success'
    | 'received'
    | 'under_review'
    | 'for_approval'
    | 'approved'
    | 'returned'
    | 'liquidation_required'
    | 'cancellation_submitted'
    | 'cancellation_approved'
    | 'comment';

export type RequestType = 'Cash Advance' | 'Non-Trade Payable' | 'Trade Payable' | 'Liquidation Report';

export interface Notification {
    id: string;
    type: NotificationType;
    requestType: RequestType;
    message: string;
    referenceNo?: string;
    timestamp: Date;
    reviewerRemarks?: string;
    commenterName?: string;
    comment?: string;
    requestId?: string; // For navigation
}
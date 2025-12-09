export type RequestStatus = 'Pending' | 'Returned' | 'Completed' | 'Rejected' | 'Cancelled' | 'Cancellation Requested';
export type LiquidationStatus = 'For Liquidation' | 'Pending' | 'Approved' | 'Returned' | 'Rejected' | 'Completed';

export type RequestType = 'Reimbursement' | 'Vendor Payment' | 'Cash Advance' | 'Travel Request' | 'Purchase Request' | 'Liquidation';

export interface Request {
    id: string;
    requestType: RequestType;
    dateRequested: string;
    description: string;
    amount: number;
    currency: 'PHP' | 'USD' | 'EUR';
    status: RequestStatus;
}


export interface LiquidationRequest {
    id: string;
    requestType: 'Cash Advance'; // Only Cash Advance in liquidation
    dateRequested: string;
    description: string;
    amount: number;
    currency: 'PHP' | 'USD' | 'EUR';
    status: LiquidationStatus;
}
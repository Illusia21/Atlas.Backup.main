export type RequestStatus = 'Pending' | 'Returned' | 'Completed' | 'Rejected' | 'Cancelled';

export type RequestType = 'Reimbursement' | 'Vendor Payment' | 'Cash Advance' | 'Travel Request' | 'Purchase Request';

export interface Request {
    id: string;
    requestType: RequestType;
    dateRequested: string;
    description: string;
    amount: string;
    currency: 'PHP' | 'USD' | 'EUR';
    status: RequestStatus;
}
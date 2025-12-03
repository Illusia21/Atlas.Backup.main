import type { DateRange } from 'react-day-picker';

export interface LineItem {
    id: string;
    category: string;
    activity: string;
    quantity: number;
    uom: string;
    price: number;
    amount: number;
}

export interface CAStep2Data {
    sourceOfFunds: string;
    costCenter: string;
    description: string;
    currency: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    lineItems: LineItem[];
    totalAmount: number;
}

export interface CAStep3Data {
    bankName: string;
    //swiftCode: string;
    swiftCode?: string; // Made optional to maintain type compatibility
    accountName: string;
    accountNumber: string;
    instructions: string;
}

export interface CAStep1Data {
    requestedBy: string;
    department: string;
}

export interface CashAdvanceRequest {
    step1: CAStep1Data;
    step2: CAStep2Data;
    step3: CAStep3Data;
    // step4, step5 will be added later
}
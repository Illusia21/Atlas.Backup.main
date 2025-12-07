import type { DateRange } from "react-day-picker";

export interface LiquidationLineItem {
    id: string;
    lineNumber: number;
    category: string;
    activityDescription: string;
    quantity: number;
    uom: string;
    price: number;
    amount: number;
}

export interface LiquidationStep1Data {
    sourceOfFunds: string;
    costCenter: string;
    descriptionPurpose: string;
    dateRange: DateRange | undefined;
    currency: 'PHP' | 'USD' | 'EUR';
    lineItems: LiquidationLineItem[];
}
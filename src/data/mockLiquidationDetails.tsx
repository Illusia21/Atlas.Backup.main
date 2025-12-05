import type { Comment, Attachment, Approver, JourneyStep } from './mockRequestDetails';

// Liquidation-specific line item (no Price column, just Amount)
export interface LiquidationLineItem {
    lineNumber: number;
    category: string;
    activityDescription: string;
    quantity: number;
    uom: string;
    price: number;
    amount: number;
}

// Liquidation-specific request details
export interface LiquidationRequestDetailsInfo {
    cashAdvanceForm: string; // Reference to original CA form
    descriptionPurpose: string;
    sourceOfFund: string;
    costCenter: string;
    dateRequested: string;
    dateNeeded: string;
    dateStart: string; // NEW: Liquidation-specific
    dateEnd: string;   // NEW: Liquidation-specific
}

// Liquidation-specific amount summary
export interface LiquidationAmountSummary {
    currency: string;
    totalAmount: number;
    cashAdvance: number;
    amountToReturn: number; // Can be negative (refund) or positive (return)
}

// Liquidation requester info
export interface LiquidationRequesterInfo {
    requestedBy: string;
    department: string;
}

// Full liquidation detail structure
export interface LiquidationDetail {
    id: string;
    referenceNumber: string; // e.g., LR2025-October-CCIS-00123
    formTitle: string; // "Liquidation Report"
    requestType: 'Cash Advance';
    dateRequested: string;
    description: string;
    amount: number;
    currency: string;
    status: 'For Liquidation' | 'Pending' | 'Approved' | 'Returned' | 'Rejected' | 'Completed';
    approver: Approver;
    comments: Comment[];
    attachments: Attachment[];
    journey: JourneyStep[];
    requesterInfo: LiquidationRequesterInfo;
    requestDetailsInfo: LiquidationRequestDetailsInfo;
    lineItems: LiquidationLineItem[];
    amountSummary: LiquidationAmountSummary;
}

// Mock liquidation details data
export const mockLiquidationDetails: Record<string, LiquidationDetail> = {
    'CA-2024-001': {
        id: 'CA-2024-001',
        referenceNumber: 'LR2025-October-CCIS-00123',
        formTitle: 'Liquidation Report',
        requestType: 'Cash Advance',
        dateRequested: 'October 3, 2025',
        description: 'Reimbursement of expenses for faculty training workshop on Artificial Intelligence in Education',
        amount: 18500.00,
        currency: 'PHP',
        status: 'For Liquidation',
        approver: {
            name: 'John Doe',
            role: 'Department Head',
            initials: 'JD',
        },
        comments: [
            {
                id: 'c1',
                author: 'John Doe',
                role: 'Role',
                timestamp: 'Oct 8, 2025 9:24am',
                text: 'Please revise the attached document',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Quotation.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a2',
                filename: 'MMCM-Invoice.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Submission',
                actor: 'Jervin Andoy',
                role: 'Requester',
                timestamp: 'Oct. 1, 2025 at 10:12 AM',
                action: 'In Progress',
                comment: 'Initial submission of liquidation report',
            },
            {
                id: 'j2',
                step: 'Department Head',
                actor: 'Jervin Andoy',
                role: 'Department Head',
                timestamp: 'Oct. 1, 2025 at 10:12 AM',
                action: 'In Progress',
                comment: 'Under department head review',
            },
        ],
        requesterInfo: {
            requestedBy: 'Aisha Nicole Dones',
            department: 'CCIS',
        },
        requestDetailsInfo: {
            cashAdvanceForm: 'RCA2025-October-CCIS-00123',
            descriptionPurpose: 'Reimbursement of expenses for faculty training workshop on Artificial Intelligence in Education',
            sourceOfFund: 'General Fund',
            costCenter: 'CCIS-2025-011',
            dateRequested: 'October 3, 2025',
            dateNeeded: 'October 19, 2025',
            dateStart: 'October 19, 2025',
            dateEnd: 'October 19, 2025',
        },
        lineItems: [
            {
                lineNumber: 1,
                category: 'Supplies',
                activityDescription: 'Workshop kits (notebooks, pens, USB drives)',
                quantity: 50,
                uom: 'Sets',
                price: 150.00,
                amount: 7500.00,
            },
            {
                lineNumber: 2,
                category: 'Meals',
                activityDescription: 'Snacks & drinks for participants',
                quantity: 50,
                uom: 'Pax',
                price: 120.00,
                amount: 6000.00,
            },
            {
                lineNumber: 3,
                category: 'Transport',
                activityDescription: 'Shuttle service for guest speakers',
                quantity: 2,
                uom: 'Trips',
                price: 2500.00,
                amount: 5000.00,
            },
        ],
        amountSummary: {
            currency: 'PHP',
            totalAmount: 18500.00,
            cashAdvance: 370.00,
            amountToReturn: 18130.00, // Positive = amount to return to company
        },
    },
};
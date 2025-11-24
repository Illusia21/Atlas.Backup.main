export interface Comment {
    id: string;
    author: string;
    role: string;
    timestamp: string;
    text: string;
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    filename: string;
    size: string;
    date: string;
    url: string;
    type: 'pdf' | 'doc' | 'xls' | 'jpg' | 'png';
}

export interface Approver {
    name: string;
    role: string;
    initials: string;
}

export interface JourneyStep {
    id: string;
    step: string;
    actor: string;
    role: string;
    timestamp: string;
    action: 'Submitted' | 'Approved' | 'Returned' | 'Rejected' | 'Cancelled' | 'Completed' | 'Pending';
    comment?: string;
}

// Line item for the request
export interface LineItem {
    lineNumber: number;
    category: string;
    activityDescription: string;
    quantity: number;
    uom: string;
    price: number;
    amount: number;
}

// Requester information
export interface RequesterInfo {
    requestedBy: string;
    department: string;
}

// Request details section
export interface RequestDetailsInfo {
    requestType: string;
    descriptionPurpose: string;
    sourceOfFund: string;
    costCenter: string;
    dateRequested: string;
    dateNeeded: string;
}

// Amount summary
export interface AmountSummary {
    currency: string;
    amount: number;
    serviceFee: number;
    ewtRate: number;
    ewtAmount: number;
    netTotalAmount: number;
}

// Payment Terms & Schedule
export interface PaymentTerms {
    modeOfPayment: string;
    termsOfPayment: string;
    taxRegistrationType: string;
    typeOfBusiness: string;
    po: string;
    pr: string;
    rr: string;
}

export interface RequestDetail {
    id: string;
    referenceNumber: string;
    formTitle: string;
    requestType: string;
    dateRequested: string;
    description: string;
    amount: string;
    currency: string;
    status: string;
    approver: Approver;
    comments: Comment[];
    attachments: Attachment[];
    journey: JourneyStep[];
    requesterInfo: RequesterInfo;
    requestDetailsInfo: RequestDetailsInfo;
    lineItems: LineItem[];
    amountSummary: AmountSummary;
    paymentTerms: PaymentTerms;
}

// Mock detailed request data
export const mockRequestDetails: Record<string, RequestDetail> = {
    // ID 1 - PENDING
    '1': {
        id: '1',
        referenceNumber: 'RFP2025-October-CCIS-00123',
        formTitle: 'Request for Payment',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses for Q1 client meeting',
        amount: '18,130.00',
        currency: 'PHP',
        status: 'Pending', // ← FIXED: Changed from 'Submitted' to 'Pending'
        approver: {
            name: 'John Doe',
            role: 'Department Head',
            initials: 'JD',
        },
        comments: [],
        attachments: [
            {
                id: 'a1',
                filename: 'File Title.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a2',
                filename: 'File Title.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a3',
                filename: 'File Title.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Aisha Nicole Dones',
                role: 'Requester',
                timestamp: 'Oct 3, 2025 3:45pm',
                action: 'Submitted',
                comment: 'Initial submission of reimbursement request',
            },
        ],
        requesterInfo: {
            requestedBy: 'Aisha Nicole Dones',
            department: 'CCIS',
        },
        requestDetailsInfo: {
            requestType: 'Reimbursement',
            descriptionPurpose: 'Reimbursement of expenses for faculty training workshop on Artificial Intelligence in Education',
            sourceOfFund: 'General Fund',
            costCenter: 'CCIS-2025-011',
            dateRequested: 'October 3, 2025',
            dateNeeded: 'October 19, 2025',
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
            amount: 18500.00,
            serviceFee: 0.00,
            ewtRate: 2,
            ewtAmount: 370.00,
            netTotalAmount: 18130.00,
        },
        paymentTerms: {
            modeOfPayment: 'Cash',
            termsOfPayment: 'Full Payment',
            taxRegistrationType: 'VAT',
            typeOfBusiness: 'Goods',
            po: 'N/A',
            pr: 'PR-CCIS-1025',
            rr: 'RR-001122',
        },
    },

    // ID 2 - RETURNED
    '2': {
        id: '2',
        referenceNumber: 'RFP2025-January-HR-00045',
        formTitle: 'Request for Payment',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Office supplies reimbursement',
        amount: '3,200.00',
        currency: 'PHP',
        status: 'Returned',
        approver: {
            name: 'John Doe',
            role: 'Department Head',
            initials: 'JD',
        },
        comments: [
            {
                id: 'c1',
                author: 'John Doe',
                role: 'Department Head',
                timestamp: 'Jan 10, 2025 11:20am',
                text: 'Missing official receipt. Please resubmit with OR.',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Purchase_Receipt.pdf',
                size: '156 KB',
                date: '05 Jan, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Pedro Garcia',
                role: 'Requester',
                timestamp: 'Jan 5, 2025 9:00am',
                action: 'Submitted',
            },
            {
                id: 'j2',
                step: 'Step 2',
                actor: 'John Doe',
                role: 'Department Head',
                timestamp: 'Jan 10, 2025 11:20am',
                action: 'Returned',
                comment: 'Missing official receipt',
            },
        ],
        requesterInfo: {
            requestedBy: 'Pedro Garcia',
            department: 'HR',
        },
        requestDetailsInfo: {
            requestType: 'Reimbursement',
            descriptionPurpose: 'Office supplies reimbursement for Q1 inventory',
            sourceOfFund: 'Operating Fund',
            costCenter: 'HR-2025-003',
            dateRequested: 'January 5, 2025',
            dateNeeded: 'January 15, 2025',
        },
        lineItems: [
            {
                lineNumber: 1,
                category: 'Supplies',
                activityDescription: 'Printer paper (A4)',
                quantity: 10,
                uom: 'Reams',
                price: 250.00,
                amount: 2500.00,
            },
            {
                lineNumber: 2,
                category: 'Supplies',
                activityDescription: 'Ballpoint pens',
                quantity: 50,
                uom: 'Pcs',
                price: 14.00,
                amount: 700.00,
            },
        ],
        amountSummary: {
            currency: 'PHP',
            amount: 3200.00,
            serviceFee: 0.00,
            ewtRate: 0,
            ewtAmount: 0.00,
            netTotalAmount: 3200.00,
        },
        paymentTerms: {
            modeOfPayment: 'Cash',
            termsOfPayment: 'Full Payment',
            taxRegistrationType: 'Non-VAT',
            typeOfBusiness: 'Goods',
            po: 'N/A',
            pr: 'PR-HR-0045',
            rr: 'N/A',
        },
    },

    // ID 3 - COMPLETED
    '3': {
        id: '3',
        referenceNumber: 'RFP2025-January-CCIS-00089',
        formTitle: 'Request for Payment',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Training seminar reimbursement',
        amount: '8,000.00',
        currency: 'PHP',
        status: 'Completed',
        approver: {
            name: 'Anna Reyes',
            role: 'HR Director',
            initials: 'AR',
        },
        comments: [
            {
                id: 'c1',
                author: 'Anna Reyes',
                role: 'HR Director',
                timestamp: 'Jan 20, 2025 4:30pm',
                text: 'Approved. Payment will be processed within 5 business days.',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Seminar_Certificate.pdf',
                size: '421 KB',
                date: '15 Jan, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a2',
                filename: 'Registration_Receipt.pdf',
                size: '298 KB',
                date: '15 Jan, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Lisa Torres',
                role: 'Requester',
                timestamp: 'Jan 15, 2025 10:00am',
                action: 'Submitted',
            },
            {
                id: 'j2',
                step: 'Step 2',
                actor: 'Anna Reyes',
                role: 'HR Director',
                timestamp: 'Jan 18, 2025 2:15pm',
                action: 'Approved',
            },
            {
                id: 'j3',
                step: 'Step 3',
                actor: 'System',
                role: 'Finance System',
                timestamp: 'Jan 20, 2025 4:30pm',
                action: 'Completed',
                comment: 'Payment processed successfully',
            },
        ],
        requesterInfo: {
            requestedBy: 'Lisa Torres',
            department: 'CCIS',
        },
        requestDetailsInfo: {
            requestType: 'Reimbursement',
            descriptionPurpose: 'Training seminar registration and materials reimbursement',
            sourceOfFund: 'Training Fund',
            costCenter: 'CCIS-2025-007',
            dateRequested: 'January 15, 2025',
            dateNeeded: 'January 25, 2025',
        },
        lineItems: [
            {
                lineNumber: 1,
                category: 'Training',
                activityDescription: 'Seminar registration fee',
                quantity: 1,
                uom: 'Slot',
                price: 6500.00,
                amount: 6500.00,
            },
            {
                lineNumber: 2,
                category: 'Materials',
                activityDescription: 'Training materials and handouts',
                quantity: 1,
                uom: 'Set',
                price: 1500.00,
                amount: 1500.00,
            },
        ],
        amountSummary: {
            currency: 'PHP',
            amount: 8000.00,
            serviceFee: 0.00,
            ewtRate: 0,
            ewtAmount: 0.00,
            netTotalAmount: 8000.00,
        },
        paymentTerms: {
            modeOfPayment: 'Bank Transfer',
            termsOfPayment: 'Full Payment',
            taxRegistrationType: 'VAT',
            typeOfBusiness: 'Services',
            po: 'PO-2025-0089',
            pr: 'PR-CCIS-0089',
            rr: 'RR-001150',
        },
    },

    // ID 4 - REJECTED (NEW)
    '4': {
        id: '4',
        referenceNumber: 'RFP2025-February-FIN-00156',
        formTitle: 'Reimbursement',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses reimbursement',
        amount: '15,000.00',
        currency: 'PHP',
        status: 'Rejected',
        approver: {
            name: 'Maria Santos',
            role: 'Finance Manager',
            initials: 'MS',
        },
        comments: [
            {
                id: 'c1',
                author: 'Maria Santos',
                role: 'Finance Manager',
                timestamp: 'Feb 15, 2025 2:30pm',
                text: 'Request rejected. Expenses exceed the approved budget allocation for this department. Please coordinate with your department head for budget reallocation.',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Travel_Itinerary.pdf',
                size: '245 KB',
                date: '10 Feb, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a2',
                filename: 'Hotel_Receipt.pdf',
                size: '189 KB',
                date: '10 Feb, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Carlos Rivera',
                role: 'Requester',
                timestamp: 'Feb 10, 2025 9:30am',
                action: 'Submitted',
                comment: 'Submitted for approval',
            },
            {
                id: 'j2',
                step: 'Step 2',
                actor: 'John Doe',
                role: 'Department Head',
                timestamp: 'Feb 12, 2025 11:00am',
                action: 'Approved',
                comment: 'Forwarded to Finance',
            },
            {
                id: 'j3',
                step: 'Step 3',
                actor: 'Maria Santos',
                role: 'Finance Manager',
                timestamp: 'Feb 15, 2025 2:30pm',
                action: 'Rejected',
                comment: 'Expenses exceed approved budget allocation',
            },
        ],
        requesterInfo: {
            requestedBy: 'Carlos Rivera',
            department: 'Finance',
        },
        requestDetailsInfo: {
            requestType: 'Reimbursement',
            descriptionPurpose: 'Travel expenses for client visit in Cebu including airfare, hotel, and meals',
            sourceOfFund: 'Operating Fund',
            costCenter: 'FIN-2025-012',
            dateRequested: 'February 10, 2025',
            dateNeeded: 'February 20, 2025',
        },
        lineItems: [
            {
                lineNumber: 1,
                category: 'Airfare',
                activityDescription: 'Round trip flight Manila to Cebu',
                quantity: 1,
                uom: 'Trip',
                price: 8500.00,
                amount: 8500.00,
            },
            {
                lineNumber: 2,
                category: 'Accommodation',
                activityDescription: 'Hotel stay (2 nights)',
                quantity: 2,
                uom: 'Nights',
                price: 2500.00,
                amount: 5000.00,
            },
            {
                lineNumber: 3,
                category: 'Meals',
                activityDescription: 'Meal allowance',
                quantity: 3,
                uom: 'Days',
                price: 500.00,
                amount: 1500.00,
            },
        ],
        amountSummary: {
            currency: 'PHP',
            amount: 15000.00,
            serviceFee: 0.00,
            ewtRate: 0,
            ewtAmount: 0.00,
            netTotalAmount: 15000.00,
        },
        paymentTerms: {
            modeOfPayment: 'Bank Transfer',
            termsOfPayment: 'Full Payment',
            taxRegistrationType: 'Non-VAT',
            typeOfBusiness: 'Services',
            po: 'N/A',
            pr: 'PR-FIN-0156',
            rr: 'N/A',
        },
    },

    // ID 5 - CANCELLED (NEW)
    '5': {
        id: '5',
        referenceNumber: 'RFP2025-March-IT-00203',
        formTitle: 'Request for Payment',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Software subscription reimbursement',
        amount: '5,500.00',
        currency: 'PHP',
        status: 'Cancelled',
        approver: {
            name: 'Robert Chen',
            role: 'IT Director',
            initials: 'RC',
        },
        comments: [
            {
                id: 'c1',
                author: 'Emily Cruz',
                role: 'Requester',
                timestamp: 'Mar 8, 2025 10:15am',
                text: 'Cancelling this request as the software license was provided by the company instead.',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Software_Invoice.pdf',
                size: '134 KB',
                date: '05 Mar, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Emily Cruz',
                role: 'Requester',
                timestamp: 'Mar 5, 2025 2:00pm',
                action: 'Submitted',
                comment: 'Submitted for software subscription reimbursement',
            },
            {
                id: 'j2',
                step: 'Step 2',
                actor: 'Emily Cruz',
                role: 'Requester',
                timestamp: 'Mar 8, 2025 10:15am',
                action: 'Cancelled',
                comment: 'Cancelled by requester - company provided license',
            },
        ],
        requesterInfo: {
            requestedBy: 'Emily Cruz',
            department: 'IT',
        },
        requestDetailsInfo: {
            requestType: 'Reimbursement',
            descriptionPurpose: 'Annual subscription for project management software (Jira)',
            sourceOfFund: 'IT Budget',
            costCenter: 'IT-2025-008',
            dateRequested: 'March 5, 2025',
            dateNeeded: 'March 15, 2025',
        },
        lineItems: [
            {
                lineNumber: 1,
                category: 'Software',
                activityDescription: 'Jira Software Cloud Annual Subscription',
                quantity: 1,
                uom: 'License',
                price: 5500.00,
                amount: 5500.00,
            },
        ],
        amountSummary: {
            currency: 'PHP',
            amount: 5500.00,
            serviceFee: 0.00,
            ewtRate: 0,
            ewtAmount: 0.00,
            netTotalAmount: 5500.00,
        },
        paymentTerms: {
            modeOfPayment: 'Cash',
            termsOfPayment: 'Full Payment',
            taxRegistrationType: 'VAT',
            typeOfBusiness: 'Services',
            po: 'N/A',
            pr: 'PR-IT-0203',
            rr: 'N/A',
        },
    },
};
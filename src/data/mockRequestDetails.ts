// Extended request details with comments, attachments, approver, and journey
export interface Comment {
    id: string;
    author: string;
    role: string;
    timestamp: string;
    text: string;
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
    action: 'Submitted' | 'Approved' | 'Returned' | 'Rejected' | 'Cancelled' | 'Completed';
    comment?: string;
}

export interface RequestDetail {
    id: string;
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
}

// Mock detailed request data
export const mockRequestDetails: Record<string, RequestDetail> = {
    '1': {
        id: '1',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses for Q1 client meeting',
        amount: '15,500.00',
        currency: 'PHP',
        status: 'Pending',
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
                timestamp: 'Oct 8, 2025 9:24am',
                text: 'Please revise the attached document',
            },
            {
                id: 'c2',
                author: 'Juan Dela Cruz',
                role: 'Requester',
                timestamp: 'Oct 7, 2025 2:15pm',
                text: 'Uploaded receipts for hotel and transportation',
            },
            {
                id: 'c3',
                author: 'Maria Santos',
                role: 'Finance Manager',
                timestamp: 'Oct 6, 2025 10:30am',
                text: 'Please provide breakdown of expenses',
            },
        ],
        attachments: [
            {
                id: 'a1',
                filename: 'Hotel_Receipt.pdf',
                size: '313 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a2',
                filename: 'Transportation_Receipt.pdf',
                size: '245 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
            {
                id: 'a3',
                filename: 'Expense_Summary.pdf',
                size: '189 KB',
                date: '31 Aug, 2025',
                url: '#',
                type: 'pdf',
            },
        ],
        journey: [
            {
                id: 'j1',
                step: 'Step 1',
                actor: 'Juan Dela Cruz',
                role: 'Requester',
                timestamp: 'Oct 5, 2025 3:45pm',
                action: 'Submitted',
                comment: 'Initial submission of reimbursement request',
            },
            {
                id: 'j2',
                step: 'Step 2',
                actor: 'Maria Santos',
                role: 'Finance Manager',
                timestamp: 'Oct 6, 2025 10:30am',
                action: 'Returned',
                comment: 'Please provide breakdown of expenses',
            },
            {
                id: 'j3',
                step: 'Step 3',
                actor: 'Juan Dela Cruz',
                role: 'Requester',
                timestamp: 'Oct 7, 2025 2:15pm',
                action: 'Submitted',
                comment: 'Uploaded receipts for hotel and transportation',
            },
        ],
    },
    '2': {
        id: '2',
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
    },
    '3': {
        id: '3',
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
    },
};
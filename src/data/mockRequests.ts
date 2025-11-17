import type { Request } from "@/types";

export const mockRequests: Request[] = [
    {
        id: '1',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses',
        amount: '1000',
        currency: 'PHP',
        status: 'Pending',
    },
    {
        id: '2',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses',
        amount: '1000',
        currency: 'PHP',
        status: 'Returned',
    },
    {
        id: '3',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses',
        amount: '1000',
        currency: 'PHP',
        status: 'Completed',
    },
    {
        id: '4',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses',
        amount: '1000',
        currency: 'PHP',
        status: 'Rejected',
    },
    {
        id: '5',
        requestType: 'Reimbursement',
        dateRequested: '2025-01-01',
        description: 'Travel expenses',
        amount: '1000',
        currency: 'PHP',
        status: 'Cancelled',
    },
];
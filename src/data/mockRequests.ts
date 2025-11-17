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
];
import { create } from 'zustand';
import type { Request } from '@/types';

interface SubmittedRequestsState {
    submittedRequests: Request[];
    addSubmittedRequest: (request: Request) => void;
    clearSubmittedRequests: () => void;
}

export const useSubmittedRequestsStore = create<SubmittedRequestsState>((set) => ({
    submittedRequests: [],
    addSubmittedRequest: (request) => set((state) => ({
        submittedRequests: [...state.submittedRequests, request],
    })),
    clearSubmittedRequests: () => set({ submittedRequests: [] }),
}));
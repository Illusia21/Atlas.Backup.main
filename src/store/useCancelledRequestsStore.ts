import { create } from 'zustand';

interface CancelledRequestsState {
    cancelledRequestIds: string[];
    addCancelledRequest: (requestId: string) => void;
    clearCancelledRequests: () => void;
}

export const useCancelledRequestsStore = create<CancelledRequestsState>((set) => ({
    cancelledRequestIds: [],
    addCancelledRequest: (requestId) => set((state) => ({
        cancelledRequestIds: [...state.cancelledRequestIds, requestId],
    })),
    clearCancelledRequests: () => set({ cancelledRequestIds: [] }),
}));


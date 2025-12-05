import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CAStep1Data, CAStep2Data, CAStep3Data } from '@/types/cashAdvance';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
}

interface CashAdvanceState {
    // Step data
    step1Data: CAStep1Data | null;
    step2Data: CAStep2Data | null;
    step3Data: CAStep3Data | null;
    step4Files: UploadedFile[];

    // Actions
    saveStep1: (data: CAStep1Data) => void;
    saveStep2: (data: CAStep2Data) => void;
    saveStep3: (data: CAStep3Data) => void;
    saveStep4Files: (files: UploadedFile[]) => void;
    clearAllData: () => void;
}

export const useCashAdvanceStore = create<CashAdvanceState>()(
    persist(
        (set) => ({
            // Initial state
            step1Data: null,
            step2Data: null,
            step3Data: null,
            step4Files: [],

            // Actions
            saveStep1: (data) => set({ step1Data: data }),
            saveStep2: (data) => set({ step2Data: data }),
            saveStep3: (data) => set({ step3Data: data }),
            saveStep4Files: (files) => set({ step4Files: files }),
            clearAllData: () => set({
                step1Data: null,
                step2Data: null,
                step3Data: null,
                step4Files: [],
            }),
        }),
        {
            name: 'cash-advance-storage', // localStorage key
            partialize: (state) => ({
                // Only persist these fields (exclude large files)
                step1Data: state.step1Data,
                step2Data: state.step2Data,
                step3Data: state.step3Data,
                // Don't persist step4Files (files can't be serialized)
            }),
        }
    )
);
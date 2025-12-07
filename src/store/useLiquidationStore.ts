import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LiquidationStep1Data } from '@/types/liquidation';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
}

// ADD THIS: Cash Advance data interface
interface CashAdvanceData {
    id: string;
    referenceNumber: string; // e.g., "RCA2025-October-CCIS-00123"
    requestedBy: string; // e.g., "Aisha Nicole Dones"
    department: string; // e.g., "CCIS"
    dateRequested: string; // e.g., "October 3, 2025"
    dateNeeded: string; // e.g., "October 19, 2025"
    approvedAmount: number; // The amount that was approved
}

interface LiquidationState {
    // ADD THIS: Store the original Cash Advance data
    cashAdvanceData: CashAdvanceData | null;

    step1Data: LiquidationStep1Data | null;
    step2Files: UploadedFile[];
    requestedAmount: number; // From original CA request

    // ADD THIS: Method to set CA data when liquidation starts
    setCashAdvanceData: (data: CashAdvanceData) => void;

    saveStep1: (data: LiquidationStep1Data) => void;
    saveStep2Files: (files: UploadedFile[]) => void;
    setRequestedAmount: (amount: number) => void;
    clearAllData: () => void;
}

export const useLiquidationStore = create<LiquidationState>()(
    persist(
        (set) => ({
            // ADD THIS
            cashAdvanceData: null,

            step1Data: null,
            step2Files: [],
            requestedAmount: 20000,

            // ADD THIS
            setCashAdvanceData: (data) => set({
                cashAdvanceData: data,
                requestedAmount: data.approvedAmount // Auto-set requested amount from CA
            }),

            saveStep1: (data) => set({ step1Data: data }),
            saveStep2Files: (files) => set({ step2Files: files }),
            setRequestedAmount: (amount) => set({ requestedAmount: amount }),
            clearAllData: () => set({
                cashAdvanceData: null, // ✅ ADD THIS
                step1Data: null,
                step2Files: [],
                requestedAmount: 20000,
            }),
        }),
        {
            name: 'liquidation-storage',
            partialize: (state) => ({
                cashAdvanceData: state.cashAdvanceData, // ✅ ADD THIS
                step1Data: state.step1Data,
                step2Files: state.step2Files,
                requestedAmount: state.requestedAmount,
            }),
        }
    )
);

/**
 * USAGE IN LIQUIDATION STEP 3:
 * 
 * const { cashAdvanceData, step1Data, step2Files, requestedAmount } = useLiquidationStore();
 * 
 * const requestedBy = cashAdvanceData?.requestedBy || 'N/A';
 * const department = cashAdvanceData?.department || 'N/A';
 * const cashAdvanceRef = cashAdvanceData?.referenceNumber || 'N/A';
 * const dateRequested = cashAdvanceData?.dateRequested || 'N/A';
 * const dateNeeded = cashAdvanceData?.dateNeeded || 'N/A';
 */

/**
 * HOW TO SET CA DATA WHEN USER STARTS LIQUIDATION:
 * 
 * When user clicks "Start Liquidation" from the Cash Advance page:
 * 
 * const { setCashAdvanceData } = useLiquidationStore();
 * 
 * setCashAdvanceData({
 *   id: cashAdvance.id,
 *   referenceNumber: cashAdvance.referenceNumber,
 *   requestedBy: cashAdvance.requestedBy,
 *   department: cashAdvance.department,
 *   dateRequested: cashAdvance.dateRequested,
 *   dateNeeded: cashAdvance.dateNeeded,
 *   approvedAmount: cashAdvance.approvedAmount,
 * });
 * 
 * navigate('/liquidation/step1');
 */
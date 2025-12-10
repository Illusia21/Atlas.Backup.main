import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiquidationStore } from '@/store/useLiquidationStore';
import { useSubmittedRequestsStore } from '@/store/useSubmittedRequestsStore';
import { format } from 'date-fns';
import { Info, ArrowRight, CircleCheckBig, PencilLine, FileText, Link2 } from 'lucide-react';
import mapuaLogo from '@/assets/images/mapuaLogo.png';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Request } from '@/types';
import Stepper from '@/components/Stepper';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CheckGreenCircle from '@/assets/green-check-circle.svg';

const LIQUIDATION_STEPS = [
    { label: 'Liquidation Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

export default function LiquidationStep3() {
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { step1Data, step2Files, requestedAmount, clearAllData } = useLiquidationStore();
    const { user } = useAuth();
    const { addNotification } = useNotificationStore();
    const { addSubmittedRequest } = useSubmittedRequestsStore();

    // For now, using static values. When store is updated:
    // const { cashAdvanceData } = useLiquidationStore();
    // const requestedBy = cashAdvanceData?.requestedBy || 'N/A';

    const requestedBy = 'Aisha Nicole Dones';
    const department = 'CCIS';
    const cashAdvanceRef = 'RCA2025-October-CCIS-00123';
    const dateRequested = 'October 3, 2025';
    const dateNeeded = 'October 19, 2025';

    const seriesNumber = 'LR2025-October-CCIS-00123';

    // Format dates
    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return format(date, 'MMMM d, yyyy');
    };

    // Handle edit redirects
    const handleEditLiquidationDetails = () => {
        navigate('/liquidation/step1');
    };

    const handleEditAttachments = () => {
        navigate('/liquidation/step2');
    };

    const handleBack = () => {
        navigate('/liquidation/step2');
    };

    // Handle Confirm
    const handleConfirm = () => {
        setShowConfirmDialog(true);
    };

    // Handle final submission
    const handleFinalSubmit = async () => {
        try {
            // TODO: Replace with actual backend validation API call
            // const validationResponse = await api.post('/api/liquidation/validate', {
            //     step1Data,
            //     step2Files,
            // });

            // For now, simulate validation (remove this when backend is ready)
            await new Promise(resolve => setTimeout(resolve, 500));

            // If validation passes, proceed with submission
            setShowConfirmDialog(false);

            // Create the new liquidation request object
            const totalAmount = (step1Data?.lineItems || []).reduce((sum, item) => sum + item.amount, 0);
            const newRequest: Request = {
                id: `LIQ-${Date.now()}`,
                requestType: 'Liquidation' as const,
                dateRequested: new Date().toISOString().split('T')[0],
                status: 'Pending' as const,
                amount: totalAmount,
                currency: (step1Data?.currency || 'PHP') as 'PHP' | 'USD' | 'EUR',
                description: step1Data?.descriptionPurpose || '',
            };

            // Save to localStorage (will be replaced by API call later)
            // const submittedRequests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
            // submittedRequests.push(newRequest);
            // localStorage.setItem('submittedRequests', JSON.stringify(submittedRequests));

            addSubmittedRequest(newRequest);

            // Add notification before clearing data
            addNotification({
                id: `notification-${Date.now()}`,
                userId: user?.id || 'user-123',
                type: 'submission_success',
                requestType: 'Liquidation Report',
                message: 'has been submitted successfully',
                referenceNo: newRequest.id,
                timestamp: new Date(),
            });

            // Clear all stored draft data after successful submission
            clearAllData();

            // Show success toast
            toast.success('Liquidation report submitted successfully!', {
                duration: 4000,
            });

            // Navigate to Liquidation page with success flag
            setTimeout(() => {
                navigate('/liquidation?success=liquidation');
            }, 1000);

        } catch (error) {
            // Close modal on error
            setShowConfirmDialog(false);

            // Show error message
            toast.error('Validation failed. Please check your form and try again.', {
                duration: 4000,
            });

            console.error('Submission error:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Step Progress Indicator */}
            <Stepper steps={LIQUIDATION_STEPS} currentStep={3} showLeadingLine={false} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-[20px] relative">
                {/* Header with Info Icon */}
                <div className="flex items-center justify-between">
                    {/* DESIGN FIX: Changed Step 5 to Step 3, Review Form to Review & Submit */}
                    <div className="flex items-center gap-[20px]">
                        <h1 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] text-[#001c43]">
                            Step 3
                        </h1>
                        <h2 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                            Review & Submit
                        </h2>
                    </div>
                    <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-[1px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Info className="w-[24px] h-[24px] text-[#e50019]" />
                    </div>
                </div>

                {/* Form Review Container - SCROLLABLE */}
                <div className="bg-white rounded-[20px] p-[20px] flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-[20px] px-[46px]">
                        {/* === HEADER SECTION === */}
                        <div className="grid grid-cols-3 items-end h-[100px] gap-[10px]">
                            {/* Logo */}
                            <div className="flex items-start">
                                <img
                                    src={mapuaLogo}
                                    alt="MMCM Logo"
                                    className="h-[108px] w-auto object-contain"
                                />
                            </div>


                            <div className="flex items-end justify-center pb-[10px]">
                                <h2 className="font-bold text-[32px] leading-[normal] text-[#001c43] text-center">
                                    Liquidation Report
                                </h2>
                            </div>


                            <div className="flex items-end justify-end pb-[10px]">
                                <p className="font-['Montserrat'] font-semibold text-[16px] leading-none text-[#001c43] tracking-[-0.32px]">
                                    {seriesNumber}
                                </p>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-[2px] bg-[#b1b1b1]" />

                        {/* === REQUESTER INFORMATION SECTION === */}
                        <div className="bg-white rounded-[20px] p-[20px] border border-transparent">
                            <div className="grid grid-cols-2 gap-y-[10px]">
                                {/* Section Title */}
                                <div className="col-span-2 flex items-center">
                                    <h3 className="font-['Montserrat'] font-semibold text-[20px] leading-[28px] text-[#001c43]">
                                        Requester Information
                                    </h3>
                                </div>

                                {/* Requested By */}
                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Requested By
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {requestedBy}
                                    </p>
                                </div>

                                {/* Department */}
                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Department
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {department}
                                    </p>
                                </div>


                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-[2px] bg-[#b1b1b1]" />


                        <div className="bg-white rounded-[20px] p-[20px] border border-transparent">
                            <div className="grid grid-cols-2 gap-y-[10px]">
                                {/* Section Title with Edit Icon */}
                                <div className="col-span-1 flex items-center">
                                    <h3 className="font-['Montserrat'] font-semibold text-[20px] leading-[28px] text-[#001c43]">
                                        Request Details
                                    </h3>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        onClick={handleEditLiquidationDetails}
                                        className="w-[24px] h-[24px] flex items-center justify-center text-[#114B9F] hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <PencilLine className="w-[24px] h-[24px]" strokeWidth={2} />
                                    </button>
                                </div>


                                <div className="col-span-2 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Cash Advance Form
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {cashAdvanceRef}
                                    </p>
                                </div>

                                {/* Description/Purpose - Full Width */}
                                <div className="col-span-2 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Description/Purpose
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.descriptionPurpose || 'N/A'}
                                    </p>
                                </div>

                                {/* Source of Fund */}
                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Source of Fund
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.sourceOfFunds || 'N/A'}
                                    </p>
                                </div>

                                {/* Cost Center */}
                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Cost Center
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.costCenter || 'N/A'}
                                    </p>
                                </div>


                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Date Requested
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {dateRequested}
                                    </p>
                                </div>


                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Date Needed
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {dateNeeded}
                                    </p>
                                </div>


                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Date Start
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {formatDate(step1Data?.dateRange?.from)}
                                    </p>
                                </div>


                                <div className="col-span-1 flex flex-col gap-[10px] px-[20px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Date End
                                    </p>
                                    <p className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        {formatDate(step1Data?.dateRange?.to)}
                                    </p>
                                </div>

                                {/* Itemized Table - Full Width */}
                                <div className="col-span-2 px-[20px] mt-[10px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-[#001c43] hover:bg-[#001c43]">
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white rounded-tl-[12px]">
                                                    Line/Item
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                                    Category
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                                    Activity/Description
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                                    Quantity
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                                    UOM
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white">
                                                    Price
                                                </TableHead>
                                                <TableHead className="text-white font-['Montserrat'] font-bold text-[14px] text-center border-b border-white rounded-tr-[12px]">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(step1Data?.lineItems || []).map((item) => (
                                                <TableRow key={item.id} className="hover:bg-white">
                                                    <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {(step1Data?.lineItems || []).indexOf(item) + 1}
                                                    </TableCell>
                                                    <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.category}
                                                    </TableCell>
                                                    <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.activityDescription}
                                                    </TableCell>
                                                    <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.uom}
                                                    </TableCell>
                                                    <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.price.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-center font-['Montserrat'] font-bold text-[14px] text-[#001c43] border-b border-white">
                                                        {item.amount.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-[2px] bg-[#b1b1b1]" />

                        {/* === AMOUNT SUMMARY SECTION === */}

                        <div className="bg-[#ececec] rounded-[20px] p-[20px]">
                            <div className="grid grid-cols-2 gap-y-[10px] px-[20px]">
                                {/* Currency */}
                                <div className="col-span-1 flex items-center gap-[10px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Currency:
                                    </p>
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.currency || 'PHP'}
                                    </p>
                                </div>

                                {/* Total Amount (was "Requested Amount") */}
                                <div className="col-span-1 flex items-center justify-end gap-[10px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Total Amount:
                                    </p>
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.currency || 'PHP'} {(step1Data?.lineItems || []).reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* Cash Advance (new field) */}
                                <div className="col-span-2 flex items-center justify-end gap-[10px]">
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Cash Advance:
                                    </p>
                                    <p className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        {step1Data?.currency || 'PHP'} {requestedAmount.toFixed(2)}
                                    </p>
                                </div>

                                {/* Amount to Return/(Refund) (was "Actual Amount") */}
                                <div className="col-span-2 flex items-center justify-end gap-[10px] mt-[10px]">
                                    <p className="font-['Montserrat'] font-bold text-[16px] leading-[24px] text-[#001c43]">
                                        Amount to Return/(Refund):
                                    </p>
                                    <p className="font-['Montserrat'] font-bold text-[16px] leading-[24px] text-[#001c43]">
                                        {step1Data?.currency || 'PHP'} {((step1Data?.lineItems || []).reduce((sum, item) => sum + item.amount, 0) - requestedAmount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-[2px] bg-[#b1b1b1]" />

                        {/* === ATTACHMENTS SECTION === */}

                        <div className="flex items-start justify-end px-[20px] py-[10px]">
                            {/* Attachments Button */}
                            <div className="flex items-center">
                                <button className="bg-white border-0 rounded-[16px] px-[41px] py-[16px] flex items-center gap-[10px] h-[36px] hover:bg-gray-50 transition-colors">
                                    <Link2 className="w-[24px] h-[24px] text-[#001c43]" />
                                    <span className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                        Attachments
                                    </span>
                                </button>
                            </div>

                            {/* 85px gap before File Box */}
                            <div className="w-[85px]" />

                            {/* Attachments List */}
                            <div className="border border-[#001c43] rounded-[20px] p-[20px] w-[541px] flex flex-col gap-[10px]">
                                {step2Files.map((file) => (
                                    <div key={file.id} className="flex items-center gap-[10px]">
                                        <FileText className="w-[17px] h-[17px] text-[#001c43]" />
                                        <p className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                                            {file.name}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* 60px gap before Edit Icon */}
                            <div className="w-[60px]" />

                            {/* Edit Icon */}
                            <button
                                onClick={handleEditAttachments}
                                className="w-[24px] h-[24px] flex items-center justify-center text-[#114B9F] hover:bg-blue-50 rounded transition-colors"
                            >
                                <PencilLine className="w-[24px] h-[24px]" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - FIXED at bottom */}
                <div className="flex items-center justify-end gap-[10px]">
                    <button
                        onClick={handleBack}
                        className="w-[137px] h-[46px] bg-white rounded-[10px] flex items-center justify-center gap-[10px] hover:bg-gray-50 transition-colors shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] cursor-pointer"
                    >
                        <ArrowRight className="w-[24px] h-[24px] text-[#001c43] rotate-180" />
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                            Back
                        </span>
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!step1Data || step2Files.length === 0}
                        className={`w-[137px] h-[46px] rounded-[10px] flex items-center justify-center gap-[5px] transition-colors shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] ${!step1Data || step2Files.length === 0
                            ? 'bg-[#b1b1b1] cursor-not-allowed'
                            : 'bg-[#001c43] hover:bg-[#002856] cursor-pointer'
                            }`}
                    >
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-white">
                            Confirm
                        </span>
                        <CircleCheckBig className="w-[24px] h-[24px] text-white" />
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="min-w-[400px] min-h-[284px] p-[24px]">

                    <div className="flex flex-col">
                        {/* Green Check Icon */}
                        <div className="flex justify-start">
                            <img
                                src={CheckGreenCircle}
                                alt="Success"
                                className="w-[48px] h-[48px]"
                            />
                        </div>

                        {/* Title - 16px gap from icon */}
                        <DialogTitle className="font-['Montserrat'] font-bold text-[20px] leading-[28px] text-[#001c43] text-left mt-[16px]">
                            Are you sure you want to submit the Liquidation Report?
                        </DialogTitle>

                        {/* Subtitle - 4px gap from title */}
                        <DialogDescription className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#6B7280] text-left mt-[4px]">
                            Double check the form for a smooth process.
                        </DialogDescription>

                        {/* Buttons - 32px gap from subtitle */}
                        <div className="flex gap-3 mt-[32px]">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 h-[48px] border-2 border-[#E5E7EB] bg-white hover:bg-gray-50 font-['Montserrat'] font-semibold text-[16px] text-[#001c43] rounded-[8px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleFinalSubmit}
                                className="flex-1 h-[48px] bg-[#001c43] hover:bg-[#002856] font-['Montserrat'] font-semibold text-[16px] text-white rounded-[8px]"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
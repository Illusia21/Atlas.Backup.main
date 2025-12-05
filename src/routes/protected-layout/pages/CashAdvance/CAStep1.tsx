import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight, CircleX, PenLine } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import Stepper from '@/components/Stepper';
import { useCashAdvanceStore } from '@/store/useCashAdvanceStore';

const CASH_ADVANCE_STEPS = [
    { label: 'Requestor Information' },
    { label: 'Request Details' },
    { label: 'Bank Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

export default function CAStep1() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { step1Data, saveStep1 } = useCashAdvanceStore();

    // Initialize state from store or user data
    const [requestedBy] = useState(step1Data?.requestedBy || user?.name || '');
    const [department, setDepartment] = useState(step1Data?.department || user?.department || '');

    // Load saved data when component mounts
    useEffect(() => {
        if (step1Data) {
            setDepartment(step1Data.department);
        }
    }, [step1Data]);

    // Available departments (will come from backend later)
    const departments = [
        'CCIS',
        'CEAS',
        'CAFA',
        'CSB',
        'CHTM',
        'COL',
        'Admin',
        'Finance',
        'HR'
    ];

    const handleNext = () => {
        // Validation
        if (!department) {
            toast.error('Please select a department before proceeding');
            return;
        }

        // Save data to Zustand store
        saveStep1({ requestedBy, department });

        // Navigate to Step 2
        toast.success('Requestor information saved!');
        navigate('/request/cash-advance/step2');
    };

    const handleCancel = () => {
        navigate('/my-requests');
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Step Progress Indicator */}
            <Stepper steps={CASH_ADVANCE_STEPS} currentStep={1} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-[20px]">
                {/* Header with Info Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[20px]">
                        <h1 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] text-[#001c43]">
                            Step 1
                        </h1>
                        <h2 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                            Requestor Information
                        </h2>
                    </div>
                    <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-[1px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Info className="w-[24px] h-[24px] text-[#e50019]" />
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-[20px] p-[20px] flex-1 flex flex-col">
                    {/* Input Fields */}
                    <div className="grid grid-cols-2 gap-[50px] px-[20px]">
                        {/* Requested By Field */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Requested By
                            </label>
                            <div className="h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] flex items-center justify-between">
                                <span className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                    {requestedBy}
                                </span>
                                <PenLine className="w-[24px] h-[24px] text-[#001c43] opacity-50" />
                            </div>
                        </div>

                        {/* Department Dropdown */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Department
                            </label>
                            <Select value={department} onValueChange={setDepartment}>
                                <SelectTrigger className="w-full !h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#001c43] transition-colors">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem
                                            key={dept}
                                            value={dept}
                                            className="font-['Montserrat'] text-[14px]"
                                        >
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-[10px]">
                    <button
                        onClick={handleCancel}
                        className="w-[137px] h-[46px] bg-white rounded-[10px] flex items-center justify-center gap-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <CircleX className="w-[24px] h-[24px] text-[#001c43]" />
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                            Cancel
                        </span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-[137px] h-[46px] bg-[#001c43] rounded-[10px] flex items-center justify-center gap-[5px] hover:bg-[#002856] transition-colors"
                    >
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-white">
                            Next
                        </span>
                        <ArrowRight className="w-[24px] h-[24px] text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
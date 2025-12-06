import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight, CircleX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import Stepper from '@/components/Stepper';
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    const [requestedBy, setRequestedBy] = useState(step1Data?.requestedBy || user?.name || '');
    const [department, setDepartment] = useState(step1Data?.department || user?.department || '');

    // Load saved data when component mounts
    useEffect(() => {
        if (step1Data) {
            setDepartment(step1Data.department);
        }
    }, [step1Data]);

    // Available departments (will come from backend later)
    const departments = [
        'ATYCB',
        'CAS',
        'CCIS',
        'CEA',
        'CHS',
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
                        {/* Requested By Field - Combobox */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Requested By
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full h-[44px] justify-between bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] text-[#001c43] hover:bg-white"
                                    >
                                        {requestedBy || "Select name..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search or type name..."
                                            onValueChange={(value) => setRequestedBy(value)}
                                        />
                                        <CommandEmpty>
                                            <button
                                                onClick={() => {
                                                    const input = document.querySelector('[placeholder="Search or type name..."]') as HTMLInputElement;
                                                    if (input?.value) {
                                                        setRequestedBy(input.value);
                                                    }
                                                }}
                                                className="w-full text-left px-2 py-1.5 text-sm"
                                            >
                                                Use "{requestedBy}" (custom name)
                                            </button>
                                        </CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value={user?.name || ''}
                                                onSelect={(currentValue) => {
                                                    setRequestedBy(currentValue);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        requestedBy === user?.name ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {user?.name} (You)
                                            </CommandItem>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import Stepper from '@/components/Stepper';
import { useCashAdvanceStore } from '@/store/useCashAdvanceStore';

const CASH_ADVANCE_STEPS = [
    { label: 'Requestor Information' },
    { label: 'Request Details' },
    { label: 'Bank Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

export default function CAStep3() {
    const navigate = useNavigate();
    const { step3Data, saveStep3 } = useCashAdvanceStore();

    // Initialize state
    const [bankName, setBankName] = useState('');
    //const [swiftCode, setSwiftCode] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [instructions, setInstructions] = useState('');

    // Load saved data when component mounts
    useEffect(() => {
        if (step3Data) {
            setBankName(step3Data.bankName);
            //setSwiftCode(step3Data.swiftCode);
            setAccountName(step3Data.accountName);
            setAccountNumber(step3Data.accountNumber);
            setInstructions(step3Data.instructions);
        }
    }, [step3Data]);

    // Validation errors
    const [errors, setErrors] = useState({
        bankName: '',
        //swiftCode: '',
        accountName: '',
        accountNumber: '',
    });

    // Handle account number input (numbers only)
    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
        if (value === '' || /^\d+$/.test(value)) {
            setAccountNumber(value);
            // Clear error when user types valid input
            if (errors.accountNumber) {
                setErrors({ ...errors, accountNumber: '' });
            }
        } else {
            setErrors({ ...errors, accountNumber: 'Account Number must contain only numbers' });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {
            bankName: '',
            //swiftCode: '',
            accountName: '',
            accountNumber: '',
        };

        let isValid = true;

        if (!bankName.trim()) {
            newErrors.bankName = 'Bank Name is required';
            isValid = false;
        }

        // Swift Code is optional, so we don't validate it

        if (!accountName.trim()) {
            newErrors.accountName = 'Account Name is required';
            isValid = false;
        }

        if (!accountNumber.trim()) {
            newErrors.accountNumber = 'Account Number is required';
            isValid = false;
        } else if (!/^\d+$/.test(accountNumber)) {
            newErrors.accountNumber = 'Account Number must contain only numbers';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle Back
    const handleBack = () => {
        navigate('/request/cash-advance/step2');
    };

    // Handle Next
    const handleNext = () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        // Save data to Zustand store
        const dataToSave = {
            bankName,
            accountName,
            //swiftCode,
            accountNumber,
            instructions,
        };
        saveStep3(dataToSave);

        // Navigate to Step 4
        toast.success('Bank details saved!');
        navigate('/request/cash-advance/step4');
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Step Progress Indicator */}
            <Stepper steps={CASH_ADVANCE_STEPS} currentStep={3} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-[20px]">
                {/* Header with Info Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[20px]">
                        <h1 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] text-[#001c43]">
                            Step 3
                        </h1>
                        <h2 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                            Bank Details
                        </h2>
                    </div>
                    <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-[1px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Info className="w-[24px] h-[24px] text-[#e50019]" />
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-[20px] p-[20px] flex-1 flex flex-col gap-[20px]">
                    {/* Input Fields - Custom Layout */}
                    <div className="px-[20px] flex flex-col gap-[20px]">
                        {/* First Row */}
                        <div className="flex gap-[50px]">
                            {/* Bank Name - 560px */}
                            <div className="flex flex-col gap-[6px] w-full max-w-[560px]">
                                <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                    Bank Name
                                </label>
                                <Input
                                    value={bankName}
                                    onChange={(e) => {
                                        setBankName(e.target.value);
                                        if (errors.bankName) setErrors({ ...errors, bankName: '' });
                                    }}
                                    placeholder="ex."
                                    className={`!h-[44px] bg-white border rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] ${errors.bankName ? 'border-red-500' : 'border-[#b1b1b1]'
                                        }`}
                                />
                                {errors.bankName && (
                                    <span className="text-[12px] text-red-500 font-['Montserrat']">
                                        {errors.bankName}
                                    </span>
                                )}
                            </div>

                            {/* Swift Code
                            <div className="flex flex-col gap-[6px]">
                                <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                    Swift Code
                                </label>
                                <Input
                                    value={swiftCode}
                                    onChange={(e) => {
                                        setSwiftCode(e.target.value);
                                        if (errors.swiftCode) setErrors({ ...errors, swiftCode: '' });
                                    }}
                                    placeholder="ex. TLBPPHMM"
                                    className={`!h-[44px] bg-white border rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] ${errors.swiftCode ? 'border-red-500' : 'border-[#b1b1b1]'
                                        }`}
                                />
                                {errors.swiftCode && (
                                    <span className="text-[12px] text-red-500 font-['Montserrat']">
                                        {errors.swiftCode}
                                    </span>
                                )}
                            </div> */}

                            {/* Account Name and Account Number - with 10px gap between them */}
                            <div className="flex gap-[10px] flex-1">
                                {/* Account Name */}
                                <div className="flex flex-col gap-[6px] flex-1">
                                    <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Account Name
                                    </label>
                                    <Input
                                        value={accountName}
                                        onChange={(e) => {
                                            setAccountName(e.target.value);
                                            if (errors.accountName) setErrors({ ...errors, accountName: '' });
                                        }}
                                        placeholder="ex."
                                        className={`!h-[44px] bg-white border rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] ${errors.accountName ? 'border-red-500' : 'border-[#b1b1b1]'
                                            }`}
                                    />
                                    {errors.accountName && (
                                        <span className="text-[12px] text-red-500 font-['Montserrat']">
                                            {errors.accountName}
                                        </span>
                                    )}
                                </div>

                                {/* Account Number */}
                                <div className="flex flex-col gap-[6px] flex-1">
                                    <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                        Account Number
                                    </label>
                                    <Input
                                        value={accountNumber}
                                        onChange={handleAccountNumberChange}
                                        placeholder="ex."
                                        className={`!h-[44px] bg-white border rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] ${errors.accountNumber ? 'border-red-500' : 'border-[#b1b1b1]'
                                            }`}
                                    />
                                    {errors.accountNumber && (
                                        <span className="text-[12px] text-red-500 font-['Montserrat']">
                                            {errors.accountNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Second Row - Instructions underneath Bank Name */}
                        <div className="max-w-[560px]">
                            <div className="flex flex-col gap-[6px]">
                                <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                    Instructions
                                </label>
                                <Input
                                    value={instructions as string}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="(optional)"
                                    className="!h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] py-[10px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43] resize-none focus:outline-none focus:border-[#001c43] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-[10px]">
                    <button
                        onClick={handleBack}
                        className="w-[137px] h-[46px] bg-white rounded-[10px] flex items-center justify-center gap-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <ArrowRight className="w-[24px] h-[24px] text-[#001c43] rotate-180" />
                        <span className="font-['Montserrat'] font-medium text-[14px] leading-[20px] text-[#001c43]">
                            Back
                        </span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-[137px] h-[46px] bg-[#001c43] rounded-[10px] flex items-center justify-center gap-[5px] hover:bg-[#002856] transition-colors cursor-pointer"
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
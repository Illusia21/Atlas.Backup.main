import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PencilLine, CircleMinus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useLiquidationStore } from "@/store/useLiquidationStore";
import Stepper from '@/components/Stepper';
import type { LiquidationLineItem, LiquidationStep1Data } from "@/types/liquidation";
import { toast } from "sonner";
//import { getProgramsByDepartment } from '@/data/departmentPrograms';

const CATEGORIES = [
    "Supplies",
    "Meals",
    "Transport",
    "Accommodation",
    "Materials",
    "Equipment",
    "Services",
    "Other"
];

const UOM_OPTIONS = [
    "Pcs",
    "Sets",
    "Pax",
    "Days",
    "Hours",
    "Trips",
    "Nights",
    "Units",
    "Boxes",
    "Reams"
];

const COST_CENTER_OPTIONS = [
    'CS - Computer Science',
    'EMC - Entertainment and Multimedia Computing',
    'IS - Information Systems',
];

const LIQUIDATION_STEPS = [
    { label: 'Liquidation Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

// TODO: Replace with actual user data from Auth Store when available
const DEFAULT_VALUES = {
    sourceOfFunds: "General Fund", // Should come from currentUser.department.defaultFund
    descriptionPurpose: "Office Supplies Purchase for Q4", // Should come from currentUser
    dateRange: {
        from: new Date(2024, 11, 1),  // Dec 1, 2024
        to: new Date(2024, 11, 15)    // Dec 15, 2024
    },
    costCenter: "CS - Computer Science", // Should come from currentUser.department.costCenter
    currency: "PHP" as const // Should come from currentUser.preferences.currency
};

export default function LiquidationStep1() {
    const navigate = useNavigate();
    const { step1Data, saveStep1, requestedAmount } = useLiquidationStore();

    // Form state
    const [sourceOfFunds, setSourceOfFunds] = useState<string>(step1Data?.sourceOfFunds || DEFAULT_VALUES.sourceOfFunds);
    const [costCenter, setCostCenter] = useState<string>(step1Data?.costCenter || DEFAULT_VALUES.costCenter);
    const [descriptionPurpose, setDescriptionPurpose] = useState<string>(step1Data?.descriptionPurpose || DEFAULT_VALUES.descriptionPurpose);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(step1Data?.dateRange || DEFAULT_VALUES.dateRange);
    const [currency, setCurrency] = useState<'PHP' | 'USD' | 'EUR'>(step1Data?.currency || DEFAULT_VALUES.currency);

    const [lineItems, setLineItems] = useState<LiquidationLineItem[]>(
        step1Data?.lineItems && step1Data.lineItems.length > 0
            ? step1Data.lineItems
            : [
                {
                    id: `item-${Date.now()}-${Math.random()}`,
                    lineNumber: 1,
                    category: "Supplies",
                    activityDescription: "Office Supplies",
                    quantity: 1,
                    uom: "Pcs",
                    price: 1,
                    amount: 1
                }
            ]
    );

    // Edit mode tracking
    const [editingRowId, setEditingRowId] = useState<string | null>(null);

    // Track if line items have unsaved changes
    const hasUnsavedLineItems = useMemo(() => {
        // If currently editing, there are unsaved changes
        if (editingRowId !== null) {
            return true;
        }

        // If no saved data, check if line items have been modified from initial state
        if (!step1Data?.lineItems) {
            const hasNonEmptyItems = lineItems.some(item =>
                item.category || item.activityDescription || item.price > 0
            );
            return hasNonEmptyItems;
        }

        // Compare current line items with saved line items
        if (lineItems.length !== step1Data.lineItems.length) {
            return true;
        }

        // Deep compare each line item (excluding id and lineNumber which may differ)
        return lineItems.some((item, index) => {
            const savedItem = step1Data.lineItems[index];
            if (!savedItem) return true;

            return (
                item.category !== savedItem.category ||
                item.activityDescription !== savedItem.activityDescription ||
                item.quantity !== savedItem.quantity ||
                item.uom !== savedItem.uom ||
                item.price !== savedItem.price ||
                item.amount !== savedItem.amount
            );
        });
    }, [lineItems, step1Data, editingRowId]);

    // Warn before leaving page with unsaved line item changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedLineItems) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedLineItems]);

    // Calculate actual amount (sum of all line item amounts)
    const actualAmount = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + item.amount, 0);
    }, [lineItems]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Validation
    const isFormValid = useMemo(() => {
        const hasAllFields = sourceOfFunds && costCenter && descriptionPurpose && dateRange?.from && dateRange?.to && currency;
        const hasValidLineItems = lineItems.length > 0 && lineItems.every(item =>
            item.category &&
            item.activityDescription &&
            item.quantity > 0 &&
            item.uom &&
            item.price > 0
        );
        return hasAllFields && hasValidLineItems;
    }, [sourceOfFunds, costCenter, descriptionPurpose, dateRange, currency, lineItems]);

    // Handlers
    const handleAddLineItem = () => {
        const newItem: LiquidationLineItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            lineNumber: lineItems.length + 1,
            category: "",
            activityDescription: "",
            quantity: 1,
            uom: "",
            price: 0,
            amount: 0
        };
        setLineItems([...lineItems, newItem]);
        setEditingRowId(newItem.id);
    };

    const handleDeleteLineItem = (id: string) => {
        const updatedItems = lineItems
            .filter(item => item.id !== id)
            .map((item, index) => ({ ...item, lineNumber: index + 1 }));
        setLineItems(updatedItems);
        if (editingRowId === id) {
            setEditingRowId(null);
        }
    };

    const handleEditLineItem = (id: string) => {
        setEditingRowId(id === editingRowId ? null : id);
    };

    const handleLineItemChange = (id: string, field: keyof LiquidationLineItem, value: any) => {
        setLineItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    // Recalculate amount if quantity or price changes
                    if (field === 'quantity' || field === 'price') {
                        updatedItem.amount = updatedItem.quantity * updatedItem.price;
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    // ✅ ISSUE 6: Validation on Save
    const handleSaveLineItem = (item: LiquidationLineItem) => {
        // Validate all required fields
        if (!item.category) {
            toast.error('Please select a category');
            return;
        }
        if (!item.activityDescription || item.activityDescription.trim() === '') {
            toast.error('Please enter an activity/description');
            return;
        }
        if (!item.quantity || item.quantity <= 0) {
            toast.error('Please enter a valid quantity (greater than 0)');
            return;
        }
        if (!item.uom) {
            toast.error('Please select a unit of measure (UOM)');
            return;
        }
        if (item.price === undefined || item.price <= 0) {
            toast.error('Please enter a valid price (greater than 0)');
            return;
        }

        // All validations passed - save the item
        setEditingRowId(null);
        toast.success('Line item saved successfully');
    };

    const handleNext = () => {
        if (!isFormValid) return;

        const data: LiquidationStep1Data = {
            sourceOfFunds,
            costCenter,
            descriptionPurpose,
            dateRange,
            currency,
            lineItems
        };

        saveStep1(data);
        navigate('/liquidation/step2');
    };

    const handleBack = () => {
        if (hasUnsavedLineItems) {
            if (window.confirm('You have unsaved changes to line items. Are you sure you want to leave?')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Step Progress Indicator */}
            <Stepper steps={LIQUIDATION_STEPS} currentStep={1} showLeadingLine={false} />

            {/* Main Form Card */}
            <div className="rounded-[20px] bg-[#fcfcfc] p-[20px]">
                {/* Form Fields Grid - Row 1 */}
                <div className="mb-[20px] grid grid-cols-2 gap-[40px] px-[20px]">
                    {/* Source of Funds */}
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-['Montserrat'] text-[14px] font-bold leading-[20px] text-[#b1b1b1]">
                            Source of Funds
                        </label>
                        <Select value={sourceOfFunds} onValueChange={setSourceOfFunds} disabled>
                            <SelectTrigger className="!h-[44px] w-full border border-[#b1b1b1] bg-white font-['Montserrat'] text-[14px] font-normal leading-[20px] text-[#b1b1b1]">
                                <SelectValue placeholder="General Fund" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General Fund">General Fund</SelectItem>
                                <SelectItem value="Operating Fund">Operating Fund</SelectItem>
                                <SelectItem value="Training Fund">Training Fund</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cost Center */}
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-['Montserrat'] text-[14px] font-bold leading-[20px] text-[#b1b1b1]">
                            Cost Center
                        </label>
                        <Select value={costCenter} onValueChange={setCostCenter} disabled>
                            <SelectTrigger className="!h-[44px] w-full border border-[#b1b1b1] bg-white font-['Montserrat'] text-[14px] font-normal leading-[20px] text-[#b1b1b1]">
                                <SelectValue placeholder="Select Cost Center" />
                            </SelectTrigger>
                            <SelectContent>
                                {COST_CENTER_OPTIONS.map((center) => (
                                    <SelectItem key={center} value={center} className="font-['Montserrat'] text-[14px]">
                                        {center}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Form Fields Grid - Row 2 */}
                <div className="mb-[20px] grid grid-cols-2 gap-[40px] px-[20px]">
                    {/* Description/Purpose */}
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-['Montserrat'] text-[14px] font-bold leading-[20px] text-[#b1b1b1]">
                            Description/Purpose
                        </label>
                        <Input
                            value={descriptionPurpose}
                            onChange={(e) => setDescriptionPurpose(e.target.value)}
                            placeholder="ex"
                            disabled
                            className="!h-[44px] w-full border border-[#b1b1b1] bg-white font-['Montserrat'] text-[14px] font-normal leading-[20px] text-[#b1b1b1]"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-['Montserrat'] text-[14px] font-bold leading-[20px] text-[#b1b1b1]">
                            Date Range
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled
                                    className="w-full h-[44px] justify-start text-left font-normal border-[#b1b1b1] hover:bg-white"
                                >
                                    <CalendarIcon className="mr-2 h-5 w-5 text-[#b1b1b1]" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <span className="font-['Montserrat'] text-[14px] text-[#b1b1b1]">
                                                {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                                            </span>
                                        ) : (
                                            <span className="font-['Montserrat'] text-[14px] text-[#b1b1b1]">
                                                {format(dateRange.from, 'MMM dd, yyyy')}
                                            </span>
                                        )
                                    ) : (
                                        <span className="font-['Montserrat'] text-[14px] text-[#b1b1b1]">Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Currency */}
                <div className="mb-[20px] grid grid-cols-2 gap-[40px] px-[20px]">
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-['Montserrat'] text-[14px] font-bold leading-[20px] text-[#b1b1b1]">
                            Currency
                        </label>
                        <Select value={currency} onValueChange={(val) => setCurrency(val as 'PHP' | 'USD' | 'EUR')} disabled>
                            <SelectTrigger className="!h-[44px] w-full border border-[#b1b1b1] bg-white font-['Montserrat'] text-[14px] font-normal leading-[20px] text-[#b1b1b1]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PHP">PHP</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Empty space for alignment */}
                    <div></div>
                </div>

                {/* Line Items Table */}
                <div className="flex flex-col mt-[10px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#001c43] hover:bg-[#001c43]">
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[60px] rounded-tl-[10px]">
                                    Line/Item
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[168px]">
                                    Category
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[450px]">
                                    Activity/Description
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[100px]">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[102px]">
                                    UOM
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[102px]">
                                    Price
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[102px]">
                                    Amount
                                </TableHead>
                                <TableHead className="text-white text-center font-['Montserrat'] font-semibold text-[12px] w-[102px] rounded-tr-[10px]">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {lineItems.map((item, index) => {
                                const isEditing = editingRowId === item.id;

                                return (
                                    <TableRow
                                        key={item.id}
                                        className="bg-white hover:bg-[#FAFAFA]"
                                    >
                                        {/* Line Number */}
                                        <TableCell className="text-center font-['Montserrat'] text-[12px] text-[#001c43]">
                                            {index + 1}
                                        </TableCell>

                                        {isEditing ? (
                                            <>
                                                {/* Category - Editing */}
                                                <TableCell className="py-2">
                                                    <Select
                                                        value={item.category}
                                                        onValueChange={(value) => handleLineItemChange(item.id, 'category', value)}
                                                    >
                                                        <SelectTrigger className="w-full h-[36px] text-[12px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CATEGORIES.map((cat) => (
                                                                <SelectItem key={cat} value={cat} className="text-[12px]">
                                                                    {cat}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                {/* Activity - Editing */}
                                                <TableCell className="py-2">
                                                    <Input
                                                        value={item.activityDescription}
                                                        onChange={(e) => handleLineItemChange(item.id, 'activityDescription', e.target.value)}
                                                        placeholder="Enter activity"
                                                        className="h-[36px] text-[12px]"
                                                    />
                                                </TableCell>

                                                {/* Quantity - Editing */}
                                                <TableCell className="py-2">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleLineItemChange(item.id, 'quantity', Number(e.target.value))}
                                                        placeholder="0"
                                                        className="h-[36px] text-[12px] text-center"
                                                        min="0"
                                                    />
                                                </TableCell>

                                                {/* UOM - Editing */}
                                                <TableCell className="py-2">
                                                    <Select
                                                        value={item.uom}
                                                        onValueChange={(value) => handleLineItemChange(item.id, 'uom', value)}
                                                    >
                                                        <SelectTrigger className="w-full h-[36px] text-[12px]">
                                                            <SelectValue placeholder="UOM" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {UOM_OPTIONS.map((uom) => (
                                                                <SelectItem key={uom} value={uom} className="text-[12px]">
                                                                    {uom}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                {/* Price - Editing */}
                                                <TableCell className="py-2">
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleLineItemChange(item.id, 'price', Number(e.target.value))}
                                                        placeholder="0.00"
                                                        className="h-[36px] text-[12px] text-center"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </TableCell>

                                                {/* Amount - Calculated */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {formatCurrency(item.amount)}
                                                </TableCell>

                                                {/* Actions - Save/Cancel - ✅ WITH VALIDATION */}
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleSaveLineItem(item)}
                                                            className="text-[#114b9f] hover:text-[#0d3a7a] text-[12px] font-medium"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                // If it's a new unsaved item, remove it
                                                                if (!item.category && !item.activityDescription) {
                                                                    handleDeleteLineItem(item.id);
                                                                }
                                                                setEditingRowId(null);
                                                            }}
                                                            className="text-[#e50019] hover:text-[#cc0017] text-[12px] font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                {/* Category - Display */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {item.category || "Category 1"}
                                                </TableCell>

                                                {/* Activity - Display */}
                                                <TableCell className="text-[12px] font-['Montserrat'] text-[#001c43] truncate" title={item.activityDescription}>
                                                    {item.activityDescription || "Activity"}
                                                </TableCell>

                                                {/* Quantity - Display */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {item.quantity}
                                                </TableCell>

                                                {/* UOM - Display */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {item.uom || "Text"}
                                                </TableCell>

                                                {/* Price - Display */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {formatCurrency(item.price)}
                                                </TableCell>

                                                {/* Amount - Display */}
                                                <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                    {formatCurrency(item.amount)}
                                                </TableCell>

                                                {/* Actions - Edit/Delete */}
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <PencilLine
                                                            className="w-[18px] h-[18px] text-[#114b9f] cursor-pointer hover:text-[#0d3a7a]"
                                                            onClick={() => handleEditLineItem(item.id)}
                                                        />
                                                        <CircleMinus
                                                            className="w-[18px] h-[18px] text-[#e50019] cursor-pointer hover:text-[#cc0017]"
                                                            onClick={() => handleDeleteLineItem(item.id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}

                            {/* Add Row Button */}
                            <TableRow className="bg-[#F5F5F5] hover:bg-[#FAFAFA]">
                                <TableCell className="text-center py-3 cursor-pointer bg-white" onClick={handleAddLineItem}>
                                    <div className="flex items-center justify-center">
                                        <Plus className="w-[20px] h-[20px] text-[#001c43] hover:text-[#002856] transition-colors" />
                                    </div>
                                </TableCell>
                                <TableCell colSpan={7}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {/* Total Amount Footer */}
                    <div className="bg-white rounded-b-[10px] flex justify-end gap-[20px]">
                        <div className="bg-[#b1b1b1] text-white rounded-b-[8px] px-[24px] py-[12px] font-['Montserrat'] font-bold min-w-[280px] flex items-center justify-between">
                            <span className="text-[11px]">Requested Amount:</span>
                            <span className="text-[14px]">{currency} {formatCurrency(requestedAmount)}</span>
                        </div>
                        <div className="bg-[#114b9f] text-white rounded-b-[10px] px-[24px] py-[12px] font-['Montserrat'] font-bold min-w-[280px] flex items-center justify-between">
                            <span className="text-[11px]">Actual Amount:</span>
                            <span className="text-[14px]">{currency} {formatCurrency(actualAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-[10px] mt-[20px]">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="h-[46px] w-[137px] gap-[10px] rounded-[10px] bg-white px-[20px] py-[8px] font-['Montserrat'] text-[14px] font-medium leading-[20px] text-[#001c43] hover:bg-gray-50"
                    >
                        <div className="rotate-180">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!isFormValid}
                        className="h-[46px] w-[137px] gap-[5px] rounded-[10px] bg-[#001c43] px-[20px] py-[8px] font-['Montserrat'] text-[14px] font-medium leading-[20px] text-white hover:bg-[#002855] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}
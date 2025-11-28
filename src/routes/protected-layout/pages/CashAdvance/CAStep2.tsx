import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight, Plus, PencilLine, CircleMinus, Calendar as CalendarIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import Stepper from '@/components/Stepper';
import type { LineItem } from '@/types/cashAdvance';
import { useCashAdvanceStore } from '@/store/useCashAdvanceStore';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar } from "@/components/ui/calendar";

const CASH_ADVANCE_STEPS = [
    { label: 'Requestor Information' },
    { label: 'Request Details' },
    { label: 'Bank Details' },
    { label: 'Supporting Documents' },
    { label: 'Review & Submit' },
];

// Source of Funds options
const SOURCE_OF_FUNDS = [
    'General Fund',
    'Funds Payable',
    'DOST Fund',
    'Special Fund',
    'Sponsorship Fund',
];

// Category options
const CATEGORIES = [
    'Supplies',
    'Meals',
    'Transport',
    'Accommodation',
    'Equipment',
    'Services',
    'Other',
];

// UOM (Unit of Measure) options
const UOM_OPTIONS = [
    'Sets',
    'Pax',
    'Trips',
];

// Currency options
const CURRENCIES = [
    'PHP',
    'USD',
];

export default function CAStep2() {
    const navigate = useNavigate();
    const { step2Data, saveStep2 } = useCashAdvanceStore();

    // Initialize state
    const [sourceOfFunds, setSourceOfFunds] = useState('');
    const [costCenter, setCostCenter] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('PHP');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [lineItems, setLineItems] = useState<LineItem[]>([]);

    // Load saved data when component mounts
    useEffect(() => {
        if (step2Data) {
            setSourceOfFunds(step2Data.sourceOfFunds);
            setCostCenter(step2Data.costCenter);
            setDescription(step2Data.description);
            setCurrency(step2Data.currency);
            setDateRange(step2Data.dateRange);
            setLineItems(step2Data.lineItems);
        }
    }, [step2Data]);

    // Editing state
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Partial<LineItem>>({});

    // Calculate total amount
    const totalAmount = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + item.amount, 0);
    }, [lineItems]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Add new line item
    const handleAddLineItem = () => {
        const newItem: LineItem = {
            id: `item-${Date.now()}`,
            category: '',
            activity: '',
            quantity: 0,
            uom: '',
            price: 0,
            amount: 0,
        };
        setLineItems([...lineItems, newItem]);
        setEditingItemId(newItem.id);
        setEditingData(newItem);
    };

    // Edit line item
    const handleEditLineItem = (item: LineItem) => {
        setEditingItemId(item.id);
        setEditingData({ ...item });
    };

    // Save line item
    const handleSaveLineItem = () => {
        if (!editingItemId) return;

        // Validation
        if (!editingData.category) {
            toast.error('Please select a category');
            return;
        }
        if (!editingData.activity) {
            toast.error('Please enter an activity/description');
            return;
        }
        if (!editingData.quantity || editingData.quantity <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }
        if (!editingData.uom) {
            toast.error('Please select a unit of measure (UOM)');
            return;
        }
        if (editingData.price === undefined || editingData.price < 0) {
            toast.error('Please enter a valid price');
            return;
        }

        // Calculate amount
        const amount = editingData.quantity * editingData.price;

        // Update line items
        setLineItems(lineItems.map(item =>
            item.id === editingItemId
                ? { ...editingData, id: item.id, amount } as LineItem
                : item
        ));

        // Reset editing state
        setEditingItemId(null);
        setEditingData({});
        toast.success('Line item saved');
    };

    // Delete line item
    const handleDeleteLineItem = (id: string) => {
        setLineItems(lineItems.filter(item => item.id !== id));
        if (editingItemId === id) {
            setEditingItemId(null);
            setEditingData({});
        }
        toast.success('Line item deleted');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        // If it's a new unsaved item, remove it
        const editingItem = lineItems.find(item => item.id === editingItemId);
        if (editingItem && !editingItem.category && !editingItem.activity) {
            setLineItems(lineItems.filter(item => item.id !== editingItemId));
        }
        setEditingItemId(null);
        setEditingData({});
    };

    // Handle Back
    const handleBack = () => {
        navigate('/request/cash-advance');
    };

    // Handle Next
    const handleNext = () => {
        // Validation
        if (!sourceOfFunds) {
            toast.error('Please select a Source of Funds');
            return;
        }
        if (!costCenter) {
            toast.error('Please enter a Cost Center');
            return;
        }
        if (!description) {
            toast.error('Please enter a Description/Purpose');
            return;
        }
        if (!dateRange?.from || !dateRange?.to) {
            toast.error('Please select a complete date range (start and end date)');
            return;
        }
        if (lineItems.length === 0) {
            toast.error('Please add at least one line item');
            return;
        }

        // Check for incomplete line items
        const incompleteItems = lineItems.filter(item =>
            !item.category || !item.activity || !item.quantity || !item.uom || item.price < 0
        );
        if (incompleteItems.length > 0) {
            toast.error('Please complete all line items');
            return;
        }

        // Save data to Zustand store
        const dataToSave = {
            sourceOfFunds,
            costCenter,
            description,
            currency,
            dateRange: {
                from: dateRange?.from,
                to: dateRange?.to,
            },
            lineItems,
            totalAmount,
        };
        saveStep2(dataToSave);

        // Navigate to Step 3
        toast.success('Request details saved!');
        navigate('/request/cash-advance/step3');
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] px-[30px] py-[20px] gap-[20px]">
            {/* Step Progress Indicator */}
            <Stepper steps={CASH_ADVANCE_STEPS} currentStep={2} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-[20px]">
                {/* Header with Info Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[20px]">
                        <h1 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] text-[#001c43]">
                            Step 2
                        </h1>
                        <h2 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] text-[#001c43]">
                            Request Details
                        </h2>
                    </div>
                    <div className="w-[40px] h-[40px] bg-white rounded-[10px] shadow-[1px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Info className="w-[24px] h-[24px] text-[#e50019]" />
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-[20px] p-[20px] flex-1 flex flex-col gap-[20px]">
                    {/* Input Fields Grid */}
                    <div className="grid grid-cols-2 gap-x-[50px] gap-y-[20px] px-[20px]">
                        {/* Left Column */}
                        {/* Source of Funds */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Source of Funds
                            </label>
                            <Select value={sourceOfFunds} onValueChange={setSourceOfFunds}>
                                <SelectTrigger className="w-full !h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                    <SelectValue placeholder="General Fund" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOURCE_OF_FUNDS.map((fund) => (
                                        <SelectItem key={fund} value={fund} className="font-['Montserrat'] text-[14px]">
                                            {fund}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cost Center */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Cost Center
                            </label>
                            <Input
                                value={costCenter}
                                onChange={(e) => setCostCenter(e.target.value)}
                                placeholder="CCIS-2025-01"
                                className="!h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]"
                            />
                        </div>

                        {/* Description/Purpose */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Description/Purpose
                            </label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="ex"
                                className="!h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Date Range
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full h-[44px] justify-start text-left font-normal border-[#b1b1b1] hover:bg-white"
                                    >
                                        <CalendarIcon className="mr-2 h-5 w-5 text-[#001c43]" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <span className="font-['Montserrat'] text-[14px] text-[#001c43]">
                                                    {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                                                </span>
                                            ) : (
                                                <span className="font-['Montserrat'] text-[14px] text-[#001c43]">
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

                        {/* Currency */}
                        <div className="flex flex-col gap-[6px]">
                            <label className="font-['Montserrat'] font-bold text-[14px] leading-[20px] text-[#001c43]">
                                Currency
                            </label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger className="w-full !h-[44px] bg-white border border-[#b1b1b1] rounded-[6px] px-[12px] font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map((curr) => (
                                        <SelectItem key={curr} value={curr} className="font-['Montserrat'] text-[14px]">
                                            {curr}
                                        </SelectItem>
                                    ))}
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
                                    const isEditing = editingItemId === item.id;

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="bg-white hover:bg-[#FAFAFA]"
                                        >
                                            {/* Line Number */}
                                            <TableCell className="text-center font-['Montserrat'] text-[14px] text-[#001c43]">
                                                {index + 1}
                                            </TableCell>

                                            {isEditing ? (
                                                <>
                                                    {/* Category - Editing */}
                                                    <TableCell className="py-2">
                                                        <Select
                                                            value={editingData.category || ''}
                                                            onValueChange={(value) => setEditingData({ ...editingData, category: value })}
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
                                                            value={editingData.activity || ''}
                                                            onChange={(e) => setEditingData({ ...editingData, activity: e.target.value })}
                                                            placeholder="Enter activity"
                                                            className="h-[36px] text-[12px]"
                                                        />
                                                    </TableCell>

                                                    {/* Quantity - Editing */}
                                                    <TableCell className="py-2">
                                                        <Input
                                                            type="number"
                                                            value={editingData.quantity || ''}
                                                            onChange={(e) => setEditingData({ ...editingData, quantity: Number(e.target.value) })}
                                                            placeholder="0"
                                                            className="h-[36px] text-[12px] text-center"
                                                            min="0"
                                                        />
                                                    </TableCell>

                                                    {/* UOM - Editing */}
                                                    <TableCell className="py-2">
                                                        <Select
                                                            value={editingData.uom || ''}
                                                            onValueChange={(value) => setEditingData({ ...editingData, uom: value })}
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
                                                            value={editingData.price || ''}
                                                            onChange={(e) => setEditingData({ ...editingData, price: Number(e.target.value) })}
                                                            placeholder="0.00"
                                                            className="h-[36px] text-[12px] text-center"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </TableCell>

                                                    {/* Amount - Calculated */}
                                                    <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                        {formatCurrency((editingData.quantity || 0) * (editingData.price || 0))}
                                                    </TableCell>

                                                    {/* Actions - Save/Cancel */}
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={handleSaveLineItem}
                                                                className="text-[#114b9f] hover:text-[#0d3a7a] text-[12px] font-medium"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
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
                                                        {item.category || '-'}
                                                    </TableCell>

                                                    {/* Activity - Display */}
                                                    <TableCell className="text-[12px] font-['Montserrat'] text-[#001c43] truncate" title={item.activity}>
                                                        {item.activity || '-'}
                                                    </TableCell>

                                                    {/* Quantity - Display */}
                                                    <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                        {item.quantity}
                                                    </TableCell>

                                                    {/* UOM - Display */}
                                                    <TableCell className="text-center text-[12px] font-['Montserrat'] text-[#001c43]">
                                                        {item.uom || '-'}
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
                                                                onClick={() => handleEditLineItem(item)}
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
                        <div className="bg-white rounded-b-[10px] flex justify-end">
                            <div className="bg-[#114b9f] text-white rounded-bl-[8px] rounded-br-[10px] px-[24px] py-[12px] font-['Montserrat'] font-bold min-w-[280px] flex items-center justify-between">
                                <span className="text-[12px]">Total Amount:</span>
                                <span className="text-[14px]">{currency} {formatCurrency(totalAmount)}</span>
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
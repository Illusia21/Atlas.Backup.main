import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'

interface FilterPanelProps {
    onApply: (filters: FilterValues) => void
    onReset: () => void
}

export interface FilterValues {
    requestType: string
    dateRange: DateRange | undefined
}

export function FilterPanel({ onApply, onReset }: FilterPanelProps) {
    const [requestType, setRequestType] = useState<string>('all')
    const [date, setDate] = useState<DateRange | undefined>()

    const handleApply = () => {
        onApply({
            requestType,
            dateRange: date,
        })
    }

    const handleReset = () => {
        setRequestType('all')
        setDate(undefined)
        onReset()
    }

    return (
        <div className="w-[320px] bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h3 className="text-[16px] font-semibold text-[#001c43]">Filter by:</h3>

            {/* Request Type */}
            <div className="space-y-2">
                <label className="text-[14px] font-medium text-[#001c43]">Request Type:</label>
                <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Reimbursement">Reimbursement</SelectItem>
                        <SelectItem value="Vendor Payment">Vendor Payment</SelectItem>
                        <SelectItem value="Cash Advance">Cash Advance</SelectItem>
                        <SelectItem value="Travel Request">Travel Request</SelectItem>
                        <SelectItem value="Purchase Request">Purchase Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
                <label className="text-[14px] font-medium text-[#001c43]">Date Range:</label>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y')} -{' '}
                                        {format(date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
                <Button
                    onClick={handleApply}
                    className="w-full bg-[#001c43] hover:bg-[#002856] text-white"
                >
                    Apply
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-[#001c43] text-[#001c43] hover:bg-gray-50"
                >
                    Reset
                </Button>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/selectRFPStep1'
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
        <div className="w-[200px] bg-white rounded-lg shadow-lg p-4 space-y-4"> {/* Changed from w-[260px] */}
            <h3 className="text-[14px] font-semibold text-[#001c43]">Filter by:</h3>

            {/* Request Type */}
            <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#001c43]">Request Type:</label>
                <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger className="w-full h-9 text-[12px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="text-[12px]">
                        <SelectItem value="all" className="text-[12px]">All Types</SelectItem>
                        <SelectItem value="Reimbursement" className="text-[12px]">Reimbursement</SelectItem>
                        <SelectItem value="Vendor Payment" className="text-[12px]">Vendor Payment</SelectItem>
                        <SelectItem value="Cash Advance" className="text-[12px]">Cash Advance</SelectItem>
                        <SelectItem value="Travel Request" className="text-[12px]">Travel Request</SelectItem>
                        <SelectItem value="Purchase Request" className="text-[12px]">Purchase Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#001c43]">Date Range:</label>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-9 justify-start text-left font-normal text-[11px] overflow-hidden"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            {date?.from ? (
                                date.to ? (
                                    <span className="truncate">
                                        {format(date.from, 'MM/dd/yy')} - {format(date.to, 'MM/dd/yy')}
                                    </span>
                                ) : (
                                    <span className="truncate">
                                        {format(date.from, 'MM/dd/yy')}
                                    </span>
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="right">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
                <Button
                    onClick={handleApply}
                    className="w-full h-10 bg-[#001c43] hover:bg-[#002856] text-white text-[13px] font-medium"
                >
                    Apply
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full h-10 border-[#001c43] text-[#001c43] hover:bg-gray-50 text-[13px] font-medium"
                >
                    Reset
                </Button>
            </div>
        </div>
    )
}
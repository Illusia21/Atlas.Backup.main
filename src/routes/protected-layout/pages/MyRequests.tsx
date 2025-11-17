import { useState, useMemo, useRef } from 'react'
import { Eye, Search } from 'lucide-react'
import { mockRequests } from '@/data/mockRequests'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { RequestStatus } from '@/types'

function MyRequests() {
    // State for filters
    const [activeTab, setActiveTab] = useState<RequestStatus | 'All'>('All')
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Filter tabs
    const tabs: Array<RequestStatus | 'All'> = [
        'All',
        'Pending',
        'Returned',
        'Completed',
        'Rejected',
        'Cancelled',
    ]

    // Filter logic
    const filteredRequests = useMemo(() => {
        let filtered = mockRequests

        // Filter by tab
        if (activeTab !== 'All') {
            filtered = filtered.filter((req) => req.status === activeTab)
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (req) =>
                    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.requestType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    req.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        return filtered
    }, [activeTab, searchQuery])

    // Focus search input when icon is clicked
    const handleSearchIconClick = () => {
        searchInputRef.current?.focus()
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex justify-end">
                <div className="relative w-[438px]">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search by Request Type, Description, ID, etc."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-[12px] w-full rounded-[20px] border border-[#b1b1b1] bg-white px-[20px] py-[13px] font-['Montserrat'] text-sm font-normal leading-5 text-[#001c43] placeholder:text-[#b1b1b1] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search
                        onClick={handleSearchIconClick}
                        className="absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#001c43] cursor-pointer hover:text-[#002856] transition-colors"
                    />
                </div>
            </div>

            {/* Horizontal Tab Bar (Version 1) */}
            <div className="flex items-center justify-center">
                <div className="flex items-center rounded-[6px] bg-[#fcfcfc] p-[4px] w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-[196px] cursor-pointer px-[12px] py-[6px] text-center font-['Montserrat'] text-[12px] font-normal leading-5 transition-colors ${activeTab === tab
                                ? 'rounded-[4px] bg-white text-[#09090b] shadow-sm'
                                : 'text-[#71717a]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#001C43] hover:bg-[#001C43]">
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px]">Request ID</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[180px]">Request Type</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[140px]">Date Requested</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[300px]">Description</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[100px]">Amount</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[140px]">Status</TableHead>
                            <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="text-[12px] text-center">{request.id}</TableCell>
                                    <TableCell className="text-[12px] text-center">{request.requestType}</TableCell>
                                    <TableCell className="text-[12px] text-center">{request.dateRequested}</TableCell>
                                    <TableCell className="text-[12px] text-center">{request.description}</TableCell>
                                    <TableCell className="text-[12px] text-center">
                                        {request.currency} {request.amount}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StatusBadge status={request.status} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MyRequests
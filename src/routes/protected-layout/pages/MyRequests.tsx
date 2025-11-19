import { useState, useMemo, useRef } from 'react'
import { Eye, Search, Table as TableIcon, LayoutGrid, ListFilterPlus } from 'lucide-react'
import { mockRequests } from '@/data/mockRequests'
import { StatusBadge } from '@/components/StatusBadge'
import { RequestCard } from '@/components/RequestCard'
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
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
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
        <div className="space-y-6 w-full overflow-x-hidden">
            {/* View Toggle, Filter, and Search Bar */}
            <div className="flex items-center justify-between gap-4">
                {/* Left Section - View Toggle */}
                <div className="flex w-[84px] items-center rounded-[6px] bg-[#fcfcfc] p-[4px]">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex flex-1 items-center justify-center rounded-[4px] px-[6px] py-[6px] transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : ''
                            }`}
                    >
                        <TableIcon className={`h-6 w-6 ${viewMode === 'table' ? 'text-[#001c43]' : 'text-[#b1b1b1]'}`} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex flex-1 items-center justify-center rounded-[4px] px-[6px] py-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                            }`}
                    >
                        <LayoutGrid className={`h-6 w-6 ${viewMode === 'grid' ? 'text-[#001c43]' : 'text-[#b1b1b1]'}`} />
                    </button>
                </div>

                {/* Right Section - Filter and Search Bar grouped together */}
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    {/* Filter Button */}
                    <button className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors flex-shrink-0">
                        <ListFilterPlus className="h-6 w-6 text-[#001c43]" />
                    </button>

                    {/* Search Bar */}
                    <div className="relative min-w-[438px] max-w-[438px]">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by Request Type, Description, ID, etc."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-[12px] w-full rounded-[20px] border border-[#b1b1b1] bg-white px-[20px] py-[13px] font-['Montserrat'] font-normal leading-5 text-[#001c43] placeholder:text-[#b1b1b1] focus:outline-none focus:border-[#001c43]"
                        />
                        <Search
                            onClick={handleSearchIconClick}
                            className="absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#001c43] cursor-pointer hover:text-[#002856] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Horizontal Tab Bar */}
            <div className="flex items-center justify-center overflow-x-auto">
                <div className="flex items-center rounded-[6px] bg-[#fcfcfc] p-[4px] w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[120px] cursor-pointer px-[12px] py-[6px] text-center font-['Montserrat'] text-[12px] font-normal leading-5 transition-colors ${activeTab === tab
                                ? 'rounded-[4px] bg-white text-[#09090b] shadow-sm'
                                : 'text-[#71717a]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conditional Rendering: Table or Card View */}
            {viewMode === 'table' ? (
                /* Table View */
                <div className="bg-white rounded-lg border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#001C43] hover:bg-[#001C43]">
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px] rounded-tl-[12px]">Request ID</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[180px]">Request Type</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[140px]">Date Requested</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[300px]">Description</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[100px]">Amount</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[140px]">Status</TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px] rounded-tr-[12px]">Action</TableHead>
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
            ) : (
                /* Card Grid View */
                <div className="min-h-[400px] w-full">
                    {filteredRequests.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <p className="text-center text-gray-500 text-[14px]">
                                No requests found.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {filteredRequests.map((request) => (
                                <RequestCard key={request.id} request={request} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyRequests
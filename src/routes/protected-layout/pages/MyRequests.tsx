import { useState, useMemo } from 'react'
import { Eye } from 'lucide-react'
import { mockRequests } from '@/data/mockRequests'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

    return (
        <div className="p-6 space-y-6">
            {/* Header with Tabs and Search */}
            <div className="space-y-4">
                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {tabs.map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'default' : 'outline'}
                            onClick={() => setActiveTab(tab)}
                            className="rounded-md"
                        >
                            {tab}
                        </Button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="flex justify-end">
                    <Input
                        placeholder="Search by ID, type, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#001C43] hover:bg-[#001C43]">
                            <TableHead className="text-white font-semibold">Request ID</TableHead>
                            <TableHead className="text-white font-semibold">Request Type</TableHead>
                            <TableHead className="text-white font-semibold">Date Requested</TableHead>
                            <TableHead className="text-white font-semibold">Description</TableHead>
                            <TableHead className="text-white font-semibold">Amount</TableHead>
                            <TableHead className="text-white font-semibold">Status</TableHead>
                            <TableHead className="text-white font-semibold text-center">Action</TableHead>
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
                                    <TableCell className="font-medium">{request.id}</TableCell>
                                    <TableCell>{request.requestType}</TableCell>
                                    <TableCell>{request.dateRequested}</TableCell>
                                    <TableCell>{request.description}</TableCell>
                                    <TableCell>
                                        {request.currency} {request.amount}
                                    </TableCell>
                                    <TableCell>
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
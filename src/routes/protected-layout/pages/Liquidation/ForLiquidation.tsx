import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, Table as TableIcon, LayoutGrid, ListFilterPlus, ArrowUpDown } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { RequestCard } from '@/components/RequestCard';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FilterPanel, type FilterValues } from '@/components/FilterPanel';
import type { LiquidationRequest, LiquidationStatus } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ForLiquidation() {
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // State
    const [activeTab, setActiveTab] = useState<LiquidationStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    // Filter panel state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterValues>({
        requestType: 'all',
        dateRange: { from: undefined, to: undefined }
    });

    // Sorting state - Default: sort by date, descending (most recent first)
    const [sortBy, setSortBy] = useState<'date' | 'amount' | null>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Mock data - Only Cash Advance requests that reached liquidation phase
    const mockLiquidationRequests: LiquidationRequest[] = [
        {
            id: 'CA-2024-001',
            requestType: 'Cash Advance',
            dateRequested: '01/15/2024',
            description: 'Marketing campaign expenses for Q1',
            amount: 50000,
            currency: 'PHP',
            status: 'For Liquidation'
        },
        {
            id: 'CA-2024-002',
            requestType: 'Cash Advance',
            dateRequested: '01/18/2024',
            description: 'Office supplies and equipment purchase',
            amount: 1500,
            currency: 'USD',
            status: 'Pending'
        },
        {
            id: 'CA-2024-003',
            requestType: 'Cash Advance',
            dateRequested: '01/20/2024',
            description: 'Training and development program',
            amount: 2000,
            currency: 'EUR',
            status: 'Pending'
        },
        {
            id: 'CA-2024-004',
            requestType: 'Cash Advance',
            dateRequested: '01/22/2024',
            description: 'Client meeting and entertainment expenses',
            amount: 3500,
            currency: 'EUR',
            status: 'Returned'
        },
        {
            id: 'CA-2024-005',
            requestType: 'Cash Advance',
            dateRequested: '01/25/2024',
            description: 'Research and development materials',
            amount: 4200,
            currency: 'EUR',
            status: 'Rejected'
        },
        {
            id: 'CA-2024-006',
            requestType: 'Cash Advance',
            dateRequested: '01/28/2024',
            description: 'Conference attendance and travel',
            amount: 75000,
            currency: 'PHP',
            status: 'Completed'
        },
        {
            id: 'CA-2024-007',
            requestType: 'Cash Advance',
            dateRequested: '02/01/2024',
            description: 'Emergency equipment repair',
            amount: 1200,
            currency: 'USD',
            status: 'Approved'
        }
    ];

    // TODO: Get current user from auth context when backend is ready
    // import { useAuth } from '@/hooks/useAuth';
    // const { currentUser } = useAuth();

    // Filter to show only current user's requests
    // Uncomment this when you have real authentication:
    // const userLiquidationRequests = mockLiquidationRequests.filter(
    //     req => req.userId === currentUser?.id
    // );

    // For now, use all mock data (replace with userLiquidationRequests when backend is ready)
    const userLiquidationRequests = mockLiquidationRequests;

    // Filter tabs
    const tabs: (LiquidationStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Returned', 'Rejected', 'Completed'];

    // Filter handlers
    const handleApplyFilters = (filters: FilterValues) => {
        setActiveFilters(filters);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setActiveFilters({
            requestType: 'all',
            dateRange: { from: undefined, to: undefined }
        });
        setIsFilterOpen(false);
    };

    // Check if any filters are active
    const hasActiveFilters = activeFilters.requestType !== 'all' ||
        activeFilters.dateRange?.from !== undefined ||
        activeFilters.dateRange?.to !== undefined;

    // Sort handler
    const handleSort = (column: 'date' | 'amount') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Filtered requests based on active tab, search query, filters, and sorting
    const filteredRequests = useMemo(() => {
        let requests = userLiquidationRequests; // Use user-specific data

        // Filter by tab
        if (activeTab !== 'All') {
            requests = requests.filter(req => req.status === activeTab);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            requests = requests.filter(req =>
                req.requestType.toLowerCase().includes(query) ||
                req.description.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query) ||
                req.currency.toLowerCase().includes(query)
            );
        }

        // Request Type filter
        if (activeFilters.requestType !== 'all') {
            requests = requests.filter(req => req.requestType === activeFilters.requestType);
        }

        // Date Range filter
        if (activeFilters.dateRange?.from || activeFilters.dateRange?.to) {
            requests = requests.filter(req => {
                const requestDate = new Date(req.dateRequested);
                let matchesDateRange = true;

                if (activeFilters.dateRange?.from) {
                    matchesDateRange = requestDate >= activeFilters.dateRange.from;
                }
                if (activeFilters.dateRange?.to && matchesDateRange) {
                    matchesDateRange = requestDate <= activeFilters.dateRange.to;
                }

                return matchesDateRange;
            });
        }

        // Sort
        if (sortBy) {
            requests = [...requests].sort((a, b) => {
                let comparison = 0;

                if (sortBy === 'date') {
                    const dateA = new Date(a.dateRequested).getTime();
                    const dateB = new Date(b.dateRequested).getTime();
                    comparison = dateA - dateB;
                } else if (sortBy === 'amount') {
                    comparison = a.amount - b.amount;
                }

                return sortOrder === 'asc' ? comparison : -comparison;
            });
        }

        return requests;
    }, [activeTab, searchQuery, activeFilters, sortBy, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRequests.slice(startIndex, endIndex);
    }, [filteredRequests, currentPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab, activeFilters, sortBy, sortOrder]);

    const handleSearchIconClick = () => {
        searchInputRef.current?.focus();
    };

    const handleViewRequest = (id: string) => {
        navigate(`/request/${id}`);
    };

    return (
        <div className="space-y-6 w-full">
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

                {/* Right Section - Reset Filter, Filter and Search Bar */}
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    {/* Reset Filter Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={handleResetFilters}
                            className="h-[32px] w-[124px] rounded-[10px] border border-[#001c43] bg-white hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0"
                        >
                            <span className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                Reset Filter
                            </span>
                        </button>
                    )}

                    {/* Filter Button */}
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors flex-shrink-0">
                                <ListFilterPlus className="h-6 w-6 text-[#001c43]" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <FilterPanel onApply={handleApplyFilters} onReset={handleResetFilters} />
                        </PopoverContent>
                    </Popover>

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

            {/* Status Tabs */}
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
                <div className="bg-white rounded-[12px] overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#001C43] hover:bg-[#001C43]">
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px]">
                                    Request ID
                                </TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[180px]">
                                    Request Type
                                </TableHead>
                                <TableHead
                                    className="text-white text-[12px] text-center font-semibold min-w-[140px] cursor-pointer hover:bg-[#002856] transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Date Requested
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[300px]">
                                    Description
                                </TableHead>
                                <TableHead
                                    className="text-white text-[12px] text-center font-semibold min-w-[100px] cursor-pointer hover:bg-[#002856] transition-colors"
                                    onClick={() => handleSort('amount')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Amount
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[140px]">
                                    Status
                                </TableHead>
                                <TableHead className="text-white text-[12px] text-center font-semibold min-w-[80px] rounded-tr-[12px]">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        No requests found for the selected filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="text-[12px] text-center">{request.id}</TableCell>
                                        <TableCell className="text-[12px] text-center">{request.requestType}</TableCell>
                                        <TableCell className="text-[12px] text-center">{request.dateRequested}</TableCell>
                                        <TableCell className="text-[12px] text-center">{request.description}</TableCell>
                                        <TableCell className="text-[12px] text-center">
                                            {request.currency} {request.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <StatusBadge status={request.status} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewRequest(request.id)}
                                            >
                                                <Eye className="w-[24px] h-[24px] text-[#114b9f]" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {filteredRequests.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            <div className="text-[12px] text-gray-600">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="text-[12px]"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 p-0 text-[12px] ${currentPage === page ? 'bg-[#001c43] hover:bg-[#002856]' : ''}`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="text-[12px]"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Card Grid View */
                <div className="min-h-[400px] w-full">
                    {paginatedRequests.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <p className="text-center text-gray-500 text-[14px]">
                                No requests found for the selected filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {paginatedRequests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={{
                                        ...request,
                                        amount: request.amount.toLocaleString(), // Convert number to string
                                        status: request.status as any // Cast status to avoid type error
                                    }}
                                    onViewClick={() => handleViewRequest(request.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls for Card View */}
                    {filteredRequests.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-4 py-4 bg-white rounded-lg border">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="text-[12px]"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 p-0 text-[12px] ${currentPage === page ? 'bg-[#001c43] hover:bg-[#002856]' : ''}`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="text-[12px]"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
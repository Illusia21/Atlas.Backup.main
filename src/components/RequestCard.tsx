import { Eye } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/button'
import type { Request } from '@/types'

interface RequestCardProps {
    request: Request
}

export function RequestCard({ request }: RequestCardProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Header: Request ID + Status Badge */}
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#001C43]">
                    {request.id}
                </h3>
                <StatusBadge status={request.status} />
            </div>

            {/* Request Details */}
            <div className="space-y-3">
                {/* Request Type */}
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Request Type
                    </p>
                    <p className="text-[12px] text-[#001C43] font-medium">
                        {request.requestType}
                    </p>
                </div>

                {/* Date Requested */}
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Date Requested
                    </p>
                    <p className="text-[12px] text-[#001C43]">
                        {request.dateRequested}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Description
                    </p>
                    <p className="text-[12px] text-[#001C43] line-clamp-2">
                        {request.description}
                    </p>
                </div>

                {/* Amount */}
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Amount
                    </p>
                    <p className="text-[14px] text-[#001C43] font-bold">
                        {request.currency} {request.amount}
                    </p>
                </div>
            </div>

            {/* Footer: View Button */}
            <div className="mt-6 flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                >
                    <Eye className="h-5 w-5 text-[#001C43]" />
                </Button>
            </div>
        </div>
    )
}
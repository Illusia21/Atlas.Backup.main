import { Eye } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import type { Request } from '@/types'

interface RequestCardProps {
    request: Request
}

export function RequestCard({ request }: RequestCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow py-4">
            {/* Header: Request ID + Status Badge */}
            <CardHeader className="pb-2 px-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[16px] font-bold text-[#001C43] font-['Montserrat']">
                        {request.id.split('-').pop() || request.id}
                    </h3>
                    <StatusBadge status={request.status} className="flex-shrink-0" />
                </div>
            </CardHeader>

            <CardContent className="space-y-3 px-4">
                {/* Request Type (no label, just value) */}
                <p className="text-[14px] text-[#001C43] font-['Montserrat']">
                    {request.requestType}
                </p>

                {/* Horizontal separator line */}
                <div className="border-t border-gray-200" />

                {/* Date Requested */}
                <p className="text-[12px] text-[#001C43] font-['Montserrat']">
                    <span className="font-semibold">Date Requested:</span>{' '}
                    <span className="font-normal">{request.dateRequested}</span>
                </p>

                {/* Description */}
                <p className="text-[12px] text-[#001C43] font-['Montserrat']">
                    <span className="font-semibold">Description:</span>{' '}
                    <span className="font-normal">{request.description}</span>
                </p>

                {/* Amount */}
                <p className="text-[12px] text-[#001C43] font-['Montserrat']">
                    <span className="font-semibold">Amount:</span>{' '}
                    <span className="font-normal">
                        {request.currency} {request.amount}
                    </span>
                </p>
            </CardContent>

            {/* Footer: View Button */}
            <CardFooter className="justify-end pt-2 px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                >
                    <Eye className="h-5 w-5 text-[#4A90E2]" />
                </Button>
            </CardFooter>
        </Card>
    )
}
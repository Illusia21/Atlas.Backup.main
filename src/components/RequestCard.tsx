import { Eye } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Separator } from './ui/separator'
import type { Request } from '@/types'

interface RequestCardProps {
    request: Request
    onViewClick?: () => void
}

export function RequestCard({ request, onViewClick }: RequestCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow py-4">
            {/* Header: Request ID + Status Badge */}
            <CardHeader className="pb-2 px-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[16px] font-bold text-[#001C43] font-['Montserrat']">
                            {request.id.split('-').pop() || request.id}
                        </h3>
                        <p className="text-[14px] text-[#001C43] font-['Montserrat']">
                            {request.requestType}
                        </p>
                    </div>
                    <StatusBadge status={request.status} className="flex-shrink-0" />
                </div>
                {/* Separator under Request Type */}
                <Separator className="bg-gray-200 mt-3 mb-2" />
            </CardHeader>

            <CardContent className="space-y-3 px-4">

                {/* Date Requested */}
                <p className="text-[14px] text-[#001C43] font-['Montserrat']">
                    <span className="font-bold">Date Requested:</span>{' '}
                    <span className="font-normal">{request.dateRequested}</span>
                </p>

                {/* Description */}
                <p className="text-[14px] text-[#001C43] font-['Montserrat']">
                    <span className="font-bold">Description:</span>{' '}
                    <span className="font-normal">{request.description}</span>
                </p>

                {/* Amount */}
                <p className="text-[14px] text-[#001C43] font-['Montserrat']">
                    <span className="font-bold">Amount:</span>{' '}
                    <span className="font-normal">
                        {request.currency} {typeof request.amount === 'number' ? request.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : request.amount}
                    </span>
                </p>
            </CardContent>

            {/* Footer: View Button */}
            <CardFooter className="justify-end pt-6 px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 !h-8 !w-8"
                    onClick={onViewClick}
                >
                    <Eye className="!h-5 !w-5 text-[#114B9F]" />
                </Button>
            </CardFooter>
        </Card>
    )
}
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
        <Card className="hover:shadow-md transition-shadow">
            {/* Header: Request ID + Status Badge */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[16px] font-bold text-[#001C43]">
                        {request.id}
                    </h3>
                    <StatusBadge status={request.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Request Type (no label, just value) */}
                <p className="text-[14px] text-[#001C43]">
                    {request.requestType}
                </p>

                {/* Horizontal separator line */}
                <div className="border-t border-gray-200" />

                {/* Date Requested */}
                <div>
                    <p className="text-[14px] text-[#001C43] font-semibold mb-1">
                        Date Requested:{' '}
                        <span className="font-normal">{request.dateRequested}</span>
                    </p>
                </div>

                {/* Description */}
                <div>
                    <p className="text-[14px] text-[#001C43] font-semibold mb-1">
                        Description:{' '}
                        <span className="font-normal">{request.description}</span>
                    </p>
                </div>

                {/* Amount */}
                <div>
                    <p className="text-[14px] text-[#001C43] font-semibold mb-1">
                        Amount:{' '}
                        <span className="font-normal">
                            {request.currency} {request.amount}
                        </span>
                    </p>
                </div>
            </CardContent>

            {/* Footer: View Button */}
            <CardFooter className="justify-end pt-2">
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
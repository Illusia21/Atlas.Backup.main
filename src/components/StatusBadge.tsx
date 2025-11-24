import type { RequestStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
    status: RequestStatus
    className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    // Define colors for each status
    const statusStyles: Record<RequestStatus, string> = {
        Pending: 'bg-[#F0F0F0] border border-[#8B8B8B] text-gray-700 hover:bg-gray-300',
        Returned: 'bg-[#FCF2E6] border border-[#FFA323] text-[#FFA323] hover:bg-orange-200',
        Completed: 'bg-[#EAF4F0] border border-[#4DB487] text-[#4DB487] hover:bg-green-300',
        Rejected: 'bg-[#F9E2E4] border border-[#E50019] text-[#E50019] hover:bg-red-300',
        Cancelled: 'bg-[#ECECEC] border border-[#646363] text-[#646363] hover:bg-gray-400',
        'Cancellation Requested': 'bg-[#FFF5E6] border border-[#FF6B00] text-[#FF6B00] hover:bg-orange-200'
    }

    return (
        <Badge className={`w-[100px] justify-center ${statusStyles[status]} ${className}`}>
            {status}
        </Badge>
    )
}
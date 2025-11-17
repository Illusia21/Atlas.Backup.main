import type { RequestStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
    status: RequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
    // Define colors for each status
    const statusStyles: Record<RequestStatus, string> = {
        Pending: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        Returned: 'bg-orange-200 text-orange-800 hover:bg-orange-300',
        Completed: 'bg-green-200 text-green-800 hover:bg-green-300',
        Rejected: 'bg-red-200 text-red-800 hover:bg-red-300',
        Cancelled: 'bg-gray-300 text-gray-600 hover:bg-gray-400'
    }

    return (
        <Badge className={statusStyles[status]}>
            {status}
        </Badge>
    )
}
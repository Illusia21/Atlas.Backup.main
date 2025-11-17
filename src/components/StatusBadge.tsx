import type { RequestStatus } from '@/types'

interface StatusBadgeProps {
    status: RequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
    // Define colors for each status
    const statusStyles: Record<RequestStatus, string> = {
        Pending: 'bg-gray-200 text-gray-700',
        Returned: 'bg-orange-200 text-orange-800',
        Completed: 'bg-green-200 text-green-800',
        Rejected: 'bg-red-200 text-red-800',
        Cancelled: 'bg-gray-300 text-gray-600'
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
            {status}
        </span>
    )
}
import { Check, FileMinus, Building2, PiggyBank, ClockAlert, FileSymlink, MessageCircleMore, X } from 'lucide-react';
import type { Notification, NotificationType } from '@/types/notification';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
    notifications: Notification[];
    onClose: () => void;
    onNotificationClick: (notificationId: string) => void;
    readNotifications: string[];
}

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'submission_success':
        case 'approved':
        case 'cancellation_approved':
            return { Icon: Check, bgColor: '#006b3c' };
        case 'received':
        case 'under_review':
        case 'for_approval':
        case 'comment':
            if (type === 'received') return { Icon: FileMinus, bgColor: '#114b9f' };
            if (type === 'under_review') return { Icon: Building2, bgColor: '#114b9f' };
            if (type === 'for_approval') return { Icon: PiggyBank, bgColor: '#114b9f' };
            if (type === 'comment') return { Icon: MessageCircleMore, bgColor: '#114b9f' };
            return { Icon: FileMinus, bgColor: '#114b9f' };
        case 'returned':
            return { Icon: FileSymlink, bgColor: '#ffa323' };
        case 'liquidation_required':
            return { Icon: ClockAlert, bgColor: '#e50019' };
        case 'cancellation_submitted':
            return { Icon: X, bgColor: '#e50019' };
        default:
            return { Icon: Check, bgColor: '#114b9f' };
    }
};

const formatTimestamp = (date: Date) => {
    return format(date, 'MMMM dd, yyyy h:mm a');
};

export function NotificationCenter({
    notifications,
    onClose,
    onNotificationClick,
    readNotifications
}: NotificationCenterProps) {
    const navigate = useNavigate();
    const sortedNotifications = [...notifications].sort((a, b) =>
        b.timestamp.getTime() - a.timestamp.getTime()
    );

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        onNotificationClick(notification.id);

        // Navigate if there's a request ID
        if (notification.requestId) {
            if (notification.requestType === 'Liquidation Report') {
                navigate(`/liquidation/${notification.requestId}`);
            } else {
                navigate(`/request/${notification.requestId}`);
            }
            onClose();
        }
    };

    if (sortedNotifications.length === 0) {
        return (
            <div className="bg-white rounded-[15px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] w-[649px] max-h-[411px] p-4">
                <div className="flex items-center justify-center h-[300px]">
                    <p className="font-['Montserrat'] font-normal text-[14px] text-[#b1b1b1]">
                        No notifications available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfc] rounded-[15px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] w-[649px] max-h-[411px] overflow-hidden flex flex-col">
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto px-[10px] py-[10px]">
                <div className="flex flex-col gap-[3px]">
                    {sortedNotifications.map((notification, index) => {
                        const { Icon, bgColor } = getNotificationIcon(notification.type);
                        const isClickable = !!notification.requestId;
                        const isRead = readNotifications.includes(notification.id);

                        return (
                            <div key={notification.id}>
                                <div
                                    className={`flex items-start justify-between px-5 py-[10px] ${isClickable ? 'cursor-pointer hover:bg-gray-50' : ''
                                        } ${isRead ? 'opacity-60' : ''
                                        }`}
                                    onClick={() => isClickable && handleNotificationClick(notification)}
                                >
                                    {/* Icon and Message */}
                                    <div className="flex gap-5 items-start flex-1 min-w-0">
                                        {/* Icon */}
                                        <div
                                            className="flex items-center justify-center rounded-[25px] size-[50px] shrink-0 relative"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            <Icon className="h-6 w-6 text-white" />
                                            {/* ✅ Unread indicator dot */}
                                            {!isRead && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#e50019] rounded-full border-2 border-white" />
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div className="flex flex-col gap-[10px] flex-1 min-w-0">
                                            <div className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                                <span>Your </span>
                                                <span className="font-bold">{notification.requestType}</span>
                                                <span> {notification.message}</span>
                                            </div>

                                            {/* Reference Number */}
                                            {notification.referenceNo && (
                                                <div className="font-['Montserrat'] font-normal text-[14px] leading-[20px]">
                                                    <span>Reference No: </span>
                                                    <span className="text-[#e50019]">{notification.referenceNo}</span>
                                                </div>
                                            )}

                                            {/* Reviewer Remarks */}
                                            {notification.reviewerRemarks && (
                                                <div className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                                    <span>Reviewer Remarks: "{notification.reviewerRemarks}" </span>
                                                    {isClickable && (
                                                        <span className="text-[#114b9f] underline cursor-pointer">
                                                            Click to View Request
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Comment */}
                                            {notification.comment && (
                                                <>
                                                    <div className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                                        <span>{notification.commenterName} left a comment on your </span>
                                                        <span className="font-bold">{notification.requestType}</span>
                                                        <span> {notification.message}</span>
                                                    </div>
                                                    <div className="font-['Montserrat'] font-normal text-[14px] leading-[20px] text-[#001c43]">
                                                        <span>"{notification.comment}" </span>
                                                        {isClickable && (
                                                            <span className="text-[#114b9f] underline cursor-pointer">
                                                                Click to View Request
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex flex-col justify-center h-6 shrink-0 ml-4">
                                        <p className="font-['Montserrat'] font-normal text-[13px] leading-[20px] text-[#b1b1b1] text-right whitespace-nowrap">
                                            {formatTimestamp(notification.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                {/* Separator */}
                                {index < sortedNotifications.length - 1 && (
                                    <div className="h-px bg-[#d9d9d9] mx-5" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
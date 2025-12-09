import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Bell, ChevronDown, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NotificationCenter } from '@/components/NotificationCenter'
import { mockNotifications } from '@/data/mockNotification'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

interface TopbarProps {
    pageTitle: string
    userName?: string
    userRole?: string
    userAvatar?: string
}

export function Topbar({
    pageTitle,
    userName = "Dones, Aisha Nicole",
    userRole = "CSA Facilitator",
    userAvatar = "/Ellipse 2824.svg"
}: TopbarProps) {
    const { user } = useAuth()
    const { notifications: storeNotifications } = useNotificationStore()
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [readNotifications, setReadNotifications] = useState<string[]>([])

    // COMBINE mock notifications + store notifications
    const allNotifications = [...storeNotifications, ...mockNotifications]

    // Load read notifications
    useEffect(() => {
        const read = JSON.parse(localStorage.getItem('readNotifications') || '[]')
        setReadNotifications(read)
    }, [])

    // Save read notifications
    useEffect(() => {
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications))
    }, [readNotifications])

    // Get initials for fallback
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Count ONLY unread notifications (from BOTH sources)
    const unreadCount = allNotifications.filter(
        notification => !readNotifications.includes(notification.id)
    ).length

    // Mark notification as read
    const handleNotificationClick = (notificationId: string) => {
        if (!readNotifications.includes(notificationId)) {
            setReadNotifications(prev => [...prev, notificationId])
        }
    }

    // Mark all as read when notification panel opens
    const handleNotificationOpen = (open: boolean) => {
        setNotificationOpen(open)

        // When opening, mark all as read
        if (open) {
            const allNotificationIds = allNotifications.map(n => n.id)
            setReadNotifications(allNotificationIds)
        }
    }

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
            {/* Left Section */}
            <SidebarTrigger className="[&>svg]:!size-5" />
            <Separator orientation="vertical" className="h-6 bg-[#808080]" />
            <h1 className="text-sm font-normal text-[#001C43]">{pageTitle}</h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notification Bell with Popover */}
                <Popover open={notificationOpen} onOpenChange={handleNotificationOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative w-10 h-10 flex items-center justify-center">
                            {notificationOpen ? (
                                // X button
                                <div className="absolute inset-0 bg-[#114b9f] rounded-full flex items-center justify-center hover:bg-[#0d3a7a] transition-colors">
                                    <X className="h-5 w-5 text-white" strokeWidth={2.5} />
                                </div>
                            ) : (
                                // Bell icon
                                <>
                                    <Bell className="h-5 w-5 text-[#001c43]" />
                                    {unreadCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute top-0 right-0 h-4 min-w-[16px] px-1 text-[10px] font-bold flex items-center justify-center rounded-full"
                                        >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        sideOffset={10}
                        className="w-auto p-0 border-0 shadow-none bg-transparent"
                    >
                        <NotificationCenter
                            notifications={allNotifications}
                            onClose={() => setNotificationOpen(false)}
                            onNotificationClick={handleNotificationClick}
                            readNotifications={readNotifications}
                        />
                    </PopoverContent>
                </Popover>

                {/* User Info */}
                <div className="flex items-center gap-[15px]">
                    <div className="flex flex-col items-end gap-[4px] text-right font-['Montserrat'] text-[12px] font-normal leading-5">
                        <p className="text-[#001c43] leading-tight">{userName}</p>
                        <p className="text-[#e50019] leading-tight">{userRole}</p>
                    </div>

                    <div className="flex items-center gap-[15px]">
                        {/* User Avatar - Using shadcn Avatar */}
                        <Avatar className="h-[40px] w-[40px]">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback className="bg-[#001c43] text-white font-['Montserrat'] text-[12px]">
                                {getInitials(userName)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Dropdown Chevron */}
                        <ChevronDown className="h-5 w-5 text-[#001c43]" />
                    </div>
                </div>
            </div>
        </header>
    )
}
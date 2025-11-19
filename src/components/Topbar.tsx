import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, ChevronDown } from 'lucide-react'

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
    // Get initials for fallback (e.g., "DN" from "Dones, Aisha Nicole")
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

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
                {/* Notification Bell */}
                <button className="relative">
                    <Bell className="h-5 w-5 text-[#001c43]" />
                </button>

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
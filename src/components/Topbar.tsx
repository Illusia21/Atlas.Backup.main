import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/utils/auth'
import { useState, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

interface TopbarProps {
    pageTitle: string
}

export function Topbar({ pageTitle }: TopbarProps) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const authContext = useContext(AuthContext)

    // Get user data from AuthContext
    const user = authContext?.user

    // remove the || "Aisha Nicole Dones" when backend is connected
    const userName = user?.name || "Aisha Nicole Dones"
    const userRole = user?.role || "CSA Facilitator"
    const userAvatar = user?.avatar || "/Ellipse 2824.svg"

    const getInitials = (name: string) => {
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    const handleViewProfile = () => navigate('/profile')
    const handleSettings = () => navigate('/settings')
    const handleLogout = () => logout()

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

                {/* User Info with Dropdown */}
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-[15px] focus:outline-none rounded-lg p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                            {/* User Name and Role */}
                            <div className="flex flex-col items-end gap-[4px] text-right font-['Montserrat'] text-[12px] font-normal leading-5">
                                <p className="text-[#001c43] leading-tight">{userName}</p>
                                <p className="text-[#e50019] leading-tight">{userRole}</p>
                            </div>

                            {/* Avatar */}
                            <Avatar className="h-[40px] w-[40px]">
                                <AvatarImage src={userAvatar} alt={userName} />
                                <AvatarFallback className="bg-[#001c43] text-white font-['Montserrat'] text-[12px]">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    {/* Dropdown Menu */}
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white rounded-lg shadow-md border border-gray-200 py-2"
                    >
                        <DropdownMenuItem
                            onClick={handleViewProfile}
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors"
                        >
                            <User className="h-4 w-4 text-[#001c43]" />
                            <span className="text-sm font-normal text-[#001C43]">View Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleSettings}
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors"
                        >
                            <Settings className="h-4 w-4 text-[#001c43]" />
                            <span className="text-sm font-normal text-[#001c43]">Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 transition-colors text-[#001C43]"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-normal">Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
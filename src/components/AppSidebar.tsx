import { Link, useLocation } from "react-router-dom"
import mmcmLogo from "@/assets/images/mmcmLogo.png"
import { Plus, FileChartColumnIncreasing, Repeat, BookText, CircleHelp } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Menu items for navigation
const menuItems = [
    {
        title: "Add New Request",
        url: "/new-request",
        icon: Plus,
        isPrimary: true, // Special styling for the plus button
    },
    {
        title: "My Requests",
        url: "/my-requests",
        icon: FileChartColumnIncreasing,
    },
    {
        title: "Transactions",
        url: "/transactions",
        icon: Repeat,
    },
]

const bottomMenuItems = [
    {
        title: "Documentation",
        url: "/docs",
        icon: BookText,
    },
    {
        title: "Help",
        url: "/help",
        icon: CircleHelp,
    },
]

export function AppSidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const { state } = useSidebar(); // Get sidebar state (collapsed/expanded)

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-[#fcfcfc] flex flex-col items-center px-[15px] pt-[20px]">
                {/* Logo */}
                <div className="h-[40px] w-[40px] flex items-center justify-center">
                    <img
                        src={mmcmLogo}
                        alt="MCM Logo"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* First Separator */}
                <Separator className="bg-[#b1b1b1] my-[10px] w-full" />

                {/* Main Navigation */}
                <SidebarGroup className="w-full flex flex-col items-center">
                    <SidebarGroupContent className="w-full flex flex-col items-center">
                        <SidebarMenu className="gap-[20px] w-full flex flex-col items-center">
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title} className="w-auto list-none h-[45px] flex flex-col items-center justify-center gap-[6px]">
                                    {item.isPrimary ? (
                                        <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                            <Link
                                                to={item.url}
                                                className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#001c43] hover:bg-[#002856]"
                                            >
                                                <item.icon className="h-6 w-6 text-white" />
                                            </Link>
                                        </SidebarMenuButton>
                                    ) : (
                                        <>
                                            <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                                <Link
                                                    to={item.url}
                                                    className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] ${isActive(item.url) ? '' : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <item.icon className="h-6 w-6 text-[#001c43]" />
                                                </Link>
                                            </SidebarMenuButton>
                                            {/* Show red line ONLY when collapsed AND active - OUTSIDE the button */}
                                            {isActive(item.url) && state === "collapsed" && (
                                                <div className="h-[2px] w-[39px] bg-[#e50019]" />
                                            )}
                                        </>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Second Separator */}
                <Separator className="bg-[#b1b1b1] my-[10px] w-full" />

                {/* Bottom Navigation */}
                <SidebarGroup className="w-full flex flex-col items-center">
                    <SidebarGroupContent className="w-full flex flex-col items-center">
                        <SidebarMenu className="gap-[20px] w-full flex flex-col items-center">
                            {bottomMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title} className="w-auto list-none h-[45px] flex flex-col items-center justify-center gap-[6px]">
                                    <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                        <Link
                                            to={item.url}
                                            className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] ${isActive(item.url) ? '' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <item.icon className="h-6 w-6 text-[#001c43]" />
                                        </Link>
                                    </SidebarMenuButton>
                                    {/* Show red line ONLY when collapsed AND active - OUTSIDE the button */}
                                    {isActive(item.url) && state === "collapsed" && (
                                        <div className="h-[2px] w-[39px] bg-[#e50019]" />
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
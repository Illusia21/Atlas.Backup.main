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

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-[#fcfcfc] px-[15px] pt-[20px]">
                {/* Logo */}
                <div className="h-[40px] w-[40px] flex items-center justify-center mx-auto mb-[30px]">
                    <img
                        src={mmcmLogo}
                        alt="MCM Logo"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* First Separator */}
                <Separator className="bg-[#b1b1b1] mb-[30px]" />

                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-[20px]">
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.isPrimary ? (
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#001c43] hover:bg-[#002856] mx-auto"
                                            >
                                                <item.icon className="h-6 w-6 text-white" />
                                            </Link>
                                        </SidebarMenuButton>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className={`flex h-[45px] w-full flex-col items-center justify-center rounded-[10px] p-[6px] ${isActive(item.url) ? '' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <item.icon className="h-6 w-6 text-[#001c43]" />
                                                {isActive(item.url) && (
                                                    <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Second Separator */}
                <Separator className="bg-[#b1b1b1] my-[30px]" />

                {/* Bottom Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-[20px]">
                            {bottomMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={item.url}
                                            className={`flex h-[40px] w-[40px] flex-col items-center justify-center rounded-[10px] p-[10px] ${isActive(item.url) ? '' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <item.icon className="h-6 w-6 text-[#001c43]" />
                                            {isActive(item.url) && (
                                                <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
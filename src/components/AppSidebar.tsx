import { Link, useLocation } from "react-router-dom"
import mmcmLogo from "@/assets/images/mmcmLogo.png"
import { Plus, FileChartColumnIncreasing, Repeat, BookText, CircleHelp } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items for navigation (populate this later)
const menuItems: any[] = []

export function AppSidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* Custom collapsed view - shown when collapsed */}
                <div className="group-data-[state=collapsed]:flex group-data-[state=expanded]:hidden h-full flex-col items-center gap-[30px] bg-[#fcfcfc] px-[15px] py-[26px]">
                    {/* Logo */}
                    <div className="h-[40px] w-[40px]">
                        <img
                            src={mmcmLogo}
                            alt="MCM Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Separator */}
                    <div className="h-px w-full bg-[#b1b1b1]" />

                    {/* Main Navigation */}
                    <div className="flex w-[43px] flex-col gap-[20px]">
                        {/* Add New Request */}
                        <Link
                            to="/new-request"
                            className="flex h-[40px] w-[36px] items-center justify-center rounded-[10px] bg-[#001c43] ml-auto mr-auto hover:bg-[#002856]"
                        >
                            <Plus className="h-6 w-6 text-white" />
                        </Link>

                        {/* My Requests */}
                        <Link
                            to="/my-requests"
                            className={`flex h-[45px] w-full flex-col items-center justify-center rounded-[10px] p-[6px] ${isActive('/my-requests') ? '' : 'hover:bg-gray-100'
                                }`}
                        >
                            <FileChartColumnIncreasing className="h-6 w-6 text-[#001c43]" />
                            {isActive('/my-requests') && (
                                <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                            )}
                        </Link>

                        {/* Transactions */}
                        <Link
                            to="/transactions"
                            className={`flex h-[45px] w-full flex-col items-center justify-center rounded-[10px] p-[10px] ${isActive('/transactions') ? '' : 'hover:bg-gray-100'
                                }`}
                        >
                            <Repeat className="h-6 w-6 text-[#001c43]" />
                            {isActive('/transactions') && (
                                <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                            )}
                        </Link>
                    </div>

                    {/* Separator */}
                    <div className="h-px w-full bg-[#b1b1b1]" />

                    {/* Bottom Navigation */}
                    <div className="flex flex-col gap-[20px]">
                        {/* Documentation */}
                        <Link
                            to="/docs"
                            className={`flex h-[45px] w-[43px] flex-col items-center justify-center rounded-[10px] p-[10px] ${isActive('/docs') ? '' : 'hover:bg-gray-100'
                                }`}
                        >
                            <BookText className="h-6 w-6 text-[#001c43]" />
                            {isActive('/docs') && (
                                <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                            )}
                        </Link>

                        {/* Help */}
                        <Link
                            to="/help"
                            className={`flex h-[45px] w-[43px] flex-col items-center justify-center rounded-[10px] p-[10px] ${isActive('/help') ? '' : 'hover:bg-gray-100'
                                }`}
                        >
                            <CircleHelp className="h-6 w-6 text-[#001c43]" />
                            {isActive('/help') && (
                                <div className="mt-[10px] h-[2px] w-[39px] bg-[#e50019]" />
                            )}
                        </Link>
                    </div>
                </div>

                {/* Expanded view - only shown when expanded */}
                <div className="hidden group-data-[state=expanded]:block">
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
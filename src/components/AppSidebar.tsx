import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import mmcmLogo from "@/assets/images/mmcmLogo.png"
import acoLogo from "@/assets/images/ACO.png"
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
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

    // Reset dropdown when sidebar collapses
    useEffect(() => {
        if (state === "collapsed") {
            setIsNewRequestOpen(false);
        }
    }, [state]);

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-[#fcfcfc]">
                {/* COLLAPSED VIEW */}
                {state === "collapsed" && (
                    <div className="flex flex-col items-center px-[15px] pt-[20px]">
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
                                                    {isActive(item.url) && (
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
                                            {isActive(item.url) && (
                                                <div className="h-[2px] w-[39px] bg-[#e50019]" />
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                )}

                {/* EXPANDED VIEW */}
                {state === "expanded" && (
                    <div className="flex flex-col p-4">
                        {/* Header with Logo */}
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={mmcmLogo}
                                alt="MCM Logo"
                                className="h-[60px] w-[60px] object-contain mb-2"
                            />
                            <img
                                src={acoLogo}
                                alt="Accounting Office"
                                className="h-[60px] w-auto object-contain"
                            />
                        </div>

                        {/* Main Navigation Group */}
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {/* New Request Button with Dropdown */}
                                    <div>
                                        <button
                                            onClick={() => setIsNewRequestOpen(!isNewRequestOpen)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#001c43] text-white hover:bg-[#002856] transition-colors"
                                        >
                                            <Plus className="h-5 w-5" />
                                            <span className="text-sm font-medium">New Request</span>
                                            <svg
                                                className={`ml-auto h-4 w-4 transition-transform ${isNewRequestOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Options */}
                                        {isNewRequestOpen && (
                                            <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                                                <Link
                                                    to="/request/reimbursement"
                                                    className="block px-3 py-2 text-sm text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    Reimbursement
                                                </Link>
                                                <Link
                                                    to="/request/non-trade-payable"
                                                    className="block px-3 py-2 text-sm text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    Non-Trade Payable
                                                </Link>
                                                <Link
                                                    to="/request/trade-payable"
                                                    className="block px-3 py-2 text-sm text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    Trade Payable
                                                </Link>
                                                <Link
                                                    to="/request/cash-advance"
                                                    className="block px-3 py-2 text-sm text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    Cash Advance
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* My Request */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={isActive('/my-requests')}>
                                            <Link to="/my-requests" className="flex items-center gap-2">
                                                <FileChartColumnIncreasing className="h-4 w-4" />
                                                <span>My Request</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Liquidation */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={isActive('/transactions')}>
                                            <Link to="/transactions" className="flex items-center gap-2">
                                                <Repeat className="h-4 w-4" />
                                                <span>Liquidation</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <Separator className="my-4" />

                        {/* Bottom Navigation Group */}
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {/* Guidelines */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={isActive('/docs')}>
                                            <Link to="/docs" className="flex items-center gap-2">
                                                <BookText className="h-4 w-4" />
                                                <span>Guidelines</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Help & FAQs */}
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={isActive('/help')}>
                                            <Link to="/help" className="flex items-center gap-2">
                                                <CircleHelp className="h-4 w-4" />
                                                <span>Help & FAQs</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                )}
            </SidebarContent>
        </Sidebar>
    )
}
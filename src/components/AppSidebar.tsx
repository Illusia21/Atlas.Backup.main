import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Menu items for navigation
const menuItems = [
    {
        title: "New Request",
        url: "/new-request",
        icon: Plus,
        isPrimary: true,
    },
    {
        title: "My Requests",
        url: "/my-requests",
        icon: FileChartColumnIncreasing,
    },
    {
        title: "Liquidation",
        url: "/liquidation",
        icon: Repeat,
    },
]

const bottomMenuItems = [
    {
        title: "Guidelines",
        url: "/guidelines",
        icon: BookText,
    },
    {
        title: "Help & FAQs",
        url: "/help-and-faqs",
        icon: CircleHelp,
    },
]

export function AppSidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const { state, setOpen } = useSidebar();
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking New Request button in collapsed mode
    const handleCollapsedNewRequest = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        setOpen(true); // Expand the sidebar
        setIsNewRequestOpen(true); // Open the dropdown
    };

    // Reset dropdown when sidebar collapses
    useEffect(() => {
        if (state === "collapsed") {
            setIsNewRequestOpen(false);
        }
    }, [state]);

    // Close dropdown when route changes (after navigation)
    useEffect(() => {
        setIsNewRequestOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNewRequestOpen(false);
            }
        }

        if (isNewRequestOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isNewRequestOpen]);

    const isCollapsed = state === "collapsed";

    return (
        <TooltipProvider>
            <Sidebar collapsible="icon">
                <SidebarContent className="bg-[#fcfcfc]">
                    {/* Logo Section - Always visible */}
                    <div className={`flex flex-col items-center transition-all duration-300 ${isCollapsed ? 'px-[15px] pt-[20px]' : 'p-4'}`}>
                        <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'h-[40px] w-[40px]' : 'h-[60px] w-[60px] mb-2'}`}>
                            <img
                                src={mmcmLogo}
                                alt="MCM Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* ACO Logo - only in expanded */}
                        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'h-[60px] opacity-100'}`}>
                            <img
                                src={acoLogo}
                                alt="Accounting Office"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* First Separator */}
                    <Separator
                        className={`bg-[#b1b1b1] w-full transition-all duration-300 ${isCollapsed ? 'my-[10px] mx-[15px]' : 'mb-1 mx-6'
                            }`}
                        style={{
                            width: isCollapsed ? 'calc(100% - 30px)' : 'calc(100% - 48px)'
                        }}
                    />


                    {/* Main Navigation */}
                    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center px-[15px]' : 'px-4'}`}>
                        <SidebarGroup className={`w-full transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                            <SidebarGroupContent className={`w-full transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                                <SidebarMenu className={`w-full flex flex-col transition-all duration-300 ${isCollapsed ? 'gap-[20px] items-center' : 'space-y-3'}`}>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem
                                            key={item.title}
                                            className={`transition-all duration-300 ${isCollapsed
                                                ? 'w-auto list-none h-[45px] flex flex-col items-center justify-center gap-[6px]'
                                                : 'w-full'
                                                }`}
                                        >
                                            {item.isPrimary ? (
                                                isCollapsed ? (
                                                    // Collapsed: Icon only with Tooltip
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                                                <button
                                                                    onClick={handleCollapsedNewRequest}
                                                                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#001c43] hover:bg-[#002856] transition-all duration-300"
                                                                    aria-label={item.title}
                                                                >
                                                                    <item.icon className="h-6 w-6 text-white" />
                                                                </button>
                                                            </SidebarMenuButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right">
                                                            <p>{item.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    // Expanded: Button with dropdown
                                                    <div className="w-full" ref={dropdownRef}>
                                                        <button
                                                            onClick={() => setIsNewRequestOpen(!isNewRequestOpen)}
                                                            aria-expanded={isNewRequestOpen}
                                                            aria-haspopup="true"
                                                            aria-controls="new-request-dropdown"
                                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#001c43] text-white hover:bg-[#002856] transition-all duration-300"
                                                        >
                                                            <Plus className="h-5 w-5 flex-shrink-0" />
                                                            <span className="text-[12px] font-medium whitespace-nowrap">New Request</span>
                                                            <svg
                                                                className={`ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-300 ${isNewRequestOpen ? 'rotate-180' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>

                                                        {/* Dropdown Options */}
                                                        <div
                                                            id="new-request-dropdown"
                                                            role="menu"
                                                            className={`overflow-hidden transition-all duration-300 ${isNewRequestOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                                                        >
                                                            <div className="mt-2 ml-4 border-l-2 border-gray-200 pl-4">
                                                                {/* Reimbursement */}
                                                                {/* Reimbursement */}
                                                                <Link
                                                                    to="/request/reimbursement"
                                                                    role="menuitem"
                                                                    aria-label="Create Reimbursement Request"
                                                                    className="block px-3 py-2 text-[12px] text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                                >
                                                                    <span className={`${isActive('/request/reimbursement') ? 'border-b-2 border-[#e50019]' : ''}`}>
                                                                        Reimbursement
                                                                    </span>
                                                                </Link>

                                                                {/* Non-Trade Payable */}
                                                                <Link
                                                                    to="/request/non-trade-payable"
                                                                    role="menuitem"
                                                                    aria-label="Create Non-Trade Payable Request"
                                                                    className="block px-3 py-2 text-[12px] text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                                >
                                                                    <span className={`${isActive('/request/non-trade-payable') ? 'border-b-2 border-[#e50019]' : ''}`}>
                                                                        Non-Trade Payable
                                                                    </span>
                                                                </Link>

                                                                {/* Trade Payable */}
                                                                <Link
                                                                    to="/request/trade-payable"
                                                                    role="menuitem"
                                                                    aria-label="Create Trade Payable Request"
                                                                    className="block px-3 py-2 text-[12px] text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                                >
                                                                    <span className={`${isActive('/request/trade-payable') ? 'border-b-2 border-[#e50019]' : ''}`}>
                                                                        Trade Payable
                                                                    </span>
                                                                </Link>

                                                                {/* Cash Advance */}
                                                                <Link
                                                                    to="/request/cash-advance"
                                                                    role="menuitem"
                                                                    aria-label="Create Cash Advance Request"
                                                                    className="block px-3 py-2 text-[12px] text-[#001c43] hover:bg-gray-100 rounded-md transition-colors"
                                                                >
                                                                    <span className={`${isActive('/request/cash-advance') ? 'border-b-2 border-[#e50019]' : ''}`}>
                                                                        Cash Advance
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                isCollapsed ? (
                                                    // Collapsed: Icon only with Tooltip
                                                    <>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                                                    <Link
                                                                        to={item.url}
                                                                        aria-label={item.title}
                                                                        className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] hover:bg-gray-100 transition-all duration-300"
                                                                    >
                                                                        <item.icon className="h-6 w-6 text-[#001c43]" />
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right">
                                                                <p>{item.title}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        {isActive(item.url) && (
                                                            <div className="h-[2px] w-[39px] bg-[#e50019]" />
                                                        )}
                                                    </>
                                                ) : (
                                                    // Expanded: Icon + Text
                                                    <SidebarMenuButton asChild isActive={isActive(item.url)} className="h-auto">
                                                        <Link to={item.url} className="flex items-center gap-2 py-2 transition-all duration-300">
                                                            <item.icon className="h-4 w-4 flex-shrink-0" />
                                                            <span className="text-[12px] whitespace-nowrap">{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                )
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>

                    {/* Second Separator */}
                    <Separator
                        className={`bg-[#b1b1b1] w-full transition-all duration-300 ${isCollapsed ? 'my-[10px] mx-[15px]' : 'mb-1 mx-6'
                            }`}
                        style={{
                            width: isCollapsed ? 'calc(100% - 30px)' : 'calc(100% - 48px)'
                        }}
                    />


                    {/* Bottom Navigation */}
                    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center px-[15px]' : 'px-4'}`}>
                        <SidebarGroup className={`w-full transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                            <SidebarGroupContent className={`w-full transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                                <SidebarMenu className={`w-full flex flex-col transition-all duration-300 ${isCollapsed ? 'gap-[20px] items-center' : 'space-y-3'}`}>
                                    {bottomMenuItems.map((item) => (
                                        <SidebarMenuItem
                                            key={item.title}
                                            className={`transition-all duration-300 ${isCollapsed
                                                ? 'w-auto list-none h-[45px] flex flex-col items-center justify-center gap-[6px]'
                                                : 'w-full'
                                                }`}
                                        >
                                            {isCollapsed ? (
                                                // Collapsed: Icon only with Tooltip
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <SidebarMenuButton asChild className="w-auto h-auto p-0">
                                                                <Link
                                                                    to={item.url}
                                                                    aria-label={item.title}
                                                                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] hover:bg-gray-100 transition-all duration-300"
                                                                >
                                                                    <item.icon className="h-6 w-6 text-[#001c43]" />
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right">
                                                            <p>{item.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {isActive(item.url) && (
                                                        <div className="h-[2px] w-[39px] bg-[#e50019]" />
                                                    )}
                                                </>
                                            ) : (
                                                // Expanded: Icon + Text
                                                <SidebarMenuButton asChild isActive={isActive(item.url)} className="h-auto">
                                                    <Link to={item.url} className="flex items-center gap-2 py-2 transition-all duration-300">
                                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                                        <span className="text-[12px] whitespace-nowrap">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider>
    )
}
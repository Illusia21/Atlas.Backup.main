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
import { Separator } from "@/components/ui/separator"

// Menu items for navigation (populate this later)
const menuItems: any[] = []

export function AppSidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
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
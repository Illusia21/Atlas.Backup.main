import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

interface TopbarProps {
    pageTitle: string
}

export function Topbar({ pageTitle }: TopbarProps) {
    return (
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6 bg-[#808080]" />
            <h1 className="text-sm font-normal text-[#001C43]">{pageTitle}</h1>
        </header>
    )
}
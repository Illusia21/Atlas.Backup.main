import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Separator } from '@/components/ui/separator'

// Page titles for different routes
const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/my-requests': 'My Requests',
}

function Dashboard() {
  const location = useLocation()
  const pageTitle = routeTitles[location.pathname] || 'Dashboard'

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold text-[#001C43]">{pageTitle}</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#F5F5F5] p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
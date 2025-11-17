/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Separator } from '@/components/ui/separator'

interface JWTPayload {
  exp?: number;
  user_id?: number;
  [key: string]: any;
}

// Page titles for different routes
const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/my-requests': 'My Requests',
}

export default function ProtectedLayout() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation()
  const pageTitle = routeTitles[location.pathname] || 'Dashboard'

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const tokenExpiration = decoded.exp;

      if (!tokenExpiration) {
        setIsAuthorized(false);
        return;
      }

      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Token decode error:", error);
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // Temporary bypass - wrapping with Sidebar + Topbar
  return (
    <SidebarProvider defaultOpen={false}>
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
  );

  // When you're ready to enable auth again, replace the return above with:
  // return isAuthorized ? (
  //   <SidebarProvider defaultOpen={false}>
  //     <AppSidebar />
  //     <div className="flex flex-col w-full">
  //       <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
  //         <SidebarTrigger />
  //         <Separator orientation="vertical" className="h-6" />
  //         <h1 className="text-lg font-semibold text-[#001C43]">{pageTitle}</h1>
  //       </header>
  //       <main className="flex-1 bg-[#F5F5F5] p-6">
  //         <Outlet />
  //       </main>
  //     </div>
  //   </SidebarProvider>
  // ) : <Navigate to="/login" />;
}
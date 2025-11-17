import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthCallback from "./routes/public-layout/pages/AuthCallback";
import Dashboard from "./routes/protected-layout/pages/Dashboard";
import ForgotPassword from "./routes/public-layout/pages/ForgotPassword";
import Login from "./routes/public-layout/pages/Login";
import ResetPassword from "./routes/public-layout/pages/ResetPassword";
import ProtectedLayout from "./routes/protected-layout";
import PublicLayout from "./routes/public-layout";
import { logout } from './utils/auth';
import MyRequests from "./routes/protected-layout/pages/MyRequests";

function Logout() {
  logout();
  return null;
}

const Router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <div className="text-center text-gray-500">Welcome to Dashboard</div>,
          },
          {
            path: "my-requests",
            element: <MyRequests />,
          },
        ],
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:uid/:token",
        element: <ResetPassword />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);

export default Router;

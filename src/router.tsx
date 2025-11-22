import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthCallback from "./routes/public-layout/pages/AuthCallback";
import ForgotPassword from "./routes/public-layout/pages/ForgotPassword";
import Login from "./routes/public-layout/pages/Login";
import ResetPassword from "./routes/public-layout/pages/ResetPassword";
import ProtectedLayout from "./routes/protected-layout";
import PublicLayout from "./routes/public-layout";
import { logout } from './utils/auth';
import MyRequests from "./routes/protected-layout/pages/MyRequests";
import RFPStep1 from "./routes/public-layout/pages/Reimbursement/RFPStep1";

function Logout() {
  logout();
  return null;
}

const Router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/my-requests" replace />,
      },
      {
        path: "/my-requests",
        element: <MyRequests />,
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
      {
        path: "/reimbursement/step1",
        element: <RFPStep1 />,
      },
    ],
  },
]);

export default Router;

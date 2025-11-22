import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthCallback from "./routes/public-layout/pages/AuthCallback";
import ForgotPassword from "./routes/public-layout/pages/ForgotPassword";
import Login from "./routes/public-layout/pages/Login";
import ResetPassword from "./routes/public-layout/pages/ResetPassword";
import ProtectedLayout from "./routes/protected-layout";
import PublicLayout from "./routes/public-layout";
import { logout } from './utils/auth';
import MyRequests from "./routes/protected-layout/pages/MyRequests";
import MyRequests from "./routes/protected-layout/pages/MyRequests";
import { logout } from './utils/auth';
import Reimbursement from "./routes/protected-layout/pages/Reimbursement";
import NonTradePayable from "./routes/protected-layout/pages/NonTradePayable";
import TradePayable from "./routes/protected-layout/pages/TradePayable";
import CashAdvance from "./routes/protected-layout/pages/CashAdvance";
import RequestDetails from "./routes/protected-layout/pages/RequestDetails";

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
        path: "/request/:id",
        element: <RequestDetails />,
      },
      {
        path: "/request/reimbursement",
        element: <Reimbursement />,
      },
      {
        path: "/request/non-trade-payable",
        element: <NonTradePayable />,
      },
      {
        path: "/request/trade-payable",
        element: <TradePayable />,
      },
      {
        path: "/request/cash-advance",
        element: <CashAdvance />,
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

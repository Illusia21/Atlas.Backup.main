import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthCallback from "./routes/public-layout/pages/AuthCallback";
import ForgotPassword from "./routes/public-layout/pages/ForgotPassword";
import Login from "./routes/public-layout/pages/Login";
import ResetPassword from "./routes/public-layout/pages/ResetPassword";
import ProtectedLayout from "./routes/protected-layout";
import PublicLayout from "./routes/public-layout";
import { logout } from './utils/auth';
import MyRequests from "./routes/protected-layout/pages/MyRequestPage/MyRequests";
import RFPStep3 from "./routes/public-layout/pages/Reimbursement/RFPStep3";
import RFPStep1 from "./routes/public-layout/pages/Reimbursement/RFPStep1";
import Reimbursement from "./routes/protected-layout/pages/Reimbursement";
import NonTradePayable from "./routes/protected-layout/pages/NonTradePayable";
import TradePayable from "./routes/protected-layout/pages/TradePayable";
import RequestDetails from "./routes/protected-layout/pages/MyRequestPage/RequestDetails";
import CAStep1 from "./routes/protected-layout/pages/CashAdvance/CAStep1";
import CAStep2 from "./routes/protected-layout/pages/CashAdvance/CAStep2";
import CAStep3 from "./routes/protected-layout/pages/CashAdvance/CAStep3";
import CAStep4 from "./routes/protected-layout/pages/CashAdvance/CAStep4";
import CAStep5 from "./routes/protected-layout/pages/CashAdvance/CAStep5";
import ForLiquidation from "./routes/protected-layout/pages/Liquidation/ForLiquidation";
import LiquidationDetails from "./routes/protected-layout/pages/Liquidation/LiquidationDetails";
import LiquidationStep1 from "./routes/protected-layout/pages/Liquidation/LiquidationStep1";
import LiquidationStep2 from "./routes/protected-layout/pages/Liquidation/LiquidationStep2";
import LiquidationStep3 from "./routes/protected-layout/pages/Liquidation/LiquidationStep3";
//import CashAdvance from "./routes/protected-layout/pages/CashAdvance";
import RFPStep3Bank from "./routes/public-layout/pages/Reimbursement/RFPStep3Bank";
import Profile from "./routes/protected-layout/pages/Profile";
import RFPStep3Cheque from "./routes/public-layout/pages/Reimbursement/RFPStep3Cheque";

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
        path: "/reimbursement/step3/:id",
        element: <RFPStep3 />,
      },
      {
        path: "/reimbursement/step3-cheque/:id",
        element: <RFPStep3Cheque />,
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
        element: <CAStep1 />,
      },
      {
        path: "/request/cash-advance/step2",
        element: <CAStep2 />,
      },
      {
        path: "/request/cash-advance/step3",
        element: <CAStep3 />,
      },
      {
        path: "/request/cash-advance/step4",
        element: <CAStep4 />,
      },
      {
        path: "/request/cash-advance/step5",
        element: <CAStep5 />,
      },
      {
        path: "/liquidation",
        element: <ForLiquidation />,
      },
      {
        path: "/liquidation/:id",
        element: <LiquidationDetails />,
      },
      {
        path: "/liquidation/step1",
        element: <LiquidationStep1 />,
      },
      {
        path: "/liquidation/step2",
        element: <LiquidationStep2 />,
      },
      {
        path: "/liquidation/step3",
        element: <LiquidationStep3 />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/settings",
        element: <Navigate to="/my-requests" replace />, // Replace with actual Settings component when ready
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
        path: "/reimbursement/step3/:id",
        element: <RFPStep3 />,
      },
      {
        path: "/reimbursement/step3-bank/:id",
        element: <RFPStep3Bank />,
      },
      {
        path: "/reimbursement/step1",
        element: <RFPStep1 />,
      },
    ],
  },
]);

export default Router;
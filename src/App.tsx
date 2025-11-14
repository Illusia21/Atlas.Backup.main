import {Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from "./pages/AuthCallback"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function App() {
  return (
    <Routes>
      <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:uid/:token" element={<ResetPassword/>}/>
      <Route path="/auth/callback" element={<AuthCallback/>}/>
    </Routes> 
)
}

export default App

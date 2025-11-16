// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access = searchParams.get("access");
    const refresh = searchParams.get("refresh");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(errorParam);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    if (access && refresh) {
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      navigate("/dashboard");
    } else {
      setError("Authentication failed. Missing tokens.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded">
          <h2 className="font-bold text-lg mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;

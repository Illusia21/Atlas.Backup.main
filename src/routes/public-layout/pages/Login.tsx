import mmcmLogo from "@/assets/images/mmcmLogo.png";
import acoLogo from "@/assets/images/ACO.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Login() {
  const handleMicrosoftLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    window.location.href = `${apiUrl}/api/microsoft/login/`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="bg-[#FCFCFC] w-full max-w-lg p-6">
        <CardHeader className="flex items-center justify-center gap-4">
          <img
            src={mmcmLogo}
            alt="Logo"
            className="h-22 sm:h-26 object-contain"
          />
          <img
            src={acoLogo}
            alt="Logo"
            className="h-16 sm:h-20 object-contain"
          />
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleMicrosoftLogin}
            variant="secondary"
            type="button"
            className="w-full rounded-[24px] h-[45px] border border-[#001C43]"
          >
            Login with a Microsoft Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

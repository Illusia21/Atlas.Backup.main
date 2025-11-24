import {
  Check,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// Custom Success Icon with layered circles - ONLY for success toasts
const SuccessIcon = () => (
  <div className="flex items-center justify-center flex-shrink-0">
    <div className="w-10 h-10 rounded-full bg-[#ECFDF3] flex items-center justify-center">
      <div className="w-7 h-7 rounded-full bg-[#D1FADF] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#039855] flex items-center justify-center">
          <Check className="w-3 h-3 text-[#039855] stroke-[3]" />
        </div>
      </div>
    </div>
  </div>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          fontFamily: 'Montserrat, sans-serif',
        },
      }}
      icons={{
        success: <SuccessIcon />,  // Custom icon ONLY for success
        info: <InfoIcon className="size-4" />,  // Default
        warning: <TriangleAlertIcon className="size-4" />,  // Default
        error: <OctagonXIcon className="size-4 text-[#E50019]" />,  // Default
        loading: <Loader2Icon className="size-4 animate-spin" />,  // Default
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
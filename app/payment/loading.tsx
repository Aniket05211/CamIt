import { Loader2 } from "lucide-react"

export default function PaymentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Loading Payment Page</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we prepare your checkout...</p>
      </div>
    </div>
  )
}

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-slate-900">Loading business opportunities...</h2>
        <p className="text-slate-600">Please wait while we prepare your content</p>
      </div>
    </div>
  )
}

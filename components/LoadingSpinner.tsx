export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-pulse"></div>
        {/* Inner spinner */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-[#EC6546] ${className}`}>
    </div>
  );
}
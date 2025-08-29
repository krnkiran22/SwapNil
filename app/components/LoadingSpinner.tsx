interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = "Loading...", size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      <p className="text-gray-600 text-sm animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'emerald' | 'purple' | 'amber' | 'red';
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressBar = ({ progress, color = "blue", showPercentage = true, animated = true }: ProgressBarProps) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    purple: "bg-purple-600",
    amber: "bg-amber-600",
    red: "bg-red-600"
  };

  return (
    <div className="w-full">
      <div className="progress-bar">
        <div 
          className={`progress-fill ${colorClasses[color]} ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
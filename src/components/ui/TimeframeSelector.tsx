interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  timeframes?: string[];
  className?: string;
}

export default function TimeframeSelector({ 
  selectedTimeframe, 
  onTimeframeChange, 
  timeframes = ['1D', '1W', '1M', '3M', '1Y'],
  className = "" 
}: TimeframeSelectorProps) {
  return (
    <div className={`flex space-x-1 bg-gray-100 rounded-lg p-1 ${className}`}>
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => onTimeframeChange(timeframe)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            selectedTimeframe === timeframe
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label={`Select ${timeframe} timeframe`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}

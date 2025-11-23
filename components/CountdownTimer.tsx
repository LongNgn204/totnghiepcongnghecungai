import React, { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  initialMinutes?: number;
  onTimeUp?: () => void;
  onWarning?: (minutes: number) => void;
  autoStart?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  initialMinutes = 50,
  onTimeUp,
  onWarning,
  autoStart = true
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasWarned10, setHasWarned10] = useState(false);
  const [hasWarned5, setHasWarned5] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Warning at 10 minutes
          if (newTime === 600 && !hasWarned10 && onWarning) {
            setHasWarned10(true);
            onWarning(10);
          }
          
          // Warning at 5 minutes
          if (newTime === 300 && !hasWarned5 && onWarning) {
            setHasWarned5(true);
            onWarning(5);
          }
          
          // Time up
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, hasWarned10, hasWarned5, onTimeUp, onWarning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setHasWarned10(false);
    setHasWarned5(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (timeLeft <= 300) return 'text-red-600  bg-red-50  border-red-500'; // <= 5 mins
    if (timeLeft <= 600) return 'text-amber-600  bg-amber-50  border-amber-500'; // <= 10 mins
    return 'text-green-600  bg-green-50  border-green-500';
  };

  const getIconClass = () => {
    if (timeLeft <= 300) return 'fa-exclamation-triangle animate-pulse';
    if (timeLeft <= 600) return 'fa-clock';
    return 'fa-hourglass-half';
  };

  const percentage = (timeLeft / (initialMinutes * 60)) * 100;

  return (
    <div className={`sticky top-20 z-40 ${getColorClass()} border-2 rounded-lg shadow-lg p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between gap-4">
        {/* Timer Display */}
        <div className="flex items-center gap-3">
          <i className={`fas ${getIconClass()} text-2xl`}></i>
          <div>
            <div className="text-3xl font-bold font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs opacity-75">
              {timeLeft <= 300 
                ? '⚠️ Sắp hết giờ!' 
                : timeLeft <= 600 
                ? '⚡ Còn ít thời gian'
                : '⏱️ Thời gian làm bài'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs">
          <div className="h-3 bg-gray-200  rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 300 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : timeLeft <= 600 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1 opacity-75 font-semibold">
            {Math.round(percentage)}%
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="px-4 py-2 bg-white  rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-sm"
            title={isRunning ? 'Tạm dừng' : 'Tiếp tục'}
          >
            <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} mr-2`}></i>
            {isRunning ? 'Dừng' : 'Chạy'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-white  rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-sm"
            title="Đặt lại"
          >
            <i className="fas fa-redo mr-2"></i>
            Reset
          </button>
        </div>
      </div>

      {/* Warning Messages */}
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="mt-3 pt-3 border-t-2 border-red-300  text-center animate-pulse">
          <p className="text-sm font-bold">
            🚨 Chỉ còn {Math.floor(timeLeft / 60)} phút! Hãy nộp bài sớm để tránh mất điểm!
          </p>
        </div>
      )}

      {timeLeft === 0 && (
        <div className="mt-3 pt-3 border-t-2 border-red-300  text-center">
          <p className="text-sm font-bold animate-bounce">
            ⏰ HẾT GIỜ! Bài thi đã được tự động nộp.
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;

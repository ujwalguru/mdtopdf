import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Beautiful toast notification component with animations
 */
function Toast({ message, type, onClose, autoClose = true, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Allow animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 min-w-72 max-w-96 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        transition-all duration-200 ease-out
        ${isVisible ? 'animate-in slide-in-from-top-2 fade-in' : 'animate-out slide-out-to-top-2 fade-out'}
        ${getColorClasses()}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
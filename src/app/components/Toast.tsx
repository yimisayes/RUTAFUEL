import { useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'loading' | 'success';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-5 fade-in">
      <div className={`px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md ${
        type === 'loading' 
          ? 'bg-blue-600 text-white' 
          : 'bg-green-600 text-white'
      }`}>
        {type === 'loading' ? (
          <Loader2 className="size-5 animate-spin flex-shrink-0" />
        ) : (
          <CheckCircle className="size-5 flex-shrink-0" />
        )}
        <p className="font-medium text-sm leading-relaxed break-words">{message}</p>
      </div>
    </div>
  );
}
import React from 'react';
import { useNotification, NotificationItem } from '@/context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <ToastItem key={n.id} item={n} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ item: NotificationItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl transition-all duration-300',
        'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800'
      )}
    >
      {icons[item.type]}
      <div className="flex-1 space-y-0.5">
        {item.title && (
          <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.title}</h5>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

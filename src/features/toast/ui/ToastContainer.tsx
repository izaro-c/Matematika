import { useToastStore } from '@/features/toast/ToastStore';
import type { ToastType } from '@/features/toast/ToastStore';

const typeStyles: Record<ToastType, string> = {
  success: 'bg-[#2a6a2a] text-white',
  error: 'bg-granada text-white',
  info: 'bg-carbon text-white',
};

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow-lg text-sm font-sans tracking-wider animate-fade-in ${typeStyles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

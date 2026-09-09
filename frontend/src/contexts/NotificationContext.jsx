import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

const toastStyles = {
  success: { bg: '#E8F5EE', border: '#7BBFA0', text: '#21865B', Icon: CheckCircle2 },
  error:   { bg: '#FDE8E8', border: '#E8A0A0', text: '#C94A4A', Icon: AlertTriangle },
  warning: { bg: '#FFF7E0', border: '#E8C668', text: '#C88A00', Icon: AlertTriangle },
  info:    { bg: '#E8F0F8', border: '#A5C2DF', text: '#1D5D8F', Icon: Info },
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map(toast => {
          const s = toastStyles[toast.type] || toastStyles.info;
          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 p-3.5 rounded-xl shadow-xl border text-xs font-600 fade-in pointer-events-auto"
              style={{ background: s.bg, borderColor: s.border, color: s.text }}
            >
              <s.Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-1 w-5 h-5 rounded flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

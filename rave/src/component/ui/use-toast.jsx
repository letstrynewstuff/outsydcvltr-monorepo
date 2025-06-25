import { createContext, useContext, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, duration = 5000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: context.addToast,
  };
};

const Toast = ({ id, title, description, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        "bg-[#161a2c]/30 backdrop-blur-md border border-white/10 rounded-lg p-4 max-w-sm text-white shadow-lg",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-[#38b2c8]">{title}</h3>
          )}
          {description && <p className="text-gray-300">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export { ToastProvider, useToast };

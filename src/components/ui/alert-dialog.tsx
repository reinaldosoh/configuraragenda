import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  autoClose?: number; // tempo em ms para fechar automaticamente, 0 para não fechar
}

/**
 * Componente de diálogo de alerta customizado
 */
function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  autoClose = 0
}: AlertDialogProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);

  // Efeito para controlar a visibilidade do alerta
  useEffect(() => {
    setIsVisible(isOpen);
    
    // Configurar fechamento automático se necessário
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  // Se não estiver visível, não renderizar nada
  if (!isVisible) return null;

  // Configurações de estilo baseadas no tipo de alerta
  const getTypeStyles = (): { bgColor: string; icon: JSX.Element } => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-400',
          icon: <CheckCircle className="h-6 w-6 text-green-500" />
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-400',
          icon: <AlertCircle className="h-6 w-6 text-red-500" />
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-400',
          icon: <Info className="h-6 w-6 text-blue-500" />
        };
    }
  };

  const { bgColor, icon } = getTypeStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity">
      <div 
        className={`max-w-md w-full mx-4 rounded-lg shadow-lg border ${bgColor} overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {icon}
              <h3 
                id="alert-dialog-title" 
                className="ml-2 text-lg font-medium text-gray-900"
              >
                {title}
              </h3>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-[#39d2c0] rounded-md hover:bg-[#39d2c0]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39d2c0]"
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;

import React, { ReactNode } from 'react';
import Button from './button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Componente para exibir um estado vazio com mensagem e ação opcional
 */
function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction
}: EmptyStateProps): JSX.Element {
  return (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 flex flex-col items-center">
      {icon && (
        <div className="text-gray-400 mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button 
          variant="secondary" 
          onClick={onAction}
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

import React from 'react';

interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    title,
    message,
    onClose,
}) => {
    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const titleColorStyles = {
        success: 'text-green-900',
        error: 'text-red-900',
        warning: 'text-yellow-900',
        info: 'text-blue-900',
    };

    const buttonColorStyles = {
        success: 'text-green-600 hover:text-green-800',
        error: 'text-red-600 hover:text-red-800',
        warning: 'text-yellow-600 hover:text-yellow-800',
        info: 'text-blue-600 hover:text-blue-800',
    };

    return (
        <div className={`border rounded-lg p-4 ${typeStyles[type]}`} role="alert">
            <div className="flex items-start justify-between">
                <div>
                    {title && (
                        <h3 className={`font-semibold ${titleColorStyles[type]}`}>
                            {title}
                        </h3>
                    )}
                    <p className="text-sm mt-1">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`ml-4 font-bold ${buttonColorStyles[type]}`}
                        aria-label="Close alert"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

Alert.displayName = 'Alert';

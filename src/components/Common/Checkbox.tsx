import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random()}`;

        return (
            <div>
                <div className="flex items-center gap-2">
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        className={`
              w-4 h-4 rounded border-gray-300 text-blue-600
              focus:ring-2 focus:ring-blue-500
              cursor-pointer
              ${className}
            `}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {label && (
                        <label htmlFor={checkboxId} className="text-sm font-medium text-gray-700 cursor-pointer">
                            {label}
                        </label>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

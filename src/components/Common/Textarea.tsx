import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    charLimit?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            charLimit,
            className = '',
            id,
            value,
            maxLength,
            onChange,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random()}`;
        const charCount = value ? String(value).length : 0;
        const effectiveMaxLength = charLimit || maxLength;

        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    maxLength={effectiveMaxLength}
                    onChange={onChange}
                    className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-none
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : undefined}
                    {...props}
                />

                <div className="flex justify-between items-start mt-2">
                    <div>
                        {error && (
                            <p id={`${textareaId}-error`} className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {helperText && !error && (
                            <p className="text-sm text-gray-500">{helperText}</p>
                        )}
                    </div>

                    {effectiveMaxLength && (
                        <p className="text-xs text-gray-500">
                            {charCount}/{effectiveMaxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

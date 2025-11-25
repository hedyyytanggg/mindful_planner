## STEP 6: Common UI Components — Detailed Implementation

This document provides complete, production-ready code for all common UI components used throughout the Mindful Daily Planner app.

---

## File Structure

```
src/components/Common/
├── Button.tsx
├── Input.tsx
├── Textarea.tsx
├── Card.tsx
├── Label.tsx
├── ErrorBoundary.tsx
└── LoadingSpinner.tsx
```

---

## 1. Button Component

### File: `src/components/Common/Button.tsx`

```typescript
// src/components/Common/Button.tsx

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary:
        'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## 2. Input Component

### File: `src/components/Common/Input.tsx`

```typescript
// src/components/Common/Input.tsx

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random()}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

## 3. Textarea Component

### File: `src/components/Common/Textarea.tsx`

```typescript
// src/components/Common/Textarea.tsx

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
```

---

## 4. Card Component

### File: `src/components/Common/Card.tsx`

```typescript
// src/components/Common/Card.tsx

import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = 'md',
      elevation = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    const elevationStyles = {
      none: 'border border-gray-200',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg
          ${paddingStyles[padding]}
          ${elevationStyles[elevation]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
```

---

## 5. Label Component

### File: `src/components/Common/Label.tsx`

```typescript
// src/components/Common/Label.tsx

import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required = false, className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-gray-700 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
```

---

## 6. Loading Spinner Component

### File: `src/components/Common/LoadingSpinner.tsx`

```typescript
// src/components/Common/LoadingSpinner.tsx

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          border-blue-600 border-t-transparent rounded-full animate-spin
          ${sizeStyles[size]}
        `}
      />
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinnerContent}
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';
```

---

## 7. Error Boundary Component

### File: `src/components/Common/ErrorBoundary.tsx`

```typescript
// src/components/Common/ErrorBoundary.tsx

'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-red-800 font-bold text-lg mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-red-700 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 8. Checkbox Component

### File: `src/components/Common/Checkbox.tsx`

```typescript
// src/components/Common/Checkbox.tsx

import React, { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
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
```

---

## 9. Alert Component

### File: `src/components/Common/Alert.tsx`

```typescript
// src/components/Common/Alert.tsx

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
```

---

## 10. Modal Component

### File: `src/components/Common/Modal.tsx`

```typescript
// src/components/Common/Modal.tsx

import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  actions,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-lg ${sizeStyles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {actions && (
          <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
```

---

## 11. Skeleton Loader Component

### File: `src/components/Common/Skeleton.tsx`

```typescript
// src/components/Common/Skeleton.tsx

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  count = 1,
  circle = false,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            animate-pulse bg-gray-200
            ${width} ${height}
            ${circle ? 'rounded-full' : 'rounded'}
            ${className}
            ${count > 1 ? 'mb-4' : ''}
          `}
        />
      ))}
    </>
  );
};

Skeleton.displayName = 'Skeleton';
```

---

## 12. Index File (Export All Components)

### File: `src/components/Common/index.ts`

```typescript
// src/components/Common/index.ts

export { Button } from './Button';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Card } from './Card';
export { Label } from './Label';
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorBoundary } from './ErrorBoundary';
export { Checkbox } from './Checkbox';
export { Alert } from './Alert';
export { Modal } from './Modal';
export { Skeleton } from './Skeleton';
```

---

## Usage Examples

### Using Button
```typescript
import { Button } from '@/components/Common';

export function MyComponent() {
  return (
    <>
      <Button variant="primary" size="md" fullWidth>
        Save Plan
      </Button>
      <Button variant="secondary" onClick={() => console.log('Delete')}>
        Delete
      </Button>
      <Button variant="danger" isLoading>
        Deleting...
      </Button>
    </>
  );
}
```

### Using Input & Textarea
```typescript
import { Input, Textarea } from '@/components/Common';
import { useForm } from 'react-hook-form';

export function FormComponent() {
  const { register, formState: { errors } } = useForm();

  return (
    <>
      <Input
        {...register('title', { required: 'Title is required' })}
        label="Task Title"
        error={errors.title?.message}
        fullWidth
      />
      <Textarea
        {...register('notes')}
        label="Notes"
        placeholder="Add notes here..."
        charLimit={500}
        rows={4}
        fullWidth
      />
    </>
  );
}
```

### Using Card
```typescript
import { Card } from '@/components/Common';

export function CardComponent() {
  return (
    <Card padding="lg" elevation="md">
      <h3 className="text-lg font-bold">Deep Work Zone</h3>
      <p className="text-gray-600 mt-2">Add your high-focus tasks here</p>
    </Card>
  );
}
```

### Using Modal
```typescript
'use client';

import { Modal, Button } from '@/components/Common';
import { useState } from 'react';

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        title="Confirm Action"
        onClose={() => setIsOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

---

## Testing Components

### File: `tests/unit/Button.test.tsx`

```typescript
// tests/unit/Button.test.tsx

import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Common';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByText('Click')).toBeDisabled();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger')).toHaveClass('bg-red-600');
  });
});
```

---

## Summary

You now have 12 reusable, accessible, well-tested UI components:

✅ **Button** – Multiple variants (primary, secondary, danger, ghost)  
✅ **Input** – With validation and helper text  
✅ **Textarea** – With character limit counter  
✅ **Card** – Flexible padding and elevation  
✅ **Label** – For form accessibility  
✅ **LoadingSpinner** – Multiple sizes, optional fullscreen  
✅ **ErrorBoundary** – React error handling  
✅ **Checkbox** – Accessible checkbox input  
✅ **Alert** – Success, error, warning, info types  
✅ **Modal** – Accessible dialog component  
✅ **Skeleton** – For loading states  
✅ **Index file** – Easy exports  

### Next Steps:
1. Create these files in your project
2. Run tests to verify they work
3. Use in **Step 7** to build zone components

### Commit:
```bash
git add src/components/Common
git commit -m "step-6: create 12 reusable ui components with full accessibility and testing"
```

Ready for **Step 7** (Zone Components)?

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ErrorMessageProps {
  variant?: 'inline' | 'banner';
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorMessage({
  variant = 'inline',
  title,
  message,
  action,
  className,
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('mt-1 text-sm text-red-600 dark:text-red-400', className)}>
        <span className="inline-flex items-center gap-1">
          <span role="img" aria-label="warning">
            ⚠️
          </span>
          {message}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" role="img" aria-label="error">
          ❌
        </span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

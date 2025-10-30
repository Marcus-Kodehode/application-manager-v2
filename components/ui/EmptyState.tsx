import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  emoji?: string;
  heading: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  emoji = '📋',
  heading,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)} role="status" aria-live="polite">
      {/* Icon circle */}
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl" aria-hidden="true">
          {emoji}
        </span>
      </div>

      {/* Heading */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {heading}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {/* Call to action */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

import {useState} from 'react';
import {Users} from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  isAvatar?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel = '',
  isAvatar = false,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (isAvatar) {
      return (
        <div
          role="img"
          aria-label={alt}
          className={`flex items-center justify-center bg-primary-tint text-on-primary-tint font-headline text-[10px] font-bold select-none ${className}`}
        >
          {fallbackLabel || 'OS'}
        </div>
      );
    }

    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-tint via-surface-subtle to-surface-canvas text-primary p-4 select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-surface border border-border-hairline flex items-center justify-center text-primary">
          <Users className="w-6 h-6" aria-hidden="true" />
        </div>
        {fallbackLabel && (
          <span className="font-headline text-label-sm text-on-surface text-center">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

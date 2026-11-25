import {useResolvedMediaUrl} from '../utils/mediaStorage';
import {ResilientImage} from './ResilientImage';

interface CandidateMediaProps {
  imageUrl: string;
  imageAlt: string;
  fallbackLabel: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  className?: string;
}

export function CandidateMedia({
  imageUrl,
  imageAlt,
  fallbackLabel,
  mediaType = 'image',
  videoUrl,
  className = 'w-full aspect-[4/3] object-cover',
}: CandidateMediaProps) {
  const resolvedImageUrl = useResolvedMediaUrl(imageUrl);
  const resolvedVideoUrl = useResolvedMediaUrl(
    mediaType === 'video' ? videoUrl : undefined
  );

  if (mediaType === 'video' && resolvedVideoUrl) {
    return (
      <video
        src={resolvedVideoUrl}
        poster={resolvedImageUrl}
        controls
        playsInline
        preload="metadata"
        aria-label={`Video kampanye ${fallbackLabel}`}
        className={`${className} bg-black`}
      />
    );
  }

  return (
    <ResilientImage
      src={resolvedImageUrl ?? imageUrl}
      alt={imageAlt}
      fallbackLabel={fallbackLabel}
      className={className}
    />
  );
}

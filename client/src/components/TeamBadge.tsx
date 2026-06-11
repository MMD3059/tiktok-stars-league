interface Props {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function TeamBadge({ src, alt, size = 8, className = "" }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={`inline-block object-contain rounded-full ${className}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
}

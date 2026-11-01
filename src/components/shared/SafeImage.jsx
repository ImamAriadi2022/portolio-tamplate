import { useState } from "react";

/**
 * Komponen gambar yang menangani path kosong atau kegagalan pemuatan gambar.
 */
const SafeImage = ({
  src,
  alt = "",
  className = "",
  fallbackClassName = "",
  fallbackIcon = "ri-image-line",
  fallbackText = "",
  hideOnEmpty = false,
  hideOnError = false,
  onClick,
  ...rest
}) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const hasError = Boolean(src && failedSrc === src);

  if (!src || hasError) {
    if (hideOnEmpty || (hasError && hideOnError)) {
      return null;
    }
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-800/80 text-zinc-500 border border-zinc-700/60 select-none ${
          fallbackClassName || className
        }`}
        aria-label={alt || "Gambar tidak tersedia"}
      >
        <i className={`${fallbackIcon} text-2xl`}></i>
        {fallbackText && (
          <span className="text-xs mt-1 text-zinc-400 text-center px-2">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setFailedSrc(src)}
      loading="lazy"
      {...rest}
    />
  );
};

export default SafeImage;

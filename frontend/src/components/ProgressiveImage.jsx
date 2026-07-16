import { useState, useEffect } from "react";

export function ProgressiveImage({ src, placeholderSrc, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setImgSrc(placeholderSrc || src);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src, placeholderSrc]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={`${className} transition-all duration-500 ${
        isLoaded ? "blur-0" : "blur-sm"
      }`}
    />
  );
}

export default ProgressiveImage;

import { useState, useEffect } from "react";

export function ProgressiveImage({ src, placeholderSrc, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(!placeholderSrc);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (isMounted) {
        setImgSrc(src);
        setIsLoaded(true);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt || "Millzon Commercial Machinery"}
      className={`${className || ""} transition-all duration-500 ${
        isLoaded ? "blur-0" : "blur-sm"
      }`}
    />
  );
}

export default ProgressiveImage;

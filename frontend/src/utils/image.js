/**
 * Utility to generate optimized/compressed image URLs dynamically.
 * Supports Cloudinary, Unsplash, and local image transformations for WebP/AVIF.
 */
export const getOptimizedImageUrl = (url, width, quality = "auto") => {
  if (!url) return "";

  // Handle local object URLs (blobs used during previews)
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  // Handle Cloudinary URLs
  if (url.includes("cloudinary.com")) {
    const params = [];
    params.push(`q_${quality}`);
    params.push("f_auto"); // auto-select webp/avif formats
    if (width) {
      params.push(`w_${width}`);
    }
    const transformationString = params.join(",");
    return url.replace("/upload/", `/upload/${transformationString}/`);
  }

  // Handle Unsplash URLs
  if (url.includes("unsplash.com")) {
    try {
      const newUrl = new URL(url);
      if (width) {
        newUrl.searchParams.set("w", width.toString());
      }
      newUrl.searchParams.set("q", quality === "auto" ? "80" : quality.toString());
      newUrl.searchParams.set("auto", "format");
      newUrl.searchParams.set("fit", "crop");
      return newUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
};

/**
 * Returns WebP alternative path if available for local assets
 */
export const getWebPUrl = (url) => {
  if (!url) return "";
  if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg")) {
    return url.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  }
  return url;
};

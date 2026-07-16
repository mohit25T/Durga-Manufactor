/**
 * Utility to generate optimized/compressed image URLs dynamically.
 * Supports Cloudinary and Unsplash URL transformations.
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
    } catch (e) {
      return url;
    }
  }

  return url;
};

import { useEffect } from "react";

const DOMAIN = "https://www.durgamanufactures.com";
const DEFAULT_BRAND = "Millzon";
const DEFAULT_TITLE = "Commercial Food Processing Machinery | Millzon";
const DEFAULT_DESCRIPTION = "Millzon is a premier manufacturer of commercial food processing machinery in India, including heavy-duty flour mills, pulverizers, vegetable cutters, potato slicers, dough kneaders, and spices grinding machines.";
const DEFAULT_IMAGE = `${DOMAIN}/millzon-logo.png`;

function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = null,
  keywords = "commercial food processing machinery, Millzon, flour mill, pulverizer machine, vegetable cutter, dough kneader, potato slicer, spices grinding machine, Rajkot manufacturer India"
}) {
  useEffect(() => {
    // 1. Set Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMetaTag("name", "author", "Millzon");

    // 3. Open Graph Tags
    const currentUrl = canonicalUrl ? `${DOMAIN}${canonicalUrl}` : window.location.href;
    setMetaTag("property", "og:site_name", DEFAULT_BRAND);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:locale", "en_IN");

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const targetCanonical = canonicalUrl ? `${DOMAIN}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}` : `${DOMAIN}${window.location.pathname}`;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", targetCanonical);

    // 6. Dynamic JSON-LD injection
    const scriptId = "seo-json-ld";
    let scriptTag = document.getElementById(scriptId);
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = scriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, noindex, jsonLd, keywords]);

  return null;
}

export default SEO;

import { useEffect } from "react";
import { useLocation } from "react-router";

const SITE_NAME = "Shiyanax";
const DEFAULT_DESCRIPTION =
  "Track cryptocurrency prices, exchanges, market stats, and crypto news with Shiyanax.";
const DEFAULT_OG_IMAGE =
  "https://cdn.jsdelivr.net/gh/shiyanax/crypto@main/public/og-image.png";

const getImageType = (url) => {
  if (!url) return "image/png";
  if (url.includes(".jpg") || url.includes(".jpeg")) return "image/jpeg";
  if (url.includes(".webp")) return "image/webp";
  return "image/png";
};

const setMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const setCanonical = (url) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", url);
};

const Seo = ({ title, description = DEFAULT_DESCRIPTION, image }) => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const ogImage = image || DEFAULT_OG_IMAGE;

    document.title = pageTitle;
    setCanonical(canonicalUrl);

    setMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    setMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    setMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    setMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: ogImage,
    });
    setMetaTag('meta[property="og:image:secure_url"]', {
      property: "og:image:secure_url",
      content: ogImage,
    });
    setMetaTag('meta[property="og:image:type"]', {
      property: "og:image:type",
      content: getImageType(ogImage),
    });
    setMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });
    setMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: ogImage,
    });
  }, [description, image, location.pathname, title]);

  return null;
};

export default Seo;

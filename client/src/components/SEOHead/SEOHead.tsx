import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: SEOHeadProps) {
  const siteName = '我的博客';
  const defaultDescription = '个人博客';

  useEffect(() => {
    if (title) {
      document.title = `${title} - ${siteName}`;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    if (ogTitle) {
      updateOrCreateMeta('property', 'og:title', ogTitle);
    }
    if (ogDescription) {
      updateOrCreateMeta('property', 'og:description', ogDescription || description || defaultDescription);
    }
    if (ogImage) {
      updateOrCreateMeta('property', 'og:image', ogImage);
    }
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:site_name', siteName);

    updateOrCreateMeta('name', 'twitter:card', twitterCard);
    if (ogTitle) {
      updateOrCreateMeta('name', 'twitter:title', ogTitle);
    }
    if (ogDescription) {
      updateOrCreateMeta('name', 'twitter:description', ogDescription || description || defaultDescription);
    }
    if (ogImage) {
      updateOrCreateMeta('name', 'twitter:image', ogImage);
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard]);

  return null;
}

function updateOrCreateMeta(attr: 'name' | 'property', key: string, value: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.content = value;
}
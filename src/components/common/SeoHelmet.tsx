import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
}

export const SeoHelmet: React.FC<SeoProps> = ({
  title,
  description = 'Play the best free online HTML5 games on PlayHub. Instant play, high scores, and arcade classics right in your browser.',
  image = '/src/assets/images/arcade_space_odyssey_1792824598615.jpg',
  type = 'website',
  canonicalUrl,
}) => {
  useEffect(() => {
    const fullTitle = title.includes('PlayHub') ? title : `${title} | PlayHub`;
    document.title = fullTitle;

    // Helper to safely set or create meta tag
    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    if (image) {
      setMeta('og:image', image, true);
      setMeta('twitter:image', image);
    }
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }, [title, description, image, type, canonicalUrl]);

  return null;
};

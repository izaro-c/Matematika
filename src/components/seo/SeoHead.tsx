import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getAbsoluteUrl } from '@/lib/seo/siteUrl';
import { useI18n } from '@/i18n';

export interface SeoBreadcrumb {
  name: string;
  href?: string;
}

export interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'defined-term';
  author?: string[];
  breadcrumbs?: SeoBreadcrumb[];
  noindex?: boolean;
}

const DEFAULT_SITE_TITLE = 'Matematika | La Enciclopedia Interactiva';
const DEFAULT_DESCRIPTION = 'Exploración interactiva, visual y formal de la matemática: teoremas, demostraciones, axiomas y modelos visuales.';

function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkCanonical(href: string) {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function updateJsonLd(data: object | null, scriptId: string) {
  let element = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!data) {
    if (element) element.remove();
    return;
  }

  if (!element) {
    element = document.createElement('script');
    element.id = scriptId;
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data, null, 2);
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  image,
  type = 'website',
  author = [],
  breadcrumbs = [],
  noindex = false,
}) => {
  const [location] = useLocation();
  const { lang } = useI18n();

  // Detectar automáticamente si estamos en la ruta de editor
  const isEditorRoute = noindex || location === '/editor' || location.startsWith('/editor/') || /\/[a-z]{2}(-[A-Z]{2})?\/editor(\/|$)/.test(location);

  const fullTitle = title ? `${title} | Matematika` : DEFAULT_SITE_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = getAbsoluteUrl(location);
  const socialImageUrl = image
    ? (image.startsWith('http') ? image : getAbsoluteUrl(image))
    : getAbsoluteUrl('/images/og-default.png');
  const locale = lang === 'eu' ? 'eu_ES' : 'es_ES';

  useEffect(() => {
    // 1. Título e idioma <html lang>
    document.title = fullTitle;
    document.documentElement.lang = lang;

    // 2. Meta description
    updateMetaTag('name', 'description', metaDescription);

    // 3. Robots (noindex en editor)
    updateMetaTag('name', 'robots', isEditorRoute ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical URL
    updateLinkCanonical(canonicalUrl);

    // 5. Open Graph
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type === 'defined-term' ? 'website' : type);
    updateMetaTag('property', 'og:image', socialImageUrl);
    updateMetaTag('property', 'og:locale', locale);
    updateMetaTag('property', 'og:site_name', 'Matematika');

    // 6. Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', socialImageUrl);

    // 7. JSON-LD: BreadcrumbList
    if (breadcrumbs.length > 0) {
      const breadcrumbListJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.href ? getAbsoluteUrl(crumb.href) : canonicalUrl,
        })),
      };
      updateJsonLd(breadcrumbListJson, 'json-ld-breadcrumbs');
    } else {
      updateJsonLd(null, 'json-ld-breadcrumbs');
    }

    // 8. JSON-LD: Article / DefinedTerm
    if (type === 'article') {
      const articleJson = {
        '@context': 'https://schema.org',
        '@type': 'EducationalArticle',
        headline: title || fullTitle,
        description: metaDescription,
        inLanguage: lang,
        url: canonicalUrl,
        image: socialImageUrl,
        author: author.length > 0 ? author.map(a => ({ '@type': 'Person', name: a })) : [{ '@type': 'Organization', name: 'Matematika' }],
        publisher: {
          '@type': 'Organization',
          name: 'Matematika',
          logo: {
            '@type': 'ImageObject',
            url: getAbsoluteUrl('/icons/matematika-logo.svg'),
          },
        },
      };
      updateJsonLd(articleJson, 'json-ld-main');
    } else if (type === 'defined-term') {
      const definedTermJson = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: title || fullTitle,
        description: metaDescription,
        inLanguage: lang,
        url: canonicalUrl,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'Matematika Códice',
          url: getAbsoluteUrl(`/${lang}/diccionario`),
        },
      };
      updateJsonLd(definedTermJson, 'json-ld-main');
    } else {
      updateJsonLd(null, 'json-ld-main');
    }
  }, [fullTitle, metaDescription, isEditorRoute, canonicalUrl, socialImageUrl, locale, lang, type, author, breadcrumbs, title]);

  return null;
};

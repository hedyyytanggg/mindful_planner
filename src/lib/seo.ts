/**
 * SEO utility functions for Mindful Planner
 */

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mindfulplanner.com'
    return `${baseUrl}${path}`
}

/**
 * Generate Open Graph image URL
 */
export function getOgImageUrl(path?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mindfulplanner.com'
    return path ? `${baseUrl}${path}` : `${baseUrl}/og-image.png`
}

/**
 * Truncate text for meta description
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
}

/**
 * Generate JSON-LD for Article (Blog Post)
 */
export function generateArticleSchema(article: {
    title: string
    description: string
    author: string
    publishedAt: string
    updatedAt?: string
    image: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
            '@type': 'Person',
            name: article.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Mindful Daily Planner',
            logo: {
                '@type': 'ImageObject',
                url: 'https://mindfulplanner.com/logo.png',
            },
        },
    }
}

/**
 * Generate JSON-LD for Breadcrumbs
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    }
}

/**
 * Generate JSON-LD for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }
}

/**
 * Generate meta keywords from array
 */
export function generateKeywords(keywords: string[]): string {
    return keywords.join(', ')
}

/**
 * Extract keywords from text (simple implementation)
 */
export function extractKeywords(text: string, count: number = 10): string[] {
    // Remove common words and extract significant terms
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])

    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word))

    // Count frequency
    const frequency = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Sort by frequency and return top N
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([word]) => word)
}

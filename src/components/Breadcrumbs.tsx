'use client'

import Link from 'next/link'

interface BreadcrumbItem {
    label: string
    href: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `${process.env.NEXT_PUBLIC_BASE_URL}${item.href}`,
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-gray-600">
                    <li>
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={item.href} className="flex items-center">
                            <span className="mx-2">/</span>
                            {index === items.length - 1 ? (
                                <span className="text-gray-900 font-medium">{item.label}</span>
                            ) : (
                                <Link href={item.href} className="hover:text-blue-600">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}

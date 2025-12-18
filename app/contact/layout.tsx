import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    title: 'Contact Us — We\'re Here to Help',
    description: 'Have questions about Mindful Planner? Get in touch with our team. We typically respond within 24 hours.',
    openGraph: {
        title: 'Contact Us — We\'re Here to Help | Mindful Planner',
        description: 'Questions, feedback, or just want to say hi? We\'d love to hear from you.',
        url: `${baseUrl}/contact`,
        type: 'website',
    },
    alternates: {
        canonical: `${baseUrl}/contact`,
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

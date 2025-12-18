import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    title: 'Create Your Free Account',
    description: 'Start planning mindfully today. Sign up for Mindful Planner — free during beta. No credit card required. Your data stays private.',
    keywords: ['sign up', 'create account', 'free planner', 'daily planner signup'],
    openGraph: {
        title: 'Create Your Free Account | Mindful Planner',
        description: 'Join thousands planning their days with purpose. Free during beta.',
        url: `${baseUrl}/signup`,
        type: 'website',
    },
    alternates: {
        canonical: `${baseUrl}/signup`,
    },
}

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

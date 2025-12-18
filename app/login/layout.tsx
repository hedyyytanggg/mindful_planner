import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    title: 'Sign In to Your Account',
    description: 'Sign in to Mindful Planner and continue planning your day with purpose. Access your personalized daily planner.',
    robots: {
        index: false, // Don't index login page
        follow: true,
    },
    alternates: {
        canonical: `${baseUrl}/login`,
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

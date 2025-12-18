import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: '7 Powerful Features for Balanced Productivity',
  description: 'Discover the 7 zones of Mindful Planner: Deep Work, Quick Wins, Make It Happen, Recharge, Little Joys, Reflection, and Focus for Tomorrow. Plan smarter, not harder.',
  keywords: ['deep work zone', 'productivity features', 'recharge activities', 'daily reflection', 'quick wins', 'task management'],
  openGraph: {
    title: '7 Powerful Features for Balanced Productivity | Mindful Planner',
    description: 'Discover the 7 zones that help you achieve more without burnout.',
    url: `${baseUrl}/features`,
    type: 'website',
  },
  alternates: {
    canonical: `${baseUrl}/features`,
  },
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add FAQ Schema for features page
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the Deep Work Zone?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Deep Work Zone helps you focus on 1-2 high-impact tasks with time estimates and detailed notes for maximum productivity. It\'s designed to help you accomplish your most important work without distractions.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the Recharge Zone work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Recharge Zone offers 8+ mindful activities (meditation, walking, creative time, social connection) or lets you add custom activities to maintain energy and well-being throughout your day.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are Quick Wins?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quick Wins are 3-5 small, achievable tasks that build confidence and momentum throughout your day. They help you feel productive even when tackling smaller items on your to-do list.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}

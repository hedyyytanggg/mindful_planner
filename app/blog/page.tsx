import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - Productivity & Mindful Planning Tips',
    description: 'Practical advice on planning, productivity, and finding balance. Real strategies that actually work for real people.',
    openGraph: {
        title: 'Blog | Mindful Planner',
        description: 'Practical productivity advice without the hustle culture nonsense',
    },
}

export default function BlogPage() {
    const posts = [
        {
            slug: 'planning-for-prospecting-types',
            title: 'Planning for People Who Hate Planning (A Guide for Prospecting Types)',
            excerpt: 'If rigid schedules make you anxious and you work best spontaneously, here\'s how to plan without killing your flexibility.',
            date: 'Dec 31, 2025',
            readTime: '7 min read',
            category: 'Planning',
        },
        {
            slug: 'stop-planning-your-entire-week',
            title: 'Why I Stopped Planning My Entire Week (And Started Getting More Done)',
            excerpt: 'Controversial take: weekly planning might be killing your productivity. Here\'s what I do instead.',
            date: 'Dec 28, 2025',
            readTime: '5 min read',
            category: 'Planning',
        },
        {
            slug: 'deep-work-myths',
            title: 'Deep Work Is Overrated (Sort Of)',
            excerpt: 'Everyone\'s obsessed with 4-hour focus blocks. But what if you only have 45 minutes? Turns out, that\'s plenty.',
            date: 'Dec 20, 2025',
            readTime: '6 min read',
            category: 'Focus',
        },
        {
            slug: 'productivity-guilt',
            title: 'The Guilt-Free Guide to Taking Breaks',
            excerpt: 'Why do we feel terrible about resting? Let\'s fix that. Here\'s how I learned to take breaks without the anxiety spiral.',
            date: 'Dec 15, 2025',
            readTime: '7 min read',
            category: 'Wellness',
        },
        {
            slug: 'morning-routine-reality',
            title: 'My Morning Routine (The Real Version)',
            excerpt: 'No cold plunges. No 5am wake-ups. Just what actually works when you\'re not a productivity influencer.',
            date: 'Dec 10, 2025',
            readTime: '5 min read',
            category: 'Habits',
        },
        {
            slug: 'task-list-actually-works',
            title: 'I Tried Every Task Management Method. Here\'s What Actually Works.',
            excerpt: 'GTD, Eisenhower Matrix, Eat the Frog... I\'ve tried them all. Here\'s the system I actually stick with.',
            date: 'Dec 5, 2025',
            readTime: '8 min read',
            category: 'Systems',
        },
    ]

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Blog
                </h1>
                <p className="text-xl text-gray-600">
                    Productivity advice for actual humans. No hustle culture, no toxic positivity—just real strategies that work.
                </p>
            </div>

            <div className="space-y-8">
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="border-b border-gray-200 pb-8 last:border-b-0"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-medium text-blue-600">
                                {post.category}
                            </span>
                            <span className="text-gray-400">•</span>
                            <time className="text-sm text-gray-500">{post.date}</time>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{post.readTime}</span>
                        </div>

                        <Link href={`/blog/${post.slug}`} className="group">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-lg text-gray-600 mb-4">
                            {post.excerpt}
                        </p>

                        <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1"
                        >
                            Read more
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    )
}

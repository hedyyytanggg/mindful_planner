import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Productivity Resources',
    description: 'Download free daily planning templates, productivity guides, and mindfulness worksheets.',
}

export default function ResourcesPage() {
    const resources = [
        {
            title: '7-Zone Daily Planning Template',
            description: 'Our signature planning framework in a free PDF template',
            type: 'PDF Template',
            downloadUrl: '#',
        },
        {
            title: 'Deep Work Planning Guide',
            description: 'Master focused work sessions with this comprehensive guide',
            type: 'Guide',
            downloadUrl: '#',
        },
        {
            title: 'Weekly Reflection Worksheet',
            description: 'Reflect on your week and plan better for the next',
            type: 'Worksheet',
            downloadUrl: '#',
        },
        {
            title: 'Morning Routine Checklist',
            description: 'Start your day right with science-backed morning habits',
            type: 'Checklist',
            downloadUrl: '#',
        },
    ]

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Free Productivity Resources
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Templates, guides, and worksheets to help you plan your day mindfully
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {resources.map((resource) => (
                    <div
                        key={resource.title}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                            {resource.type}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {resource.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{resource.description}</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Download Free
                        </button>
                    </div>
                ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-3">
                    Get Weekly Planning Tips
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Join 5,000+ people receiving productivity insights, planning templates, and mindfulness tips every Tuesday.
                </p>
                <form className="max-w-md mx-auto flex gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="text-sm text-blue-100 mt-3">
                    No spam. Unsubscribe anytime.
                </p>
            </div>
        </div>
    )
}

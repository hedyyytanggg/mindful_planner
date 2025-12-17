'use client';

import { Card } from '@/components/Common';

export default function PrivacyPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🔒 Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: December 17, 2025</p>
                </div>

                <div className="space-y-6">
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Mindful Planner ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                        <div className="space-y-3 text-gray-700">
                            <p className="font-semibold">We collect information about you in the following ways:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Account Information:</strong> Email address and password (securely hashed)</li>
                                <li><strong>Planning Data:</strong> Your daily plans across all zones (Deep Work, Quick Wins, Make It Happen, Recharge, Little Joys, Reflections, Focus Tomorrow)</li>
                                <li><strong>Project Data:</strong> Projects, hobbies, and events you track, plus activity updates</li>
                                <li><strong>Memory Data:</strong> Core memories you choose to save</li>
                                <li><strong>Usage Data:</strong> Login sessions and authentication tokens</li>
                            </ul>
                            <p className="mt-3 text-sm">All planning data is stored securely in our PostgreSQL database and is only accessible to you when logged in.</p>
                        </div>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Provide and maintain our services</li>
                            <li>Improve and personalize your experience</li>
                            <li>Send transactional emails and notifications</li>
                            <li>Respond to your inquiries</li>
                            <li>Comply with legal obligations</li>
                            <li>Detect and prevent fraud</li>
                        </ul>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage & Security</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Your data is stored securely in our PostgreSQL database with the following protections:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Passwords are hashed using SHA256 encryption</li>
                            <li>All data transmission uses SSL/TLS encryption</li>
                            <li>Database access is restricted and authenticated</li>
                            <li>Regular security updates and monitoring</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            We employ industry-standard security measures to protect your personal information, but no method of transmission over the internet is 100% secure.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We currently do not use third-party analytics or tracking services. Your data stays between you and Mindful Planner.
                        </p>
                        <p className="text-gray-700">
                            If we integrate third-party services in the future (such as payment processing or cloud backups), we will update this policy and notify users.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Session Management</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use session cookies to keep you logged in and ensure secure authentication. These are essential for the service to function. We do not use tracking cookies or third-party advertising cookies.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy with an updated revision date.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                        </p>
                        <p className="text-gray-700 mt-3">
                            📧 <a href="mailto:mindfulplanner8@gmail.com" className="text-blue-600 hover:underline">mindfulplanner8@gmail.com</a>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

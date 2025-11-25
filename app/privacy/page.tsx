'use client';

import { Card } from '@/components/Common';

export default function PrivacyPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🔒 Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: November 25, 2025</p>
                </div>

                <div className="space-y-6">
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Mindful Daily Planner ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                        <div className="space-y-3 text-gray-700">
                            <p className="font-semibold">We may collect information about you in a variety of ways:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Data:</strong> Name, email address, timezone preference</li>
                                <li><strong>Planning Data:</strong> Your daily plans, zones, reflections, and preferences (stored locally)</li>
                                <li><strong>Usage Data:</strong> How you interact with the app (anonymized)</li>
                                <li><strong>Device Data:</strong> Device type, browser, IP address</li>
                            </ul>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Local Storage & Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your daily plans and personal information are primarily stored locally on your device using browser storage. We employ industry-standard security measures including SSL/TLS encryption for data in transit and encryption at rest for any data stored on our servers.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We may use third-party services to enhance your experience:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Google Analytics (for usage analytics)</li>
                            <li>Cloud backup providers (optional)</li>
                            <li>Email service providers</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            These services have their own privacy policies, and we encourage you to review them.
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience. Most browsers allow you to control cookies through settings. We use both session and persistent cookies for functionality and analytics.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our service is not directed to children under 13. We do not knowingly collect personal information from children. If we become aware that we have collected such information, we take steps to delete such information.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy with an updated revision date.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                        </p>
                        <p className="text-gray-700 mt-3">
                            📧 <a href="mailto:privacy@mindfulplanner.com" className="text-blue-600 hover:underline">privacy@mindfulplanner.com</a>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

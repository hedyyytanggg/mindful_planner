'use client';

import { Card } from '@/components/Common';

export default function TermsPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📜 Terms of Service</h1>
                    <p className="text-gray-600">Last updated: December 17, 2025</p>
                </div>

                <div className="space-y-6">
                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing and using Mindful Planner, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Mindful Planner is a zone-based daily planning application that helps you organize your work, track projects, capture memories, and maintain balance. The service includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Daily planning across 7 zones (Deep Work, Quick Wins, Make It Happen, Recharge, Little Joys, Reflections, Focus Tomorrow)</li>
                            <li>Activity log for tracking projects, hobbies, and events</li>
                            <li>Core memories for capturing meaningful moments</li>
                            <li>Free tier with 7-day plan history</li>
                            <li>Pro tier (when available) with unlimited history and additional features</li>
                        </ul>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use License</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Mindful Planner for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            You may not: (a) modify or copy the materials; (b) use the materials for any commercial purpose or for any public display; (c) attempt to reverse engineer any software; (d) remove any copyright or other proprietary notations; (e) transfer the materials to another person or "mirror" the materials on any other server.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer</h2>
                        <p className="text-gray-700 leading-relaxed">
                            The materials on Mindful Planner are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations</h2>
                        <p className="text-gray-700 leading-relaxed">
                            In no event shall Mindful Planner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our site.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Accuracy of Materials</h2>
                        <p className="text-gray-700 leading-relaxed">
                            The materials appearing on Mindful Planner could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Links to Other Sites</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. User Accounts</h2>
                        <div className="space-y-3 text-gray-700">
                            <p>When you create an account on Mindful Planner, you are responsible for:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Providing a valid email address for account creation</li>
                                <li>Maintaining the security and confidentiality of your password</li>
                                <li>Accepting responsibility for all activities under your account</li>
                                <li>Notifying us immediately at mindfulplanner8@gmail.com of any unauthorized access</li>
                            </ul>
                            <p className="mt-3">We reserve the right to terminate accounts that violate these terms.</p>
                        </div>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Prohibited Conduct</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            You agree not to engage in any of the following prohibited conduct:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Harassing or causing distress or inconvenience to any person</li>
                            <li>Obscene or offensive statements or otherwise abusive language</li>
                            <li>Deliberate intimidation or harassment</li>
                            <li>Sexually related comments or acts</li>
                            <li>Any conduct that would be considered illegal</li>
                        </ul>
                    </Card>

                    <Card padding="md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at:
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

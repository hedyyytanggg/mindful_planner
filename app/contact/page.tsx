'use client';

import { useState } from 'react';
import { Card, Button, Input, Textarea, Alert } from '@/components/Common';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this to a backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📧 Contact Us</h1>
                    <p className="text-gray-600">We'd love to hear from you. Let us know how we can help.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card padding="md" className="text-center">
                        <div className="text-4xl mb-3">📧</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <a href="mailto:hello@mindfulplanner.com" className="text-blue-600 hover:underline text-sm">
                            hello@mindfulplanner.com
                        </a>
                    </Card>

                    <Card padding="md" className="text-center">
                        <div className="text-4xl mb-3">🐦</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Twitter</h3>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            @MindfulPlanner
                        </a>
                    </Card>

                    <Card padding="md" className="text-center">
                        <div className="text-4xl mb-3">💬</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Discord</h3>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            Join Community
                        </a>
                    </Card>
                </div>

                <Card padding="md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                    {submitted && (
                        <div className="mb-6">
                            <Alert
                                type="success"
                                message="✓ Thank you! Your message has been sent. We'll get back to you soon."
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Your Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <select
                                id="subject-select"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                aria-label="Select inquiry subject"
                            >
                                <option value="">Select a subject...</option>
                                <option value="feedback">Product Feedback</option>
                                <option value="bug">Report a Bug</option>
                                <option value="feature">Feature Request</option>
                                <option value="support">Support</option>
                                <option value="partnership">Partnership Inquiry</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Textarea
                            label="Message"
                            name="message"
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-1">
                                Send Message
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setFormData({ name: '', email: '', subject: '', message: '' })}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card padding="md" className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">What's the response time?</h3>
                            <p className="text-gray-700 text-sm">We typically respond to inquiries within 24 hours on business days.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Do you offer support for enterprise customers?</h3>
                            <p className="text-gray-700 text-sm">Yes! For enterprise support, please reach out to our sales team.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Can I schedule a demo?</h3>
                            <p className="text-gray-700 text-sm">Absolutely! Use the form above and select "Partnership Inquiry" and we'll set something up.</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">How can I report a security issue?</h3>
                            <p className="text-gray-700 text-sm">For security concerns, please email security@mindfulplanner.com directly.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

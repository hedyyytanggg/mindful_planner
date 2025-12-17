'use client';

export default function ContactPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-20">
            <div className="max-w-2xl mx-auto px-6 text-center">
                <div className="text-6xl mb-6">📧</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                <p className="text-xl text-gray-600 mb-8">
                    We&apos;d love to hear from you! Whether you have feedback, questions, or just want to say hello.
                </p>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                    <a
                        href="mailto:mindfulplanner8@gmail.com"
                        className="text-2xl text-blue-600 hover:text-blue-700 font-medium transition-colors inline-block"
                    >
                        mindfulplanner8@gmail.com
                    </a>
                </div>

                <div className="text-gray-600">
                    <p className="mb-4">We welcome:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>Product feedback</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>Bug reports</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>Feature requests</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>General questions</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

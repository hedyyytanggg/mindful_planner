'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Footer() {
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        // Ensure year matches on client after hydration
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">🧘 Mindful</h3>
                        <p className="text-sm text-gray-400">
                            Plan your day with intention, mindfulness, and purpose.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/planner" className="hover:text-blue-400 transition">
                                    Daily Planner
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="hover:text-blue-400 transition">
                                    Features
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-400 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-blue-400 transition">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-blue-400 transition">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-8">
                    {/* Copyright */}
                    <div className="text-center text-sm text-gray-500">
                        <p>
                            © {currentYear} Mindful Planner. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

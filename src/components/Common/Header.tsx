'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200" role="banner">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label="Mindful Planner - Home"
                    >
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" aria-hidden="true">
                            🧘 Mindful
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Planner</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6" aria-label="Main Navigation">
                        <Link
                            href="/planner"
                            className={`font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${isActive('/planner')
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                }`}
                            aria-current={isActive('/planner') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">📅</span> Planner
                        </Link>

                        <Link
                            href="/features"
                            className={`font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${isActive('/features')
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                }`}
                            aria-current={isActive('/features') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">✨</span> Features
                        </Link>

                        <Link
                            href="/about"
                            className={`font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${isActive('/about')
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                }`}
                            aria-current={isActive('/about') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">ℹ️</span> About
                        </Link>

                        <Link
                            href="/settings"
                            className={`font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${isActive('/settings')
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                }`}
                            aria-current={isActive('/settings') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">⚙️</span> Settings
                        </Link>
                    </nav>

                    {/* User Menu (Placeholder) */}
                    <div className="flex items-center gap-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Open user profile menu"
                        >
                            <span aria-hidden="true">👤</span> Profile
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            🧘 Mindful
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Daily Planner</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/planner"
                            className={`font-medium transition ${isActive('/planner')
                                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-gray-700 hover:text-blue-600'
                                }`}
                        >
                            📅 Planner
                        </Link>

                        <Link
                            href="/features"
                            className={`font-medium transition ${isActive('/features')
                                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-gray-700 hover:text-blue-600'
                                }`}
                        >
                            ✨ Features
                        </Link>

                        <Link
                            href="/about"
                            className={`font-medium transition ${isActive('/about')
                                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-gray-700 hover:text-blue-600'
                                }`}
                        >
                            ℹ️ About
                        </Link>

                        <Link
                            href="/settings"
                            className={`font-medium transition ${isActive('/settings')
                                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                    : 'text-gray-700 hover:text-blue-600'
                                }`}
                        >
                            ⚙️ Settings
                        </Link>
                    </nav>

                    {/* User Menu (Placeholder) */}
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                            👤 Profile
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

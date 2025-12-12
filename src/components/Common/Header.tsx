'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showMenu, setShowMenu] = useState(false);

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

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                                    aria-label="Open user profile menu"
                                    aria-expanded={showMenu}
                                >
                                    <span aria-hidden="true">👤</span>
                                    <span className="hidden sm:inline max-w-[120px] truncate">{session.user.email || 'User'}</span>
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                                            <p className="text-xs text-gray-500">Signed in</p>
                                        </div>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            ⚙️ Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-lg text-gray-700 font-medium transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

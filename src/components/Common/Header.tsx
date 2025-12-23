'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinkClass = (path: string) => `font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 ${isActive(path)
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200" role="banner">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label="Mindful Planner - Home"
                    >
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" aria-hidden="true">
                            🧘 Mindful
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Planner</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Main Navigation">
                        <Link
                            href="/planner"
                            className={navLinkClass('/planner')}
                            aria-current={isActive('/planner') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">📅</span> Planner
                        </Link>

                        <Link
                            href="/timeline"
                            className={navLinkClass('/timeline')}
                            aria-current={isActive('/timeline') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">📜</span> Timeline
                        </Link>

                        <Link
                            href="/features"
                            className={navLinkClass('/features')}
                            aria-current={isActive('/features') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">✨</span> Features
                        </Link>

                        <Link
                            href="/about"
                            className={navLinkClass('/about')}
                            aria-current={isActive('/about') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">ℹ️</span> About
                        </Link>

                        <Link
                            href="/settings"
                            className={navLinkClass('/settings')}
                            aria-current={isActive('/settings') ? 'page' : undefined}
                        >
                            <span aria-hidden="true">⚙️</span> Settings
                        </Link>
                    </nav>

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="px-3 lg:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                                    aria-label="Open user profile menu"
                                    aria-expanded={showUserMenu}
                                >
                                    <span aria-hidden="true">👤</span>
                                    <span className="hidden lg:inline max-w-[120px] truncate">{session.user.email || 'User'}</span>
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                                            <p className="text-xs text-gray-500">Signed in</p>
                                        </div>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            ⚙️ Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
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
                                    className="px-3 lg:px-4 py-2 rounded-lg text-gray-700 font-medium transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-3 lg:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle mobile menu"
                        aria-expanded={showMobileMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {showMobileMenu ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4" aria-label="Mobile Navigation">
                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/planner"
                                className={`block px-3 py-2 rounded-lg ${isActive('/planner')
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-current={isActive('/planner') ? 'page' : undefined}
                            >
                                <span aria-hidden="true">📅</span> Planner
                            </Link>

                            <Link
                                href="/timeline"
                                className={`block px-3 py-2 rounded-lg ${isActive('/timeline')
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-current={isActive('/timeline') ? 'page' : undefined}
                            >
                                <span aria-hidden="true">📜</span> Timeline
                            </Link>

                            <Link
                                href="/features"
                                className={`block px-3 py-2 rounded-lg ${isActive('/features')
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-current={isActive('/features') ? 'page' : undefined}
                            >
                                <span aria-hidden="true">✨</span> Features
                            </Link>

                            <Link
                                href="/about"
                                className={`block px-3 py-2 rounded-lg ${isActive('/about')
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-current={isActive('/about') ? 'page' : undefined}
                            >
                                <span aria-hidden="true">ℹ️</span> About
                            </Link>

                            <Link
                                href="/settings"
                                className={`block px-3 py-2 rounded-lg ${isActive('/settings')
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-current={isActive('/settings') ? 'page' : undefined}
                            >
                                <span aria-hidden="true">⚙️</span> Settings
                            </Link>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                {session?.user ? (
                                    <>
                                        <div className="px-3 py-2 mb-2">
                                            <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                                            <p className="text-xs text-gray-500">Signed in</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowMobileMenu(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            className="block px-3 py-2 rounded-lg text-center text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="block px-3 py-2 rounded-lg text-center bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

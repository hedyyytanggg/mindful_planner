'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function JourneyNav() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const journeyLinks = [
        { href: '/quick-wins', icon: '⚡', label: 'Quick Wins', color: 'hover:bg-yellow-50 hover:border-yellow-400' },
        { href: '/deep-work', icon: '🧠', label: 'Deep Work', color: 'hover:bg-purple-50 hover:border-purple-400' },
        { href: '/make-it-happen', icon: '🎯', label: 'Make It Happen', color: 'hover:bg-blue-50 hover:border-blue-400' },
        { href: '/little-joys', icon: '✨', label: 'Little Joys', color: 'hover:bg-pink-50 hover:border-pink-400' },
        { href: '/recharge-zones', icon: '🌊', label: 'Recharge', color: 'hover:bg-cyan-50 hover:border-cyan-400' },
        { href: '/core-memories', icon: '💎', label: 'Core Memories', color: 'hover:bg-indigo-50 hover:border-indigo-400' },
        { href: '/reflections-today', icon: '💭', label: 'Reflections', color: 'hover:bg-green-50 hover:border-green-400' },
    ];

    return (
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
                {/* Label */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">🗺️</span>
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Your Journey
                        </h2>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">
                        Track your daily mindful activities
                    </span>
                </div>

                {/* Scrollable Links Container */}
                <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-2 min-w-max">
                        {journeyLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    group flex items-center gap-2 px-4 py-2 rounded-lg border-2 
                                    transition-all duration-200 whitespace-nowrap
                                    ${isActive(link.href)
                                        ? 'bg-white border-blue-500 shadow-md text-blue-700 font-semibold'
                                        : `bg-white/80 border-gray-200 text-gray-700 ${link.color}`
                                    }
                                `}
                            >
                                <span className="text-xl" aria-hidden="true">{link.icon}</span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page
        router.push('/');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Redirecting...</p>
        </div>
    );
}

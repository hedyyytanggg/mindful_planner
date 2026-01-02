'use client';

import Script from 'next/script';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics Measurement ID - replace with your actual ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Separate component for search params tracking (needs Suspense)
function GAPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Send pageview with URL
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  // Don't load in development unless explicitly enabled
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  );
}

// Helper functions to track conversion events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Specific conversion tracking functions
export const trackSignup = (userId?: string) => {
  trackEvent('sign_up', {
    method: 'email',
    user_id: userId,
  });

  // Also track as a conversion for Google Ads
  trackEvent('conversion', {
    send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your Google Ads conversion ID
    event_callback: () => {
      console.log('Signup conversion tracked');
    }
  });
};

export const trackLogin = (userId?: string) => {
  trackEvent('login', {
    method: 'email',
    user_id: userId,
  });
};

export const trackPurchase = (value: number, currency: string = 'USD', transactionId?: string) => {
  trackEvent('purchase', {
    currency,
    value,
    transaction_id: transactionId,
  });
};

export const trackTrialStart = (userId?: string) => {
  trackEvent('begin_checkout', {
    user_id: userId,
    items: [{ item_name: 'Premium Trial' }],
  });
};

export const trackPageView = (url: string, title?: string) => {
  trackEvent('page_view', {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events for your specific features
export const trackFeatureUse = (featureName: string, userId?: string) => {
  trackEvent('feature_use', {
    feature_name: featureName,
    user_id: userId,
  });
};

export const trackTaskCreated = (taskType: string, userId?: string) => {
  trackEvent('task_created', {
    task_type: taskType,
    user_id: userId,
  });
};

export const trackReflectionComplete = (userId?: string) => {
  trackEvent('reflection_complete', {
    user_id: userId,
  });
};

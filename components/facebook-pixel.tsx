'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

interface FacebookPixelProps {
  pixelId: string;
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    // Check if Facebook Pixel is already loaded
    if (typeof window !== 'undefined' && window.fbq) {
      console.log('Facebook Pixel already loaded, skipping initialization');
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="fbevents.js"]');
    if (existingScript) {
      console.log('Facebook Pixel script already exists, skipping initialization');
      return;
    }

    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
    `;
    document.head.appendChild(script);

    // Track PageView after script is loaded
    setTimeout(() => {
      trackPageView();
    }, 100);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="fbevents.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [pixelId]);

  return null;
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    // Check if this event was already tracked in this session
    const eventKey = `${eventName}_${JSON.stringify(parameters || {})}`;
    const trackedEvents = JSON.parse(sessionStorage.getItem('fb_tracked_events') || '[]');
    
    if (!trackedEvents.includes(eventKey)) {
      window.fbq('track', eventName, parameters);
      trackedEvents.push(eventKey);
      sessionStorage.setItem('fb_tracked_events', JSON.stringify(trackedEvents));
    }
  }
};

// Track PageView only once per page load
let pageViewTracked = false;
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq && !pageViewTracked) {
    window.fbq('track', 'PageView');
    pageViewTracked = true;
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    // Check if this custom event was already tracked in this session
    const eventKey = `custom_${eventName}_${JSON.stringify(parameters || {})}`;
    const trackedEvents = JSON.parse(sessionStorage.getItem('fb_tracked_events') || '[]');
    
    if (!trackedEvents.includes(eventKey)) {
      window.fbq('trackCustom', eventName, parameters);
      trackedEvents.push(eventKey);
      sessionStorage.setItem('fb_tracked_events', JSON.stringify(trackedEvents));
    }
  }
};

// Predefined tracking functions for common events
export const trackLead = (businessName: string, source: string = 'jasabuatlagu_page') => {
  trackEvent('Lead', {
    content_name: businessName,
    content_category: 'Business Inquiry',
    value: 199000, // Rp199K package value
    currency: 'IDR',
    source: source
  });
};

export const trackWhatsAppClick = (businessName: string, csName: string) => {
  trackEvent('Contact', {
    content_name: businessName,
    content_category: 'WhatsApp Contact',
    value: 199000,
    currency: 'IDR',
    cs_name: csName
  });
};

export const trackPortfolioPlay = (songTitle: string, genre: string) => {
  trackEvent('ViewContent', {
    content_name: songTitle,
    content_category: 'Portfolio Audio',
    content_type: 'audio',
    genre: genre
  });
};

export const trackPricingView = () => {
  trackEvent('ViewContent', {
    content_name: 'Pricing Section',
    content_category: 'Pricing',
    value: 199000,
    currency: 'IDR'
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackCustomEvent('ButtonClick', {
    button_name: buttonName,
    location: location,
    timestamp: new Date().toISOString()
  });
};

// Utility function to clear tracked events (useful for testing)
export const clearTrackedEvents = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('fb_tracked_events');
    pageViewTracked = false;
  }
};

// Utility function to check if pixel is loaded
export const isPixelLoaded = () => {
  return typeof window !== 'undefined' && window.fbq;
};

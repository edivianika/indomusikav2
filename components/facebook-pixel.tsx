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
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

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
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
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

/**
 * Facebook Server Actions
 * Server-side tracking functions untuk Next.js App Router
 */

import { facebookConversionAPI } from './facebook-conversion-api';

/**
 * Server Action untuk track Lead event
 */
export async function trackLeadServer(
  businessName: string,
  source: string = 'jasabuatlagu_page',
  userEmail?: string,
  userPhone?: string
) {
  try {
    // Get request object dari Next.js headers
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    // Create mock request object untuk Conversion API
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackLead(
      mockRequest,
      businessName,
      source,
      userEmail,
      userPhone
    );

    console.log('Server-side Lead tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side Lead tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Server Action untuk track WhatsApp Contact event
 */
export async function trackWhatsAppContactServer(
  businessName: string,
  csName: string,
  userEmail?: string,
  userPhone?: string
) {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackWhatsAppContact(
      mockRequest,
      businessName,
      csName,
      userEmail,
      userPhone
    );

    console.log('Server-side WhatsApp Contact tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side WhatsApp Contact tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Server Action untuk track Portfolio Play event
 */
export async function trackPortfolioPlayServer(
  songTitle: string,
  genre: string,
  userEmail?: string
) {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackPortfolioPlay(
      mockRequest,
      songTitle,
      genre,
      userEmail
    );

    console.log('Server-side Portfolio Play tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side Portfolio Play tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Server Action untuk track Pricing View event
 */
export async function trackPricingViewServer(userEmail?: string) {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackPricingView(
      mockRequest,
      userEmail
    );

    console.log('Server-side Pricing View tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side Pricing View tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Server Action untuk track Button Click event
 */
export async function trackButtonClickServer(
  buttonName: string,
  location: string,
  userEmail?: string
) {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackButtonClick(
      mockRequest,
      buttonName,
      location,
      userEmail
    );

    console.log('Server-side Button Click tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side Button Click tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Server Action untuk track Add to Cart event
 */
export async function trackAddToCartServer(
  businessName: string,
  packageName: string = 'Paket Jingle UMKM',
  packageValue: number = 199000,
  currency: string = 'IDR',
  userEmail?: string,
  userPhone?: string
) {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name) {
            case 'user-agent':
              return headersList.get('user-agent');
            case 'x-forwarded-for':
              return headersList.get('x-forwarded-for');
            case 'x-real-ip':
              return headersList.get('x-real-ip');
            case 'referer':
              return headersList.get('referer');
            case 'cookie':
              return headersList.get('cookie');
            default:
              return null;
          }
        }
      }
    } as Request;

    const result = await facebookConversionAPI.trackAddToCart(
      mockRequest,
      businessName,
      packageName,
      packageValue,
      currency,
      userEmail,
      userPhone
    );

    console.log('Server-side Add to Cart tracking successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Server-side Add to Cart tracking failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Combined tracking function untuk dual tracking (client + server)
 */
export async function trackDualEvent(
  eventType: 'lead' | 'whatsapp' | 'portfolio' | 'pricing' | 'button' | 'addtocart',
  data: {
    businessName?: string;
    csName?: string;
    songTitle?: string;
    genre?: string;
    buttonName?: string;
    location?: string;
    source?: string;
    packageName?: string;
    packageValue?: number;
    currency?: string;
    userEmail?: string;
    userPhone?: string;
  }
) {
  try {
    let serverResult;
    
    switch (eventType) {
      case 'lead':
        serverResult = await trackLeadServer(
          data.businessName || '',
          data.source || 'jasabuatlagu_page',
          data.userEmail,
          data.userPhone
        );
        break;
        
      case 'whatsapp':
        serverResult = await trackWhatsAppContactServer(
          data.businessName || '',
          data.csName || '',
          data.userEmail,
          data.userPhone
        );
        break;
        
      case 'portfolio':
        serverResult = await trackPortfolioPlayServer(
          data.songTitle || '',
          data.genre || '',
          data.userEmail
        );
        break;
        
      case 'pricing':
        serverResult = await trackPricingViewServer(data.userEmail);
        break;
        
      case 'button':
        serverResult = await trackButtonClickServer(
          data.buttonName || '',
          data.location || '',
          data.userEmail
        );
        break;
        
      case 'addtocart':
        serverResult = await trackAddToCartServer(
          data.businessName || '',
          data.packageName || 'Paket Jingle UMKM',
          data.packageValue || 199000,
          data.currency || 'IDR',
          data.userEmail,
          data.userPhone
        );
        break;
        
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }

    return {
      success: true,
      serverResult,
      message: `Dual tracking completed for ${eventType} event`
    };
  } catch (error) {
    console.error('Dual tracking failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

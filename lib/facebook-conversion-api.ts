/**
 * Facebook Conversion API Implementation
 * Server-side tracking untuk Facebook Pixel events
 */

interface ConversionEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string[]; // email hash
    ph?: string[]; // phone hash
    fn?: string[]; // first name hash
    ln?: string[]; // last name hash
    ct?: string[]; // city hash
    st?: string[]; // state hash
    zp?: string[]; // zip code hash
    country?: string[]; // country hash
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    value?: number;
    currency?: string;
    source?: string;
    cs_name?: string;
    business_name?: string;
    genre?: string;
    button_name?: string;
    location?: string;
  };
  event_source_url?: string;
  action_source?: string;
}

interface ConversionAPIResponse {
  events_received: number;
  messages: string[];
  fbtrace_id: string;
}

class FacebookConversionAPI {
  private accessToken: string;
  private pixelId: string;
  private apiVersion: string = 'v18.0';

  constructor(accessToken: string, pixelId: string) {
    this.accessToken = accessToken;
    this.pixelId = pixelId;
  }

  /**
   * Hash data untuk privacy compliance
   */
  private hashData(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
  }

  /**
   * Extract user data dari request headers
   */
  private extractUserData(request: Request): any {
    const userAgent = request.headers.get('user-agent') || '';
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    // Extract Facebook browser ID dari cookies
    const cookies = request.headers.get('cookie') || '';
    const fbpMatch = cookies.match(/_fbp=([^;]+)/);
    const fbp = fbpMatch ? fbpMatch[1] : undefined;

    return {
      client_ip_address: clientIP,
      client_user_agent: userAgent,
      fbp: fbp
    };
  }

  /**
   * Track Lead event
   */
  async trackLead(
    request: Request,
    businessName: string,
    source: string = 'jasabuatlagu_page',
    userEmail?: string,
    userPhone?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    // Hash user data jika tersedia
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }
    if (userPhone) {
      userData.ph = [this.hashData(userPhone)];
    }

    const event: ConversionEvent = {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        content_name: businessName,
        content_category: 'Business Inquiry',
        value: 199000,
        currency: 'IDR',
        source: source,
        business_name: businessName
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Track WhatsApp Contact event
   */
  async trackWhatsAppContact(
    request: Request,
    businessName: string,
    csName: string,
    userEmail?: string,
    userPhone?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }
    if (userPhone) {
      userData.ph = [this.hashData(userPhone)];
    }

    const event: ConversionEvent = {
      event_name: 'Contact',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        content_name: businessName,
        content_category: 'WhatsApp Contact',
        value: 199000,
        currency: 'IDR',
        cs_name: csName,
        business_name: businessName
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Track Portfolio Play event
   */
  async trackPortfolioPlay(
    request: Request,
    songTitle: string,
    genre: string,
    userEmail?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }

    const event: ConversionEvent = {
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        content_name: songTitle,
        content_category: 'Portfolio Audio',
        content_type: 'audio',
        genre: genre
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Track Pricing View event
   */
  async trackPricingView(
    request: Request,
    userEmail?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }

    const event: ConversionEvent = {
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        content_name: 'Pricing Section',
        content_category: 'Pricing',
        value: 199000,
        currency: 'IDR'
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Track Button Click event
   */
  async trackButtonClick(
    request: Request,
    buttonName: string,
    location: string,
    userEmail?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }

    const event: ConversionEvent = {
      event_name: 'CustomizeProduct',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        button_name: buttonName,
        location: location,
        content_name: `Button Click: ${buttonName}`,
        content_category: 'Button Interaction'
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Track Add to Cart event
   */
  async trackAddToCart(
    request: Request,
    businessName: string,
    packageName: string = 'Paket Jingle UMKM',
    packageValue: number = 199000,
    currency: string = 'IDR',
    userEmail?: string,
    userPhone?: string
  ): Promise<ConversionAPIResponse> {
    const userData = this.extractUserData(request);
    
    if (userEmail) {
      userData.em = [this.hashData(userEmail)];
    }
    if (userPhone) {
      userData.ph = [this.hashData(userPhone)];
    }

    const event: ConversionEvent = {
      event_name: 'AddToCart',
      event_time: Math.floor(Date.now() / 1000),
      user_data: userData,
      custom_data: {
        content_name: packageName,
        content_category: 'Jingle Package',
        content_type: 'service',
        value: packageValue,
        currency: currency,
        business_name: businessName,
        num_items: 1
      },
      event_source_url: request.headers.get('referer') || '',
      action_source: 'website'
    };

    return this.sendEvent(event);
  }

  /**
   * Send event to Facebook Conversion API
   */
  private async sendEvent(event: ConversionEvent): Promise<ConversionAPIResponse> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events`;
    
    const payload = {
      data: [event],
      access_token: this.accessToken,
      test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE // Optional: untuk testing
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook Conversion API Error: ${JSON.stringify(errorData)}`);
      }

      const result: ConversionAPIResponse = await response.json();
      console.log('Facebook Conversion API Success:', result);
      return result;
    } catch (error) {
      console.error('Facebook Conversion API Error:', error);
      throw error;
    }
  }

  /**
   * Batch send multiple events
   */
  async sendBatchEvents(events: ConversionEvent[]): Promise<ConversionAPIResponse> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events`;
    
    const payload = {
      data: events,
      access_token: this.accessToken,
      test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook Conversion API Error: ${JSON.stringify(errorData)}`);
      }

      const result: ConversionAPIResponse = await response.json();
      console.log('Facebook Conversion API Batch Success:', result);
      return result;
    } catch (error) {
      console.error('Facebook Conversion API Batch Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const facebookConversionAPI = new FacebookConversionAPI(
  process.env.FACEBOOK_ACCESS_TOKEN || '',
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''
);

// Export class for custom instances
export { FacebookConversionAPI, type ConversionEvent, type ConversionAPIResponse };

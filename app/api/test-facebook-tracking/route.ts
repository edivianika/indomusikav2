/**
 * Test API endpoint untuk Facebook tracking
 * GET /api/test-facebook-tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { facebookConversionAPI } from '@/lib/facebook-conversion-api';

export async function GET(request: NextRequest) {
  try {
    // Test server-side tracking
    const testResults = {
      pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN ? 'Configured' : 'Missing',
      testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || 'Not set',
      timestamp: new Date().toISOString()
    };

    // Test Lead tracking
    const leadResult = await facebookConversionAPI.trackLead(
      request,
      'Test Business Name',
      'test_api',
      'test@example.com',
      '+6281234567890'
    );

    return NextResponse.json({
      success: true,
      message: 'Facebook tracking test completed',
      configuration: testResults,
      leadTracking: {
        success: true,
        result: leadResult
      }
    });

  } catch (error) {
    console.error('Facebook tracking test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      configuration: {
        pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN ? 'Configured' : 'Missing',
        testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || 'Not set'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, data } = body;

    let result;
    
    switch (eventType) {
      case 'lead':
        result = await facebookConversionAPI.trackLead(
          request,
          data.businessName || 'Test Business',
          data.source || 'test_api',
          data.userEmail,
          data.userPhone
        );
        break;
        
      case 'whatsapp':
        result = await facebookConversionAPI.trackWhatsAppContact(
          request,
          data.businessName || 'Test Business',
          data.csName || 'Test CS',
          data.userEmail,
          data.userPhone
        );
        break;
        
      case 'portfolio':
        result = await facebookConversionAPI.trackPortfolioPlay(
          request,
          data.songTitle || 'Test Song',
          data.genre || 'Test Genre',
          data.userEmail
        );
        break;
        
      case 'pricing':
        result = await facebookConversionAPI.trackPricingView(
          request,
          data.userEmail
        );
        break;
        
      case 'button':
        result = await facebookConversionAPI.trackButtonClick(
          request,
          data.buttonName || 'Test Button',
          data.location || 'test_page',
          data.userEmail
        );
        break;
        
      case 'addtocart':
        result = await facebookConversionAPI.trackAddToCart(
          request,
          data.businessName || 'Test Business',
          data.packageName || 'Test Package',
          data.packageValue || 199000,
          data.currency || 'IDR',
          data.userEmail,
          data.userPhone
        );
        break;
        
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }

    return NextResponse.json({
      success: true,
      eventType,
      result
    });

  } catch (error) {
    console.error('Facebook tracking test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

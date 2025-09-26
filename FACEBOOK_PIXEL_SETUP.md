# Facebook Pixel Setup Guide

## 📊 Overview
Dokumentasi ini menjelaskan cara setup Facebook Pixel untuk tracking dan analytics di aplikasi Indomusika.

## 🔧 Setup Instructions

### 1. Facebook Business Manager Setup
1. Login ke [Facebook Business Manager](https://business.facebook.com)
2. Pergi ke **Events Manager** > **Data Sources**
3. Klik **Create** > **Facebook Pixel**
4. Masukkan nama: "Indomusika Pixel"
5. Copy **Pixel ID** (format: 1234567890123456)

### 2. Environment Variables
Buat file `.env.local` di root project:
```bash
# Facebook Pixel Configuration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1234567890123456

# Facebook Conversion API Configuration
FACEBOOK_ACCESS_TOKEN=EAAIJbU65rIYBPtxQhAc8QYm0XQymOZARegt6nsveZAjDaMLfZBZBKBv1ZBWY7jCDWZAHmTwxcYZCGsuc1FZA2UfX1ZCZCg0lSTVZA2ypsZAg3Ihq9i11M2xcJDNZC3oP33xow3VmtB0ZCayANHURKQuYIE3z6nBFshLFIK71p5YryFUUhgFWxYv1na1FqtiU0xxnkz7CqYfgZDZD

# Optional: Test Event Code untuk testing
FACEBOOK_TEST_EVENT_CODE=TEST12345

# Supabase Configuration (jika belum ada)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Verify Installation
1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) di Chrome
2. Buka website dan cek apakah pixel terdeteksi
3. Test events di Facebook Events Manager

## 🔄 Dual Tracking Implementation

### Client-Side + Server-Side Tracking
Aplikasi sekarang menggunakan **dual tracking** untuk akurasi maksimal:

1. **Client-Side (Facebook Pixel)** - Real-time tracking di browser
2. **Server-Side (Conversion API)** - Reliable tracking dari server

### ✅ Implemented Events

**1. PageView (Automatic)**
```javascript
// Otomatis track saat halaman dimuat
fbq('track', 'PageView');
```

**2. Lead Generation (Dual Tracking)**
```javascript
// Client-side tracking
trackLead(businessName, 'jasabuatlagu_page');

// Server-side tracking (automatic)
import { trackLeadServer } from '@/lib/facebook-server-actions';
await trackLeadServer(businessName, 'jasabuatlagu_page', userEmail, userPhone);
// Parameters: content_name, content_category, value, currency, source
```

**3. WhatsApp Contact (Dual Tracking)**
```javascript
// Client-side tracking
trackWhatsAppClick(businessName, csName);

// Server-side tracking (automatic)
import { trackWhatsAppContactServer } from '@/lib/facebook-server-actions';
await trackWhatsAppContactServer(businessName, csName, userEmail, userPhone);
// Parameters: content_name, content_category, value, currency, cs_name
```

**4. Portfolio Play (Dual Tracking)**
```javascript
// Client-side tracking
trackPortfolioPlay(songTitle, genre);

// Server-side tracking (automatic)
import { trackPortfolioPlayServer } from '@/lib/facebook-server-actions';
await trackPortfolioPlayServer(songTitle, genre, userEmail);
// Parameters: content_name, content_category, content_type, genre
```

**5. Pricing View (Dual Tracking)**
```javascript
// Client-side tracking
trackPricingView();

// Server-side tracking (automatic)
import { trackPricingViewServer } from '@/lib/facebook-server-actions';
await trackPricingViewServer(userEmail);
// Parameters: content_name, content_category, value, currency
```

**6. Button Clicks (Dual Tracking)**
```javascript
// Client-side tracking
trackButtonClick(buttonName, location);

// Server-side tracking (automatic)
import { trackButtonClickServer } from '@/lib/facebook-server-actions';
await trackButtonClickServer(buttonName, location, userEmail);
// Parameters: button_name, location, timestamp
```

**7. Add to Cart (Dual Tracking)**
```javascript
// Client-side tracking
trackAddToCart(businessName, packageName, packageValue, currency);

// Server-side tracking (automatic)
import { trackAddToCartServer } from '@/lib/facebook-server-actions';
await trackAddToCartServer(businessName, packageName, packageValue, currency, userEmail, userPhone);
// Parameters: content_name, content_category, content_type, value, currency, business_name, num_items
```

### 🎯 Event Parameters

**Lead Event:**
```javascript
{
  content_name: "Warung Makan Sederhana",
  content_category: "Business Inquiry", 
  value: 199000,
  currency: "IDR",
  source: "jasabuatlagu_page"
}
```

**WhatsApp Contact Event:**
```javascript
{
  content_name: "Warung Makan Sederhana",
  content_category: "WhatsApp Contact",
  value: 199000,
  currency: "IDR", 
  cs_name: "Ridha"
}
```

**Portfolio Play Event:**
```javascript
{
  content_name: "Jingle Laundry Express",
  content_category: "Portfolio Audio",
  content_type: "audio",
  genre: "Pop Catchy"
}
```

**Add to Cart Event:**
```javascript
{
  content_name: "Paket Jingle UMKM",
  content_category: "Jingle Package",
  content_type: "service",
  value: 199000,
  currency: "IDR",
  business_name: "Warung Makan Sederhana",
  num_items: 1
}
```

## 📊 Analytics Dashboard

### Facebook Events Manager
1. **Real-time Events:** Monitor events saat ini
2. **Event Details:** Lihat parameter dan metadata
3. **Conversion Tracking:** Track dari lead ke conversion
4. **Audience Building:** Buat custom audiences

### Key Metrics to Monitor
- **Lead Events:** Jumlah business inquiries
- **WhatsApp Clicks:** Conversion rate ke WhatsApp
- **Portfolio Engagement:** Audio play rates
- **Button Click Rates:** CTA effectiveness
- **Pricing Section Views:** Interest in pricing
- **Add to Cart Events:** Package interest tracking

## 🎯 Facebook Ads Integration

### Custom Audiences
```javascript
// Buat audience berdasarkan events
1. All Website Visitors (PageView)
2. Portfolio Engagers (Portfolio Play)
3. Pricing Viewers (Pricing View)
4. Lead Submitters (Lead)
5. WhatsApp Clickers (Contact)
6. Package Interested (Add to Cart)
```

### Lookalike Audiences
```javascript
// Buat lookalike dari:
1. Lead Submitters (highest value)
2. WhatsApp Clickers (high intent)
3. Portfolio Engagers (engaged users)
4. Add to Cart Users (high purchase intent)
```

### Conversion Campaigns
```javascript
// Optimize untuk:
1. Lead Events (primary conversion)
2. WhatsApp Contact (secondary conversion)
3. Portfolio Play (engagement)
4. Add to Cart (purchase intent)
```

## 🔧 Advanced Configuration

### Facebook Conversion API Setup

#### 1. Access Token Configuration
Access token sudah dikonfigurasi di environment variables:
```bash
FACEBOOK_ACCESS_TOKEN=EAAIJbU65rIYBPtxQhAc8QYm0XQymOZARegt6nsveZAjDaMLfZBZBKBv1ZBWY7jCDWZAHmTwxcYZCGsuc1FZA2UfX1ZCZCg0lSTVZA2ypsZAg3Ihq9i11M2xcJDNZC3oP33xow3VmtB0ZCayANHURKQuYIE3z6nBFshLFIK71p5YryFUUhgFWxYv1na1FqtiU0xxnkz7CqYfgZDZD
```

#### 2. Server-Side Tracking Functions
```javascript
// Import server actions
import { 
  trackLeadServer,
  trackWhatsAppContactServer,
  trackPortfolioPlayServer,
  trackPricingViewServer,
  trackButtonClickServer,
  trackDualEvent
} from '@/lib/facebook-server-actions';

// Dual tracking (client + server)
await trackDualEvent('lead', {
  businessName: 'Warung Makan Sederhana',
  source: 'jasabuatlagu_page',
  userEmail: 'user@example.com',
  userPhone: '+6281234567890'
});

// Add to Cart tracking
await trackDualEvent('addtocart', {
  businessName: 'Warung Makan Sederhana',
  packageName: 'Paket Jingle UMKM',
  packageValue: 199000,
  currency: 'IDR',
  userEmail: 'user@example.com',
  userPhone: '+6281234567890'
});
```

#### 3. Privacy Compliance
- User data di-hash dengan SHA-256
- Email dan phone number di-hash sebelum dikirim
- IP address dan user agent di-track untuk attribution
- Facebook browser ID (fbp) di-extract dari cookies

#### 4. Error Handling
```javascript
try {
  const result = await trackLeadServer(businessName, source, userEmail, userPhone);
  if (result.success) {
    console.log('Server-side tracking successful:', result.result);
  } else {
    console.error('Server-side tracking failed:', result.error);
  }
} catch (error) {
  console.error('Tracking error:', error);
}
```

### Custom Events
```javascript
// Track custom business events
trackCustomEvent('BusinessTypeSelected', {
  business_type: 'Restoran',
  location: 'Jakarta',
  timestamp: new Date().toISOString()
});
```

### Enhanced Ecommerce
```javascript
// Track package value
trackEvent('Purchase', {
  content_name: 'Paket Jingle UMKM',
  value: 199000,
  currency: 'IDR',
  content_category: 'Jingle Package'
});
```

### Customer Journey Tracking
```javascript
// Track user journey
1. PageView → Portfolio Play → Pricing View → Lead
2. PageView → Button Click → WhatsApp Contact
3. Portfolio Play → Lead (direct conversion)
```

## 🛠️ Troubleshooting

### Common Issues
1. **Pixel Not Loading:** Cek environment variables
2. **Events Not Firing:** Cek browser console untuk errors
3. **Duplicate Events:** Cek untuk multiple pixel instances
4. **Missing Parameters:** Verify event parameters

### Debug Steps
1. **Facebook Pixel Helper:** Cek pixel loading dan events
2. **Browser Console:** Cek JavaScript errors
3. **Network Tab:** Cek pixel requests
4. **Events Manager:** Verify events received

### Testing Checklist
- [ ] Pixel loads on page load
- [ ] PageView event fires
- [ ] Lead event fires on form submit
- [ ] WhatsApp click tracked
- [ ] Portfolio play tracked
- [ ] Button clicks tracked
- [ ] No duplicate events
- [ ] Parameters included correctly

## 📈 Performance Optimization

### Lazy Loading
```javascript
// Pixel loads only when needed
useEffect(() => {
  // Load pixel script
}, []);
```

### Event Batching
```javascript
// Batch multiple events
const batchEvents = () => {
  trackEvent('ViewContent', {...});
  trackEvent('AddToCart', {...});
};
```

### Error Handling
```javascript
// Graceful degradation
if (typeof window !== 'undefined' && window.fbq) {
  window.fbq('track', eventName, parameters);
}
```

## 🚀 Production Checklist

### Before Launch
- [ ] Pixel ID configured correctly
- [ ] All events firing properly
- [ ] No console errors
- [ ] Events visible in Facebook Events Manager
- [ ] Custom audiences created
- [ ] Conversion tracking setup
- [ ] Attribution windows configured

### Post-Launch Monitoring
- [ ] Daily event monitoring
- [ ] Conversion rate tracking
- [ ] Audience quality assessment
- [ ] Ad performance optimization
- [ ] ROI measurement
- [ ] A/B testing setup

## 📞 Support

### Facebook Resources
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Events Manager Guide](https://business.facebook.com/events_manager)
- [Facebook Business Help](https://www.facebook.com/business/help)

### Technical Support
- Check browser console for errors
- Verify environment variables
- Test with Facebook Pixel Helper
- Monitor Events Manager for data

## 🎉 Success Metrics

### Key Performance Indicators
- **Lead Conversion Rate:** % visitors yang submit business name
- **WhatsApp Click Rate:** % leads yang klik WhatsApp
- **Portfolio Engagement:** % visitors yang play audio
- **Pricing Interest:** % visitors yang view pricing
- **Button Click Rate:** % visitors yang klik CTA buttons

### Business Impact
- **Cost Per Lead:** Ad spend / number of leads
- **Lead Quality:** % leads yang convert to customers
- **Customer Lifetime Value:** Revenue per customer
- **ROI:** Return on ad investment
- **Attribution:** Which touchpoints drive conversions

// Test script untuk memverifikasi format nomor WhatsApp
function testWhatsAppFormat(phoneNumber) {
  console.log(`\n📱 Testing: ${phoneNumber}`);
  
  // Clean the number - remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  console.log(`🧹 Cleaned: ${cleanNumber}`);
  
  let whatsappNumber;
  
  // Handle different Indonesian phone number formats
  if (cleanNumber.startsWith('08')) {
    // Format: 08xxxxxxxxx -> 628xxxxxxxxx
    whatsappNumber = '62' + cleanNumber.substring(1);
  } else if (cleanNumber.startsWith('8')) {
    // Format: 8xxxxxxxxx -> 628xxxxxxxxx
    whatsappNumber = '62' + cleanNumber;
  } else if (cleanNumber.startsWith('62')) {
    // Check if it's properly formatted
    if (cleanNumber.length >= 11 && cleanNumber.length <= 15) {
      // Already properly formatted
      whatsappNumber = cleanNumber;
    } else {
      // Handle malformed numbers like 62085264693348
      // Remove the first 62 and process the rest
      const withoutFirst62 = cleanNumber.substring(2);
      if (withoutFirst62.startsWith('08')) {
        whatsappNumber = '62' + withoutFirst62.substring(1);
      } else if (withoutFirst62.startsWith('8')) {
        whatsappNumber = '62' + withoutFirst62;
      } else {
        whatsappNumber = '62' + withoutFirst62;
      }
    }
  } else {
    // Default: add 62 prefix
    whatsappNumber = '62' + cleanNumber;
  }
  
  // Final validation: ensure we don't have duplicate 62
  if (whatsappNumber.startsWith('6262')) {
    whatsappNumber = whatsappNumber.substring(2);
  }
  
  console.log(`✅ Final: ${whatsappNumber}`);
  console.log(`🔗 URL: https://wa.me/${whatsappNumber}`);
  
  return whatsappNumber;
}

// Test cases
const testCases = [
  '085264693348',     // Format: 08xxxxxxxxx
  '6285264693348',    // Format: 62xxxxxxxxx (sudah benar)
  '85264693348',      // Format: 8xxxxxxxxx
  '0852-6469-3348',   // Format dengan dash
  '0852 6469 3348',   // Format dengan spasi
  '+6285264693348',   // Format dengan +
  '62085264693348'    // Format yang bermasalah (duplikasi 62)
];

console.log('🧪 Testing WhatsApp Number Format Logic\n');
console.log('='.repeat(50));

testCases.forEach(testCase => {
  testWhatsAppFormat(testCase);
});

console.log('\n' + '='.repeat(50));
console.log('✅ Test completed!');

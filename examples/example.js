const PushNotificationSender = require('../push-notification-sender');
const fs = require('fs');
const path = require('path');

// Example 1: Loading from configuration and payload files
async function example1() {
  try {
    const sender = PushNotificationSender.createFromConfigFile('./examples/config.json');
    
    // Load payload file
    const payloadPath = path.resolve('./examples/payload.json');
    const payloadContent = fs.readFileSync(payloadPath, 'utf8');
    const payload = JSON.parse(payloadContent);
    
    // Update dynamic values
    const now = new Date().toISOString();
    payload.PostPushResult.forEach(item => {
      item.Created = now;
      item.TakenForSent = now;
      item.DsLastChange = now;
      item.TextMessage = "Message loaded from payload file";
    });
    payload.TransactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const result = await sender.sendNotification(payload, {
      alert: "Hello! This is a test message.",
      badge: 1,
      sound: "ping.aiff"
    });
    
    console.log('Example 1 - Result:', result);
  } catch (error) {
    console.error('Example 1 - Error:', error.message);
  }
}

// Example 2: Manual configuration
async function example2() {
  try {
    const sender = new PushNotificationSender({
      keyId: "YOUR_KEY_ID_HERE",
      teamId: "YOUR_TEAM_ID_HERE", 
      bundleId: "com.yourcompany.yourapp",
      deviceToken: "your-device-token-here",
      keyPath: "path/to/your/AuthKey_XXXXXXXXXX.p8",
      production: false
    });
    
    const customPayload = {
      message: "Custom message",
      data: {
        userId: 123,
        action: "view_product",
        productId: "ABC123"
      }
    };
    
    const result = await sender.sendNotification(customPayload, {
      alert: {
        title: "New Product!",
        body: "We have a special product recommendation for you"
      },
      badge: 5,
      sound: "default"
    });
    
    console.log('Example 2 - Result:', result);
  } catch (error) {
    console.error('Example 2 - Error:', error.message);
  }
}

// Run examples
async function runExamples() {
  console.log('🚀 Secure APNs Sender Examples\n');
  
  console.log('📱 Example 1: Loading from configuration file');
  await example1();
  
  console.log('\n📱 Example 2: Manual configuration');
  await example2();
}

runExamples().catch(console.error);

const PushNotificationSender = require('../push-notification-sender');
const fs = require('fs');

// Test configuration
const testConfig = {
  keyId: "TEST_KEY_ID",
  teamId: "TEST_TEAM_ID",
  bundleId: "com.test.app",
  deviceToken: "test_device_token",
  keyPath: "/tmp/test_key.p8",
  production: false
};

// Create mock key file
const mockKeyContent = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgSkfqXty
-----END PRIVATE KEY-----`;

function runTests() {
  console.log('🧪 APNs Push Notification Sender Tests\n');
  
  // Test 1: Configuration validation
  console.log('📋 Test 1: Configuration validation');
  try {
    new PushNotificationSender({});
    console.log('❌ Test 1 failed: Error should have been thrown');
  } catch (error) {
    console.log('✅ Test 1 successful: Missing configuration error caught');
  }
  
  // Test 2: Valid configuration
  console.log('\n📋 Test 2: Valid configuration');
  try {
    // Create mock key file
    fs.writeFileSync('/tmp/test_key.p8', mockKeyContent);
    
    const sender = new PushNotificationSender(testConfig);
    console.log('✅ Test 2 successful: Valid configuration accepted');
    
    // Clean up mock key file
    fs.unlinkSync('/tmp/test_key.p8');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message);
  }
  
  // Test 3: Loading from configuration file
  console.log('\n📋 Test 3: Loading from configuration file');
  try {
    // Create test configuration file
    const testConfigPath = '/tmp/test-config.json';
    fs.writeFileSync('/tmp/test_key.p8', mockKeyContent);
    fs.writeFileSync(testConfigPath, JSON.stringify(testConfig, null, 2));
    
    const sender = PushNotificationSender.createFromConfigFile(testConfigPath);
    console.log('✅ Test 3 successful: Loaded from configuration file');
    
    // Clean up test files
    fs.unlinkSync(testConfigPath);
    fs.unlinkSync('/tmp/test_key.p8');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message);
  }
  
  console.log('\n🎉 Tests completed!');
}

runTests();

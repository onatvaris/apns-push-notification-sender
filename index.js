/**
 * Secure APNs Sender
 * 
 * A secure and easy-to-use Node.js package for Apple Push Notification Service (APNs)
 * with built-in security features and path traversal protection.
 * 
 * @version 1.0.0
 * @author Onat Varis <onatvaris@gmail.com>
 * @license MIT
 */

'use strict';

const PushNotificationSender = require('./lib/PushNotificationSender');

// Export the main class
module.exports = PushNotificationSender;

// Named exports for ES6 compatibility
module.exports.PushNotificationSender = PushNotificationSender;
module.exports.default = PushNotificationSender;

// Version info
module.exports.version = require('./package.json').version;

// Helper functions
module.exports.createSender = function(config) {
  return new PushNotificationSender(config);
};

module.exports.createFromConfig = function(configPath) {
  return PushNotificationSender.createFromConfigFile(configPath);
};

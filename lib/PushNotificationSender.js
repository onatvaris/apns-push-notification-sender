const apn = require('apn');
const fs = require('fs');
const path = require('path');

class PushNotificationSender {
  constructor(config = {}) {
    this.config = {
      keyId: config.keyId || null,
      teamId: config.teamId || null,
      bundleId: config.bundleId || null,
      deviceToken: config.deviceToken || null,
      keyPath: config.keyPath || null,
      production: config.production || false,
      ...config
    };
    
    this.validateConfig();
  }

  // Secure file path validation
  validateFilePath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }
    
    // Prevent path traversal attacks
    const resolvedPath = path.resolve(filePath);
    const normalizedPath = path.normalize(resolvedPath);
    
    // Check for .. characters
    if (normalizedPath.includes('..')) {
      throw new Error('Path traversal detected in file path');
    }
    
    // Only allow .p8 and .json file extensions
    const allowedExtensions = ['.p8', '.json'];
    const fileExtension = path.extname(normalizedPath).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`File extension ${fileExtension} is not allowed`);
    }
    
    return normalizedPath;
  }

  validateConfig() {
    const requiredFields = ['keyId', 'teamId', 'bundleId', 'deviceToken', 'keyPath'];
    
    for (const field of requiredFields) {
      if (!this.config[field]) {
        throw new Error(`Missing required config field: ${field}`);
      }
    }

    // Secure file path validation
    try {
      this.config.keyPath = this.validateFilePath(this.config.keyPath);
    } catch (error) {
      throw new Error(`Invalid key file path: ${error.message}`);
    }

    if (!fs.existsSync(this.config.keyPath)) {
      throw new Error('APNs key file not found');
    }
  }

  async sendNotification(payload, options = {}) {
    let apnProvider = null;
    try {
      // APNs configuration
      const apnOptions = {
        token: {
          key: fs.readFileSync(this.config.keyPath),
          keyId: this.config.keyId,
          teamId: this.config.teamId,
        },
        production: this.config.production,
        connectionTimeout: 5000, // 5 seconds timeout
        requestTimeout: 10000    // 10 seconds request timeout
      };
      
      apnProvider = new apn.Provider(apnOptions);
      
      // Create notification
      const notification = new apn.Notification();
      notification.expiry = Math.floor(Date.now() / 1000) + (options.expiry || 3600);
      notification.badge = options.badge || 1;
      notification.sound = options.sound || "ping.aiff";
      notification.alert = options.alert || "Push Notification";
      notification.topic = this.config.bundleId;
      
      // Add payload
      notification.payload = payload;
      
      // Send notification
      const result = await apnProvider.send(notification, this.config.deviceToken);
      
      return {
        success: result.sent.length > 0,
        sent: result.sent,
        failed: result.failed,
        result
      };
      
    } catch (error) {
      throw new Error(`Push notification failed: ${error.message}`);
    } finally {
      // Close provider
      if (apnProvider) {
        apnProvider.shutdown();
      }
    }
  }

  async sendCustomNotification(customPayload, notificationOptions = {}) {
    return this.sendNotification(customPayload, notificationOptions);
  }

  static createFromConfigFile(configPath) {
    // Simple validation for secure file path validation
    if (!configPath || typeof configPath !== 'string') {
      throw new Error('Invalid config file path provided');
    }
    
    const resolvedPath = path.resolve(configPath);
    const normalizedPath = path.normalize(resolvedPath);
    
    // Path traversal check
    if (normalizedPath.includes('..')) {
      throw new Error('Path traversal detected in config file path');
    }
    
    // Only allow .json file extensions
    if (path.extname(normalizedPath).toLowerCase() !== '.json') {
      throw new Error('Config file must have .json extension');
    }
    
    if (!fs.existsSync(normalizedPath)) {
      throw new Error('Config file not found');
    }
    
    let config;
    try {
      const configContent = fs.readFileSync(normalizedPath, 'utf8');
      config = JSON.parse(configContent);
      
      // Validate config content
      if (!config || typeof config !== 'object') {
        throw new Error('Config file must contain a valid JSON object');
      }
      
    } catch (parseError) {
      throw new Error(`Invalid config file format: ${parseError.message}`);
    }
    
    return new PushNotificationSender(config);
  }
}

module.exports = PushNotificationSender;

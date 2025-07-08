# APNs Push Notification Sender

Secure and easy-to-use Node.js package for Apple Push Notification Service (APNs).

## 📦 Installation

```bash
npm install apns-push-notification-sender
```

## 🚀 Quick Start

### 1. Creating Configuration File

Create a `push-config.json` file:

```json
{
  "keyId": "YOUR_KEY_ID",
  "teamId": "YOUR_TEAM_ID",
  "bundleId": "com.your.app",
  "deviceToken": "YOUR_DEVICE_TOKEN",
  "keyPath": "/path/to/your/AuthKey_XXXXXXXXXX.p8",
  "production": false
}
```

### 2. Creating Payload File

Create a `payload.json` file:

```json
{
  "PostPushResult": [
    {
      "PushId": "384430a5-113f-4d61-8f9e-d404f22748e8",
      "EmpushToken": "1d9106ca5928a6f6dd0632d7f32dbe2369987ea18ff9a18a43fb1eb10ad1cccc",
      "AppAlias": "your-app-alias",
      "PushType": "T",
      "TextMessage": "PostPush test data",
      "TargetUrl": "http://example.com/target",
      "MediaUrl": "http://example.com/media",
      "Status": "R",
      "Created": "2025-07-08T12:00:00.000Z",
      "TakenForSent": "2025-07-08T12:00:00.000Z",
      "DsLastChange": "2025-07-08T12:00:00.000Z",
      "OpenTime": null
    }
  ],
  "Success": true,
  "Errors": [],
  "DetailedMessage": "",
  "TransactionId": "ABC123DEF"
}
```

### 2. Programmatic Usage

```javascript
const PushNotificationSender = require('apns-push-notification-sender');
const fs = require('fs');

// Load from configuration file
const sender = PushNotificationSender.createFromConfigFile('./push-config.json');

// Load from payload file
const payloadContent = fs.readFileSync('./payload.json', 'utf8');
const payload = JSON.parse(payloadContent);

// Update dynamic values
const now = new Date().toISOString();
payload.PostPushResult.forEach(item => {
  item.Created = now;
  item.TakenForSent = now;
  item.DsLastChange = now;
});
payload.TransactionId = Math.random().toString(36).substr(2, 9).toUpperCase();

const result = await sender.sendNotification(payload, {
  alert: "Notification message",
  badge: 1,
  sound: "ping.aiff"
});

console.log('Send result:', result);
```

### 3. CLI Usage

```bash
# Send notification with payload file
apns --config ./push-config.json --payload ./payload.json

# Send with message override
apns -c ./push-config.json -p ./payload.json -m "Custom message"

# Send with title and message
apns -c ./push-config.json -p ./payload.json -m "Message content" -t "Title" -b 5

# Send with custom sound
apns -c ./push-config.json -p ./payload.json -m "Message" -s "custom-sound.aiff"
```

## 🔧 API Reference

### PushNotificationSender

#### Constructor

```javascript
const sender = new PushNotificationSender(config);
```

**Parameters:**
- `config` (Object): Configuration object
  - `keyId` (String): APNs Auth Key ID
  - `teamId` (String): Apple Developer Team ID
  - `bundleId` (String): Application Bundle ID
  - `deviceToken` (String): Target device's device token
  - `keyPath` (String): Path to .p8 file
  - `production` (Boolean): Production environment (false = test)

#### Static Methods

##### createFromConfigFile(configPath)

```javascript
const sender = PushNotificationSender.createFromConfigFile('./config.json');
```

Loads configuration from JSON file.

#### Instance Methods

##### sendNotification(payload, options)

```javascript
const result = await sender.sendNotification(payload, options);
```

**Parameters:**
- `payload` (Object): Data to be sent
- `options` (Object): Notification options
  - `alert` (String|Object): Notification message
  - `badge` (Number): Badge count
  - `sound` (String): Sound file
  - `expiry` (Number): Notification validity period (seconds)

**Return Value:**
```javascript
{
  success: boolean,
  sent: Array,
  failed: Array,
  result: Object
}
```

## 🛠️ Configuration

### Required Information

1. **APNs Auth Key (.p8 file)**
   - Apple Developer Console > Certificates, Identifiers & Profiles > Keys
   - Create new key with APNs option
   - Store the downloaded .p8 file securely

2. **Key ID**
   - Taken from .p8 file name (AuthKey_XXXXXXXXXX.p8)

3. **Team ID**
   - Found in Apple Developer Console > Membership section

4. **Bundle ID**
   - Your application's unique identifier

5. **Device Token**
   - Obtained from your iOS application:
   ```javascript
   import PushNotification from '@react-native-community/push-notification-ios';
   
   PushNotification.addEventListener('register', (token) => {
     console.log('Device Token:', token);
   });
   ```

## 📋 CLI Options

| Option | Shorthand | Description | Default |
|---------|----------|----------|------------|
| `--config` | `-c` | Configuration file path | - |
| `--payload` | `-p` | Payload file path | - |
| `--message` | `-m` | Notification message (overrides payload) | taken from payload |
| `--title` | `-t` | Notification title | - |
| `--badge` | `-b` | Badge count | 1 |
| `--sound` | `-s` | Sound file | "ping.aiff" |
| `--help` | `-h` | Help message | - |

### Payload File Format

The payload file should be in the following JSON format:

```json
{
  "PostPushResult": [
    {
      "PushId": "unique-push-id",
      "EmpushToken": "empush-token",
      "AppAlias": "app-alias",
      "PushType": "T",
      "TextMessage": "Your message here",
      "TargetUrl": "http://example.com/target",
      "MediaUrl": "http://example.com/media",
      "Status": "R",
      "Created": "2025-07-08T12:00:00.000Z",
      "TakenForSent": "2025-07-08T12:00:00.000Z",
      "DsLastChange": "2025-07-08T12:00:00.000Z",
      "OpenTime": null
    }
  ],
  "Success": true,
  "Errors": [],
  "DetailedMessage": "",
  "TransactionId": "UNIQUE_TRANSACTION_ID"
}
```

**Note:** The `Created`, `TakenForSent`, `DsLastChange` and `TransactionId` fields will be automatically updated by the CLI.

## 🧪 Testing

```bash
# Run tests
npm test

# Run example usage
npm run example
```

## 🔒 Security

- Never upload .p8 files to public repositories
- Use `production: true` setting in production environment
- Store device tokens securely

## 📝 License

MIT

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

You can open an issue for any questions.

---

Developed by **Push Notification Team**.

/**
 * Type definitions for secure-apns-sender
 * @version 1.0.0
 * @author Onat Varis <onatvaris@gmail.com>
 */

declare module 'secure-apns-sender' {
  
  export interface APNsConfig {
    keyId: string;
    teamId: string;
    bundleId: string;
    deviceToken: string;
    keyPath: string;
    production?: boolean;
  }

  export interface NotificationOptions {
    alert?: string | {
      title?: string;
      body?: string;
      subtitle?: string;
    };
    badge?: number;
    sound?: string;
    expiry?: number;
    priority?: number;
    topic?: string;
    collapseId?: string;
    threadId?: string;
  }

  export interface SendResult {
    success: boolean;
    sent: any[];
    failed: any[];
    result: any;
  }

  export interface PayloadData {
    PostPushResult?: Array<{
      PushId: string;
      EmpushToken: string;
      AppAlias: string;
      PushType: string;
      TextMessage: string;
      TargetUrl?: string;
      MediaUrl?: string;
      Status: string;
      Created: string;
      TakenForSent: string;
      DsLastChange: string;
      OpenTime?: string | null;
    }>;
    Success: boolean;
    Errors: any[];
    DetailedMessage: string;
    TransactionId: string;
    [key: string]: any;
  }

  export class PushNotificationSender {
    constructor(config: APNsConfig);
    
    validateFilePath(filePath: string): string;
    validateConfig(): void;
    
    sendNotification(payload: PayloadData | any, options?: NotificationOptions): Promise<SendResult>;
    sendCustomNotification(customPayload: any, notificationOptions?: NotificationOptions): Promise<SendResult>;
    
    static createFromConfigFile(configPath: string): PushNotificationSender;
  }

  // Helper functions
  export function createSender(config: APNsConfig): PushNotificationSender;
  export function createFromConfig(configPath: string): PushNotificationSender;
  
  // Version
  export const version: string;
  
  // Default export
  export default PushNotificationSender;
}

import { EventEmitter } from 'events';
import { NotificationType } from '../models/Notification';

// Define event types
export enum EventType {
  // Authentication events
  USER_REGISTERED = 'user_registered',
  USER_LOGGED_IN = 'user_logged_in',
  PASSWORD_CHANGED = 'password_changed',
  
  // Wallet events
  WALLET_CREATED = 'wallet_created',
  WALLET_CONNECTED = 'wallet_connected',
  DELEGATION_UPDATED = 'delegation_updated',
  BALANCE_CHANGED = 'balance_changed',
  TRANSACTION_COMPLETED = 'transaction_completed',
  
  // KYC events
  KYC_SUBMITTED = 'kyc_submitted',
  KYC_STATUS_CHANGED = 'kyc_status_changed',
  
  // Card events
  CARD_SELECTED = 'card_selected',
  CARD_STATUS_CHANGED = 'card_status_changed',
  
  // Transaction events
  TRANSACTION_STATUS_CHANGED = 'transaction_status_changed',
  
  // Payment events
  PAYMENT_SCHEDULED = 'payment_scheduled',
  PAYMENT_STATUS_CHANGED = 'payment_status_changed'
}

// Define event data structure
export interface EventData {
  userId: string;
  type: EventType;
  payload: any;
  timestamp: Date;
}

// Map of event types to notification types
export const eventToNotificationMap: Record<EventType, NotificationType | null> = {
  [EventType.USER_REGISTERED]: NotificationType.ACCOUNT_CREATED,
  [EventType.USER_LOGGED_IN]: NotificationType.LOGIN_NEW_DEVICE,
  [EventType.PASSWORD_CHANGED]: NotificationType.PASSWORD_CHANGED,
  
  [EventType.WALLET_CREATED]: NotificationType.WALLET_CREATED,
  [EventType.WALLET_CONNECTED]: NotificationType.WALLET_CONNECTED,
  [EventType.DELEGATION_UPDATED]: null, // Requires logic to determine if approved or expired
  [EventType.BALANCE_CHANGED]: NotificationType.LOW_BALANCE, // Only if balance is low
  [EventType.TRANSACTION_COMPLETED]: NotificationType.TRANSACTION_CONFIRMED,
  
  [EventType.KYC_SUBMITTED]: NotificationType.KYC_SUBMITTED,
  [EventType.KYC_STATUS_CHANGED]: null, // Requires logic to determine if approved or rejected
  
  [EventType.CARD_SELECTED]: NotificationType.CARD_SELECTED,
  [EventType.CARD_STATUS_CHANGED]: null, // Requires logic to determine the specific notification type
  
  [EventType.TRANSACTION_STATUS_CHANGED]: null, // Requires logic to determine if pending, completed or failed
  
  [EventType.PAYMENT_SCHEDULED]: NotificationType.PAYMENT_UPCOMING,
  [EventType.PAYMENT_STATUS_CHANGED]: null // Requires logic to determine the specific notification type
};

// Create a singleton event emitter
class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;

  private constructor() {
    super();
    // Set higher maxListeners limit to avoid Node.js warnings
    this.setMaxListeners(20);
  }

  public static getInstance(): AppEventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new AppEventEmitter();
    }
    return AppEventEmitter.instance;
  }

  /**
   * Emit an event with the provided data
   * @param eventType The type of event to emit
   * @param payload The event payload data
   * @param userId The ID of the user associated with the event
   */
  public emitEvent(eventType: EventType, userId: string, payload: any = {}): void {
    const eventData: EventData = {
      userId,
      type: eventType,
      payload,
      timestamp: new Date()
    };
    
    this.emit(eventType, eventData);
    this.emit('*', eventData); // Global event for catching all events
  }
}

// Export the singleton instance
export const eventEmitter = AppEventEmitter.getInstance(); 
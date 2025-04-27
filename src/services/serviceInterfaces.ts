import { INotification, NotificationType, INotificationData } from '../models/Notification';

// KYC Service interfaces
export interface KYCService {
  submitKYC: (userId: string, data: any) => Promise<any>;
  getKYCStatus: (userId: string) => Promise<string>;
  updateKYCStatus: (kycId: string, status: string, reason?: string) => Promise<any>;
  mockKulipaResponse: (kycId: string, status: string, responseData?: any) => Promise<any>;
}

// Wallet Service interfaces
export interface WalletService {
  createWallet: (userId: string, mnemonic?: string) => Promise<any>;
  connectWallet: (userId: string, publicKey: string) => Promise<any>;
  getUserWallets: (userId: string) => Promise<any[]>;
}

// Notification Service interfaces
export interface NotificationService {
  createNotification: (
    userId: string, 
    type: NotificationType, 
    message: string, 
    data?: INotificationData
  ) => Promise<INotification>;
  
  getUserNotifications: (
    userId: string,
    limit?: number,
    offset?: number,
    onlyUnread?: boolean
  ) => Promise<{ notifications: INotification[], total: number }>;
  
  markNotificationAsRead: (
    notificationId: string,
    userId: string
  ) => Promise<INotification | null>;
  
  markAllNotificationsAsRead: (
    userId: string
  ) => Promise<number>;
  
  processEvent: (eventData: any) => Promise<void>;
} 
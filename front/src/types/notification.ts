export enum NotificationType {
  ACCOUNT_PENDING = 'ACCOUNT_PENDING',
  ACCOUNT_APPROVED = 'ACCOUNT_APPROVED',
  ACCOUNT_REJECTED = 'ACCOUNT_REJECTED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationUser {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface NotificationWithUser extends Notification {
  user: NotificationUser;
}

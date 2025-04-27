import { Request, Response, NextFunction } from 'express';
import notificationServiceModule from '../services/notificationService';
import { NotificationService } from '../services/serviceInterfaces'; 
import { AppError } from '../utils/AppError';
import { getUserIdFromRequest } from '../utils/requestUtils';

// Cast imported service to interface
const notificationService = notificationServiceModule as unknown as NotificationService;

/**
 * Get all notifications for the current user
 * @route GET /api/notifications
 */
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
    const onlyUnread = req.query.unread === 'true';
    
    const { notifications, total } = await notificationService.getUserNotifications(
      userId,
      limit,
      offset,
      onlyUnread
    );
    
    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + notifications.length < total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get count of unread notifications
 * @route GET /api/notifications/unread/count
 */
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const { total } = await notificationService.getUserNotifications(
      userId,
      0,
      0,
      true
    );
    
    res.status(200).json({
      success: true,
      data: {
        count: total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a notification as read
 * @route PUT /api/notifications/:id/read
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    const notificationId = req.params.id;
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    if (!notificationId) {
      return next(new AppError('Notification ID is required', 400));
    }
    
    const notification = await notificationService.markNotificationAsRead(notificationId, userId);
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * @route PUT /api/notifications/read-all
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const count = await notificationService.markAllNotificationsAsRead(userId);
    
    res.status(200).json({
      success: true,
      data: {
        count
      },
      message: `${count} notifications marked as read`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
}; 
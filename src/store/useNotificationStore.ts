import { create } from 'zustand';
import type { Notification } from '@/types/notification';

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    getNotificationsByUserId: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
    })),

    getNotificationsByUserId: (userId) => {
        return get().notifications.filter(n => n.userId === userId);
    }
}));
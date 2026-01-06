import { createContext, useContext, useState } from 'react';

export interface Alert {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  read: boolean;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  markAllAsRead: () => void;
  removeAlert: (id: number) => void;
  unreadCount: number;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => {
      // 🔥 중복 알림 체크 (type + location + 3초 이내 시간)
      const exists = prev.some(existingAlert => {
        // type과 location이 같은지 확인
        const isSameEvent = 
          existingAlert.type === alert.type &&
          existingAlert.location === alert.location;

        if (!isSameEvent) return false;

        // 시간 차이가 3초 이내인지 확인
        const timeDiff = Math.abs(
          new Date().getTime() - new Date(existingAlert.id).getTime()
        );

        return timeDiff < 3000; // 3초 이내면 중복으로 판단
      });

      if (exists) {
        console.log("⛔ 중복 알림 차단:", alert);
        return prev;
      }

      console.log("✅ 새 알림 추가:", alert);
      return [alert, ...prev];
    });
  };

  // 🔥 완전히 비우기
  const markAllAsRead = () => {
    setAlerts([]);
  };

  // 🔥 개별 알림 삭제
  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <AlertContext.Provider
      value={{ alerts, addAlert, markAllAsRead, removeAlert, unreadCount }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('AlertProvider 안에서만 사용해야 함');
  return ctx;
};
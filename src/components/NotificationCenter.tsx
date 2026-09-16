'use client';
import React, { useState, useEffect } from 'react';
import { Card, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const stats = await poctApi('getDashboardStats');

      const notes = [];
      if (stats.overdue > 0) {
        notes.push({
          id: 'cal-overdue',
          title: 'เลยกำหนดสอบเทียบ',
          message: `มีเครื่องมือ ${stats.overdue} เครื่อง ที่เลยกำหนดสอบเทียบ`,
          severity: 'red',
          type: 'calibration'
        });
      }
      if (stats.warning > 0) {
        notes.push({
          id: 'cal-warning',
          title: 'ใกล้ครบกำหนดสอบเทียบ',
          message: `มีเครื่องมือ ${stats.warning} เครื่อง ที่จะครบกำหนดภายใน 30 วัน`,
          severity: 'yellow',
          type: 'calibration'
        });
      }

      setNotifications(notes);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000 * 5); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-800 rounded-full transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-blue-700">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">การแจ้งเตือน</h3>
            <button onClick={() => setNotifications([])} className="text-xs text-blue-600 hover:underline">ล้างทั้งหมด</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-sm">กำลังโหลด...</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-slate-800">{n.title}</span>
                      <Badge color={n.severity as any}>{n.severity === 'red' ? 'ด่วน' : 'แจ้งเตือน'}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 text-sm">
                <div className="text-3xl mb-2">🎉</div>
                ไม่มีการแจ้งเตือนในขณะนี้
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

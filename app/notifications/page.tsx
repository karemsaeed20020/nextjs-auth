"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { Bell } from "lucide-react";
import { markAllAsRead } from "@/redux/notifications/notificationsSlice";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);

  useEffect(() => {
    dispatch(markAllAsRead()); 
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">
          <Bell className="mx-auto mb-4 w-12 h-12 text-gray-300" />
          No notifications available
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-semibold text-gray-800">{n.title}</h2>
                <p className="text-sm text-gray-400">{n.created_at}</p>
              </div>
              <p className="text-base text-gray-600">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

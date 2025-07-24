
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/auth/authSlice";
import { setNotifications } from "@/redux/notifications/notificationsSlice";
import { Heart, ShoppingCart, Bell } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cart = useSelector((state: RootState) => state.cart.items);
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = notifications.filter((n) => n.is_read === 0).length;
  const isLoggedIn = !!token && !!user;

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await axios.get("https://backend.outletplus.sa/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const formatted = (data.length > 0 ? data : [
          { id: 1, title: "Order Created", body: "Your order has been placed.", created_at: "1 day ago", is_read: 0 },
          { id: 2, title: "Order Shipped", body: "Your order has been shipped.", created_at: "2 days ago", is_read: 1 },
          { id: 3, title: "Discount Available", body: "20% off selected items!", created_at: "3 days ago", is_read: 0 },
          { id: 4, title: "Discount Available", body: "20% off selected items!", created_at: "3 days ago", is_read: 0 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ]).map((n: any) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          created_at: n.created_at,
          is_read: n.is_read,
        }));

        dispatch(setNotifications(formatted));
      } catch (error) {
        console.error("Notification fetch failed:", error);
      }
    };

    if (token) fetchNotificationCount();
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <div className="pt-16"></div>
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 md:px-16 py-4">
          <Link href="/" className="text-2xl font-bold text-emerald-600">Outlet</Link>

          <div className="hidden sm:flex items-center gap-8 relative">
            <Link href="/about" className="text-black hover:text-indigo-600">About</Link>
            <Link href="/contact" className="text-black hover:text-indigo-600">Contact</Link>
            <Link href="/products" className="text-black hover:text-indigo-600">Products</Link>

            <Link href="/favorites" className="relative">
              <Heart className="text-red-500" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{favorites.length}</span>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="text-blue-500" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>
              )}
            </Link>

            <Link href="/notifications" className="relative">
              <Bell className="text-yellow-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
              )}
            </Link>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden"
                >
                  {user?.image ? (
                    <img src={user.image} alt="User" className="object-cover w-full h-full" />
                  ) : (
                    <span className="flex justify-center items-center h-full text-gray-600 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">Hi, <b>{user.name}</b></div>
                    <Link
                      href="/change-password"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                    <Link
                      href="/change-phone"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Phone
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <rect width="24" height="2" fill="#000000" />
              <rect y="9" width="24" height="2" fill="#000000" />
              <rect y="18" width="24" height="2" fill="#000000" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden px-6 pb-4 space-y-2 bg-white shadow-md">
            <Link href="/about" className="block text-black">About</Link>
            <Link href="/contact" className="block text-black">Contact</Link>
            <Link href="/products" className="block text-black">Products</Link>
            <Link href="/favorites" className="block text-black">Favorites</Link>
            <Link href="/cart" className="block text-black">Cart</Link>
            <Link href="/notifications" className="block text-black">Notifications</Link>
            {isLoggedIn ? (
              <>
                <Link href="/change-password" className="block text-black">Change Password</Link>
                <Link href="/change-phone" className="block text-black">Change Phone</Link>
                <button onClick={handleLogout} className="block text-red-600">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block text-indigo-600">Login</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

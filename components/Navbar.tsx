"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/auth/authSlice";
import { Heart, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cart = useSelector((state: RootState) => state.cart.items);
  const isLoggedIn = !!token && !!user;


  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <main>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <Link href="/" className="text-2xl font-bold text-emerald-600">
          Outlet
        </Link>

        <div className="hidden sm:flex items-center gap-8 relative">
          <Link href="/about" className="text-black hover:text-indigo-600">About</Link>
          <Link href="/contact" className="text-black hover:text-indigo-600">Contact</Link>
          <Link href="/products" className="text-black hover:text-indigo-600">Products</Link>

          <Link href="/favorites" className="relative">
            <Heart className="text-red-500 hover:scale-110 transition" size={24} />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart className="text-blue-500 hover:scale-110 transition" size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full focus:outline-none"
              >
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">
                    Hello, <span className="font-medium">{user.name}</span>
                  </div>
                  <Link
                    href="/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Change Password
                  </Link>
                  <Link
                    href="/change-phone"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Change Phone
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="cursor-pointer px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">
                Login
              </button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="sm:hidden focus:outline-none"
        >
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="sm:hidden bg-white shadow-md py-2 border-b border-gray-200">
          <Link href="/about" className="block px-4 py-2 text-black hover:bg-gray-100">About</Link>
          <Link href="/contact" className="block px-4 py-2 text-black hover:bg-gray-100">Contact</Link>
          <Link href="/products" className="block px-4 py-2 text-black hover:bg-gray-100">Products</Link>
          <Link href="/favorites" className="block px-4 py-2 text-black hover:bg-gray-100">Favorites</Link>
          <Link href="/cart" className="block px-4 py-2 text-black hover:bg-gray-100">Cart</Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/change-password"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Change Password
              </Link>
              <Link
                href="/change-phone"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Change Phone
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block px-4 py-2 text-indigo-600 hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      )}

    </main>
  );
}

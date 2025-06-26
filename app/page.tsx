"use client";
import Hero from "@/components/Hero";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/auth/authSlice";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <main className="">
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Outlet
        </Link>

        <div className="hidden sm:flex items-center gap-8 relative">
          <Link
            href="/about"
            className="text-black hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-black hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/products"
            className="text-black hover:text-indigo-600 transition-colors"
          >
            Products
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 focus:outline-none"
              >
                <svg
                  className="absolute w-12 h-12 text-gray-400 -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
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
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#426287"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="sm:hidden bg-white shadow-md py-2 border-b border-gray-200">
          <Link
            href="/about"
            className="block px-4 py-2 text-black hover:bg-gray-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-black hover:bg-gray-100"
          >
            Contact
          </Link>
          {isLoggedIn && (
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
          )}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="block px-4 py-2 text-indigo-600 hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      )}

      <Hero isLoggedIn={isLoggedIn} />
    </main>
  );
}

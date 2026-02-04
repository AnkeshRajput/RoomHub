"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navigation() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-700">
      <nav className="max-w-6xl mx-auto flex gap-6 items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex-shrink-0"
        >
          🏠 RoomHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 lg:gap-6 items-center">
          {!session ? (
            <>
              <Link
                href="/about"
                className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/login"
                className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 lg:px-4 py-2 bg-blue-600 text-white text-sm lg:text-base rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/about"
                className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              {session.user?.role === "landlord" && (
                <>
                  <Link
                    href="/landlord/add-room"
                    className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    ➕ Add Room
                  </Link>
                  <Link
                    href="/landlord/my-rooms"
                    className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    My Rooms
                  </Link>
                </>
              )}
              {session.user?.role === "renter" && (
                <Link
                  href="/renter/search"
                  className="text-sm lg:text-base text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  🔍 Search
                </Link>
              )}
            </>
          )}
        </div>

        {/* Desktop User Info */}
        {session && (
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs lg:text-sm font-medium text-slate-900 dark:text-white">
                {session.user?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {session.user?.role}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block w-6 h-0.5 bg-slate-900 dark:bg-white transition-transform ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-900 dark:bg-white transition-opacity ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-900 dark:bg-white transition-transform ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-3">
            {!session ? (
              <>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={handleNavClick}
                >
                  About
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={handleNavClick}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-center font-medium"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={handleNavClick}
                >
                  About
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={handleNavClick}
                >
                  Dashboard
                </Link>
                {session.user?.role === "landlord" && (
                  <>
                    <Link
                      href="/landlord/add-room"
                      className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={handleNavClick}
                    >
                      ➕ Add Room
                    </Link>
                    <Link
                      href="/landlord/my-rooms"
                      className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={handleNavClick}
                    >
                      My Rooms
                    </Link>
                  </>
                )}
                {session.user?.role === "renter" && (
                  <Link
                    href="/renter/search"
                    className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    onClick={handleNavClick}
                  >
                    🔍 Search
                  </Link>
                )}

                {/* Mobile User Info */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                  <div className="px-3 py-2 mb-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {session.user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      handleNavClick();
                    }}
                    className="w-full px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
          🏠 RoomHub
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
          Find your perfect room or list yours
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mb-12 sm:mb-16">
        <Link href="/login" className="group">
          <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-700 h-full">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔑</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sign In
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Already have an account? Login to get started
            </p>
            <div className="mt-3 sm:mt-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 font-semibold text-sm sm:text-base">
              Go to Login →
            </div>
          </div>
        </Link>

        <Link href="/register" className="group">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 sm:p-8 text-center text-white h-full flex flex-col justify-between">
            <div>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">✨</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Create Account
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                New here? Join as a landlord or renter
              </p>
            </div>
            <div className="mt-3 sm:mt-4 text-blue-100 group-hover:text-white font-semibold text-sm sm:text-base">
              Create Account →
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-0">
        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🏘️</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">
            Find Rooms
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Search for rooms in your area with advanced filters
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📍</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">
            Location Search
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Filter by radius from your current location
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔒</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">
            Secure & Safe
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Verified listings with trusted landlords
          </p>
        </div>
      </div>
    </div>
  );
}

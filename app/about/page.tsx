import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">
              🏠 About RoomHub
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300">
              Connecting landlords and renters with ease, trust, and
              transparency
            </p>
          </div>

          {/* Platform Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-3 sm:mb-4">
              RoomHub is a modern room rental platform designed to simplify the
              process of finding and renting rooms. We believe that finding the
              perfect room should be easy, transparent, and efficient for both
              landlords and renters.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Our platform leverages geolocation technology, high-quality image
              galleries, and direct communication channels to create a seamless
              experience for everyone involved in the rental process.
            </p>
          </div>

          {/* For Landlords Section */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl shadow-lg p-8 mb-8 border border-blue-200 dark:border-blue-700">
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              👨‍💼 For Landlords
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✓ List Your Rooms Easily
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Create comprehensive listings with multiple high-quality
                  images, detailed descriptions, and your exact location on the
                  map.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✓ Direct Communication
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Share your WhatsApp number or phone contact directly with
                  interested renters for quick and convenient discussions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✓ Manage Your Listings
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  View all your active rooms in one place, edit details, add
                  images, and delete listings when rooms are rented.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✓ Geolocation Showcase
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Automatically capture your room's exact location to help
                  renters find you on the map with precision.
                </p>
              </div>
            </div>
          </div>

          {/* For Renters Section */}
          <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg p-8 mb-8 border border-green-200 dark:border-green-700">
            <h2 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-4">
              👨‍💼 For Renters
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Smart Location Search
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Use your current location to find rooms within your desired
                  radius. Adjust the search range from 1 to 50 km.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ View Full Images
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  See complete image galleries for each room in full-screen mode
                  to make an informed decision before contacting.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Easy Contact Options
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Reach out to landlords instantly via WhatsApp or email without
                  leaving the platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Detailed Information
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Access full room descriptions, pricing, landlord details, and
                  precise location coordinates.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              ✨ Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">📸</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Image Gallery
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Upload and view multiple high-quality images with full-screen
                  preview capability
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Geolocation Maps
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  See room locations on interactive maps with precise
                  coordinates
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Radius Search
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Find rooms within your preferred distance using smart
                  filtering
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  WhatsApp Integration
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Connect directly with landlords through WhatsApp or email
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Clear Pricing
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Transparent rent information displayed in Indian Rupees (₹)
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Secure & Safe
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Authentication and role-based access for landlords and renters
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Is it free to use RoomHub?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Yes! RoomHub is completely free to use for both landlords and
                  renters. You can list rooms and search for rentals without any
                  charges.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  How do I create an account?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Click the "Sign Up" button in the top-right corner, enter your
                  details, and select your role (Landlord or Renter). Verify
                  your email and you're ready to go!
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  How do I list my room?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  After logging in as a landlord, click "➕ Add Room" in the
                  navigation. Fill in room details, add images, set your
                  location, and include your contact number for direct
                  communication.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  How do I search for rooms?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Log in as a renter, go to "🔍 Search", and click "Use My
                  Location" to enable geolocation. Adjust the radius slider to
                  find rooms within your desired distance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Can I see full images of rooms?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Absolutely! Click on any image in the room listing to view it
                  in full-screen mode. You can navigate through all images using
                  arrow buttons or keyboard shortcuts.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  How do I contact a landlord?
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Click the "💬 Contact on WhatsApp" button if they've provided
                  a WhatsApp number, or use the "📧 Contact Landlord" email
                  button. You can also see their contact details on the listing.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of users finding and renting rooms on RoomHub
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4">
            © 2026 RoomHub. All rights reserved. | Connecting Landlords &
            Renters Worldwide 🏠
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <a
              href="mailto:support@roomhub.com"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

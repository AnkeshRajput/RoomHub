/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddRoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "landlord"
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // If files selected, upload them first
      let uploadedImages: { url: string; public_id: string }[] = [];
      if (files && files.length > 0) {
        const promises = Array.from(files).map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const r = await fetch("/api/upload", { method: "POST", body: fd });
          if (!r.ok) throw new Error("Image upload failed");
          const data = await r.json();
          return { url: data.url, public_id: data.public_id };
        });
        uploadedImages = await Promise.all(promises);
      }
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          rent,
          address,
          description,
          images: uploadedImages,
          location: location
            ? { type: "Point", coordinates: [location.lng, location.lat] }
            : undefined,
          contactNumber: contactNumber || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create room");
        setLoading(false);
        return;
      }

      setSuccess("Room created successfully!");
      setTitle("");
      setRent("");
      setAddress("");
      setDescription("");
      setContactNumber("");
      setLoading(false);

      // Redirect to dashboard or my-rooms after a short delay
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Server error");
      setLoading(false);
    }
  }

  if (status === "loading" || session?.user?.role !== "landlord") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-slate-600 dark:text-slate-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          ➕ Add a New Room
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          List your room and start earning
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800">
            <p className="font-medium">✓ {success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">
              📍 Room Location{" "}
              <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                (Optional)
              </span>
            </label>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
              Attach your current location to help renters find your room
              easily.
            </p>
            {location ? (
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 sm:mb-3">
                  ✓ Location set: {location.lat.toFixed(6)}°,{" "}
                  {location.lng.toFixed(6)}°
                </p>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=17/${location.lat}/${location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <img
                    src={`https://staticmap.openstreetmap.de/staticmap.php?center=${location.lat},${location.lng}&zoom=16&size=600x300&markers=${location.lat},${location.lng},red-pushpin`}
                    alt="Location preview"
                    className="w-full h-auto rounded-lg border border-blue-300 dark:border-blue-600 hover:opacity-90 transition-opacity max-h-64 sm:max-h-80"
                  />
                </a>
              </div>
            ) : null}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  if (!navigator.geolocation) {
                    setError("Geolocation is not supported in this browser.");
                    return;
                  }
                  setLoading(true);
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      });
                      setLoading(false);
                    },
                    (e) => {
                      setError("Could not get location: " + e.message);
                      setLoading(false);
                    },
                    { enableHighAccuracy: true, timeout: 10000 },
                  );
                }}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors whitespace-nowrap"
              >
                📍 Use My Location
              </button>
              {location && (
                <button
                  type="button"
                  onClick={() => setLocation(null)}
                  className="px-3 sm:px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium text-sm sm:text-base rounded-lg transition-colors whitespace-nowrap"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Room Details */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Room Title
            </label>
            <input
              type="text"
              placeholder="e.g., Cozy Studio in Downtown"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-sm sm:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                placeholder="1500"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Address
              </label>
              <input
                type="text"
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              placeholder="Tell renters about your room... (amenities, features, etc.) , Please also metion Your contact number. so that renter can contact you."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Contact Number (WhatsApp / Phone)
            </label>
            <input
              type="tel"
              placeholder="e.g., +919876543210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-sm sm:text-base"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provide a phone or WhatsApp number so renters can contact you
              directly.
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">
              🖼️ Room Images{" "}
              <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                (Optional)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full px-3 sm:px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition text-sm sm:text-base"
            />
            {files.length > 0 && (
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ {files.length} image{files.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm sm:text-lg rounded-lg transition-colors"
          >
            {loading ? "⏳ Saving..." : "✓ Save Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

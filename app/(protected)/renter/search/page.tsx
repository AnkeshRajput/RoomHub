/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Room {
  _id: string;
  title: string;
  rent: number;
  address: string;
  description?: string;
  owner: { name: string; email: string };
  contactNumber?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  images?: { url: string; public_id?: string }[];
}

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    roomTitle: string;
    currentIndex: number;
    totalImages: number;
    allImages: { url: string; public_id?: string }[];
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    roomTitle: string;
    roomLat: number;
    roomLng: number;
    distance: number;
  } | null>(null);

  // Normalize phone number to digits for wa.me links
  function normalizeNumber(num?: string) {
    if (!num) return null;
    const digits = num.replace(/\D/g, "");
    return digits || null;
  }

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function handleLocationClick(room: Room) {
    if (!searchLocation || !room.location) return;
    const distance = calculateDistance(
      searchLocation.lat,
      searchLocation.lng,
      room.location.coordinates[1],
      room.location.coordinates[0],
    );
    setSelectedLocation({
      roomTitle: room.title,
      roomLat: room.location.coordinates[1],
      roomLng: room.location.coordinates[0],
      distance: Math.round(distance * 100) / 100,
    });
  }

  function handleImageClick(
    image: { url: string; public_id?: string },
    images: { url: string; public_id?: string }[],
    roomTitle: string,
    index: number,
  ) {
    setSelectedImage({
      url: image.url,
      roomTitle,
      currentIndex: index,
      totalImages: images.length,
      allImages: images,
    });
  }

  function handlePrevImage() {
    if (!selectedImage) return;
    const newIndex =
      selectedImage.currentIndex === 0
        ? selectedImage.totalImages - 1
        : selectedImage.currentIndex - 1;
    setSelectedImage({
      ...selectedImage,
      currentIndex: newIndex,
      url: selectedImage.allImages[newIndex].url,
    });
  }

  function handleNextImage() {
    if (!selectedImage) return;
    const newIndex =
      selectedImage.currentIndex === selectedImage.totalImages - 1
        ? 0
        : selectedImage.currentIndex + 1;
    setSelectedImage({
      ...selectedImage,
      currentIndex: newIndex,
      url: selectedImage.allImages[newIndex].url,
    });
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "renter"
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Handle ESC key to close image viewer
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft" && selectedImage) {
        handlePrevImage();
      } else if (e.key === "ArrowRight" && selectedImage) {
        handleNextImage();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "renter") {
      // Only fetch all rooms if user hasn't set a search location
      if (!searchLocation) {
        fetchAllRooms();
      }
    }
  }, [status, session, searchLocation]);

  async function fetchAllRooms() {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLocationSearch() {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSearchLocation({ lat, lng });

        // Call radius search API
        try {
          const res = await fetch("/api/rooms/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              radiusMeters: radiusKm * 1000, // Convert km to meters
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setRooms(data.rooms);
          }
        } catch (err) {
          setError("Failed to search rooms");
          console.error(err);
        }
        setLoading(false);
      },
      (e) => {
        setError("Could not get location: " + e.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleRadiusChange(newRadius: number) {
    setRadiusKm(newRadius);
    if (searchLocation) {
      setLoading(true);
      try {
        const res = await fetch("/api/rooms/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: searchLocation.lat,
            longitude: searchLocation.lng,
            radiusMeters: newRadius * 1000,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setRooms(data.rooms);
        }
      } catch (err) {
        setError("Failed to search rooms");
        console.error(err);
      }
      setLoading(false);
    }
  }

  if (status === "loading" || session?.user?.role !== "renter") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-slate-600 dark:text-slate-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
          🔍 Find Your Perfect Room
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400">
          Search for rooms near you using your current location
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 text-xs sm:text-sm">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      <div className="mb-6 sm:mb-8 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">
          Search Settings
        </h2>

        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
            📍 Enable location access to find rooms near you
          </p>
          {searchLocation && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                ✓ Location: {searchLocation.lat.toFixed(4)}° N,{" "}
                {searchLocation.lng.toFixed(4)}° E
              </p>
            </div>
          )}
          <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
            <button
              onClick={handleLocationSearch}
              disabled={loading}
              className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm sm:text-base rounded-lg transition-colors flex-1 sm:flex-none"
            >
              {searchLocation ? "🔄 Refresh Search" : "📍 Use My Location"}
            </button>
            {searchLocation && (
              <button
                onClick={() => {
                  setSearchLocation(null);
                  setRooms([]);
                }}
                className="px-4 sm:px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium text-sm sm:text-base rounded-lg transition-colors"
              >
                ✕ Clear Location
              </button>
            )}
          </div>
        </div>

        {searchLocation && (
          <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">
              Search Radius:{" "}
              <span className="text-base sm:text-lg text-blue-600 dark:text-blue-400">
                {radiusKm} km
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={radiusKm}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
              <span>1 km</span>
              <span>5 km</span>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin text-3xl sm:text-4xl mb-2 sm:mb-3">
              ⏳
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
              Searching rooms...
            </p>
          </div>
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🏠</div>
          <p className="text-xs sm:text-sm md:text-lg text-slate-600 dark:text-slate-400 px-4">
            {searchLocation
              ? "No rooms found in your search radius. Try increasing the radius!"
              : "Use your location to search for nearby rooms."}
          </p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div>
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-xs sm:text-sm text-green-900 dark:text-green-100 font-medium">
              ✓ Found {rooms.length} room{rooms.length !== 1 ? "s" : ""} near
              you
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                {/* Image Gallery */}
                {room.images && room.images.length > 0 && (
                  <div className="bg-slate-200 dark:bg-slate-700">
                    {/* Featured Image */}
                    <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden bg-slate-300 dark:bg-slate-600">
                      <img
                        src={room.images[0].url}
                        alt={`${room.title} - Featured`}
                        onClick={() =>
                          handleImageClick(
                            room.images![0],
                            room.images!,
                            room.title,
                            0,
                          )
                        }
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      {room.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium">
                          1/{room.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {room.images.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 p-2">
                        {room.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image.url}
                            alt={`${room.title} - Thumbnail ${idx + 1}`}
                            onClick={() =>
                              handleImageClick(
                                image,
                                room.images!,
                                room.title,
                                idx,
                              )
                            }
                            className="w-full h-16 sm:h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        {room.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-start sm:text-start mt-1">
                        📍 {room.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{room.rent}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        per month
                      </p>
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-slate-200 dark:border-slate-700">
                    {room.location &&
                      Array.isArray(room.location.coordinates) && (
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            Coordinates
                          </p>
                          <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white">
                            {room.location.coordinates[1].toFixed(4)}°
                            <br />
                            {room.location.coordinates[0].toFixed(4)}°
                          </p>
                        </div>
                      )}
                    <div className="text-right">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Landlord
                      </p>
                      <div className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                        {room.owner.name}
                      </div>
                      {room.contactNumber ? (
                        <a
                          href={`https://wa.me/${normalizeNumber(room.contactNumber)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-green-600 dark:text-green-400 hover:underline font-semibold"
                        >
                          📞 {room.contactNumber}
                        </a>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Contact number not provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 flex-col sm:flex-row">
                    {room.contactNumber ? (
                      <a
                        href={`https://wa.me/${normalizeNumber(room.contactNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex-1 sm:flex-none text-center"
                      >
                        💬 Contact on WhatsApp
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-block px-3 sm:px-4 py-2 bg-slate-400 text-slate-700 font-medium text-xs sm:text-sm rounded-lg cursor-not-allowed opacity-60"
                      >
                        ⚠️ No Contact Number
                      </button>
                    )}
                    {searchLocation && room.location && (
                      <button
                        onClick={() => handleLocationClick(room)}
                        className="inline-block px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex-1 sm:flex-none"
                      >
                        📍 View Location
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen Image Viewer Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-screen max-h-screen flex flex-col bg-black rounded-lg overflow-hidden"
          >
            {/* Image Display */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.roomTitle}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info Bar */}
            <div className="bg-slate-900 px-6 py-4 text-white text-center">
              <p className="font-semibold text-lg">{selectedImage.roomTitle}</p>
              <p className="text-sm text-slate-400 mt-1">
                Image {selectedImage.currentIndex + 1} of{" "}
                {selectedImage.totalImages}
              </p>
            </div>

            {/* Navigation Controls */}
            {selectedImage.totalImages > 1 && (
              <div className="bg-slate-800 px-6 py-3 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex gap-2">
                  {selectedImage.allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage({
                          ...selectedImage,
                          currentIndex: idx,
                          url: selectedImage.allImages[idx].url,
                        });
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === selectedImage.currentIndex
                          ? "bg-blue-500 w-4"
                          : "bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all z-10"
            >
              ✕
            </button>

            {/* Keyboard Navigation Hint */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded">
              Click outside or press ESC to close
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {selectedLocation && searchLocation && (
        <div
          onClick={() => setSelectedLocation(null)}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-2xl my-4 sm:my-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-4 sm:px-6 py-3 sm:py-4 text-white z-10">
              <h2 className="text-lg sm:text-2xl font-bold">
                {selectedLocation.roomTitle}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                📍 Location Details
              </p>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6">
              {/* Distance Info */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                <p className="text-center">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300">
                    {selectedLocation.distance} km
                  </span>
                  <br />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Away from your location
                  </span>
                </p>
              </div>

              {/* Map */}
              <div className="mb-4 sm:mb-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                <iframe
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.roomLng - 0.01},${selectedLocation.roomLat - 0.01},${selectedLocation.roomLng + 0.01},${selectedLocation.roomLat + 0.01}&layer=mapnik&marker=${selectedLocation.roomLat},${selectedLocation.roomLng}`}
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Room Location
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white">
                    {selectedLocation.roomLat.toFixed(6)}°<br />
                    {selectedLocation.roomLng.toFixed(6)}°
                  </p>
                </div>
                <div className="p-2 sm:p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400 mb-1">
                    Your Location
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-green-900 dark:text-green-100">
                    {searchLocation.lat.toFixed(6)}°<br />
                    {searchLocation.lng.toFixed(6)}°
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selectedLocation.roomLat}&mlon=${selectedLocation.roomLng}&zoom=17`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors text-center flex-1"
                >
                  🗺️ Open Full Map
                </a>
                <a
                  href={`https://www.google.com/maps/dir/${searchLocation.lat},${searchLocation.lng}/${selectedLocation.roomLat},${selectedLocation.roomLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors text-center flex-1"
                >
                  🧭 Get Directions
                </a>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedLocation(null)}
              className="fixed top-4 right-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full w-10 h-10 flex items-center justify-center text-xl sm:text-2xl transition-all shadow-lg z-20"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

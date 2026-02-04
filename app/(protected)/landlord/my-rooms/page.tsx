"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Room {
  _id: string;
  title: string;
  rent: number;
  address: string;
  description?: string;
  images?: { url: string; public_id?: string }[];
  contactNumber?: string;
  location?: { type: "Point"; coordinates: [number, number] };
}

export default function MyRoomsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    roomTitle: string;
    currentIndex: number;
    totalImages: number;
    allImages: { url: string; public_id?: string }[];
  } | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        // Filter to only show rooms owned by this user
        const myRooms = data.rooms.filter(
          (r: Room & { owner: { _id?: string } | string }) =>
            (typeof r.owner === "object" ? r.owner._id : r.owner) ===
            session?.user?.id,
        );
        setRooms(myRooms);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

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
      session?.user?.role !== "landlord"
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
    if (status === "authenticated" && session?.user?.role === "landlord") {
      fetchRooms();
    }
  }, [status, session, fetchRooms]);

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this room? This action cannot be undone.",
      )
    )
      return;
    try {
      setLoading(true);
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete room");
      } else {
        await fetchRooms();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete room");
    } finally {
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
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
            🏠 My Rooms
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage your room listings
          </p>
        </div>
        <button
          onClick={() => router.push("/landlord/add-room")}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-lg transition-colors whitespace-nowrap"
        >
          ➕ Add New Room
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Loading your rooms...
            </p>
          </div>
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
            You haven&apos;t created any rooms yet.
          </p>
          <button
            onClick={() => router.push("/landlord/add-room")}
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            ➕ Create Your First Room
          </button>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="grid gap-4 sm:gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Image Section */}
                <div className="md:col-span-1">
                  {room.images && room.images.length > 0 ? (
                    <div className="relative">
                      <div className="w-full h-40 sm:h-48 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-x-auto">
                        <div className="flex gap-2 p-2 min-w-min h-full">
                          {room.images.map((image, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={idx}
                              src={image.url}
                              alt={`${room.title} - Image ${idx + 1}`}
                              onClick={() =>
                                handleImageClick(
                                  image,
                                  room.images!,
                                  room.title,
                                  idx,
                                )
                              }
                              className="h-36 sm:h-44 w-36 sm:w-44 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity hover:shadow-lg"
                            />
                          ))}
                        </div>
                      </div>
                      {room.images && room.images.length > 1 && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center font-medium">
                          🖼️ {room.images.length} images (scroll to view all)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2">📷</div>
                        <p className="text-xs sm:text-sm">No image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="md:col-span-2">
                  <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                        {room.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        📍 {room.address}
                      </p>
                      {room.contactNumber && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">
                          📞 {room.contactNumber}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="w-full sm:w-auto px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>

                  {room.description && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Monthly Rent
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{room.rent}
                      </p>
                    </div>
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
                  </div>

                  {room.location &&
                    Array.isArray(room.location.coordinates) && (
                      <div className="mt-3 sm:mt-4">
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${room.location.coordinates[1]}&mlon=${room.location.coordinates[0]}#map=17/${room.location.coordinates[1]}/${room.location.coordinates[0]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`https://staticmap.openstreetmap.de/staticmap.php?center=${room.location.coordinates[1]},${room.location.coordinates[0]}&zoom=15&size=600x200&markers=${room.location.coordinates[1]},${room.location.coordinates[0]},red-pushpin`}
                            alt="Room location"
                            className="w-full h-auto rounded-lg border border-slate-300 dark:border-slate-600 hover:opacity-90 transition-opacity max-h-48 sm:max-h-64"
                          />
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}

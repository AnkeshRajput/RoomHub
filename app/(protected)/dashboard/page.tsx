"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role) {
      // Auto-redirect based on role
      if ((session?.user as any)?.role === "landlord") {
        router.push("/landlord/add-room");
      } else if ((session?.user as any)?.role === "renter") {
        router.push("/renter/search");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-slate-600">
        Welcome, {session?.user?.name}! Role: {(session?.user as any)?.role}
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Redirecting you to your role-specific page...
      </p>
    </div>
  );
}

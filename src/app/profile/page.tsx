// \src\app\profile\page.tsx
//By Robert Nelson last edit 04/28/25
//About File:

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserProfile {
  username: string;
  email: string;
  createdAt: string; // or Date
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: UserProfile) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Welcome Header */}
      <header className="bg-green-700 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to LINCS Golf!</h1>
        <p className="text-green-100 text-sm mt-2">Gary likes wet hot dogs</p>
      </header>

      {/* Sticky Toolbar */}
      <nav className="sticky top-0 z-50 bg-green-600 shadow-md flex justify-center space-x-6 py-3">
        <Link
          href="/dashboard"
          className={`hover:underline ${pathname === "/dashboard" ? "text-yellow-300 font-bold" : "text-white"}`}
        >
          Home
        </Link>
        <Link
          href="/scheduling"
          className={`hover:underline ${pathname === "/scheduling" ? "text-yellow-300 font-bold" : "text-white"}`}
        >
          Scheduling
        </Link>
        <Link
          href="/profile"
          className={`hover:underline ${pathname === "/profile" ? "text-yellow-300 font-bold" : "text-white"}`}
        >
          Profile
        </Link>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Profile Information</h2>

        {profile ? (
          <div className="bg-white max-w-md mx-auto p-6 rounded shadow">
            <p className="text-lg"><span className="font-bold">Username:</span> {profile.username}</p>
            <p className="text-lg"><span className="font-bold">Email:</span> {profile.email}</p>
            <p className="text-lg"><span className="font-bold">Joined:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-center text-red-500">Profile not found.</p>
        )}
      </main>

    </div>
  );
}
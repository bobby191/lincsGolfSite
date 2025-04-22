//lincs-golf-site\src\app\dashboard\page.tsx
//By Robert Nelson last edit 04/22/25
//About File:

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with real auth check (e.g. call /api/auth/me or verify JWT)
    const isAuthenticated = true; // placeholder

    if (!isAuthenticated) {
      router.replace("/"); // not logged in? kick back to login
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 p-8">
      <h1 className="text-4xl font-bold mb-6">LINCS Golf Dashboard</h1>
      <p className="mb-4">Welcome back, <span className="font-semibold">testuser</span>!</p>
      {/* TODO: List upcoming events, leaderboard, user stats, etc. */}
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <p className="text-center text-gray-500">Your leaderboard and stats will appear here.</p>
      </div>
    </div>
  );
}
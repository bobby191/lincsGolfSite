//lincs-golf-site\src\app\dashboard\page.tsx
//By Robert Nelson last edit 04/28/25
//About File:

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Entry {
  username: string;
  totalPoints: number;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/leaderboards/season")
      .then((res) => res.json())
      .then((data: Entry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading leaderboard…</p>
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
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Season Leaderboard</h2>

        <div className="mx-auto max-w-2xl">
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Player</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.username}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-4">{i + 1}</td>
                  <td className="py-2 px-4">{e.username}</td>
                  <td className="py-2 px-4 text-right font-semibold">
                    {e.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

    </div>
  );
}
//lincs-golf-site\src\app\dashboard\page.tsx
//By Robert Nelson last edit 04/23/25
//About File:

"use client";

import { useEffect, useState } from "react";

interface Entry {
  username: string;
  totalPoints: number;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Season Leaderboard</h1>
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
    </div>
  );
}
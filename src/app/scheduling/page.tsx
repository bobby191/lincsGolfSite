// \src\app\scheduling\page.tsx
//By Robert Nelson last edit 04/28/25
//About File:

"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const pathname = usePathname();

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

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
        <h2 className="text-4xl font-bold mb-6 text-center">Event Scheduling</h2>

        <div className="max-w-4xl mx-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
          />
          {selectedDate && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <h2 className="text-2xl font-semibold mb-2">Selected Date</h2>
              <p>{selectedDate}</p>
              <p className="text-gray-600 text-sm mt-2">Sign-up or details will go here later.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
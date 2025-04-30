// \src\app\scheduling\page.tsx
//By Robert Nelson last edit 04/28/25
//About File:

"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateEventModal from "@/components/CreateEventModal";

interface CalendarEvent {
  title: string;
  start: string;      // ISO date string
  allDay: boolean;
  extendedProps: { type: "Major" | "Desi" | "Unofficial" };
}

export default function SchedulingPage() {
  const pathname = usePathname();

  // --- Fetch & store events ---
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: any[]) => {
        // assume each `data` item has { name, date, type }
        const mapped = data.map((e) => ({
          title: e.name,
          start: e.date,
          allDay: true,
          extendedProps: { type: e.type as CalendarEvent["extendedProps"]["type"] },
        }));
        setEvents(mapped);
      });
  }, []);

  // --- Filters ---
  const [showMajors, setShowMajors] = useState(true);
  const [showDesi, setShowDesi] = useState(true);
  const [showUnofficial, setShowUnofficial] = useState(true);

  const filteredEvents = events.filter((e) => {
    const t = e.extendedProps.type;
    if (t === "Major" && !showMajors) return false;
    if (t === "Desi" && !showDesi) return false;
    if (t === "Unofficial" && !showUnofficial) return false;
    return true;
  });

  // --- Modal state ---
  const [showModal, setShowModal] = useState(false);

  // Called when modal “Create Event” or “Post Event Proposition” fires
  const handleEventCreate = (dates: string[]) => {
    // Example: simply push each selected date as a new all-day “Proposed Event”
    const newOnes = dates.map((d) => ({
      title: "Proposed Event",
      start: d,
      allDay: true,
      extendedProps: { type: "Unofficial" as const },
    }));
    setEvents((prev) => [...prev, ...newOnes]);
    setShowModal(false);
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
          className={pathname === "/dashboard"
            ? "text-yellow-300 font-bold"
            : "text-white hover:underline"}
        >Home</Link>
        <Link
          href="/scheduling"
          className={pathname === "/scheduling"
            ? "text-yellow-300 font-bold"
            : "text-white hover:underline"}
        >Scheduling</Link>
        <Link
          href="/profile"
          className={pathname === "/profile"
            ? "text-yellow-300 font-bold"
            : "text-white hover:underline"}
        >Profile</Link>
      </nav>

      {/* Filters */}
      <div className="max-w-4xl mx-auto p-4 flex space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={showMajors}
            onChange={() => setShowMajors((v) => !v)}
          />
          Majors
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={showDesi}
            onChange={() => setShowDesi((v) => !v)}
          />
          Desi
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={showUnofficial}
            onChange={() => setShowUnofficial((v) => !v)}
          />
          Unofficial
        </label>
      </div>

      {/* Main Content */}
      <main className="p-8">
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
          <h2 className="text-4xl font-bold">Event Scheduling</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Create Event
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            height={600}
          />
        </div>
      </main>

      {/* Create Event Modal */}
      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onEventCreate={handleEventCreate}
          events={events}
        />
      )}
    </div>
  );
}
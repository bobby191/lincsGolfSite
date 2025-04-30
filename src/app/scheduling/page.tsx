// \src\app\scheduling\page.tsx
//By Robert Nelson last edit 04/28/25
//About File:

"use client";

import React, { useState, useEffect } from "react";
import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateEventModal from "@/components/CreateEventModal";

interface CalendarEvent {
  id: number;
  title: string;
  start: string;      // ISO date string
  allDay: boolean;
  extendedProps: {
    type: "Major" | "Desi" | "Unofficial";
    participants: number;
  };
}

type NewEventPayload = {
  name: string;
  eventType: "Major" | "Desi" | "Unofficial";
  gameType: string;
  takeAll: boolean;
  winnerCount: number;
  pointSplit: number[];
  date: string;  // YYYY-MM-DD
  time: string;  // e.g. "07:30 AM"
};

export default function SchedulingPage() {
  const pathname = usePathname();

  // --- Fetch & store events ---
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: any[]) => {
        const mapped: CalendarEvent[] = data.map((e) => ({
          id: e.id,
          title: e.name,
          start: e.date,
          allDay: true,
          extendedProps: {
            type: e.type,
            participants: e.participants,
          },
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

  // Called when CreateEventModal calls onEventCreate(...)
  const handleEventCreate = async (payload: NewEventPayload) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const text = await res.text();
        console.error(
          `Failed to create event (status ${res.status}):`,
          text || "no details"
        );
        return;
      }
  
      const newEvent = await res.json();
      setEvents((prev) => [
        ...prev,
        {
          id: newEvent.id,
          title: newEvent.name,
          start: newEvent.date,
          allDay: true,
          extendedProps: {
            type: newEvent.type,
            participants: newEvent.participants,
          },
        },
      ]);
      setShowModal(false);
    } catch (err) {
      console.error("Network error creating event:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-700 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to LINCS Golf!</h1>
        <p className="text-green-100 text-sm mt-2">Gary likes wet hot dogs</p>
      </header>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-green-600 shadow-md flex justify-center space-x-6 py-3">
        <Link href="/dashboard" className={pathname === "/dashboard" ? "text-yellow-300 font-bold" : "text-white hover:underline"}>Home</Link>
        <Link href="/scheduling" className={pathname === "/scheduling" ? "text-yellow-300 font-bold" : "text-white hover:underline"}>Scheduling</Link>
        <Link href="/profile" className={pathname === "/profile" ? "text-yellow-300 font-bold" : "text-white hover:underline"}>Profile</Link>
      </nav>

      {/* Filters */}
      <div className="max-w-4xl mx-auto p-4 flex space-x-6">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" checked={showMajors} onChange={() => setShowMajors((v) => !v)} />
          Majors
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" checked={showDesi} onChange={() => setShowDesi((v) => !v)} />
          Desi
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" checked={showUnofficial} onChange={() => setShowUnofficial((v) => !v)} />
          Unofficial
        </label>
      </div>

      {/* Calendar + Create Button */}
      <main className="p-8">
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
          <h2 className="text-4xl font-bold">Event Scheduling</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>
            Create Event
          </button>
        </div>
        <div className="max-w-4xl mx-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            height={600}
            eventContent={(info: EventContentArg) => {
              const { title } = info.event;
              const { type, participants } = info.event.extendedProps as CalendarEvent["extendedProps"];
              return (
                <div className="p-1">
                  <Link href={`/events/${encodeURIComponent(title)}`}>{title}</Link>
                  <div className="text-xs opacity-75">
                    {type} • {participants} {participants === 1 ? "player" : "players"}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onEventCreate={handleEventCreate}
        />
      )}
    </div>
  );
}
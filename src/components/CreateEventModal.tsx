//src/components/CreateEventModal.tsx
//By Robert Nelson last edit 04/29/25
//About File:

"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onClose: () => void;
  onEventCreate: (payload: {
    name: string;
    eventType: "Unofficial" | "Desi";
    gameType: string;
    takeAll: boolean;
    winnerCount: number;
    pointSplit: number[];
    date: string;
    time: string;
  }) => void;
}

export default function CreateEventModal({ onClose, onEventCreate }: Props) {
  // step 1 = configure, step 2 = name & summary
  const [step, setStep] = useState<1 | 2>(1);

  // user stats
  const [userStats, setUserStats] = useState<{
    username: string;
    unofficialCount: number;
    desiCount: number;
  } | null>(null);

  // core fields
  const [eventType, setEventType] = useState<"Unofficial" | "Desi" | "">("");
  const [gameType, setGameType] = useState("");
  const [takeAll, setTakeAll] = useState(false);
  const [winnerCount, setWinnerCount] = useState(2);
  const [pointSplit, setPointSplit] = useState<number[]>([2, 2]);

  // date/time
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [timeInput, setTimeInput] = useState(""); // hh:mm
  const [amPm, setAmPm] = useState<"AM" | "PM" | "">("");

  // name (step 2)
  const [eventName, setEventName] = useState("");

  // load user stats
  useEffect(() => {
    fetch("/api/user/event-counter?userId=1")
      .then((r) => r.json())
      .then((j) => setUserStats(j));
  }, []);

  // reset splits if winner count or type changes
  useEffect(() => {
    setPointSplit(Array(winnerCount).fill(0));
  }, [winnerCount, eventType, gameType]);

  const maxWinners = eventType === "Desi" ? 8 : 4;
  const totalPoints = eventType === "Desi" ? 8 : 4;

  // force takeAll for 2v2 or 4v4
  const lockedTakeAll =
    (eventType === "Unofficial" &&
      ["Bestball (2v2)", "Scramble (2v2)", "Shamble (2v2)", "Alternate Shot (2v2)"].includes(gameType)) ||
    (eventType === "Desi" &&
      ["Bestball (4v4)", "Scramble (4v4)", "Shamble (4v4)", "Alternate Shot (4v4)"].includes(gameType));

  const gameTypeOptions =
    eventType === "Desi"
      ? [
          "Stroke Play",
          "Match Play",
          "Bestball (2v2)",
          "Bestball (4v4)",
          "Scramble (2v2)",
          "Scramble (4v4)",
          "Skins",
          "Stableford",
          "Shamble (2v2)",
          "Shamble (4v4)",
          "Alternate Shot (2v2)",
          "Alternate Shot (4v4)",
        ]
      : [
          "Stroke Play",
          "Match Play",
          "Bestball (2v2)",
          "Scramble (2v2)",
          "Skins",
          "Stableford",
          "Shamble (2v2)",
          "Alternate Shot (2v2)",
        ];

  // helpers
  const remainingPoints = (idx: number) => {
    const used = pointSplit.slice(0, idx).reduce((a, b) => a + b, 0);
    const reserve = (winnerCount - idx - 1) * 0.5;
    return Math.max(0, totalPoints - used - reserve);
  };
  const isValidSplit = () => pointSplit.reduce((a, b) => a + b, 0) === totalPoints;
  const showSplitAlert = !takeAll && !lockedTakeAll && pointSplit.every((p) => p > 0) && !isValidSplit();

  // time input handler
  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length <= 2) setTimeInput(v);
    else setTimeInput(v.slice(0, 2) + ":" + v.slice(2));
  };

  // can advance from step1?
  const canAdvance =
    eventType &&
    gameType &&
    (takeAll || isValidSplit()) &&
    eventDate &&
    /^((0?[1-9])|(1[0-2])):[0-5][0-9]$/.test(timeInput) &&
    (amPm === "AM" || amPm === "PM");

  // final create enabled?
  const canCreate = canAdvance && eventName.trim().length > 0;

  const handleNext = () => {
    if (canAdvance) setStep(2);
  };

  const handleSplitChange = (idx: number, val: number) => {
    // copy the old splits, change the one at index `idx`, then write it back
    setPointSplit((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleFinish = () => {
    if (!canCreate || !eventDate) return;
    onEventCreate({
      name: eventName.trim(),
      eventType,
      gameType,
      takeAll,
      winnerCount,
      pointSplit,
      date: eventDate.toISOString().split("T")[0],
      time: `${timeInput} ${amPm}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4 text-center">Create New Event</h3>

        {userStats && (
          <div className="flex justify-around mb-4 text-sm text-gray-700">
            <span>{userStats.username}</span>
            <span>Unofficial: {userStats.unofficialCount}/4</span>
            <span>Desi: {userStats.desiCount}/4</span>
          </div>
        )}

        {step === 1 ? (
          <>
            {/* Event Type */}
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Type</option>
              <option value="Unofficial">Unofficial (min 3)</option>
              <option value="Desi">Designated (min 8)</option>
            </select>

            {/* Game Type */}
            {eventType && (
              <>
                <label className="block text-sm font-medium mb-1">Game Type</label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="">Select Game</option>
                  {gameTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {/* Take All */}
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={takeAll || lockedTakeAll}
                    disabled={lockedTakeAll}
                    onChange={() => !lockedTakeAll && setTakeAll((v) => !v)}
                    className="mr-2"
                  />
                  <label className="text-sm">
                    Winner(s) Take All{lockedTakeAll && " (required)"}
                  </label>
                </div>

                {/* Split */}
                {!takeAll && !lockedTakeAll && (
                  <>
                    <label className="block text-sm font-medium mb-1">How many winners?</label>
                    <select
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(+e.target.value)}
                      className="w-full border p-2 rounded mb-4"
                    >
                      {Array.from({ length: maxWinners - 1 }, (_, i) => i + 2).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <div className="space-y-2 mb-4">
                      {pointSplit.map((v, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm">
                            {i + 1}
                            {["st", "nd", "rd"][i] || "th"} Place
                          </span>
                          <select
                            value={v}
                            onChange={(e) => handleSplitChange(i, +e.target.value)}
                            disabled={i > 0 && pointSplit[i - 1] === 0}
                            className="border p-1 rounded"
                          >
                            <option value={0}>--</option>
                            {Array.from({ length: Math.floor(remainingPoints(i) * 2) + 1 }, (_, j) => j * 0.5)
                              .filter((opt) => (i === 0 ? true : opt <= pointSplit[i - 1]))
                              .map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    {showSplitAlert && (
                      <p className="text-red-600 text-sm mb-4">Points must total {totalPoints}.</p>
                    )}
                  </>
                )}
              </>
            )}

            {/* Date & Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <DatePicker
                selected={eventDate}
                onChange={(d) => setEventDate(d)}
                dateFormat="MMMM d, yyyy"
                className="w-full border p-2 rounded"
                placeholderText="Select event date"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Tee Time</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={timeInput}
                  onChange={onTimeChange}
                  placeholder="hhmm"
                  className="w-2/3 border p-2 rounded"
                />
                <select
                  value={amPm}
                  onChange={(e) => setAmPm(e.target.value as any)}
                  className="w-1/3 border p-2 rounded"
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              {!canAdvance && (
                <p className="text-red-600 text-sm mt-1">
                  Fill out all fields & valid time (e.g. 07:30 AM).
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={handleNext}
                    disabled={!canAdvance}
                    className={`px-4 py-2 rounded text-white ${
                    canAdvance
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 opacity-50 cursor-not-allowed"
                    }`}
                >
                    Next
                </button>
                </div>
            </>
            ) : (
          <>
            {/* Step 2: Name & summary */}
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="My Awesome Tournament"
            />
            <div className="mb-4 text-sm">
              <p>
                <strong>Type:</strong> {eventType}, <strong>Game:</strong> {gameType}
              </p>
              <p>
                <strong>Date:</strong> {eventDate?.toLocaleDateString()} @ {timeInput} {amPm}
              </p>
              <p>
                <strong>Points:</strong>{" "}
                {takeAll
                  ? "Winner takes all"
                  : pointSplit.map((v, i) => `${i + 1}→${v}`).join(", ")}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={!canCreate}
                className={`px-4 py-2 rounded text-white ${
                  canCreate ? "bg-green-600 hover:bg-green-700" : "bg-green-600 opacity-50 cursor-not-allowed"
                }`}
              >
                Create Event
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
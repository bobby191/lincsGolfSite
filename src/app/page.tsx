//\lincs-golf-site\src\app\page.tsx
//By Robert Nelson last edit 04/12/25
//About File:

"use client";//this has something to do with react idk yet

import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Function to handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("Response from login:", data);
    // Handle success/error and update the UI accordingly
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to LINCS Golf</h1>
      <form onSubmit={handleSignIn} className="bg-white p-6 rounded shadow-md w-80">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}

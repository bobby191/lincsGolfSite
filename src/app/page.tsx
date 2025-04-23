//\lincs-golf-site\src\app\page.tsx
//By Robert Nelson last edit 04/23/25
//About File:

"use client";//this has something to do with react idk yet

import { useState, useEffect } from "react";

export default function HomePage() {
  //set mode allows switch page display between register and login
  const [mode, setMode] = useState<"login" | "register">("login");

  //shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //register fields
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);//setLoading is used to prevent double clicks during db calls

  //match check for inline UX
  const passwordsMatch = mode == "register" ? password === confirmPassword : true;
  
  //clear error when fields change
  useEffect(() => {
    setError(null);
  }, [email, password, username, confirmPassword, mode]);
  
  // Function to handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (res.ok) {
      //login succeeded go to dashboard
      window.location.href = "/dashboard";
    } else {
      // show error message
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  //register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!passwordsMatch){
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    setLoading(false);

    if (res.ok) {
      // Optionally auto-login or switch back to login mode:
      setMode("login");
      setError("Account created! Please log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Welcome to LINCS Golf" : "Create Account"}
        </h1>

        {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={mode === "login" ? handleSignIn : handleRegister}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Username (register only) */}
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Confirm Password (register only) */}
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={`mt-1 block w-full rounded-md shadow-sm border ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-600 mt-1">
                  Passwords must match.
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between items-center">
            {mode === "login" ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  {loading ? "Logging in…" : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  disabled={loading}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  disabled={loading}
                  className="text-gray-600 hover:underline disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || (mode === "register" && !passwordsMatch)}
                  aria-busy={loading}
                  className="bg-green-600 disabled:opacity-50 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  {loading ? "Creating…" : "Create"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


  
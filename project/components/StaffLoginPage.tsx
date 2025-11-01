"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { STAFF_CREDENTIALS } from "@/lib/utils";
// import { STAFF_CREDENTIALS } from "../utils/staffCredentials";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = STAFF_CREDENTIALS.find(
      (u) => u.email === email && u.password === password
    );
    if (staff) {
      localStorage.setItem("staffUser", email);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-[350px]"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Staff Login
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

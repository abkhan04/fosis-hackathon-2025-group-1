"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Here you would typically store the token in localStorage or a secure cookie
        // localStorage.setItem("token", data.token);
        router.push("/"); // Redirect to home page after successful login
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#53ec62] font-bold text-3xl">
            <span className="bg-[#53ec62] text-white px-2 py-1 rounded-md">
              Halal
            </span>
            Bites
          </Link>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#39db4a] text-white py-2 px-4 rounded-full hover:bg-[#53ec62] transition-colors disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-6 text-center text-black">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#39db4a] hover:text-[#53ec62]">
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center text-black">
            <Link href="/register/restaurant" className="text-[#39db4a] hover:text-[#53ec62]">
              Register as a Restaurant Owner
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 
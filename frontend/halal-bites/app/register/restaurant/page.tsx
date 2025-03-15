"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RestaurantRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    halalCertification: "",
    website: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/restaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phone: formData.phone,
          halalCertification: formData.halalCertification,
          website: formData.website,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
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

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">Register Your Restaurant</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-black mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-black mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-black mb-1">
                  Restaurant Address
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-black mb-1">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="halalCertification" className="block text-sm font-medium text-black mb-1">
                  Halal Certification Details
                </label>
                <input
                  type="text"
                  id="halalCertification"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.halalCertification}
                  onChange={(e) => setFormData({ ...formData, halalCertification: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                  Restaurant Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#53ec62] focus:border-[#53ec62] text-black"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#39db4a] text-white py-2 px-4 rounded-full hover:bg-[#53ec62] transition-colors disabled:bg-gray-400"
            >
              {loading ? "Registering Restaurant..." : "Register Restaurant"}
            </button>
          </form>

          <div className="mt-6 text-center text-black">
            Already have an account?{" "}
            <Link href="/login" className="text-[#39db4a] hover:text-[#53ec62]">
              Log in
            </Link>
          </div>

          <div className="mt-4 text-center text-black">
            <Link href="/register" className="text-[#39db4a] hover:text-[#53ec62]">
              Register as a User Instead
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 
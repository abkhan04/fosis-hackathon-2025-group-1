"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

interface Restaurant {
  name: string;
  address: string;
  rating: number;
  total_ratings: number;
  photo_url: string;
  price_level: number;
  phone_number: string;
  website: string;
  opening_hours: string[];
  place_id: string;
}

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const latitude = searchParams.get('latitude');
        const longitude = searchParams.get('longitude');
        const location = searchParams.get('location');

        // If no location parameters are provided, redirect to home
        if (!latitude && !longitude && !location) {
          router.push('/');
          return;
        }

        const params = new URLSearchParams();
        if (latitude && longitude) {
          params.append('latitude', latitude);
          params.append('longitude', longitude);
        } else if (location) {
          params.append('location', location);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/halal-restaurants?${params}`);
        const data = await response.json();

        if (data.status === 'success') {
          setRestaurants(data.restaurants);
        } else {
          setError(data.message || 'Failed to fetch restaurants');
        }
      } catch (err) {
        setError('Failed to fetch restaurants');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#53ec62]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-[#53ec62] font-bold text-3xl">
            <span className="bg-[#53ec62] text-white px-2 py-1 rounded-md">
              Halal
            </span>
            Bites
          </Link>
          <Link 
            href={`/map${searchParams ? '?' + searchParams.toString() : ''}`}
            className="bg-[#39db4a] text-white px-4 py-2 rounded-full"
          >
            View Map
          </Link>
        </div>

        {/* Results count */}
        <h2 className="text-2xl font-semibold mb-6">
          Found {restaurants.length} Halal restaurants
        </h2>

        {/* Restaurant grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.place_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {restaurant.photo_url ? (
                <Image
                  src={restaurant.photo_url}
                  alt={restaurant.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-4">{restaurant.address}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (restaurant.rating || 0)
                            ? "text-[#ffe605] fill-[#ffe605]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({restaurant.total_ratings} reviews)
                  </span>
                </div>

                {/* Price level */}
                {restaurant.price_level && (
                  <div className="mb-4">
                    <span className="text-gray-600">
                      {"€".repeat(restaurant.price_level)}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#39db4a] text-white text-center py-2 rounded-full hover:bg-[#53ec62] transition-colors"
                  >
                    Get Directions
                  </a>
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border border-[#39db4a] text-[#39db4a] text-center py-2 rounded-full hover:bg-[#f8fff9] transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 
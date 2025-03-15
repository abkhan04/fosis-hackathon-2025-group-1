"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";

interface Restaurant {
  name: string;
  address: string;
  rating: number;
  total_ratings: number;
  photo_url: string | null;
  price_level: number | null;
  phone_number: string;
  website: string | null;
  opening_hours: string[];
  place_id: string;
  latitude?: number;
  longitude?: number;
}

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)" // Full height minus header
};

const defaultCenter = {
  lat: 53.3498, // Dublin's latitude
  lng: -6.2603  // Dublin's longitude
};

export default function MapPage() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams();
        const latitude = searchParams.get('latitude');
        const longitude = searchParams.get('longitude');
        const location = searchParams.get('location');

        if (latitude && longitude) {
          params.append('latitude', latitude);
          params.append('longitude', longitude);
          setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
        } else if (location) {
          params.append('location', location);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/halal-restaurants?${params}`);
        const data = await response.json();

        if (data.status === 'success') {
          // Process restaurants to add coordinates from place_id
          const processedRestaurants = data.restaurants.map(restaurant => ({
            ...restaurant,
            // These coordinates would ideally come from your backend
            // For now, we'll add some offset to spread them around Dublin center
            latitude: defaultCenter.lat + (Math.random() - 0.5) * 0.02,
            longitude: defaultCenter.lng + (Math.random() - 0.5) * 0.02
          }));
          setRestaurants(processedRestaurants);
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
  }, [searchParams]);

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#53ec62] font-bold text-3xl">
            <span className="bg-[#53ec62] text-white px-2 py-1 rounded-md">
              Halal
            </span>
            Bites
          </Link>
          <Link 
            href="/restaurants" 
            className="bg-[#39db4a] text-white px-4 py-2 rounded-full hover:bg-[#53ec62] transition-colors"
          >
            View List
          </Link>
        </div>
      </div>

      {/* Map */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.place_id}
              position={{
                lat: restaurant.latitude || defaultCenter.lat,
                lng: restaurant.longitude || defaultCenter.lng
              }}
              onClick={() => setSelectedRestaurant(restaurant)}
            />
          ))}

          {selectedRestaurant && (
            <InfoWindow
              position={{
                lat: selectedRestaurant.latitude || defaultCenter.lat,
                lng: selectedRestaurant.longitude || defaultCenter.lng
              }}
              onCloseClick={() => setSelectedRestaurant(null)}
            >
              <div className="max-w-xs">
                <h3 className="font-semibold mb-2">{selectedRestaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedRestaurant.address}</p>
                <div className="text-sm mb-2">
                  <span className="text-yellow-500">★</span> {selectedRestaurant.rating} 
                  <span className="text-gray-500"> ({selectedRestaurant.total_ratings} reviews)</span>
                </div>
                {selectedRestaurant.price_level && (
                  <p className="text-sm text-gray-600 mb-2">
                    {"€".repeat(selectedRestaurant.price_level)}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedRestaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-[#39db4a] text-white px-3 py-1 rounded-full hover:bg-[#53ec62] transition-colors"
                  >
                    Directions
                  </a>
                  {selectedRestaurant.website && (
                    <a
                      href={selectedRestaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm border border-[#39db4a] text-[#39db4a] px-3 py-1 rounded-full hover:bg-[#f8fff9] transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
} 
"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Restaurant {
  name: string;
  address: string;
  rating: number;
  total_ratings: number;
  place_id: string;
  photo_url: string | null;
  price_level: number;
  phone_number: string;
  website: string;
  opening_hours: string[];
  halal_certification?: string;
}

interface FoodCardProps {
  title: string;
  rating: number;
  price: number;
  image: string;
}

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleLocationSearch = async () => {
    if (location.trim()) {
      try {
        setIsLoading(true);
        setSearchError(null);
        // First try to fetch restaurants with the location
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/halal-restaurants?location=${encodeURIComponent(location.trim())}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          router.push(`/restaurants?location=${encodeURIComponent(location.trim())}`);
        } else {
          setSearchError('No restaurants found in this location. Please try another area.');
        }
      } catch (error) {
        setSearchError('Error searching for restaurants. Please try again.');
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUserLocation = () => {
    setIsLoading(true);
    setSearchError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Verify if there are restaurants in the area before redirecting
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/halal-restaurants?latitude=${latitude}&longitude=${longitude}`
            );
            const data = await response.json();

            if (data.status === 'success' && data.restaurants.length > 0) {
              router.push(`/restaurants?latitude=${latitude}&longitude=${longitude}`);
            } else {
              setSearchError('No halal restaurants found near your location. Try searching in a different area.');
            }
          } catch (error) {
            setSearchError('Error finding restaurants. Please try again.');
            console.error('Location search error:', error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setSearchError('Could not get your location. Please enter it manually.');
          setIsLoading(false);
        }
      );
    } else {
      setSearchError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-hidden px-6 md:px-12 py-6">
      <div className="container mx-auto px-4 py-6 relative">
        {/* Logo */}
        <div className="mb-16 flex justify-between items-center">
          <h1 className="text-[#53ec62] font-bold text-3xl">
            <span className="bg-[#53ec62] text-white px-2 py-1 rounded-md">
              Halal
            </span>
            Bites
          </h1>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="text-[#39db4a] hover:text-[#53ec62] px-4 py-2 border border-[#39db4a] rounded-full hover:bg-[#f8fff9] transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="bg-[#39db4a] text-white px-4 py-2 rounded-full hover:bg-[#53ec62] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 z-10">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-black">
              Savor the Finest <span className="text-[#53ec62]">Halal</span> Flavors, Anytime, Anywhere.
            </h2>

            <p className="text-[#4a4a4a] mt-6 max-w-lg">
              Your trusted guide to discovering authentic, delicious, and 100% Halal cuisine near you.
            </p>

            {/* Search Bar and Location Button */}
            <div className="mt-10 flex flex-col gap-4">
              <div className="relative flex items-center bg-white rounded-full shadow-lg pr-1 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="py-4 px-6 w-full rounded-full outline-none text-black"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLocationSearch();
                    }
                  }}
                  disabled={isLoading}
                />
                <button 
                  onClick={handleLocationSearch}
                  disabled={isLoading}
                  className="bg-[#39db4a] hover:bg-[#53ec62] text-white font-medium py-3 px-8 rounded-full transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
              
              <button
                onClick={getUserLocation}
                disabled={isLoading}
                className="bg-[#4a4a4a] hover:bg-[#666666] text-white font-medium py-3 px-8 rounded-full transition-colors max-w-md flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {isLoading ? (
                  "Getting location..."
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Use my current location
                  </>
                )}
              </button>

              {/* Error Message */}
              {searchError && (
                <div className="text-red-500 text-sm mt-2 max-w-md">
                  {searchError}
                </div>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 relative mt-10 lg:mt-0">
            <div className="relative">
              {/* Speech Bubble */}
              <div className="absolute top-0 left-0 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-[#ff6868]">Us when we see haram food 🌶️</p>
              </div>

              {/* Chef Image inside Green Circle */}
              <div className="w-[500px] h-[500px] bg-[#53ec62] rounded-full overflow-hidden relative">
                <Image
                  src="/images/male-chef.png" // Just use "/images/your-image.png"
                  alt="Chef rejecting non-halal food"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
            </div>

{/* Food Cards */}
<div className="absolute bottom-0 right-0 flex flex-col md:flex-row gap-4 z-20 -mb-20">
  <FoodCard
    title="Chicken Doner"
    rating={4} // 4-star rating
    price={18.0}
    image="/images/chicken-doner-kebab-1.jpg" // Ensure this file exists in /public/images/
  />
  <FoodCard
    title="Lamb Biryani"
    rating={3} // 3-star rating
    price={23.0}
    image="/images/lamb-biryani-83e5c3d.jpg" // Ensure this file exists in /public/images/
  />
</div>

          </div>
        </div>
      </div>
    </main>
  );
}

function FoodCard({ title, rating, price, image }: FoodCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4 w-64">
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        width={80}
        height={80}
        className="rounded-lg object-cover"
      />
      <div>
        <h3 className="font-medium text-black">{title}</h3>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < rating ? "text-[#ffe605] fill-[#ffe605]" : "text-gray-300"}`} 
              fill={i < rating ? "#ffe605" : "none"} // Ensure filled stars when rating is high
              stroke={i < rating ? "#ffe605" : "currentColor"} // Keep stroke for outlined stars
            />
          ))}
        </div>
        <p className="text-[#ff6868] font-medium mt-1">€{price.toFixed(2)}</p>
      </div>
    </div>
  );
}
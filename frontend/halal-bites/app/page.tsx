import Image from "next/image"
import { Star } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-6 relative">
        {/* Logo */}
        <div className="mb-16">
          <h1 className="text-[#53ec62] font-bold text-3xl">
            <span className="bg-[#53ec62] text-white px-2 py-1 rounded-md">Halal</span>Bites
          </h1>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 z-10">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Dive into Delights
              <br />
              Of Delectable <span className="text-[#53ec62]">Food</span>
            </h2>
            <p className="text-[#4a4a4a] mt-6 max-w-lg">
              Where Each Plate Weaves a Story of Culinary
              <br />
              Mastery and Passionate Craftsmanship
            </p>

            {/* Search Bar */}
            <div className="mt-10 flex items-center">
              <div className="relative flex items-center bg-white rounded-full shadow-lg pr-1 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="py-4 px-6 w-full rounded-full outline-none"
                />
                <button className="bg-[#39db4a] hover:bg-[#53ec62] text-white font-medium py-3 px-8 rounded-full transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2 relative mt-10 lg:mt-0">
            <div className="relative">
              {/* Speech Bubble */}
              <div className="absolute top-0 left-0 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-[#ff6868]">Us when we see haram food 🌶️</p>
              </div>

              {/* Chef Image */}
              <div className="w-[500px] h-[500px] bg-[#53ec62] rounded-full overflow-hidden relative">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Chef rejecting non-halal food"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Food Cards */}
            <div className="absolute bottom-0 right-0 flex flex-col md:flex-row gap-4 z-20 -mb-20">
              <FoodCard title="Spicy noodles" rating={3} price={18.0} image="/placeholder.svg?height=80&width=80" />
              <FoodCard title="Vegetarian salad" rating={4} price={23.0} image="/placeholder.svg?height=80&width=80" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

interface FoodCardProps {
  title: string
  rating: number
  price: number
  image: string
}

function FoodCard({ title, rating, price, image }: FoodCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4 w-64">
      <Image src={image || "/placeholder.svg"} alt={title} width={80} height={80} className="rounded-lg object-cover" />
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-[#ffe605] fill-[#ffe605]" : "text-gray-300"}`} />
          ))}
        </div>
        <p className="text-[#ff6868] font-medium mt-1">${price.toFixed(2)}</p>
      </div>
    </div>
  )
}

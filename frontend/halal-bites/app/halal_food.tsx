export default function HalalFoodOptions() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="mb-12 text-center text-4xl font-bold text-[#000000] md:text-5xl">
          Halal Food Options in X
        </h1>

        {/* Filter Options */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {["Type", "Cost", "Rating", "Free Delivery"].map((filter) => (
            <button
              key={filter}
              className="rounded-full bg-white px-12 py-4 text-lg font-medium shadow-[0_0_20px_rgba(0,255,0,0.1)]"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl bg-white p-6 shadow-lg"
            >
              <h2 className="mb-8 text-center text-2xl font-bold">
                Restraunt A
              </h2>

              {/* Image placeholder */}
              <div className="mb-8 h-48 w-full rounded-lg bg-gray-100"></div>

              {/* Restaurant details */}
              <div className="space-y-2">
                <p className="font-medium">
                  <span className="font-bold">LOCATION:</span>{" "}
                </p>
                <p className="font-medium">
                  <span className="font-bold">RATING:</span>{" "}
                </p>
                <p className="font-medium">
                  <span className="font-bold">DELIVERY TIME:</span>{" "}
                </p>
                <p className="font-medium">
                  <span className="font-bold">DELIVERY COST:</span>{" "}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

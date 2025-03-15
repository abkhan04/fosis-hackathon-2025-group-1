# HalalBites 🥘

HalalBites is a web application that helps users find Halal restaurants in their area. The platform allows users to search for restaurants, view their details, and get directions. Restaurant owners can also register their establishments.

## Features 🌟

- Search for Halal restaurants by location
- Use current location to find nearby restaurants
- View restaurant details including:
  - Halal certification
  - Ratings and reviews
  - Opening hours
  - Contact information
  - Directions
- User registration and authentication
- Restaurant owner registration and management
- Interactive map view
- Responsive design for mobile and desktop

## Prerequisites 📋

Before you begin, ensure you have the following installed:

### Frontend Requirements

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Backend Requirements

- Python (v3.8 or higher)
- pip (Python package manager)
- virtualenv or venv (recommended)

## Environment Variables 🔐

### Frontend Environment

Create a `.env.local` file in the frontend directory (`frontend/halal-bites/.env.local`) with the following variables:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

### Backend Environment

Create a `.env` file in the backend directory (`backend/.env`) with the following variables:

```env
DATABASE_URL=your_database_url
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
JWT_SECRET_KEY=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

To get your Google Maps API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API key)
5. Optionally restrict the API key to your domain

## Installation 🚀

### Frontend Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/halal-bites.git
cd halal-bites
```

2. Install frontend dependencies:

```bash
cd frontend/halal-bites
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Start the backend server:

```bash
python main.py
```

The backend API will be available at `http://127.0.0.1:5000`

## Project Structure 📁

```
halal-bites/
├── frontend/
│   └── halal-bites/
│       ├── app/                # Next.js app directory
│       │   ├── components/     # Reusable components
│       │   ├── login/          # Login page
│       │   ├── register/       # User registration
│       │   ├── restaurants/    # Restaurant listing
│       │   ├── map/            # Map view
│       │   └── page.tsx        # Home page
│       ├── public/             # Static assets
│       └── package.json        # Frontend dependencies
│
└── backend/
    ├── requirements.txt        # Backend dependencies
    └── main.py                 # Application entry point
```

## Tech Stack 💻

- **Frontend:**

  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Google Maps API

- **Backend:**
  - Python Flask
  - SQLAlchemy ORM
  - JWT Authentication
  - Google Maps API

## API Documentation 📚

The backend API provides the following endpoints:

### Authentication

- `POST /register` - Register a new user
- `POST /login` - User login

### Restaurants

- `GET /halal-restaurants` - Get restaurants by location

## Acknowledgments 🙏

- Google Maps Platform for location services
- All contributors who have helped with the project
- The Halal certification bodies for their important work

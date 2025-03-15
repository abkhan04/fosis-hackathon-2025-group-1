from flask import Flask, jsonify
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Google Places API endpoint
GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"

@app.route('/halal-restaurants', methods=['GET'])
def get_halal_restaurants():
    try:
        # Parameters for the Google Places API request
        params = {
            'query': 'halal restaurants in Dublin',
            'key': os.getenv('GOOGLE_API_KEY')
        }

        # Make request to Google Places API
        response = requests.get(GOOGLE_API_URL, params=params, timeout=10)
        data = response.json()

        # Extract relevant information from results
        restaurants = []
        for place in data.get('results', []):
            restaurant = {
                'name': place.get('name'),
                'address': place.get('formatted_address'),
                'rating': place.get('rating'),
                'total_ratings': place.get('user_ratings_total'),
                'place_id': place.get('place_id')
            }
            restaurants.append(restaurant)

        return jsonify({
            'status': 'success',
            'restaurants': restaurants
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True)

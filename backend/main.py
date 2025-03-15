from flask import Flask, jsonify, request
import requests
import os
import re
from datetime import timedelta
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 'sqlite:///halal_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 'your-super-secret-key-change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(
    seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400)))

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Google Places API endpoints
GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
GOOGLE_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"
GOOGLE_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

# Define User model


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    phone_number = db.Column(db.String(20))

# Define Restaurant model


class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Float, nullable=True)
    total_ratings = db.Column(db.Integer, nullable=True)
    place_id = db.Column(db.String(255), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    owner = db.relationship(
        'User', backref=db.backref('restaurants', lazy=True))
    phone_number = db.Column(db.String(20))
    website = db.Column(db.String(255))
    halal_certification = db.Column(db.String(255))


# Initialize Database
with app.app_context():
    db.create_all()


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

# User Registration


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        phone_number = data.get('phone_number')

        # Validation
        if not all([email, password]):
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        if not validate_email(email):
            return jsonify({'status': 'error', 'message': 'Invalid email format'}), 400

        password_valid, password_message = validate_password(password)
        if not password_valid:
            return jsonify({'status': 'error', 'message': password_message}), 400

        # Check for existing user
        if User.query.filter_by(email=email).first():
            return jsonify({'status': 'error', 'message': 'Email already registered'}), 400

        # Create new user
        hashed_password = bcrypt.generate_password_hash(
            password).decode('utf-8')
        new_user = User(
            email=email,
            password=hashed_password,
            phone_number=phone_number
        )

        db.session.add(new_user)
        db.session.commit()

        # Generate token
        access_token = create_access_token(identity={
            'id': new_user.id
        })

        return jsonify({
            'status': 'success',
            'message': 'Registration successful',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'phone_number': new_user.phone_number
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# User Login


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password')

        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Missing email or password'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

        access_token = create_access_token(identity={
            'id': user.id
        })

        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'phone_number': user.phone_number
            }
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Get User Profile


@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()['id']
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        profile_data = {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'restaurants': [{
                'id': restaurant.id,
                'name': restaurant.name,
                'address': restaurant.address,
                'rating': restaurant.rating,
                'total_ratings': restaurant.total_ratings,
                'phone_number': restaurant.phone_number,
                'website': restaurant.website,
                'halal_certification': restaurant.halal_certification
            } for restaurant in user.restaurants]
        }

        return jsonify({
            'status': 'success',
            'profile': profile_data
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Update User Profile


@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()['id']
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        data = request.get_json()

        # Update allowed fields
        if 'phone_number' in data:
            user.phone_number = data['phone_number']

        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Profile updated successfully',
            'profile': {
                'id': user.id,
                'email': user.email,
                'phone_number': user.phone_number
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Add a Restaurant


@app.route('/restaurants', methods=['POST'])
@jwt_required()
def add_restaurant():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        required_fields = ['name', 'address', 'place_id']
        if not all(field in data for field in required_fields):
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Check if restaurant already exists
        existing_restaurant = Restaurant.query.filter_by(
            place_id=data['place_id']).first()
        if existing_restaurant:
            return jsonify({'status': 'error', 'message': 'Restaurant already exists'}), 400

        new_restaurant = Restaurant(
            name=data['name'],
            address=data['address'],
            place_id=data['place_id'],
            owner_id=current_user['id'],
            phone_number=data.get('phone_number'),
            website=data.get('website'),
            halal_certification=data.get('halal_certification')
        )

        db.session.add(new_restaurant)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Restaurant added successfully',
            'restaurant': {
                'id': new_restaurant.id,
                'name': new_restaurant.name,
                'address': new_restaurant.address,
                'place_id': new_restaurant.place_id,
                'phone_number': new_restaurant.phone_number,
                'website': new_restaurant.website,
                'halal_certification': new_restaurant.halal_certification
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/halal-restaurants', methods=['GET'])
def get_halal_restaurants():
    try:
        # Get location parameters from request
        location = request.args.get('location')
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')

        # Build the search query based on provided parameters
        if latitude and longitude:
            query = f'halal restaurants'
            params = {
                'query': query,
                'key': os.getenv('GOOGLE_API_KEY'),
                'location': f'{latitude},{longitude}',
                'radius': '5000'  # 5km radius
            }
        elif location:
            query = f'halal restaurants in {location}'
            params = {
                'query': query,
                'key': os.getenv('GOOGLE_API_KEY')
            }
        else:
            return jsonify({
                'status': 'error',
                'message': 'Either location or coordinates (latitude/longitude) must be provided'
            }), 400

        # Make request to Google Places API
        response = requests.get(GOOGLE_API_URL, params=params, timeout=10)
        data = response.json()

        if data.get('status') != 'OK':
            return jsonify({
                'status': 'error',
                'message': 'No restaurants found in this location'
            }), 404

        # Extract relevant information from results
        restaurants = []
        for place in data.get('results', []):
            # Get detailed place information
            place_id = place.get('place_id')
            place_details = {}
            if place_id:
                details_params = {
                    'place_id': place_id,
                    'key': os.getenv('GOOGLE_API_KEY'),
                    'fields': 'name,formatted_address,rating,user_ratings_total,photo,price_level,formatted_phone_number,website,opening_hours,reviews'
                }
                details_response = requests.get(
                    GOOGLE_PLACE_DETAILS_URL, params=details_params, timeout=10)
                place_details = details_response.json().get('result', {})

            # Get the first photo reference if available
            photo_reference = None
            if place.get('photos'):
                photo_reference = place['photos'][0].get('photo_reference')
            elif place_details.get('photos'):
                photo_reference = place_details['photos'][0].get(
                    'photo_reference')

            # Construct photo URL if photo reference exists
            photo_url = None
            if photo_reference:
                photo_url = f"{GOOGLE_PHOTO_URL}?maxwidth=400&photo_reference={photo_reference}&key={os.getenv('GOOGLE_API_KEY')}"

            restaurant = {
                'name': place.get('name'),
                'address': place.get('formatted_address'),
                'rating': place.get('rating'),
                'total_ratings': place.get('user_ratings_total'),
                'place_id': place_id,
                'photo_url': photo_url,
                'price_level': place.get('price_level'),
                'phone_number': place_details.get('formatted_phone_number'),
                'website': place_details.get('website'),
                'opening_hours': place_details.get('opening_hours', {}).get('weekday_text'),
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

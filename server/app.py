from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Inventory, Location, Notification, MovingCompany, Quote, Booking, Residence
from datetime import datetime
from flask_wtf.csrf import generate_csrf
from flask import jsonify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movers.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
CORS(app)
login_manager = LoginManager(app)

# Flask-Login setup
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Define the SignupForm
class SignupForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=50)])
    email = StringField('Email', validators=[InputRequired(), Email(), Length(max=100)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6, max=100)])
    submit = SubmitField('Sign Up')

# Define the LoginForm
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=50)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6, max=100)])
    submit = SubmitField('Login')

# Endpoint to get CSRF token
@app.route('/csrf_token', methods=['GET'])
def get_csrf_token():
    csrf_token = generate_csrf()
    return jsonify({'token': csrf_token})

# Endpoint to create a new user
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form = SignupForm(data=data)

    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    else:
        csrf_token = generate_csrf()
        response = jsonify({'error': 'Validation failed', 'details': form.errors})
        response.headers['X-CSRFToken'] = csrf_token
        return response, 400

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    form = LoginForm(data=data)

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user, remember=True)
            return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
        else:
            # Include the CSRF token in the response headers
            csrf_token = generate_csrf()
            response = jsonify({'error': 'Invalid username or password'})
            response.headers['X-CSRFToken'] = csrf_token
            return response, 401
    else:
        # Include the CSRF token in the response headers
        csrf_token = generate_csrf()
        response = jsonify({'error': 'Validation failed', 'details': form.errors})
        response.headers['X-CSRFToken'] = csrf_token
        return response, 400

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

# Authentication resource
class Auth(Resource):

    def post(self):
        form = LoginForm(data=request.get_json())
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user and check_password_hash(user.password, form.password.data):
                login_user(user)
                return {"message": "Logged in successfully!"}, 200
            return {"message": "Invalid credentials!"}, 401
        return {"message": "Invalid input!", "errors": form.errors}, 400

    @login_required
    def get(self):
        return {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }, 200

# Add resources to the API
api.add_resource(Auth, '/auth')

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to BoxdNLoaded!!!'})

@app.route('/users')
def get_users():
    # Debugging: Print a message to the console
    print("Attempting to retrieve users from the database.")

    # Retrieve users from the database
    users = User.query.all()

    # Debugging: Print the users to the console
    print("Users retrieved from the database:", users)

    # Convert users to JSON and return
    user_list = [{"username": user.username, "email": user.email} for user in users]
    return jsonify({"users": user_list})

# Endpoint to get all inventory items
@app.route('/inventory', methods=['GET'])
def get_all_inventory():
    inventory_items = Inventory.query.all()
    inventory_list = [
        {
            'id': item.id,
            'residence_type_id': item.residence_type_id,
            'item': item.item,
            'quantity': item.quantity,
            'user_id': item.user_id
        }
        for item in inventory_items
    ]
    return jsonify({'inventory_items': inventory_list})

# Endpoint to get all locations
@app.route('/locations', methods=['GET'])
def get_all_locations():
    locations = Location.query.all()
    location_list = [
        {
            'id': loc.id,
            'current_address': loc.current_address,
            'new_address': loc.new_address,
            'user_id': loc.user_id
        }
        for loc in locations
    ]
    return jsonify({'locations': location_list})

# Endpoint to get all notifications
@app.route('/notifications', methods=['GET'])
def get_all_notifications():
    notifications = Notification.query.all()
    notification_list = [
        {
            'id': note.id,
            'user_id': note.user_id,
            'notification_type': note.notification_type,
            'content': note.content,
            'timestamp': note.timestamp.isoformat()
        }
        for note in notifications
    ]
    return jsonify({'notifications': notification_list})

# Endpoint to get all moving companies
@app.route('/moving_companies', methods=['GET'])
def get_all_moving_companies():
    companies = MovingCompany.query.all()
    company_list = [
        {
            'id': comp.id,
            'company_name': comp.company_name,
            'contact_person': comp.contact_person,
            'contact_email': comp.contact_email,
            'contact_phone': comp.contact_phone
        }
        for comp in companies
    ]
    return jsonify({'moving_companies': company_list})

# Endpoint to get all quotes
@app.route('/quotes', methods=['GET'])
def get_all_quotes():
    quotes = Quote.query.all()
    quote_list = [
        {
            'id': quote.id,
            'company_id': quote.company_id,
            'user_id': quote.user_id,
            'quote_amount': quote.quote_amount,
            'residence_type_id': quote.residence_type_id
        }
        for quote in quotes
    ]
    return jsonify({'quotes': quote_list})

# Endpoint to get all bookings
@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    bookings = Booking.query.all()
    booking_list = [
        {
            'id': booking.id,
            'user_id': booking.user_id,
            'quote_id': booking.quote_id,
            'booking_status': booking.booking_status,
            'moving_date': booking.moving_date.isoformat(),
            'moving_time': booking.moving_time.isoformat(),
            'residence_type_id': booking.residence_type_id
        }
        for booking in bookings
    ]
    return jsonify({'bookings': booking_list})

# Endpoint to get all residences
@app.route('/residences', methods=['GET'])
def get_all_residences():
    residences = Residence.query.all()
    residence_list = [
        {'id': res.id, 'name': res.name}
        for res in residences
    ]
    return jsonify({'residences': residence_list})

# Endpoint to create a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# Endpoint to create a new inventory item
@app.route('/inventory', methods=['POST'])
def create_inventory_item():
    data = request.get_json()
    new_inventory_item = Inventory(
        residence_type_id=data['residence_type_id'],
        item=data['item'],
        quantity=data['quantity'],
        user_id=data['user_id']
    )
    db.session.add(new_inventory_item)
    db.session.commit()
    return jsonify({'message': 'Inventory item created successfully'}), 201

# Endpoint to create a new location
@app.route('/locations', methods=['POST'])
def create_location():
    data = request.get_json()
    new_location = Location(
        current_address=data['current_address'],
        new_address=data['new_address'],
        user_id=data['user_id']
    )
    db.session.add(new_location)
    db.session.commit()
    return jsonify({'message': 'Location created successfully'}), 201

# Endpoint to create a new notification
@app.route('/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()
    new_notification = Notification(
        user_id=data['user_id'],
        notification_type=data['notification_type'],
        content=data['content']
    )
    db.session.add(new_notification)
    db.session.commit()
    return jsonify({'message': 'Notification created successfully'}), 201

# Endpoint to create a new moving company
@app.route('/moving_companies', methods=['POST'])
def create_moving_company():
    data = request.get_json()
    new_moving_company = MovingCompany(
        company_name=data['company_name'],
        contact_person=data['contact_person'],
        contact_email=data['contact_email'],
        contact_phone=data['contact_phone']
    )
    db.session.add(new_moving_company)
    db.session.commit()
    return jsonify({'message': 'Moving company created successfully'}), 201

# Endpoint to create a new quote
@app.route('/quotes', methods=['POST'])
def create_quote():
    data = request.get_json()
    new_quote = Quote(
        company_id=data['company_id'],
        user_id=data['user_id'],
        quote_amount=data['quote_amount'],
        residence_type_id=data['residence_type_id']
    )
    db.session.add(new_quote)
    db.session.commit()
    return jsonify({'message': 'Quote created successfully'}), 201

# Endpoint to create a new booking

@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    moving_date = datetime.strptime(data['moving_date'], '%Y-%m-%d').date()
    moving_time = datetime.strptime(data['moving_time'], '%H:%M').time()

    new_booking = Booking(
        user_id=data['user_id'],
        quote_id=data['quote_id'],
        booking_status=data['booking_status'],
        moving_date=moving_date,
        moving_time=moving_time,
        residence_type_id=data['residence_type_id']
    )

    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'message': 'Booking created successfully'}), 201

# Endpoint to create a new residence
@app.route('/residences', methods=['POST'])
def create_residence():
    data = request.get_json()
    new_residence = Residence(
        name=data['name']
    )
    db.session.add(new_residence)
    db.session.commit()
    return jsonify({'message': 'Residence created successfully'}), 201

# Endpoint to update a user by ID
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Endpoint to update an inventory item by ID
@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    inventory_item = Inventory.query.get(item_id)
    if inventory_item:
        data = request.get_json()
        inventory_item.residence_type_id = data.get('residence_type_id', inventory_item.residence_type_id)
        inventory_item.item = data.get('item', inventory_item.item)
        inventory_item.quantity = data.get('quantity', inventory_item.quantity)
        inventory_item.user_id = data.get('user_id', inventory_item.user_id)
        db.session.commit()
        return jsonify({'message': 'Inventory item updated successfully'}), 200
    else:
        return jsonify({'error': 'Inventory item not found'}), 404

# Endpoint to update a location by ID
@app.route('/locations/<int:location_id>', methods=['PUT'])
def update_location(location_id):
    location = Location.query.get(location_id)
    if location:
        data = request.get_json()
        location.current_address = data.get('current_address', location.current_address)
        location.new_address = data.get('new_address', location.new_address)
        location.user_id = data.get('user_id', location.user_id)
        db.session.commit()
        return jsonify({'message': 'Location updated successfully'}), 200
    else:
        return jsonify({'error': 'Location not found'}), 404

# Endpoint to update a booking by ID
@app.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    booking = Booking.query.get(booking_id)
    
    if booking:
        data = request.get_json()
        
        try:
            moving_date = datetime.strptime(data['moving_date'], '%Y-%m-%d').date()
            moving_time = datetime.strptime(data['moving_time'], '%H:%M:%S').time()
        except ValueError as e:
            return jsonify({'error': f'Error parsing date or time: {str(e)}'}), 400
        
        # Update individual attributes using setattr
        setattr(booking, 'moving_date', moving_date)
        setattr(booking, 'user_id', data.get('user_id', booking.user_id))
        setattr(booking, 'quote_id', data.get('quote_id', booking.quote_id))
        setattr(booking, 'booking_status', data.get('booking_status', booking.booking_status))
        setattr(booking, 'moving_time', moving_time)
        setattr(booking, 'residence_type_id', data.get('residence_type_id', booking.residence_type_id))
        
        db.session.commit()
        
        return jsonify({'message': 'Booking updated successfully'}), 200
    else:
        return jsonify({'error': 'Booking not found'}), 404
# Endpoint to delete a user by ID
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Endpoint to delete a booking by ID
@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200
    else:
        return jsonify({'error': 'Booking not found'}), 404        



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)


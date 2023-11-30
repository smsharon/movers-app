from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user, AnonymousUserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Inventory, Location, Notification, MovingCompany, Quote, Booking, Residence, Customer
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


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class SignupForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=50)])
    email = StringField('Email', validators=[InputRequired(), Email(), Length(max=100)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=100)])
    role = StringField('Role', validators=[InputRequired(), Length(max=20)])

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if 'email' is present in data
    if 'email' not in data:
        return jsonify({'message': 'Email is required for login'}), 400

    user = User.query.filter_by(email=data.get('email')).first()

    if user and check_password_hash(user.password, data['password']):
        login_user(user)

        # Return the user's role in the response
        return jsonify({'message': 'Login successful', 'role': user.role})

    else:
        return jsonify({'error': 'Invalid email or password'}), 401
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Check if the role is provided
    role = data.get('role')
    if role not in ['customer', 'moving_company']:
        return jsonify({'error': 'Invalid role'}), 400

    # Check if the email already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Email already exists. Choose a different email.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')


    # Create a new user based on the role
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201
@app.route('/complete_customer_profile', methods=['POST'])
@login_required
def complete_customer_profile():
    data = request.get_json()

    # Check if the user already has a customer profile
    existing_profile = Customer.query.filter_by(user_id=current_user.id).first()

    if existing_profile:
        # Update the existing customer profile
        existing_profile.full_name = data.get('full_name', existing_profile.full_name)
        existing_profile.contact_phone = data.get('contact_phone', existing_profile.contact_phone)
        existing_profile.address = data.get('address', existing_profile.address)
        existing_profile.preferred_contact_method = data.get('preferred_contact_method', existing_profile.preferred_contact_method)
    else:
        # Create a new customer profile
        new_customer_profile = Customer(
            user_id=current_user.id,
            full_name=data.get('full_name'),
            contact_phone=data.get('contact_phone'),
            address=data.get('address'),
            preferred_contact_method=data.get('preferred_contact_method')
        )

        db.session.add(new_customer_profile)

    db.session.commit()

    return jsonify({'message': 'Customer profile completed or updated successfully'}), 200

# Profile completion route for moving companies
@app.route('/complete_moving_company_profile', methods=['GET', 'POST'])
@login_required
def complete_moving_company_profile():
    data = request.get_json()

    # Assuming you have a MovingCompany model with appropriate attributes
    new_moving_company_profile = MovingCompany(
        user_id=current_user.id,
        company_name=data.get('company_name'),
        contact_person=data.get('contact_person'),
        contact_email=data.get('contact_email'),
        contact_phone=data.get('contact_phone'),
        extra_services=data.get('extra_services')
    )

    db.session.add(new_moving_company_profile)
    db.session.commit()

    return jsonify({'message': 'Moving company profile completed successfully'}), 200



class IndexResource(Resource):
    def get(self):
        return jsonify({'message': 'Welcome to BoxdNLoaded!!!'})

api.add_resource(IndexResource, '/')

#user endpoints
class UserResource(Resource):
    def get(self):
        users = User.query.all()
        user_list = [{"username": user.username, "email": user.email, "role": user.role} for user in users]
        return jsonify({"users": user_list})

    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(email=data['email']).first()

        if existing_user:
            return jsonify({'error': 'Email already exists. Choose a different Email.'}), 400
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201

api.add_resource(UserResource, '/users')

#inventory endpoints
class InventoryResource(Resource):
    def get(self):
        inventory_items = Inventory.query.all()
        inventory_list = [
            {
                'id': item.id,
                'residence_type_id': item.residence_type_id,
                'user_id': item.user_id
            }
            for item in inventory_items
        ]
        return jsonify({'inventory_items': inventory_list})

    def post(self):
        data = request.get_json()
        new_inventory_item = Inventory(
        residence_type_id=data['residence_type_id'],
        user_id=data['user_id']
       )
        db.session.add(new_inventory_item)
        db.session.commit()
        return jsonify({'message': 'Inventory item created successfully'}), 201

api.add_resource(InventoryResource, '/inventory')

#location endpoints
class LocationResource(Resource):
    @login_required
    def get(self):
        locations = Location.query.all()
        location_list = [
            {
                'id': loc.id,
                'current_address': loc.current_address,
                'new_address': loc.new_address,
                'distance': loc.distance,
                'user_id': loc.user_id
            }
            for loc in locations
        ]
        return jsonify({'locations': location_list})
    @login_required
    def post(self):
        if isinstance(current_user, AnonymousUserMixin):
        # Handle the case when the user is anonymous (not logged in)
           return {'message': 'User not logged in'}, 401
        data = request.get_json()
        new_location = Location(
        current_address=data['current_address'],
        new_address=data['new_address'],
        distance=data['distance'],
        user_id=current_user.id
        )
        db.session.add(new_location)
        db.session.commit()
        return {'message': 'Location created successfully'}, 201

api.add_resource(LocationResource, '/locations')


# notifications endpoints
class NotificationResource(Resource):
    def get(self):
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
    def post(self):
        data = request.get_json()
        new_notification = Notification(
        user_id=data['user_id'],
        notification_type=data['notification_type'],
        content=data['content']
    )
        db.session.add(new_notification)
        db.session.commit()
        return jsonify({'message': 'Notification created successfully'}), 201
api.add_resource(NotificationResource, '/notifications')


# Endpoints for moving companies
class MovingCompanyResource(Resource):
    @login_required
    def get(self):
        if current_user.role != 'moving_company':
            return jsonify({'error': 'Unauthorized access'}), 403
        companies = MovingCompany.query.all()
        company_list = [
        {
            'id': comp.id,
            'user_id': comp.user_id,
            'company_name': comp.company_name,
            'contact_person': comp.contact_person,
            'contact_email': comp.contact_email,
            'contact_phone': comp.contact_phone,
            'extra_services': comp.extra_services
        }
        for comp in companies
    ]
        return jsonify({'moving_companies': company_list})
    def post(self):
        data = request.get_json()
        new_moving_company = MovingCompany(
        company_name=data['company_name'],
        contact_person=data['contact_person'],
        contact_email=data['contact_email'],
        contact_phone=data['contact_phone'],
        extra_services=data['extra_services'],
        user=current_user
    )
        db.session.add(new_moving_company)
        db.session.commit()
        return jsonify({'message': 'Moving company created successfully'}), 201
api.add_resource(MovingCompanyResource, '/moving_companies')

# Endpoint to get all quotes
class QuoteResource(Resource):
    def get(self):
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
    def post(self):
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
api.add_resource(QuoteResource, '/quotes')
# Endpoint for bookings
class BookingResource(Resource):
    def get(self):
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
    def post(self):
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
api.add_resource(BookingResource, '/bookings')    

# Endpoint for all residences
class ResidenceResource(Resource):
    def get(self):
        residences = Residence.query.all()
        residence_list = [
        {'id': res.id, 'name': res.name}
        for res in residences
    ]
        return jsonify({'residences': residence_list})

    def post(self):
        data = request.get_json()
        new_residence = Residence(
        name=data['name']
    )
        db.session.add(new_residence)
        db.session.commit()
        return jsonify({'message': 'Residence created successfully'}), 201
api.add_resource(ResidenceResource, '/residences')

class CustomerResource(Resource):
    @login_required
    def get(self):
        if current_user.role != 'customer':
            return jsonify({'error': 'Unauthorized access'}), 403

        customers = Customer.query.all()
        customer_list = [
            {
                'user_id': customer.user_id,
                'full_name': customer.full_name,
                'contact_phone': customer.contact_phone,
                'email': customer.email,
                'address': customer.address,
                'preferred_contact_method': customer.preferred_contact_method
            }
            for customer in customers
        ]
        return jsonify({'customers': customer_list})

    def post(self):
        data = request.get_json()
        new_customer = Customer(
            user_id=data['user_id'],
            full_name=data['full_name'],
            contact_phone=data['contact_phone'],
            email=data['email'],
            address=data['address'],
            preferred_contact_method=data['preferred_contact_method'],
            user=current_user
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({'message': 'Customer created successfully'}), 201

api.add_resource(CustomerResource, '/customers')

# Update user by ID
class UpdateUserResource(Resource):
    def put(self, user_id):
        user = User.query.get(user_id)
        if user:
            data = request.get_json()
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.password = data.get('password', user.password)
            user.role = data.get('role', user.role)
            db.session.commit()
            return jsonify({'message': 'User updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

api.add_resource(UpdateUserResource, '/users/<int:user_id>')

# Endpoint to update an inventory item by ID
class UpdateInventoryResource(Resource):
    def put(self, item_id):
        inventory_item = Inventory.query.get(item_id)
        if inventory_item:
            data = request.get_json()
            inventory_item.residence_type_id = data.get('residence_type_id', inventory_item.residence_type_id)
            inventory_item.user_id = data.get('user_id', inventory_item.user_id)
            db.session.commit()
            return jsonify({'message': 'Inventory item updated successfully'}), 200
        else:
            return jsonify({'error': 'Inventory item not found'}), 404

api.add_resource(UpdateInventoryResource, '/inventory/<int:item_id>')


# Endpoint to update a location by ID
class UpdateLocationResource(Resource):
    def put(self, location_id):
        location = Location.query.get(location_id)
        if location:
            data = request.get_json()
            location.current_address = data.get('current_address', location.current_address)
            location.new_address = data.get('new_address', location.new_address)
            location.distance = data.get('distance', location.distance)
            location.user_id = data.get('user_id', location.user_id)
            db.session.commit()
            return jsonify({'message': 'Location updated successfully'}), 200
        else:
            return jsonify({'error': 'Location not found'}), 404

api.add_resource(UpdateLocationResource, '/locations/<int:location_id>')
# Endpoint to update a booking by ID
class UpdateBookingResource(Resource):
    def put(self, booking_id):
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

api.add_resource(UpdateBookingResource, '/bookings/<int:booking_id>')

# Endpoint to delete a user by ID
class DeleteUserResource(Resource):
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

api.add_resource(DeleteUserResource, '/users/<int:user_id>')

# Endpoint to delete a booking by ID
class DeleteBookingResource(Resource):
    def delete(self, booking_id):
        booking = Booking.query.get(booking_id)
        if booking:
            db.session.delete(booking)
            db.session.commit()
            return jsonify({'message': 'Booking deleted successfully'}), 200
        else:
            return jsonify({'error': 'Booking not found'}), 404

api.add_resource(DeleteBookingResource, '/bookings/<int:booking_id>')



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)


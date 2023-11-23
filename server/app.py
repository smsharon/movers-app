from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from models import db, User, Inventory, Location, Notification, MovingCompany, Quote, Booking

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movers.db'
app.config['SECRET_KEY'] = 'your_secret_key'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migarte = Migrate(app, db)
db.init_app(app)
#db = SQLAlchemy(app)

api = Api(app)
CORS(app)
login_manager = LoginManager(app)

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to BoxdNLoaded!!!'})

# Initialize login manager
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        login_user(user)
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid credentials'})

# Logout route
@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})

# Forms for input validation
class InventoryForm(FlaskForm):
    residence_type = StringField('Residence Type', validators=[InputRequired()])
    item = StringField('Item', validators=[InputRequired()])
    quantity = IntegerField('Quantity', validators=[InputRequired()])

class LocationForm(FlaskForm):
    current_address = StringField('Current Address', validators=[InputRequired()])
    new_address = StringField('New Address', validators=[InputRequired()])

# Create inventory route
@app.route('/create-inventory', methods=['POST'])
@login_required
def create_inventory():
    form = InventoryForm(request.get_json())
    if form.validate():
        data = form.data
        new_inventory = Inventory(residence_type=data['residence_type'], item=data['item'], quantity=data['quantity'], user_id=current_user.id)
        db.session.add(new_inventory)
        db.session.commit()
        return jsonify({'message': 'Inventory item created successfully'})
    else:
        return jsonify({'error': 'Invalid input'})

# Get inventory route
@app.route('/get-inventory/<int:user_id>', methods=['GET'])
@login_required
def get_inventory(user_id):
    user_inventory = Inventory.query.filter_by(user_id=user_id).all()
    inventory_list = [{'id': item.id, 'residence_type': item.residence_type, 'item': item.item, 'quantity': item.quantity} for item in user_inventory]
    return jsonify({'inventory': inventory_list})

# Update inventory route
@app.route('/update-inventory/<int:inventory_id>', methods=['PUT'])
@login_required
def update_inventory(inventory_id):
    form = InventoryForm(request.get_json())
    if form.validate():
        inventory_item = Inventory.query.get(inventory_id)
        if inventory_item:
            data = form.data
            inventory_item.residence_type = data['residence_type']
            inventory_item.item = data['item']
            inventory_item.quantity = data['quantity']
            db.session.commit()
            return jsonify({'message': 'Inventory item updated successfully'})
        else:
            return jsonify({'error': 'Inventory item not found'})
    else:
        return jsonify({'error': 'Invalid input'})

# Delete inventory route
@app.route('/delete-inventory/<int:inventory_id>', methods=['DELETE'])
@login_required
def delete_inventory(inventory_id):
    inventory_item = Inventory.query.get(inventory_id)
    if inventory_item:
        db.session.delete(inventory_item)
        db.session.commit()
        return jsonify({'message': 'Inventory item deleted successfully'})
    else:
        return jsonify({'error': 'Inventory item not found'})

# Create location route
@app.route('/create-location', methods=['POST'])
@login_required
def create_location():
    form = LocationForm(request.get_json())
    if form.validate():
        data = form.data
        new_location = Location(current_address=data['current_address'], new_address=data['new_address'], user_id=current_user.id)
        db.session.add(new_location)
        db.session.commit()
        return jsonify({'message': 'Location created successfully'})
    else:
        return jsonify({'error': 'Invalid input'})

# Get locations route
@app.route('/get-locations/<int:user_id>', methods=['GET'])
@login_required
def get_locations(user_id):
    user_locations = Location.query.filter_by(user_id=user_id).all()
    location_list = [{'id': location.id, 'current_address': location.current_address, 'new_address': location.new_address} for location in user_locations]
    return jsonify({'locations': location_list})

# Update location route
@app.route('/update-location/<int:location_id>', methods=['PUT'])
@login_required
def update_location(location_id):
    form = LocationForm(request.get_json())
    if form.validate():
        data = form.data
        location_item = Location.query.get(location_id)
        if location_item:
            location_item.current_address = data['current_address']
            location_item.new_address = data['new_address']
            db.session.commit()
            return jsonify({'message': 'Location updated successfully'})
        else:
            return jsonify({'error': 'Location not found'})
    else:
        return jsonify({'error': 'Invalid input'})

# Delete location route
@app.route('/delete-location/<int:location_id>', methods=['DELETE'])
@login_required
def delete_location(location_id):
    location_item = Location.query.get(location_id)
    if location_item:
        db.session.delete(location_item)
        db.session.commit()
        return jsonify({'message': 'Location deleted successfully'})
    else:
        return jsonify({'error': 'Location not found'})

# ... Other routes ...

# Create notification route
@app.route('/create-notification', methods=['POST'])
@login_required
def create_notification():
    data = request.get_json()
    user_id = data.get('user_id')
    notification_type = data.get('notification_type')
    content = data.get('content')

    new_notification = Notification(user_id=user_id, notification_type=notification_type, content=content)
    db.session.add(new_notification)
    db.session.commit()

    return jsonify({'message': 'Notification created successfully'})

# Get notifications route
@app.route('/get-notifications/<int:user_id>', methods=['GET'])
@login_required
def get_notifications(user_id):
    user_notifications = Notification.query.filter_by(user_id=user_id).all()
    notification_list = [{'id': notification.id, 'notification_type': notification.notification_type, 'content': notification.content, 'timestamp': notification.timestamp} for notification in user_notifications]
    return jsonify({'notifications': notification_list})

# Update notification route
@app.route('/update-notification/<int:notification_id>', methods=['PUT'])
@login_required
def update_notification(notification_id):
    data = request.get_json()
    notification_type = data.get('notification_type')
    content = data.get('content')

    notification_item = Notification.query.get(notification_id)
    if notification_item:
        notification_item.notification_type = notification_type
        notification_item.content = content
        db.session.commit()
        return jsonify({'message': 'Notification updated successfully'})
    else:
        return jsonify({'error': 'Notification not found'})

# Delete notification route
@app.route('/delete-notification/<int:notification_id>', methods=['DELETE'])
@login_required
def delete_notification(notification_id):
    notification_item = Notification.query.get(notification_id)
    if notification_item:
        db.session.delete(notification_item)
        db.session.commit()
        return jsonify({'message': 'Notification deleted successfully'})
    else:
        return jsonify({'error': 'Notification not found'})

# Create moving company route
@app.route('/create-moving-company', methods=['POST'])
@login_required
def create_moving_company():
    data = request.get_json()
    company_name = data.get('company_name')
    contact_person = data.get('contact_person')
    contact_email = data.get('contact_email')
    contact_phone = data.get('contact_phone')

    new_moving_company = MovingCompany(company_name=company_name, contact_person=contact_person, contact_email=contact_email, contact_phone=contact_phone)
    db.session.add(new_moving_company)
    db.session.commit()

    return jsonify({'message': 'Moving Company created successfully'})

# Get moving companies route
@app.route('/get-moving-companies', methods=['GET'])
@login_required
def get_moving_companies():
    moving_companies = MovingCompany.query.all()
    company_list = [{'id': company.id, 'company_name': company.company_name, 'contact_person': company.contact_person, 'contact_email': company.contact_email, 'contact_phone': company.contact_phone} for company in moving_companies]
    return jsonify({'moving_companies': company_list})

# Update moving company route
@app.route('/update-moving-company/<int:company_id>', methods=['PUT'])
@login_required
def update_moving_company(company_id):
    data = request.get_json()
    company_name = data.get('company_name')
    contact_person = data.get('contact_person')
    contact_email = data.get('contact_email')
    contact_phone = data.get('contact_phone')

    moving_company_item = MovingCompany.query.get(company_id)
    if moving_company_item:
        moving_company_item.company_name = company_name
        moving_company_item.contact_person = contact_person
        moving_company_item.contact_email = contact_email
        moving_company_item.contact_phone = contact_phone
        db.session.commit()
        return jsonify({'message': 'Moving Company updated successfully'})
    else:
        return jsonify({'error': 'Moving Company not found'})

# Delete moving company route
@app.route('/delete-moving-company/<int:company_id>', methods=['DELETE'])
@login_required
def delete_moving_company(company_id):
    moving_company_item = MovingCompany.query.get(company_id)
    if moving_company_item:
        db.session.delete(moving_company_item)
        db.session.commit()
        return jsonify({'message': 'Moving Company deleted successfully'})
    else:
        return jsonify({'error': 'Moving Company not found'})

# Get quotes route
@app.route('/get-quotes/<int:user_id>', methods=['GET'])
@login_required
def get_quotes(user_id):
    user_quotes = Quote.query.filter_by(user_id=user_id).all()
    quote_list = [{'id': quote.id, 'company_id': quote.company_id, 'quote_amount': quote.quote_amount} for quote in user_quotes]
    return jsonify({'quotes': quote_list})

# Update quote route
@app.route('/update-quote/<int:quote_id>', methods=['PUT'])
@login_required
def update_quote(quote_id):
    data = request.get_json()
    company_id = data.get('company_id')
    quote_amount = data.get('quote_amount')

    quote_item = Quote.query.get(quote_id)
    if quote_item:
        quote_item.company_id = company_id
        quote_item.quote_amount = quote_amount
        db.session.commit()
        return jsonify({'message': 'Quote updated successfully'})
    else:
        return jsonify({'error': 'Quote not found'})

# Delete quote route
@app.route('/delete-quote/<int:quote_id>', methods=['DELETE'])
@login_required
def delete_quote(quote_id):
    quote_item = Quote.query.get(quote_id)
    if quote_item:
        db.session.delete(quote_item)
        db.session.commit()
        return jsonify({'message': 'Quote deleted successfully'})
    else:
        return jsonify({'error': 'Quote not found'})

# Create booking route
@app.route('/create-booking', methods=['POST'])
@login_required
def create_booking():
    data = request.get_json()
    user_id = current_user.id  # Use the current user's ID
    quote_id = data.get('quote_id')
    booking_status = data.get('booking_status')
    moving_date = data.get('moving_date')
    moving_time = data.get('moving_time')

    new_booking = Booking(user_id=user_id, quote_id=quote_id, booking_status=booking_status, moving_date=moving_date, moving_time=moving_time)
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'message': 'Booking created successfully'})

# Get bookings route
@app.route('/get-bookings/<int:user_id>', methods=['GET'])
@login_required
def get_bookings(user_id):
    user_bookings = Booking.query.filter_by(user_id=user_id).all()
    booking_list = [{'id': booking.id, 'quote_id': booking.quote_id, 'booking_status': booking.booking_status, 'moving_date': booking.moving_date, 'moving_time': booking.moving_time} for booking in user_bookings]
    return jsonify({'bookings': booking_list})

# Update booking route
@app.route('/update-booking/<int:booking_id>', methods=['PUT'])
@login_required
def update_booking(booking_id):
    data = request.get_json()
    quote_id = data.get('quote_id')
    booking_status = data.get('booking_status')
    moving_date = data.get('moving_date')
    moving_time = data.get('moving_time')

    booking_item = Booking.query.get(booking_id)
    if booking_item:
        booking_item.quote_id = quote_id
        booking_item.booking_status = booking_status
        booking_item.moving_date = moving_date
        booking_item.moving_time = moving_time
        db.session.commit()
        return jsonify({'message': 'Booking updated successfully'})
    else:
        return jsonify({'error': 'Booking not found'})

# Delete booking route
@app.route('/delete-booking/<int:booking_id>', methods=['DELETE'])
@login_required
def delete_booking(booking_id):
    booking_item = Booking.query.get(booking_id)
    if booking_item:
        db.session.delete(booking_item)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'})
    else:
        return jsonify({'error': 'Booking not found'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
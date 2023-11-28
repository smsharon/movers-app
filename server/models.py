from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import Flask, request, jsonify
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re



db = SQLAlchemy()

class User(db.Model,SerializerMixin):
    serialize_rules = ('-inventory.user', '-notification.user', '-location.user', '-booking.user', '-quote.user', '-quote.residence_type.quotes', '-location.user.location', '-booking.user.bookings', '-notification.user.notification')
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    # Relationships
    inventory = db.relationship('Inventory', back_populates='user')
    location = db.relationship('Location', back_populates='user')
    notification = db.relationship('Notification', back_populates='user')
    bookings = db.relationship('Booking', back_populates='user')
    quotes = db.relationship('Quote', back_populates='user')
     # Relationship specific to MovingCompany
    company = db.relationship('MovingCompany', back_populates='user', uselist=False)

    # Relationship specific to Customer
    customer = db.relationship('Customer', back_populates='user', uselist=False)
    
    #validations
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise AssertionError('Provided email is not valid.')
        return email

    @validates('password')
    def validate_password(self, key, password):
        if not re.search(r"[A-Z]", password):
            raise AssertionError('Password must contain at least one uppercase letter.')
        if not re.search(r"[a-z]", password):
            raise AssertionError('Password must contain at least one lowercase letter.')
        if not re.search(r"[0-9]", password):
            raise AssertionError('Password must contain at least one digit.')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise AssertionError('Password must contain at least one special character.')
        return password
    

class Inventory(db.Model,SerializerMixin):
    serialize_rules = ('-user.inventory',)
    id = db.Column(db.Integer, primary_key=True)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    residence_type = db.relationship('Residence', backref=db.backref('inventory_items', lazy=True))
    user = db.relationship('User', back_populates='inventory')


class Location(db.Model):
    serialize_rules = ('-user.location',)
    id = db.Column(db.Integer, primary_key=True)
    current_address = db.Column(db.String(100), nullable=False)
    new_address = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='location')

class Notification(db.Model):
    serialize_rules = ('-user.notification',)
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notification_type = db.Column(db.String(50))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='notification')

class MovingCompany(db.Model):
    serialize_rules = ('-quote.moving_company',)
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(50))
    contact_email = db.Column(db.String(100), unique=True, nullable=False)
    contact_phone = db.Column(db.String(20))
    extra_services = db.Column(db.String(50), nullable=False)
    #service_area = db.Column(db.String(120), nullable=False)

    #relationships
    quotes = db.relationship('Quote', back_populates='company')
    user = db.relationship('User', back_populates='company')
    
class Quote(db.Model):
    serialize_rules = ('-user.quotes', '-residence_type.quotes', '-moving_company.quotes', '-booking.quote', '-booking.residence_type.quotes')

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('moving_company.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quote_amount = db.Column(db.Integer)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    user = db.relationship('User', back_populates='quotes')
    residence_type = db.relationship('Residence', backref=db.backref('quotes', lazy=True))
    company = db.relationship('MovingCompany', back_populates='quotes')


class Booking(db.Model):
    serialize_rules = ('-user.bookings', '-quote.bookings', '-residence_type.bookings')
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=False)
    booking_status = db.Column(db.String(50))
    moving_date = db.Column(db.Date)
    moving_time = db.Column(db.Time)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    residence_type = db.relationship('Residence', backref=db.backref('bookings', lazy=True))
    user = db.relationship('User', back_populates='bookings')
    quote = db.relationship('Quote', backref=db.backref('bookings', lazy=True))

class Residence(db.Model):
    serialize_rules = ('-inventory.residence_type', '-quote.residence_type', '-booking.residence_type')
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  


class Customer(db.Model, SerializerMixin):
    serialize_rules = ('-user.customer',)
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(200))
    preferred_contact_method = db.Column(db.String(20))
    
    # Relationships
    user = db.relationship('User', back_populates='customer')







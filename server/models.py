from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import Flask, request, jsonify
from flask_login import UserMixin
from sqlalchemy.orm import validates
import re

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

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

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    item = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    residence_type = db.relationship('Residence', backref=db.backref('inventory_items', lazy=True))
    user = db.relationship('User', backref=db.backref('inventory_items', lazy=True))


class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    current_address = db.Column(db.String(100), nullable=False)
    new_address = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('location', lazy=True))

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notification_type = db.Column(db.String(50))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('notification', lazy=True))


class MovingCompany(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(50))
    contact_email = db.Column(db.String(100))
    contact_phone = db.Column(db.String(20))

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('moving_company.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quote_amount = db.Column(db.Integer)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    residence_type = db.relationship('Residence', backref=db.backref('quotes', lazy=True))

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=False)
    booking_status = db.Column(db.String(50))
    moving_date = db.Column(db.Date)
    moving_time = db.Column(db.Time)
    residence_type_id = db.Column(db.Integer, db.ForeignKey('residence.id'), nullable=False)
    residence_type = db.relationship('Residence', backref=db.backref('bookings', lazy=True))
    user = db.relationship('User', backref=db.backref('bookings', lazy=True))
    quote = db.relationship('Quote', backref=db.backref('bookings', lazy=True))

class Residence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)    






from app import app
from datetime import datetime, time
from models import db, User, Inventory, Location, Notification, MovingCompany, Quote, Booking, Residence, Customer

with app.app_context():

    # Delete existing data from all tables
    db.session.query(User).delete()
    db.session.query(Inventory).delete()
    db.session.query(Location).delete()
    db.session.query(Notification).delete()
    db.session.query(MovingCompany).delete()
    db.session.query(Quote).delete()
    db.session.query(Booking).delete()
    db.session.query(Residence).delete()
    db.session.query(Customer).delete()

    # Add users
    user1 = User(
        id = 1,
        username="shallon",
        email="shallon@gmail.com",
        password="Said@8354",
        role="customer"
        
    )

    user2 = User(
        id = 2,
        username="kelvin",
        email="kelvin@gmail.com",
        password="Kelvin@2010",
        role="customer"
    )

    # Add residences
    residence1 = Residence(
        id = 1,
        name="Bedsitter"
    )

    residence2 = Residence(
        id = 2,
        name="One Bedroom"
    )

    residence3 = Residence(
        id =3,
        name="Two Bedroom"
    )

    residence4 = Residence(
        id =4,
        name="Studio"
    )

    # Add inventory items
    inventory_item1 = Inventory(
        residence_type_id=residence1.id,
        user=user1
    )

    inventory_item2 = Inventory(
        residence_type_id=residence1.id,
        user=user2
    )

    # Add locations
    location1 = Location(
        current_address="wahiyaki highway",
        new_address="Ngong street 11",
        user=user1
    )

    location2 = Location(
        current_address="Thika road 34",
        new_address="parklands street 2",
        user=user2
    )

    # Add notifications
    notification1 = Notification(
        user_id=user1.id,
        notification_type="Reminder",
        content="Yor move is scheduled on saturday"
    )

    notification2 = Notification(
        user_id=user2.id,
        notification_type="service update",
        content="stay updated with the latest moving tricks"
    )

    # Add moving companies
    company1 = MovingCompany(
        id =1,
        user_id=user1.id,
        company_name="Tusonge",
        contact_person="John Doe",
        contact_email="tusongeservices@gmail.com",
        contact_phone="+254712345678",
        extra_services="Packing"
    )

    company2 = MovingCompany(
        id = 2,
        user_id=user2.id,
        company_name="Tuvybe",
        contact_person="Jane Doe",
        contact_email="tuvybeservices@gmail.com",
        contact_phone="+254758793099",
        extra_services="Storage"
    )

    # Add quotes
    quote1 = Quote(
        id = 1,
        company_id=company1.id,
        user_id=user1.id,
        quote_amount=500,
        residence_type_id=residence1.id
    )

    quote2 = Quote(
        id= 2,
        company_id=company2.id,
        user_id=user2.id,
        quote_amount=700,
        residence_type_id=residence2.id
    )

    # Add bookings
    booking1 = Booking(
        user_id=user1.id,
        quote_id=quote1.id,
        booking_status="Confirmed",
        moving_date=datetime(2023, 1, 15),
        moving_time=time(10, 40),
        residence_type_id=residence1.id 
    )

    booking2 = Booking(
        user_id=user2.id,
        quote_id=quote1.id,
        booking_status="Pending",
        moving_date=datetime(2023, 2, 20),
        moving_time=time(14, 30),
        residence_type_id=residence2.id 
    )

     # Add customers
    customer1 = Customer(
        id=1,
        user_id=user1.id,
        full_name="Shallon Customer",
        contact_phone="+254712345678",
        email="shallon@gmail.com",
        address="Ngong Street 11",
        preferred_contact_method="email"
    )

    customer2 = Customer(
        id=2,
        user_id=user2.id,
        full_name="Kelvin Customer",
        contact_phone="+254758793099",
        email="kelvin@gmail.com",
        address="Parklands Street 2",
        preferred_contact_method="phone"
    )

    # Add all records to the session
    db.session.add_all([
        user1, user2,
        residence1, residence2, residence3, residence4,
        inventory_item1, inventory_item2,
        location1, location2,
        notification1, notification2,
        company1, company2,
        quote1, quote2,
        booking1, booking2,
        customer1, customer2
    ])

    # Commit changes to the database
    db.session.commit()

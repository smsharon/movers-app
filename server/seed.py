from app import app
from models import db, User, Inventory, Location, Notification, MovingCompany, Quote, Booking

with app.app_context():

  #add user records
  user1 = User(
    id=1,
    username="user1",
    email="shallon@gmail.com",
    password = "password"
  )
  user2 = User(
    id=2,
    username="user2",
    email="kelvin@gmail.com",
    password = "password"
  )
  db.session.add_all([user1,user2])

#add inventory records
  inventory1 = Inventory(
    id=1,
    residence_type="residence1.id",
    email="shallon@gmail.com",
    password = "password"
  )
  inventory2 = Inventory(
    id=2,
    username="user2",
    email="kelvin@gmail.com",
    password = "password"
  )
  db.session.add_all([user1,user2])

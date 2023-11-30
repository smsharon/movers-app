import React from 'react';
import { Container, Nav, Navbar, Card } from 'react-bootstrap';

function CustomNavbar() {
  return (
    <div>
    <Card className="bg-dark text-black">
      <Card.Body>
        <Navbar >
          <Container>
            <Navbar.Brand href="#home">
            </Navbar.Brand>
            <span style={{ fontSize: '40px', marginLeft: '50px', marginTop: '10', display: 'flex', alignItems: 'center' }}>
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#Inventory">Inventory</Nav.Link>
                <Nav.Link href="#Signup">Signup</Nav.Link>
                <Nav.Link href="#Location">Location</Nav.Link>
                <Nav.Link href="#Booking">Booking</Nav.Link>
                <Nav.Link href="#Tracking">Tracking</Nav.Link>
                <Nav.Link href="#Notification">Notification</Nav.Link>
              </Nav>
            </span>
          </Container>
        </Navbar>
      </Card.Body>
    </Card>
    </div>
  );
}


export default CustomNavbar;

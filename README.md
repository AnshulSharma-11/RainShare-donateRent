# RainShare – Community Gear Sharing Platform

## Project Overview

RainShare is a web-based platform that allows people to rent, borrow, and donate outdoor gear. Many people own equipment such as tents, trekking bags, sleeping bags, hiking shoes, bicycles, and camping accessories that remain unused for most of the year. At the same time, others need these items for short periods but cannot afford to purchase them.

RainShare connects these users through a simple, secure, and user-friendly platform where equipment can be listed, rented, or donated. The application also provides an admin panel to manage users, gear listings, rentals, and donations.

# Problem Statement

Outdoor equipment is often expensive, making it difficult for many people to purchase gear for occasional use. At the same time, many owners have equipment that remains unused after one or two trips.

The major problems include:

- High cost of outdoor equipment
- Unused gear occupying storage space
- No centralized platform for renting and donating gear
- Difficulty finding trustworthy renters or donors
- Lack of proper management for rental requests and donations

These challenges reduce accessibility to outdoor activities while increasing unnecessary spending and equipment waste.

---

# Proposed Solution

RainShare provides an online platform that enables users to share outdoor equipment instead of purchasing new items.

Users can:

- Register and log into the system
- Browse available gear
- Search and filter products
- Request rentals
- Donate equipment
- Save favorite items in a wishlist
- Track rental and donation requests
- pay the rend directly 

Administrators can:

- Manage users
- Approve or reject requests
- Manage gear listings
- Monitor donations
- View platform statistics through an admin dashboard


The platform encourages sustainable sharing while making outdoor activities more affordable and accessible.

---

# Features

- User Authentication
- Role-Based Access Control
- Gear Listing
- Gear Search and Filters
- Rental Management
- Donation Management
- Wishlist
- Responsive User Interface
- Admin Dashboard
- Redux State Management
- rental payment available

- ---

# Technology Stack

## Frontend

- React (Create React App)
- Redux Toolkit
- React Router DOM
- Bootstrap
- CSS
- Axios
- Recharts

## Backend

- Spring Boot (REST APIs)

## Database

- MySQL

---

# Modules

### Authentication Module

- User Registration
- User Login
- Session Management

### Gear Module

- View Gear
- Add Gear
- Edit Gear
- Delete Gear

### Rental Module

- Request Rental
- Approve Requests
- Cancel Requests
- Return Equipment

### Donation Module

- Donate Gear
- Manage Donations

### Wishlist Module

- Save Favorite Gear
- Remove Favorites

### Admin Module

- Dashboard
- User Management
- Gear Management
- Rental Management
- Donation Management

---

# Application Workflow

1. User Registration/Login
2. Browse Available Gear
3. Search or Filter Equipment
4. Request Rental or Donate Gear
5. Admin Reviews Requests
6. User Tracks Request Status

---

# Redux Architecture

The application uses Redux Toolkit for centralized state management.

Main slices include:

- authSlice
- gearSlice
- rentalSlice
- donationSlice

Redux improves:

- State consistency
- API handling
- Performance
- Code organization

---

# Future Scope

The project can be extended with several advanced features:

- Online payment integration
- AI-based gear recommendations
- Live chat between users
- Push notifications
- Google Maps integration for pickup locations
- QR code verification
- Rating and review system
- Email notifications
- Mobile application
- Real-time rental tracking
- Analytics Dashboard
- Multi-language support

---

# Benefits

- Reduces equipment waste
- Encourages sustainable sharing
- Makes outdoor activities affordable
- Generates income for gear owners
- Provides a secure rental process
- Improves accessibility to outdoor adventures
- ditect payent method available
---
# To start the backend 
- mvnw spring-boot:run

# To start the frontend 
- npm start

# Conclusion

RainShare is a modern community gear-sharing platform designed to connect people who own outdoor equipment with those who need it temporarily. By providing rental and donation services through a simple and responsive web application, the platform promotes sustainability, affordability, and efficient resource utilization.

---



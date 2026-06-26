# RainShare 🌧️

> Community platform for donating, renting, and reusing rain gear.

## Tech Stack
- **Frontend**: Create React App + Tailwind CSS + Redux Toolkit
- **Mock Backend**: JSON Server (dev) → Spring Boot + MySQL (production)
- **Auth**: Mock JWT stored in localStorage

## Setup

```bash
npm install
npm run dev    # starts CRA on :3000 + JSON Server on :3001
```

## Demo Credentials

| Role   | Email               | Password  |
|--------|---------------------|-----------|
| Admin  | admin@rain.com      | admin123  |
| Donor  | donor1@rain.com     | donor123  |
| Renter | renter1@rain.com    | renter123 |

## API
All requests go to `/api/*`. In dev, CRA proxies to JSON Server on port 3001.
In production, update the proxy to point to your Spring Boot server.

## Build Sessions
- **Session 1** (this): Scaffold, design system, auth, shared components
- **Session 2**: Landing page, Browse Gear, Gear Detail, Volunteer Register
- **Session 3**: Donor Dashboard (My Gear, Donations, Rental Requests, Profile)
- **Session 4**: Renter Dashboard (My Rentals, Wishlist)
- **Session 5**: Admin Dashboard, Analytics, Dark Mode polish, Full ZIP

## Folder Structure
```
src/
  api/          Axios instance (baseURL: /api)
  components/   Shared UI (Button, Input, Card, Modal, ...)
  features/     Auth, Donor, Renter, Admin, Gear, Volunteer, Profile
  hooks/        useAuth, useRole
  layouts/      MainLayout, DashboardLayout
  store/        Redux store + slices
  utils/        validators (Zod), helpers (date, format)
```

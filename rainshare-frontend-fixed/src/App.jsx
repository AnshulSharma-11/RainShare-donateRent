import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage } from './features/auth/authSlice';

// Layouts
import MainLayout      from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RenterLayout    from './layouts/RenterLayout';   // ← SESSION 4

// Auth
import Login    from './features/auth/Login';
import Register from './features/auth/Register';

// Public pages
import Landing           from './features/landing/Landing';
import GearList          from './features/gear/GearList';       // ← enhanced (S4)
import GearDetail        from './features/gear/GearDetail';     // ← enhanced (S4)
import VolunteerRegister from './features/volunteer/VolunteerRegister';

// Donor pages
import DonorDashboard  from './features/donor/DonorDashboard';
import MyGear          from './features/donor/MyGear';
import DonationsList   from './features/donor/DonationsList';
import RentalRequests  from './features/donor/RentalRequests';

// Renter pages (SESSION 4)
import RenterDashboard from './features/renter/RenterDashboard';
import MyRentals       from './features/renter/MyRentals';
import Wishlist        from './features/renter/Wishlist';

// Shared pages
import Profile from './features/profile/Profile';

// Admin placeholder (session 5)
import AdminDashboard from './features/admin/AdminDashboard';
import AdminUsers     from './features/admin/Users';
import Categories     from './features/admin/Categories';
import GearMgmt       from './features/admin/GearMgmt';
import DonationMgmt   from './features/admin/DonationMgmt';
import RentalMgmt     from './features/admin/RentalMgmt';
import Volunteers     from './features/admin/Volunteers';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

import {
  LayoutDashboard, Package, Gift, Calendar,
  Users, Tags, Settings, Heart, Search, Clipboard, UserCheck,
} from 'lucide-react';

const donorLinks = [
  { to: '/donor/dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/donor/my-gear',         label: 'My Gear',         icon: Package         },
  { to: '/donor/donations',       label: 'Donations',       icon: Gift            },
  { to: '/donor/rental-requests', label: 'Rental Requests', icon: Calendar        },
  { to: '/profile',               label: 'Profile',         icon: Settings        },
];

const adminLinks = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/users',      label: 'Users',      icon: Users           },
  { to: '/admin/categories', label: 'Categories', icon: Tags            },
  { to: '/admin/gear',       label: 'Gear',       icon: Package         },
  { to: '/admin/donations',  label: 'Donations',  icon: Gift            },
  { to: '/admin/rentals',    label: 'Rentals',    icon: Calendar        },
  { to: '/admin/volunteers', label: 'Volunteers', icon: UserCheck       },
];

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-surface dark:bg-surface-dark">
      <div className="text-8xl mb-4">🌧️</div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Lost in the rain?</h1>
      <p className="text-slate-400 mb-8">This page doesn't exist — let's get you back on dry ground.</p>
      <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((s) => s.ui);

  useEffect(() => { dispatch(loadUserFromStorage()); }, [dispatch]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!rounded-xl !shadow-card',
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
        }}
      />

      <Routes>
        {/* Auth (no layout) */}
        <Route path="/login"    element={<Login    />} />
        <Route path="/register" element={<Register />} />

        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/"                   element={<Landing           />} />
          <Route path="/browse"             element={<GearList          />} />
          <Route path="/gear/:id"           element={<GearDetail        />} />
          <Route path="/volunteer/register" element={<VolunteerRegister />} />
          <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* Donor */}
        <Route element={<ProtectedRoute allowedRole="donor"><DashboardLayout sidebarLinks={donorLinks} /></ProtectedRoute>}>
          <Route path="/donor/dashboard"       element={<DonorDashboard />} />
          <Route path="/donor/my-gear"         element={<MyGear         />} />
          <Route path="/donor/donations"       element={<DonationsList  />} />
          <Route path="/donor/rental-requests" element={<RentalRequests />} />
        </Route>

        {/* ── Renter (SESSION 4) ───────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRole="renter"><RenterLayout /></ProtectedRoute>}>
          <Route path="/renter/dashboard" element={<RenterDashboard />} />
          <Route path="/renter/rentals"   element={<MyRentals       />} />
          <Route path="/renter/wishlist"  element={<Wishlist         />} />
        </Route>

        {/* Admin (session 5) */}
        <Route element={<ProtectedRoute allowedRole="admin"><DashboardLayout sidebarLinks={adminLinks} /></ProtectedRoute>}>
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          <Route path="/admin/users"      element={<AdminUsers     />} />
          <Route path="/admin/categories" element={<Categories     />} />
          <Route path="/admin/gear"       element={<GearMgmt       />} />
          <Route path="/admin/donations"  element={<DonationMgmt   />} />
          <Route path="/admin/rentals"    element={<RentalMgmt     />} />
          <Route path="/admin/volunteers" element={<Volunteers     />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GuestNavbar } from './navbar/guestNavbar';
import { RetireeNavbar } from './navbar/retireeNavbar';
import { StartupNavbar } from './navbar/startupNavbar';

// Pages that should always show the GuestNavbar — even for logged‑in users.
// Extend this array as you add more public pages.
const ALWAYS_GUEST_ROUTES: string[] = [
  '/',
  '/login',
  '/signup',
  '/imprint',
  '/privacy',
  '/for-startups',
  '/for-retirees',
  '/',
];

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Routes that should always render the guest bar
  if (ALWAYS_GUEST_ROUTES.includes(location.pathname)) {
    return (
      <GuestNavbar
        alwaysGuestRoutes={ALWAYS_GUEST_ROUTES}
        navigate={navigate}
        location={location}
      />
    );
  }

  // 2. No user yet (unauthenticated on other pages)
  if (!user)
    return (
      <GuestNavbar
        alwaysGuestRoutes={ALWAYS_GUEST_ROUTES}
        navigate={navigate}
        location={location}
      />
    );

  // 3. Retiree
  if (user.userType === 'Retiree')
    return (
      <RetireeNavbar
        user={user}
        navigate={navigate}
        location={location}
        alwaysGuestRoutes={ALWAYS_GUEST_ROUTES}
      />
    );

  // 4. Startup
  return (
    <StartupNavbar
      user={user}
      navigate={navigate}
      location={location}
      alwaysGuestRoutes={ALWAYS_GUEST_ROUTES}
    />
  );
}

export default Navbar;

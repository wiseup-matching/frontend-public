import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStartup } from '@/hooks/useStartup';

import NotificationsPopover from '../notifications';
import { NavButton, NavButtonMobile } from './navButtons';
import { Logo } from './logo';
import { subscriptionColor } from './subscriptionColor';

interface StartupNavbarProps {
  user: { id: string; name?: string };
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
  alwaysGuestRoutes: string[]; // if true, always navigate to home
}

export const StartupNavbar: React.FC<StartupNavbarProps> = ({
  user,
  navigate,
  location,
  alwaysGuestRoutes,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isProfile = location.pathname.startsWith('/startup/profile');
  const { startup } = useStartup(user.id); // ← runs only for startups
  const { logout } = useAuth();

  const profileSrc = startup?.contactPersonPicture ?? '';

  const connectionsLeft =
    (startup?.monthlyConnectionBalance ?? 0) + (startup?.permanentConnectionBalance ?? 0);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Add/remove body class when mobile menu changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }, [isMobileMenuOpen]);

  const subColor = subscriptionColor(startup?.wiseUpSubscriptionTier ?? undefined);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo
            alwaysGuestRoutes={alwaysGuestRoutes}
            userType="Startup"
            navigate={navigate}
            location={location}
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavButton path="/startup/new-posting">New Posting</NavButton>
            <NavButton path="/startup/browse-retirees">Browse</NavButton>
            <NavButton path="/startup/matches">Matches</NavButton>
            <NavButton path="/startup/conversations">Conversations</NavButton>
          </div>

          {/* Connections pill + avatar + logout */}
          <div className="hidden lg:flex items-center space-x-2">
            <div
              style={{ '--sub': subColor } as React.CSSProperties}
              className={`text-sm  pl-4 pr-0.5 py-0.5 gap-3 flex items-center rounded-full border shadow-md transition-shadow transition-colors cursor-pointer
                ${
                  isProfile
                    ? `bg-[var(--sub)] border-[var(--sub)] text-foreground shadow-md transform transition-transform duration-200 ease-out hover:scale-[1.03] group`
                    : 'font-medium border border-[var(--sub)] text-foreground bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-[var(--sub)]/20 hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.03] ease-out group'
                }  
              p`}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                void navigate('/startup/profile');
              }}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                Connections: {connectionsLeft}
              </span>

              <button
                id="navbar-profile-pic"
                type="button"
                onClick={() => void navigate('/startup/profile')}
                className={`cursor-pointer rounded-full transition-all`}
              >
                <Avatar className="w-8.5 h-8.5">
                  <AvatarImage src={profileSrc} alt={user.name ?? 'User avatar'} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    {startup?.contactPersonNameFirst
                      ? startup.contactPersonNameFirst.charAt(0).toUpperCase()
                      : '?'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>

            <NotificationsPopover userId={user.id} isRetiree={false} />

            <button
              type="button"
              onClick={handleLogout}
              className={`
                relative inline-flex items-center justify-center
                h-10 w-10 rounded-full
                transition-transform duration-200 ease-out
                group
                cursor-pointer 
                hover:shadow-lg hover:scale-[1.05]
                bg-white/40 border border-[rgba(255,255,255,0.3)] bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
                hover:border-destructive
                hover:bg-destructive/2
                cursor-pointer
              `}
            >
              {/* Logout icon */}
              <LogOut
                className="
                  relative z-10
                  h-5 w-5 
                  pointer-events-none
                  text-foreground group-hover:text-destructive
                "
              />
            </button>
          </div>

          {/* Mobile: Avatar, Logout and Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              type="button"
              onClick={() => void navigate('/startup/profile')}
              aria-label="Profile"
              className={`cursor-pointer rounded-full transition-all ${isProfile ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-muted hover:ring-offset-2'}`}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={profileSrc} alt={user.name ?? 'User avatar'} />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {startup?.contactPersonNameFirst
                    ? startup.contactPersonNameFirst.charAt(0).toUpperCase()
                    : '?'}
                </AvatarFallback>
              </Avatar>
            </button>

            <NotificationsPopover userId={user.id} isRetiree={false} />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-primary group"
            >
              <Menu className="h-6 w-6 text-foreground group-hover:text-primary-foreground" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50">
            <div className="px-4 py-3 space-y-2">
              <NavButtonMobile
                path="/startup/new-posting"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                New Posting
              </NavButtonMobile>
              <NavButtonMobile
                path="/startup/browse-retirees"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                Browse
              </NavButtonMobile>
              <NavButtonMobile
                path="/startup/matches"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                Matches
              </NavButtonMobile>
              <NavButtonMobile
                path="/startup/conversations"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                Conversations
              </NavButtonMobile>
              <div className="pt-2 border-t border-muted">
                <div
                  style={{ '--sub': subColor } as React.CSSProperties}
                  className="flex items-center justify-between bg-[var(--sub)]/60 rounded-lg px-3 py-2 mb-2"
                >
                  <span className="text-sm font-medium">Connections left: {connectionsLeft}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    handleMobileLinkClick();
                  }}
                  className="cursor-pointer flex items-center w-full px-3 py-2 text-left text-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

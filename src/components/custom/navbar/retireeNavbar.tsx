import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRetiree } from '@/hooks/useRetiree';

import NotificationsPopover from '../notifications';

import { NavButton, NavButtonMobile } from './navButtons';

import { Logo } from './logo';

interface RetireeNavbarProps {
  user: { id: string; name?: string };
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
  alwaysGuestRoutes: string[]; // if true, always navigate to home
}

export const RetireeNavbar: React.FC<RetireeNavbarProps> = ({
  user,
  navigate,
  location,
  alwaysGuestRoutes,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isProfile = location.pathname.startsWith('/retiree/profile');
  const { retiree } = useRetiree(user.id);
  const { logout } = useAuth();

  const profileSrc = retiree?.profilePicture ?? '';

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

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo
            alwaysGuestRoutes={alwaysGuestRoutes}
            userType="Retiree"
            navigate={navigate}
            location={location}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavButton path="/retiree/browse-jobs">Browse</NavButton>
            <NavButton id="navbar-conversations" path="/retiree/conversations">
              Conversations
            </NavButton>
          </div>

          {/* Profile and Logout */}
          <div className="flex items-center space-x-2">
            <button
              id="navbar-profile-pic"
              type="button"
              onClick={() => void navigate('/retiree/profile')}
              className={`cursor-pointer rounded-full transition-all ${isProfile ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-muted hover:ring-offset-2'}`}
            >
              <Avatar className="w-10 h-10 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] group">
                <AvatarImage src={profileSrc} alt={user.name ?? 'User avatar'} />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {retiree?.nameFirst ? retiree.nameFirst.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
            </button>

            <div id="navbar-notifications">
              <NotificationsPopover userId={user.id} isRetiree={true} />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button
                type="button"
                onClick={handleLogout}
                className={`
                relative inline-flex items-center justify-center
                cursor-pointer 
                h-10 w-10 rounded-full
                transition-transform duration-200 ease-out
                group
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden mr-2">
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50">
            <div className="px-4 py-3 space-y-2">
              <NavButtonMobile
                path="/retiree/browse-jobs"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                Browse
              </NavButtonMobile>
              <NavButtonMobile
                path="/retiree/conversations"
                className="w-full justify-start text-left"
                onClick={handleMobileLinkClick}
              >
                Conversations
              </NavButtonMobile>
              <div className="pt-2 border-t border-muted">
                <button
                  type="button"
                  onClick={() => {
                    void navigate('/retiree/profile');
                    handleMobileLinkClick();
                  }}
                  className="cursor-pointer flex items-center w-full px-3 py-2 text-left text-foreground hover:text-primary hover:bg-muted/20 rounded-md transition-colors"
                >
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage src={profileSrc} alt={user.name ?? 'User avatar'} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                      {retiree?.nameFirst ? retiree.nameFirst.charAt(0).toUpperCase() : '?'}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </button>
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

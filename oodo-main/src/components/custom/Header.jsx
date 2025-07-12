import React from 'react';
import { Button } from '../ui/button';
import { NavLink } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-semibold text-green-700">
          Stack<span className="text-black">It</span>
        </NavLink>

        {/* Navigation Buttons */}
        {isSignedIn ? (
          <div className="flex items-center gap-3">
            <NavLink to="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-sm sm:text-base">
                 Home
              </Button>
            </NavLink>
            <UserButton  />
          </div>
        ) : (
          <NavLink to="/auth/sign-in">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm sm:text-base">
              Login
            </Button>
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;

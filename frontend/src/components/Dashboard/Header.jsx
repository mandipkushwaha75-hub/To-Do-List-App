import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, LogOut, Search, User as UserIcon } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <div className="app-logo">
            <CheckSquare size={26} className="logo-icon" />
            <span className="logo-text">TaskManager</span>
          </div>

          <div className="header-search">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="user-profile-badge">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="logout-button"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={18} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

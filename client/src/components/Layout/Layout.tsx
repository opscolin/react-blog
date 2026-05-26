import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Settings } from '../../types';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings(res.data);
      if (res.data.blogTitle) {
        document.title = res.data.blogTitle;
      }
      if (res.data.blogLogo) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = res.data.blogLogo;
        }
      }
    });
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/category') return location.pathname === '/category';
    return location.pathname.startsWith(path);
  };

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
      setSearchOpen(false);
    }
  }, [searchQuery, setSearchParams]);

  const handleSearchIconClick = () => {
    if (searchOpen && searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
      setSearchOpen(false);
    } else {
      setSearchOpen(!searchOpen);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            {settings?.blogLogo ? (
              <img src={settings.blogLogo} alt="" className="logo-img" />
            ) : null}
            <span className="logo-text">{settings?.blogTitle || 'Blog'}</span>
          </Link>
          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              最近
            </Link>
            <Link to="/category/ai" className={`nav-link ${isActive('/category/ai') ? 'active' : ''}`}>
              菩提AI
            </Link>
            {settings?.menuVisibility?.projects && (
              <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
                项目
              </Link>
            )}
            {settings?.menuVisibility?.diary && (
              <Link to="/diary" className={`nav-link ${isActive('/diary') ? 'active' : ''}`}>
                AI日记
              </Link>
            )}
            {settings?.menuVisibility?.archives && (
              <Link to="/archive" className={`nav-link ${isActive('/archive') ? 'active' : ''}`}>
                归档
              </Link>
            )}
            {settings?.menuVisibility?.about && (
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                关于
              </Link>
            )}
          </nav>
          <div className="header-actions">
            <div className={`search-container ${searchOpen ? 'open' : ''}`}>
              {searchOpen && (
                <form className="search-form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="搜索文章..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </form>
              )}
              <button className="search-btn" onClick={handleSearchIconClick} title="搜索">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
            <ThemeToggle />
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <p>Powered by Blog System</p>
      </footer>
    </div>
  );
}

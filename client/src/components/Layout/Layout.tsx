import { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Settings, Category, Quote, BannerCategory } from '../../types';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import NotificationBar from '../NotificationBar/NotificationBar';
import BannerCarousel from '../BannerCarousel/BannerCarousel';
import CategorySlider from '../CategorySlider/CategorySlider';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [banners, setBanners] = useState<BannerCategory[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
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
    api.get('/categories').then(res => {
      setCategories(res.data);
    });
    api.get('/quotes/random').then(res => {
      setQuote(res.data);
    }).catch(() => setQuote(null));
    api.get('/categories/banner').then(res => {
      setBanners(res.data.data || []);
    }).catch(() => setBanners([]));
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
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

  const renderNavItems = () => {
    const menus = settings?.navigation_menus;
    if (!menus) return null;

    return Object.entries(menus).map(([key, menu]) => {
      if (!menu.visible) return null;

      if (menu.children && menu.children.length > 0) {
        return (
          <div
            key={key}
            className="nav-dropdown"
          >
            <span className="nav-link dropdown-trigger">
              {key}
            </span>
            <div className="nav-dropdown-content">
              {menu.children.map((child, index) => (
                <Link
                  key={index}
                  to={child.path}
                  className="nav-dropdown-item"
                >
                  {child.cover && (
                    <img src={child.cover} alt="" className="dropdown-cover" />
                  )}
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      }

      return (
        <Link
          key={key}
          to={menu.path || '/'}
          className={`nav-link ${isActive(menu.path || '/') ? 'active' : ''}`}
        >
          {key}
        </Link>
      );
    });
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
            {renderNavItems()}
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
          <NotificationBar quote={quote} />
          {settings?.enable_banner_carousel !== false && <BannerCarousel banners={banners} />}
          <CategorySlider categories={categories} />
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <p>Powered by Blog System</p>
      </footer>
    </div>
  );
}
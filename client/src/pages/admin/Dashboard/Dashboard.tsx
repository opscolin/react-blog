import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import api from '../../../api';
import './Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    api.get('/settings').then(res => {
      if (res.data.blogTitle) {
        document.title = `${res.data.blogTitle} - 管理后台`;
      }
      if (res.data.blogLogo) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = res.data.blogLogo;
        }
      }
    });
  }, [token, navigate]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>管理后台</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard/articles" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            文章管理
          </NavLink>
          <NavLink to="/admin/dashboard/categories" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            分类管理
          </NavLink>
          <NavLink to="/admin/dashboard/tags" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            标签管理
          </NavLink>
          <NavLink to="/admin/dashboard/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            设置
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary">退出登录</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

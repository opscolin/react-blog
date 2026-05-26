import { Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/theme';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ArticleDetail from './pages/ArticleDetail/ArticleDetail';
import Category from './pages/Category/Category';
import Tag from './pages/Tag/Tag';
import TagList from './pages/Tag/TagList';
import Archive from './pages/Archive/Archive';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import Diary from './pages/Diary/Diary';
import AdminLogin from './pages/admin/Login/Login';
import AdminDashboard from './pages/admin/Dashboard/Dashboard';
import ArticleEdit from './pages/admin/ArticleEdit/ArticleEdit';
import ArticleList from './pages/admin/ArticleList/ArticleList';
import CategoryManage from './pages/admin/CategoryManage/CategoryManage';
import TagManage from './pages/admin/TagManage/TagManage';
import Settings from './pages/admin/Settings/Settings';
import AboutManage from './pages/admin/AboutManage/AboutManage';
import ProjectManage from './pages/admin/ProjectManage/ProjectManage';
import DiaryManage from './pages/admin/DiaryManage/DiaryManage';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  useThemeStore();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="article/:slug" element={<ArticleDetail />} />
        <Route path="article/" element={<NotFound />} />
        <Route path="category" element={<Category />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="tag" element={<TagList />} />
        <Route path="tag/:slug" element={<Tag />} />
        <Route path="archive" element={<Archive />} />
        <Route path="archive/:year/:month" element={<Archive />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="diary" element={<Diary />} />
      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        <Route index element={<ArticleList />} />
        <Route path="articles" element={<ArticleList />} />
        <Route path="articles/new" element={<ArticleEdit />} />
        <Route path="articles/:id/edit" element={<ArticleEdit />} />
        <Route path="categories" element={<CategoryManage />} />
        <Route path="tags" element={<TagManage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about-content" element={<AboutManage />} />
        <Route path="project-content" element={<ProjectManage />} />
        <Route path="diaries" element={<DiaryManage />} />
      </Route>
    </Routes>
  );
}

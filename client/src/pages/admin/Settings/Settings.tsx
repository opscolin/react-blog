import { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import type { Settings } from '../../../types';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    blogTitle: '',
    blogLogo: '',
    paginationSize: 10,
    aboutContent: '',
    menuVisibility: { categories: true, tags: true, archives: true, about: true, diary: true }
  });
  const [aiConfig, setAiConfig] = useState({ api_key: '', base_url: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo', enabled: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      setSettings({
        blogTitle: res.data.blogTitle || '',
        blogLogo: res.data.blogLogo || '',
        paginationSize: res.data.paginationSize || 10,
        aboutContent: res.data.aboutContent || '',
        menuVisibility: res.data.menuVisibility || {
          categories: true,
          tags: true,
          archives: true,
          about: true,
          diary: true
        }
      });
      api.get('/admin/ai-config').then(res => setAiConfig(res.data));
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      await api.put('/admin/ai-config', aiConfig);
      showToast('设置已保存', 'success');
    } catch {
      showToast('保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleMenu = (key: keyof Settings['menuVisibility']) => {
    setSettings(prev => ({
      ...prev,
      menuVisibility: {
        ...prev.menuVisibility,
        [key]: !prev.menuVisibility[key]
      }
    }));
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="settings-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <h1>博客设置</h1>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>博客标题</label>
          <input
            type="text"
            className="input"
            value={settings.blogTitle}
            onChange={e => setSettings(prev => ({ ...prev, blogTitle: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="text"
            className="input"
            value={settings.blogLogo}
            onChange={e => setSettings(prev => ({ ...prev, blogLogo: e.target.value }))}
            placeholder="/images/logo.svg"
          />
        </div>
        <div className="form-group">
          <label>每页文章数</label>
          <select
            className="input"
            value={settings.paginationSize}
            onChange={e => setSettings(prev => ({ ...prev, paginationSize: Number(e.target.value) }))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="form-group">
          <label>关于页面内容 (支持 Markdown)</label>
          <textarea
            className="input textarea-about"
            value={settings.aboutContent}
            onChange={e => setSettings(prev => ({ ...prev, aboutContent: e.target.value }))}
            rows={10}
          />
        </div>
        <div className="form-group">
          <label>菜单显示</label>
          <div className="menu-toggles">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={settings.menuVisibility.categories}
                onChange={() => toggleMenu('categories')}
              />
              <span>分类</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={settings.menuVisibility.tags}
                onChange={() => toggleMenu('tags')}
              />
              <span>标签</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={settings.menuVisibility.archives}
                onChange={() => toggleMenu('archives')}
              />
              <span>归档</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={settings.menuVisibility.about}
                onChange={() => toggleMenu('about')}
              />
              <span>关于</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={settings.menuVisibility.diary}
                onChange={() => toggleMenu('diary')}
              />
              <span>日记</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>AI 配置</label>
          <div className="ai-config">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={aiConfig.enabled}
                onChange={e => setAiConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              />
              <span>启用 AI 分析</span>
            </label>
            <div className="ai-config-fields">
              <input
                type="password"
                className="input"
                placeholder="API Key"
                value={aiConfig.api_key}
                onChange={e => setAiConfig(prev => ({ ...prev, api_key: e.target.value }))}
              />
              <input
                type="text"
                className="input"
                placeholder="Base URL (默认: https://api.openai.com/v1)"
                value={aiConfig.base_url}
                onChange={e => setAiConfig(prev => ({ ...prev, base_url: e.target.value }))}
              />
              <select
                className="input"
                value={aiConfig.model}
                onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </form>
    </div>
  );
}

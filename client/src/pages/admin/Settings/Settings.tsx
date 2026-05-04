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
    menuVisibility: { categories: true, tags: true, archives: true, about: true },
    enable_banner_carousel: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [menus, setMenus] = useState<Record<string, any>>({});
  const [editDialog, setEditDialog] = useState<{ key: string; name: string; path: string; visible: boolean; children: { name: string; path: string }[] } | null>(null);

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
          about: true
        },
        enable_banner_carousel: res.data.enable_banner_carousel !== false
      });
      if (res.data.navigation_menus) {
        setMenus(res.data.navigation_menus);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', { ...settings, navigation_menus: menus });
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

  const openAddMenu = () => {
    setEditDialog({ key: '', name: '', path: '', visible: true, children: [] });
  };

  const openEditMenu = (key: string, menu: any) => {
    setEditDialog({
      key,
      name: key,
      path: menu.path || '',
      visible: menu.visible !== false,
      children: (menu.children || []).map((c: any) => ({ name: c.name, path: c.path }))
    });
  };

  const saveMenu = () => {
    if (!editDialog || !editDialog.name.trim()) return;
    const newMenus = { ...menus };
    if (editDialog.key && editDialog.key !== editDialog.name) {
      delete newMenus[editDialog.key];
    }
    newMenus[editDialog.name] = {
      path: editDialog.path || null,
      visible: editDialog.visible,
      children: editDialog.children.length > 0 ? editDialog.children : undefined
    };
    setMenus(newMenus);
    setEditDialog(null);
  };

  const deleteMenu = (key: string) => {
    const newMenus = { ...menus };
    delete newMenus[key];
    setMenus(newMenus);
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
          </div>
        </div>
        <div className="form-group">
          <label>轮播封面</label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={settings.enable_banner_carousel !== false}
              onChange={e => setSettings(prev => ({ ...prev, enable_banner_carousel: e.target.checked }))}
            />
            <span>启用轮播封面展示</span>
          </label>
        </div>
        <div className="form-group">
          <label>导航菜单配置</label>
          <div className="menu-editor">
            <button type="button" className="btn btn-secondary" onClick={openAddMenu}>+ 添加菜单项</button>
            <div className="menu-tree">
              {Object.entries(menus).map(([key, menu]) => (
                <div key={key} className="menu-tree-item">
                  <div className="menu-tree-row">
                    {menu.children ? (
                      <span className="menu-toggle-icon">▾</span>
                    ) : (
                      <span className="menu-toggle-icon menu-toggle-icon-placeholder" />
                    )}
                    <span className={`menu-tree-label ${menu.visible === false ? 'menu-hidden' : ''}`}>
                      {key}
                    </span>
                    <span className="menu-tree-path">{menu.path || ''}</span>
                    <button type="button" className="action-link" onClick={() => openEditMenu(key, menu)}>编辑</button>
                    <button type="button" className="action-link danger" onClick={() => deleteMenu(key)}>删除</button>
                  </div>
                  {menu.children && (
                    <div className="menu-tree-children">
                      {menu.children.map((child: any, idx: number) => (
                        <div key={idx} className="menu-tree-row menu-tree-child">
                          <span className="menu-toggle-icon" />
                          <span className="menu-tree-label">└─ {child.name}</span>
                          <span className="menu-tree-path">{child.path}</span>
                          <button
                            type="button"
                            className="action-link danger"
                            onClick={() => {
                              const newMenus = { ...menus };
                              const updatedChildren = [...(newMenus[key].children || [])];
                              updatedChildren.splice(idx, 1);
                              newMenus[key] = { ...newMenus[key], children: updatedChildren.length > 0 ? updatedChildren : undefined };
                              setMenus(newMenus);
                            }}
                          >删除</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </form>

      {editDialog && (
        <div className="modal-overlay" onClick={() => setEditDialog(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editDialog.key ? '编辑菜单项' : '添加菜单项'}</h3>
            <div className="form-group">
              <label>菜单名称</label>
              <input
                type="text"
                className="input"
                value={editDialog.name}
                onChange={e => setEditDialog({ ...editDialog, name: e.target.value })}
                placeholder="如：首页、文章"
              />
            </div>
            <div className="form-group">
              <label>菜单路径</label>
              <input
                type="text"
                className="input"
                value={editDialog.path}
                onChange={e => setEditDialog({ ...editDialog, path: e.target.value })}
                placeholder="如：/、/about（留空则无点击跳转）"
              />
            </div>
            <div className="form-group">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={editDialog.visible}
                  onChange={e => setEditDialog({ ...editDialog, visible: e.target.checked })}
                />
                <span>显示此菜单</span>
              </label>
            </div>
            <div className="form-group">
              <label>子菜单</label>
              {editDialog.children.map((child, idx) => (
                <div key={idx} className="menu-child-row">
                  <input
                    type="text"
                    className="input"
                    value={child.name}
                    onChange={e => {
                      const children = [...editDialog.children];
                      children[idx] = { ...children[idx], name: e.target.value };
                      setEditDialog({ ...editDialog, children });
                    }}
                    placeholder="子菜单名称"
                  />
                  <input
                    type="text"
                    className="input"
                    value={child.path}
                    onChange={e => {
                      const children = [...editDialog.children];
                      children[idx] = { ...children[idx], path: e.target.value };
                      setEditDialog({ ...editDialog, children });
                    }}
                    placeholder="路径"
                  />
                  <button
                    type="button"
                    className="action-link danger"
                    onClick={() => {
                      const children = editDialog.children.filter((_, i) => i !== idx);
                      setEditDialog({ ...editDialog, children });
                    }}
                  >×</button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditDialog({ ...editDialog, children: [...editDialog.children, { name: '', path: '' }] })}
              >
                + 添加子菜单
              </button>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={saveMenu}>保存</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditDialog(null)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

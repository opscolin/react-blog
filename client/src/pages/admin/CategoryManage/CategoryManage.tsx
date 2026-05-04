import { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import type { Category } from '../../../types';
import './CategoryManage.css';

export default function CategoryManage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [cover, setCover] = useState('');
  const [isBanner, setIsBanner] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    api.get('/admin/categories').then(res => {
      setCategories(res.data);
    }).finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, { name, cover: cover || null, is_banner: isBanner });
        showToast('分类已更新', 'success');
      } else {
        await api.post('/admin/categories', { name, cover: cover || null, is_banner: isBanner });
        showToast('分类已添加', 'success');
      }
      resetForm();
      loadCategories();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setCover(cat.cover || '');
    setIsBanner(cat.is_banner || false);
    setEditingId(cat.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      showToast('分类已删除', 'success');
      loadCategories();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  const resetForm = () => {
    setName('');
    setCover('');
    setIsBanner(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="category-manage-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <h1>分类管理</h1>
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-row">
          <input
            type="text"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="分类名称"
          />
          <input
            type="text"
            className="input"
            value={cover}
            onChange={e => setCover(e.target.value)}
            placeholder="封面 URL"
          />
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={isBanner}
              onChange={e => setIsBanner(e.target.checked)}
            />
            <span>轮播封面</span>
          </label>
          <button type="submit" className="btn btn-primary">
            {editingId ? '更新' : '添加'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">取消</button>
          )}
        </div>
      </form>
      <table className="category-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>封面</th>
            <th>轮播</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                {cat.cover ? (
                  <img src={cat.cover} alt="" className="category-cover-thumb" />
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>{cat.is_banner ? '✓' : '-'}</td>
              <td>
                <button onClick={() => handleEdit(cat)} className="action-link">编辑</button>
                <button onClick={() => handleDelete(cat.id)} className="action-link danger">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

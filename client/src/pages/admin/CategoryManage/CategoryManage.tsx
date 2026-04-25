import { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import type { Category } from '../../../types';
import './CategoryManage.css';

export default function CategoryManage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
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
        await api.put(`/admin/categories/${editingId}`, { name });
        showToast('分类已更新', 'success');
      } else {
        await api.post('/admin/categories', { name });
        showToast('分类已添加', 'success');
      }
      setName('');
      setEditingId(null);
      loadCategories();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
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
        <input
          type="text"
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="分类名称"
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? '更新' : '添加'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setEditingId(null); }} className="btn btn-secondary">
            取消
          </button>
        )}
      </form>
      <table className="category-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
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

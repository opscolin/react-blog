import { useState, useEffect, useCallback } from 'react';
import api from '../../../api';
import type { Tag } from '../../../types';
import './TagManage.css';

export default function TagManage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = () => {
    setLoading(true);
    api.get('/admin/tags').then(res => {
      setTags(res.data);
    }).finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/admin/tags/${editingId}`, { name });
        showToast('标签已更新', 'success');
      } else {
        await api.post('/admin/tags', { name });
        showToast('标签已添加', 'success');
      }
      setName('');
      setEditingId(null);
      loadTags();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleEdit = (tag: Tag) => {
    setName(tag.name);
    setEditingId(tag.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/tags/${id}`);
      showToast('标签已删除', 'success');
      loadTags();
    } catch {
      showToast('删除失败', 'error');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="tag-manage-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <h1>标签管理</h1>
      <form onSubmit={handleSubmit} className="tag-form">
        <input
          type="text"
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="标签名称"
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
      <table className="tag-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {tags.map(tag => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td>
                <button onClick={() => handleEdit(tag)} className="action-link">编辑</button>
                <button onClick={() => handleDelete(tag.id)} className="action-link danger">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

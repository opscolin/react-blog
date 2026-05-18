import { useState, useEffect } from 'react';
import api from '../../../api';
import './DiaryManage.css';

interface Diary {
  id: number;
  title: string;
  content: string;
  tags: string[];
  type: 'diary' | 'ai';
  created_at: string;
  updated_at: string;
}

export default function DiaryManage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    setLoading(true);
    const res = await api.get('/admin/diaries');
    setDiaries(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(/[,，\s]+/).filter(t => t.trim());
    if (editingDiary) {
      await api.put(`/admin/diaries/${editingDiary.id}`, { ...formData, tags });
    } else {
      await api.post('/admin/diaries', { ...formData, tags });
    }
    setIsModalOpen(false);
    setEditingDiary(null);
    setFormData({ title: '', content: '', tags: '' });
    loadDiaries();
  };

  const handleEdit = (diary: Diary) => {
    setEditingDiary(diary);
    setFormData({ title: diary.title, content: diary.content, tags: diary.tags.join(', ') });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这篇日记吗？')) {
      await api.delete(`/admin/diaries/${id}`);
      loadDiaries();
    }
  };

  const handleAnalyze = async () => {
    if (!confirm('确定要触发AI分析吗？这将分析最近10篇日记并生成洞察。')) return;
    try {
      await api.post('/ai-analysis/analyze');
      alert('AI分析完成！请刷新页面查看结果。');
      loadDiaries();
    } catch (error: any) {
      alert(error.response?.data?.error || 'AI分析失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="diary-manage">
      <header className="diary-manage-header">
        <h1>日记管理</h1>
        <div className="diary-manage-actions">
          <button className="btn-secondary" onClick={handleAnalyze}>触发AI分析</button>
          <button className="btn-primary" onClick={() => { setEditingDiary(null); setFormData({ title: '', content: '', tags: '' }); setIsModalOpen(true); }}>
            新增日记
          </button>
        </div>
      </header>

      <div className="diary-list">
        {diaries.map(diary => (
          <div key={diary.id} className={`diary-item ${diary.type === 'ai' ? 'ai-item' : ''}`}>
            <div className="diary-item-content">
              <h3>{diary.title}</h3>
              <p>{diary.content.substring(0, 100)}...</p>
              <div className="diary-item-meta">
                <span className="date">{new Date(diary.created_at).toLocaleString('zh-CN')}</span>
                <span className={`type-badge ${diary.type}`}>{diary.type === 'ai' ? 'AI洞察' : '日记'}</span>
                {diary.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
              </div>
            </div>
            <div className="diary-item-actions">
              {diary.type !== 'ai' && (
                <button onClick={() => handleEdit(diary)}>编辑</button>
              )}
              <button onClick={() => handleDelete(diary.id)} className="delete-btn">删除</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingDiary ? '编辑日记' : '新增日记'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>内容</label>
                <textarea
                  className="input"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>标签（用逗号分隔）</label>
                <input
                  type="text"
                  className="input"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="工作, 生活, 感悟"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>取消</button>
                <button type="submit" className="btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
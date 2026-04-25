import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api';
import type { Category, Tag } from '../../../types';
import Modal from '../../../components/Modal/Modal';
import './ArticleEdit.css';

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/admin/categories'),
      api.get('/admin/tags')
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.data);
      setTags(tagRes.data);
    });

    if (isEdit && id) {
      api.get(`/admin/articles/${id}`).then(res => {
        const article = res.data;
        setTitle(article.title);
        setContent(article.content);
        setExcerpt(article.excerpt || '');
        setCreatedAt(article.created_at ? article.created_at.slice(0, 16) : '');
        setCategoryId(article.category_id);
        setTagIds(article.tags.map((t: Tag) => t.id));
        setStatus(article.status);
      }).finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { title, content, excerpt, categoryId, tags: tagIds, status, createdAt };
      if (isEdit && id) {
        await api.put(`/admin/articles/${id}`, data);
      } else {
        await api.post('/admin/articles', data);
      }
      navigate('/admin/dashboard/articles');
    } catch (err) {
      showToast('保存失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await api.post('/admin/categories', { name: newCategoryName });
      setCategories([...categories, res.data]);
      setCategoryId(res.data.id);
      setNewCategoryName('');
      setShowCategoryModal(false);
      showToast('分类已创建', 'success');
    } catch {
      showToast('创建失败', 'error');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const res = await api.post('/admin/tags', { name: newTagName });
      setTags([...tags, res.data]);
      setTagIds([...tagIds, res.data.id]);
      setNewTagName('');
      setShowTagModal(false);
      showToast('标签已创建', 'success');
    } catch {
      showToast('创建失败', 'error');
    }
  };

  if (initialLoading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="article-edit-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <div className="page-header">
        <h1>{isEdit ? '编辑文章' : '新建文章'}</h1>
        <Link to="/admin/dashboard/articles" className="btn btn-secondary">返回</Link>
      </div>
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>内容 (Markdown)</label>
          <textarea
            className="input"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={15}
            required
          />
        </div>
        <div className="form-group">
          <label>摘要</label>
          <input
            type="text"
            className="input"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="form-label-row">
              <label>分类</label>
              <button type="button" className="btn-link" onClick={() => setShowCategoryModal(true)}>+ 新建</button>
            </div>
            <select
              className="input"
              value={categoryId || ''}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">请选择</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
          <div className="form-group">
            <label>发布时间</label>
            <input
              type="datetime-local"
              className="input"
              value={createdAt}
              onChange={e => setCreatedAt(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>状态</label>
            <select
              className="input"
              value={status}
              onChange={e => setStatus(e.target.value as 'draft' | 'published')}
            >
              <option value="draft">草稿</option>
              <option value="published">发布</option>
            </select>
          </div>
        </div>
        </div>
        <div className="form-group">
          <div className="form-label-row">
            <label>标签</label>
            <button type="button" className="btn-link" onClick={() => setShowTagModal(true)}>+ 新建</button>
          </div>
          <div className="tag-selector">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                className={`tag-btn ${tagIds.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>

      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="新建分类">
        <div className="modal-form">
          <input
            type="text"
            className="input"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="分类名称"
          />
          <button className="btn btn-primary" onClick={handleCreateCategory}>创建</button>
        </div>
      </Modal>

      <Modal isOpen={showTagModal} onClose={() => setShowTagModal(false)} title="新建标签">
        <div className="modal-form">
          <input
            type="text"
            className="input"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            placeholder="标签名称"
          />
          <button className="btn btn-primary" onClick={handleCreateTag}>创建</button>
        </div>
      </Modal>
    </div>
  );
}

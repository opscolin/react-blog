import { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import api from '../../../api';
import './AboutManage.css';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function AboutManage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((res) => {
        setContent(res.data.aboutContent || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const html = useMemo(() => marked(content) as string, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', { aboutContent: content });
      showToast('已保存', 'success');
    } catch {
      showToast('保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="content-editor-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <div className="editor-header">
        <h1>关于页面</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
      <div className="editor-panels">
        <div className="editor-panel editor-panel-left">
          <textarea
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此输入 Markdown 内容..."
          />
        </div>
        <div className="editor-panel editor-panel-right">
          <div className="editor-preview markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}

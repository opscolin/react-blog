import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import api from '../../api';
import './About.css';

marked.setOptions({
  gfm: true,
  breaks: true
});

marked.use({
  hooks: {
    postprocess(html) {
      return html.replace(/<input type="checkbox"(.*?)>/g, (_, attrs) => {
        const cleaned = attrs.replace(/\s*disabled\s*/g, '');
        return `<input type="checkbox"${cleaned} class="task-list-item-checkbox">`;
      });
    }
  }
});

export default function About() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/settings').then(res => {
      setContent(res.data.aboutContent || '暂无关于内容');
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!content || loading) return;
    const STORAGE_KEY = 'about-checkbox-state';
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const container = contentRef.current;
    if (!container) return;

    const checkboxes = container.querySelectorAll<HTMLInputElement>('input.task-list-item-checkbox');
    checkboxes.forEach((cb, i) => {
      cb.checked = saved[i] ?? cb.hasAttribute('checked');
      cb.addEventListener('change', () => {
        saved[i] = cb.checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      });
    });
  }, [content, loading]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const html = marked(content) as string;

  return (
    <div className="about-page">
      <h1 className="page-title">关于</h1>
      <div ref={contentRef} className="about-content markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
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
      html = html.replace(
        /<input([^>]*?)type="checkbox"([^>]*?)>/g,
        (_, before, after) => {
          const attrs = (before + ' ' + after).replace(/\s*disabled(?:="")?\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
          return '<input type="checkbox" class="task-list-item-checkbox"' + (attrs ? ' ' + attrs : '') + '>';
        }
      );
      html = html.replace(
        /<li>\s*(<input[^>]*class="task-list-item-checkbox"[^>]*>)/g,
        '<li class="task-list-item">$1'
      );
      html = html.replace(
        /<(ul|ol)>\s*(<li class="task-list-item")/g,
        '<$1 class="contains-task-list">$2'
      );
      return html;
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

  const html = useMemo(() => marked(content) as string, [content]);

  useEffect(() => {
    if (!content || loading) return;
    const STORAGE_KEY = 'about-checkbox-state';
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const container = contentRef.current;
    if (!container) return;

    const checkboxes = container.querySelectorAll<HTMLInputElement>('input.task-list-item-checkbox');
    const cleanupFns: (() => void)[] = [];
    checkboxes.forEach((cb, i) => {
      cb.checked = saved[i] ?? cb.hasAttribute('checked');
      const handler = () => {
        saved[i] = cb.checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      };
      cb.addEventListener('change', handler);
      cleanupFns.push(() => cb.removeEventListener('change', handler));
    });
    return () => cleanupFns.forEach(fn => fn());
  }, [content, loading]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

return (
    <main className="about-page">
      <article className="about-content markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

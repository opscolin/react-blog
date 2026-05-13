import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import dayjs from 'dayjs';
import api from '../../api';
import type { Article } from '../../types';
import './ArticleDetail.css';

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
  },
  renderer: {
    code(code: string, infostring?: string): string {
      const lang = infostring || 'plaintext';
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(code, { language }).value;
      const copyBtn = `<div class="code-wrapper"><button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').innerText);this.innerHTML='<svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><polyline points=\\'20 6 9 17 4 12\\'/></svg>';setTimeout(()=>this.innerHTML='<svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><rect x=\\'9\\' y=\\'9\\' width=\\'13\\' height=\\'13\\' rx=\\'2\\' ry=\\'2\\'/><path d=\\'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1\\'/></svg>',2000)" title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button><pre class="code-block"><code class="hljs language-${language}">${highlighted}</code></pre></div>`;
      return `<div class="code-window"><div class="code-window-header"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="code-lang">${language}</span></div>${copyBtn}</div>`;
    }
  }
});

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/articles/${slug}`)
      .then(res => {
        setArticle(res.data);
        document.title = `${res.data.title} - ${document.title}`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', res.data.excerpt || res.data.title);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!article || loading) return;
    const STORAGE_KEY = `article-checkbox-state-${slug}`;
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
  }, [article, loading, slug]);

  const html = useMemo(() => {
    if (!article) return '';
    return marked(article.content) as string;
  }, [article]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!article) {
    return <div className="not-found">文章不存在</div>;
  }

  return (
    <article className="article-detail">
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-date">{dayjs(article.created_at).format('YYYY-MM-DD')}</span>
          <span className="article-views">
            <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {article.view_count || 0} 次阅读
          </span>
          {article.category && (
            <Link to={`/category/${article.category.slug}`} className="article-category">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {article.category.name}
            </Link>
          )}
          {article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.map(tag => (
                <Link key={tag.id} to={`/tag/${tag.name}`} className="article-tag">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      <div ref={contentRef} className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

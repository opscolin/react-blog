import { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import api from '../../api';
import './Projects.css';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function Projects() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        setContent(res.data.projectContent || '暂无项目内容');
      })
      .finally(() => setLoading(false));
  }, []);

  const html = useMemo(() => marked(content) as string, [content]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <main className="projects-page">
      <article className="projects-content markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

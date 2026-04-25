import { useState, useEffect } from 'react';
import { marked } from 'marked';
import api from '../../api';
import './About.css';

marked.setOptions({
  gfm: true,
  breaks: true
});

export default function About() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings').then(res => {
      setContent(res.data.aboutContent || '暂无关于内容');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const html = marked(content) as string;

  return (
    <div className="about-page">
      <h1 className="page-title">关于</h1>
      <div className="about-content markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

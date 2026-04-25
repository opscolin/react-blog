import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import type { Article } from '../../types';
import './Archive.css';

export default function Archive() {
  const { year, month } = useParams();
  const [archives, setArchives] = useState<Record<string, Record<string, Article[]>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/archives')
      .then(res => setArchives(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  const years = Object.keys(archives).sort((a, b) => parseInt(b) - parseInt(a));

  if (year && month) {
    const articles = archives[year]?.[month] || [];
    return (
      <div className="archive-page">
        <div className="archive-header">
          <Link to="/archive" className="archive-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回归档
          </Link>
          <h1 className="archive-title">{year}年{parseInt(month)}月</h1>
        </div>
        <div className="archive-list">
          {articles.map(article => {
            const date = new Date(article.created_at);
            return (
              <Link key={article.id} to={`/article/${article.slug}`} className="archive-item">
                <span className="archive-date">
                  {String(date.getMonth() + 1).padStart(2, '0')}-{String(date.getDate()).padStart(2, '0')}
                </span>
                <span className="archive-title-text">{article.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <h1 className="archive-title">文章归档</h1>
      <div className="archive-container">
        {years.map(y => (
          <div key={y} className="archive-year-row">
            <div className="archive-year">{y}</div>
            <div className="archive-articles">
              {Object.keys(archives[y]).sort((a, b) => parseInt(b) - parseInt(a)).map(m => (
                archives[y][m].map(article => {
                  const date = new Date(article.created_at);
                  return (
                    <Link key={article.id} to={`/article/${article.slug}`} className="archive-article-row">
                      <span className="archive-mm-dd">
                        {String(date.getMonth() + 1).padStart(2, '0')}-{String(date.getDate()).padStart(2, '0')}
                      </span>
                      <span className="archive-article-title">{article.title}</span>
                    </Link>
                  );
                })
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

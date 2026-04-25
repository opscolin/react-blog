import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import type { Tag } from '../../types';
import './TagList.css';

export default function TagList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/tags')
      .then(res => setTags(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="tag-list-page">
      <h1 className="page-title">标签列表</h1>
      <div className="tag-cloud">
        {tags.length > 0 ? (
          tags.map(tag => (
            <Link key={tag.id} to={`/tag/${tag.name}`} className="tag-item">
              <span className="tag-name">{tag.name}</span>
              <span className="tag-count">{tag.article_count || 0}</span>
            </Link>
          ))
        ) : (
          <p className="empty">暂无标签</p>
        )}
      </div>
    </div>
  );
}

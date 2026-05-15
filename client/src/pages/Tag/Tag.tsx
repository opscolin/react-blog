import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Article, Tag as TagType, Pagination as PaginationType } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Pagination from '../../components/Pagination/Pagination';
import './Tag.css';

export default function Tag() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [tag, setTag] = useState<TagType | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/articles', { params: { page, limit: 10, tag: slug } })
      .then(res => {
        setArticles(res.data.articles);
        setPagination(res.data.pagination);
        if (res.data.articles.length > 0) {
          const foundTag = res.data.articles[0].tags.find((t: TagType) => t.name === slug);
          if (foundTag) setTag(foundTag);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, page]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <main className="tag-page">
      <h1 className="page-title">标签: {tag?.name || slug}</h1>
      <section className="article-list">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="empty">暂无文章</p>
        )}
      </section>
      {pagination && (
        <Pagination page={page} totalPages={pagination.totalPages} basePath={`/tag/${slug}`} />
      )}
    </main>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Article, Pagination as PaginationType } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Pagination from '../../components/Pagination/Pagination';
import './Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || undefined;
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/articles', { params: { page, limit: 10, search } })
      .then(res => {
        setArticles(res.data.articles);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="home">
      <h1 className="page-title">{search ? `搜索结果: "${search}"` : '文章列表'}</h1>
      <div className="article-list">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="empty">暂无文章</p>
        )}
      </div>
      {pagination && (
        <Pagination page={page} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}

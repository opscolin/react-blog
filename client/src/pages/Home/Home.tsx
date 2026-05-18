import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Article, Pagination as PaginationType } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Pagination from '../../components/Pagination/Pagination';
import CategoryScroll from '../../components/CategoryScroll/CategoryScroll';
import './Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || undefined;
  const currentCategory = searchParams.get('category') || undefined;
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/articles', { params: { page, limit: 10, search, category: currentCategory } })
      .then(res => {
        setArticles(res.data.articles);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, search, currentCategory]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <main className="home">
      {categories.length > 0 && (
        <CategoryScroll categories={categories} />
      )}
      <section className="article-list">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="empty">暂无文章</p>
        )}
      </section>
      {pagination && pagination.totalPages > 1 && (
        <Pagination pagination={pagination} />
      )}
    </main>
  );
}

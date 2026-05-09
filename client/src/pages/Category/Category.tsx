import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../../api';
import type { Article, Category, Pagination as PaginationType } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Pagination from '../../components/Pagination/Pagination';
import './Category.css';

export default function Category() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setCategory(null);
    if (slug) {
      api.get('/articles', { params: { page, limit: 10, category: slug } })
        .then(res => {
          setArticles(res.data.articles);
          setPagination(res.data.pagination);
          if (res.data.articles.length > 0 && res.data.articles[0].category) {
            setCategory(res.data.articles[0].category);
          }
          setCategories([]);
        })
        .finally(() => setLoading(false));
    } else {
      api.get('/categories').then(res => {
        setCategories(res.data);
        setArticles([]);
        setPagination(null);
      }).finally(() => setLoading(false));
    }
  }, [slug, page]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!slug) {
    return (
      <div className="category-page">
        <h1 className="page-title">分类列表</h1>
        <div className="category-cloud">
          {categories.length > 0 ? (
            categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="category-item">
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.article_count || 0}</span>
              </Link>
            ))
          ) : (
            <p className="empty">暂无分类</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <h1 className="page-title">分类: {category?.name || slug}</h1>
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
        <Pagination page={page} totalPages={pagination.totalPages} basePath={`/category/${slug}`} />
      )}
    </div>
  );
}

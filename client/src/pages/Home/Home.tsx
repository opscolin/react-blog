import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Article } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadArticles = useCallback((pageNum: number, searchTerm?: string, reset = false) => {
    if (loading) return;
    setLoading(true);
    api.get('/articles', { params: { page: pageNum, limit: 10, search: searchTerm } })
      .then(res => {
        const newArticles = res.data.articles as Article[];
        if (reset) {
          setArticles(newArticles);
        } else {
          setArticles(prev => [...prev, ...newArticles]);
        }
        setHasMore(newArticles.length > 0 && pageNum < (res.data.pagination?.totalPages ?? 1));
      })
      .finally(() => setLoading(false));
  }, [loading]);

  useEffect(() => {
    setArticles([]);
    setHasMore(true);
    loadArticles(1, search, true);
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadArticles(nextPage, search);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, page, search, loadArticles]);

  if (loading && articles.length === 0) {
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
      <div ref={loadMoreRef} className="load-more">
        {loading && articles.length > 0 && <span className="loading-text">加载中...</span>}
        {!hasMore && articles.length > 0 && <span className="no-more">没有更多文章了</span>}
      </div>
    </div>
  );
}
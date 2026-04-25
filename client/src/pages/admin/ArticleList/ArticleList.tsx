import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api';
import type { Article, Pagination as PaginationType } from '../../../types';
import dayjs from 'dayjs';
import './ArticleList.css';

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/articles', { params: { page, limit: 10 } })
      .then(res => {
        setArticles(res.data.articles);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
      showToast('删除成功', 'success');
    } catch {
      showToast('删除失败', 'error');
    }
  };

  return (
    <div className="article-list-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <div className="page-header">
        <h1>文章管理</h1>
        <Link to="/admin/dashboard/articles/new" className="btn btn-primary">新建文章</Link>
      </div>
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <table className="article-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>分类</th>
                <th>状态</th>
                <th>日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.category?.name || '-'}</td>
                  <td>
                    <span className={`status-badge ${article.status}`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td>{dayjs(article.created_at).format('YYYY-MM-DD')}</td>
                  <td>
                    <Link to={`/admin/dashboard/articles/${article.id}/edit`} className="action-link">编辑</Link>
                    <button onClick={() => handleDelete(article.id)} className="action-link danger">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              {page > 1 && (
                <button onClick={() => setSearchParams({ page: String(page - 1) })} className="btn btn-secondary">
                  上一页
                </button>
              )}
              <span>{page} / {pagination.totalPages}</span>
              {page < pagination.totalPages && (
                <button onClick={() => setSearchParams({ page: String(page + 1) })} className="btn btn-secondary">
                  下一页
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

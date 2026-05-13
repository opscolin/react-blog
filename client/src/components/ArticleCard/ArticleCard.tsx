import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Article } from '../../types';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <Link to={`/article/${article.slug}`} className="article-card-link">
        <h2 className="article-card-title">{article.title}</h2>
        <p className="article-card-excerpt">{article.excerpt}</p>
      </Link>
      <div className="article-card-meta">
        <span className="article-card-date">
          {dayjs(article.created_at).format('YYYY-MM-DD')}
        </span>
        <span className="article-card-views">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {article.view_count || 0}
        </span>
        {article.category && (
          <Link to={`/category/${article.category.slug}`} className="article-card-category">
            <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {article.category.name}
          </Link>
        )}
        {article.tags.length > 0 && (
          <div className="article-card-tags">
            {article.tags.slice(0, 3).map(tag => (
              <Link key={tag.id} to={`/tag/${tag.name}`} className="article-card-tag">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

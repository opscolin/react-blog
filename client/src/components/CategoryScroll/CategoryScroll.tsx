import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Category } from '../../types';
import './CategoryScroll.css';

interface CategoryScrollProps {
  categories: Category[];
}

export default function CategoryScroll({ categories }: CategoryScrollProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleCategoryClick = (slug: string) => {
    navigate(`/?category=${slug}`);
  };

  return (
    <div className="category-scroll">
      <div className="category-scroll-inner">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-chip ${currentCategory === cat.slug ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.name}
            <span className="category-count">({cat.article_count})</span>
          </button>
        ))}
      </div>
      <div className="category-scroll-hint">
        更多
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
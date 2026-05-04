import { Link } from 'react-router-dom';
import { Category } from '../../types';
import './CategorySlider.css';

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.category-slider-list');
    if (container) {
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="category-slider">
      <div className="category-slider-header">
        <Link to="/categories" className="category-slider-more">更多 ›</Link>
      </div>
      <div className="category-slider-wrapper">
        <button
          className="category-slider-btn category-slider-btn-left"
          onClick={() => scroll('left')}
          aria-label="向左滚动"
        >
          ‹
        </button>
        <div className="category-slider-list">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="category-slider-card"
            >
              <span className="category-slider-card-name">{category.name}</span>
              <span className="category-slider-card-count">
                {category.article_count ?? 0} 篇
              </span>
            </Link>
          ))}
        </div>
        <button
          className="category-slider-btn category-slider-btn-right"
          onClick={() => scroll('right')}
          aria-label="向右滚动"
        >
          ›
        </button>
      </div>
    </div>
  );
}
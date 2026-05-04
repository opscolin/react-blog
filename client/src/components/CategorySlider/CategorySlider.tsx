import { Link } from 'react-router-dom';
import { Category } from '../../types';
import './CategorySlider.css';

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <div className="category-slider">
      <div className="category-slider-wrapper">
        <div className="category-slider-list">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-slider-card"
            >
              <span className="category-slider-card-name">
                {category.name}
                <span className="category-slider-card-count">
                  ({category.article_count ?? 0})
                </span>
              </span>
            </Link>
          ))}
        </div>
        <Link to="/category" className="category-slider-more">更多 ›</Link>
      </div>
    </div>
  );
}

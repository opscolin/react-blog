import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BannerCategory } from '../../types';
import './BannerCarousel.css';

interface BannerCarouselProps {
  banners: BannerCategory[];
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [banners.length, goToNext]);

  const handleBannerClick = () => {
    const banner = banners[currentIndex];
    if (banner?.slug) {
      navigate(`/categories/${banner.slug}`);
    }
  };

  if (banners.length === 0) {
    return <div className="banner-carousel" />;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="banner-carousel">
      <div
        className="banner-carousel__image"
        style={{ backgroundImage: `url(${currentBanner.cover})` }}
        onClick={handleBannerClick}
      />
      <div className="banner-carousel__overlay">
        <h2 className="banner-carousel__category">{currentBanner.name}</h2>
        <h1 className="banner-carousel__title">
          {currentBanner.article?.title || ''}
        </h1>
      </div>

      {banners.length > 1 && (
        <>
          <button
            className="banner-carousel__btn banner-carousel__btn--prev"
            onClick={goToPrev}
          >
            ‹
          </button>
          <button
            className="banner-carousel__btn banner-carousel__btn--next"
            onClick={goToNext}
          >
            ›
          </button>
          <div className="banner-carousel__dots">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`banner-carousel__dot ${
                  idx === currentIndex ? 'banner-carousel__dot--active' : ''
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
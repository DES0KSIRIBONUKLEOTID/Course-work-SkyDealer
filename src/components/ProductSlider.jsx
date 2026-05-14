import React, { useState } from 'react';
import './ProductSlider.css'; 

const ProductSlider = ({ images }) => {
  // Стейт для відстеження поточного фото
  const [currentIndex, setCurrentIndex] = useState(0);

  // Функції перемикання
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Якщо фотографій немає показує заглушку
  if (!images || images.length === 0) return <div>Немає фото</div>;

  return (
    <div className="product-slider-container">
      {/* Головне велике фото */}
      <div className="main-image-wrapper">
        <button className="slider-btn prev" onClick={prevSlide}>❮</button>
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex}`} 
          className="main-image" 
        />
        <button className="slider-btn next" onClick={nextSlide}>❯</button>
      </div>

      {/* Мініатюри під головним фото */}
      <div className="thumbnails-wrapper">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${index === currentIndex ? 'active-thumb' : ''}`}
            onClick={() => setCurrentIndex(index)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
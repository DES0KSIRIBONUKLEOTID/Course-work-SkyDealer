import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductSlider from './ProductSlider';

const ProductPage = () => {
  const { id } = useParams(); 
  const [plane, setPlane] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функція для отримання даних конкретного літака
    const fetchPlane = async () => {
      try {
        const response = await fetch(`https://skydealer-backend.onrender.com${id}`);
        
        if (!response.ok) {
          throw new Error('Не вдалося завантажити дані про літак');
        }
        
        const data = await response.json();
        setPlane(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlane();
  }, [id]);

  if (loading) return <h2>Завантаження...</h2>;
  if (error) return <h2>Помилка: {error}</h2>;
  if (!plane) return <h2>Літак не знайдено</h2>;
 
  const sliderImages = plane.images && plane.images.length > 0 
    ? plane.images 
    : [plane.image];

  return (
    <div className="product-page">
      <div className="product-header">
        <h1>{plane.title}</h1>
      </div>

      <div className="product-content">
        {/* ЛІВА КОЛОНКА: Слайдер (Галерея) */}
        <div className="gallery-section">
          <ProductSlider images={sliderImages} />
        </div>

        {/* ПРАВА КОЛОНКА: Інформаційний блок */}
        <div className="info-section">
          <div className="price-block">
            <h2>${plane.price.toLocaleString()}</h2> 
            <span className="status-badge in-stock">
                {plane.status ? plane.status : 'В наявності'}
            </span>
          </div>

          <div className="specs-table">
            <h3>Технічні характеристики</h3>
            <ul>
              <li><strong>Виробник:</strong> {plane.manufacturer}</li>
              <li><strong>Рік випуску:</strong> {plane.year}</li>
              <li><strong>Категорія:</strong> {plane.category}</li>
              <li><strong>Макс. швидкість:</strong> {plane.specs?.speed || 'Не вказано'}</li>
              <li><strong>Дальність польоту:</strong> {plane.specs?.range || 'Не вказано'}</li>
              <li><strong>Кількість пасажирів:</strong> {plane.specs?.passengers || 'Не вказано'} чол.</li>
            </ul>
          </div>

          <div className="description-block">
            <h3>Опис</h3>
            <p>{plane.description}</p>
          </div>
          
          <button className="order-button">Залишити заявку</button>
        </div>
      </div>

      {/* НИЖНІЙ БЛОК: Схожі пропозиції */}
      <div className="similar-planes-section">
        
      </div>
    </div>
  );
};

export default ProductPage;
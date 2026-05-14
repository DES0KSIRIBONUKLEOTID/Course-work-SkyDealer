import React, { createContext, useState, useContext, useEffect } from 'react';

const PlaneContext = createContext(null);

export const PlaneProvider = ({ children }) => {
  const [planes, setPlanes] = useState([]);

  // 1. Завантаження даних з бекенду при старті
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/planes');
        const data = await response.json();
        
        const formattedData = data.map(plane => ({
          ...plane,
          id: plane._id 
        }));
        
        setPlanes(formattedData);
      } catch (error) {
        console.error("Помилка завантаження літаків з сервера:", error);
      }
    };

    fetchPlanes();
  }, []); 

  // 2. Додавання нового літака
  const addPlane = async (newPlane) => {
    try {
      const response = await fetch('http://localhost:5000/api/planes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlane)
      });
      const savedPlane = await response.json();
      
      savedPlane.id = savedPlane._id; 
      setPlanes([...planes, savedPlane]);
    } catch (error) {
      console.error("Помилка додавання літака:", error);
    }
  };

  // 3. Видалення літака
  const deletePlane = async (id) => {
    if(window.confirm("Ви впевнені, що хочете видалити цей літак?")) {
      try {
        await fetch(`http://localhost:5000/api/planes/${id}`, { method: 'DELETE' });
        setPlanes(planes.filter(p => p._id !== id && p.id !== id));
      } catch (error) {
        console.error("Помилка видалення літака:", error);
      }
    }
  };

  // 4. Оновлення літака (Редагування)
  const updatePlane = async (updatedPlane) => {
    try {
      const response = await fetch(`http://localhost:5000/api/planes/${updatedPlane._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlane)
      });
      const data = await response.json();
      
      // Оновлює стейт новим літаком з бази
      setPlanes(planes.map(p => (p._id === data._id ? data : p)));
    } catch (error) {
      console.error("Помилка оновлення літака:", error);
    }
  };

  return (
    <PlaneContext.Provider value={{ planes, addPlane, deletePlane, updatePlane }}>
      {children}
    </PlaneContext.Provider>
  );
};

export const usePlanes = () => useContext(PlaneContext);
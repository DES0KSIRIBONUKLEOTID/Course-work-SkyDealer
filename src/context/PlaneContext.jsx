import React, { createContext, useState, useContext, useEffect } from 'react';
import { planes as defaultPlanes } from '../data/planes';

const PlaneContext = createContext(null);

export const PlaneProvider = ({ children }) => {
  // Знаходження збережених літаків в LocalStorage
  const [planes, setPlanes] = useState(() => {
    const saved = localStorage.getItem('planesDataV5.1');
    return saved ? JSON.parse(saved) : defaultPlanes;
  });

  // коли planes змінюються зберігаємо їх у LocalStorage
  useEffect(() => {
    localStorage.setItem('planesDataV5.1', JSON.stringify(planes));
  }, [planes]);

  // Функція додавання
  const addPlane = (newPlane) => {
    setPlanes([...planes, newPlane]);
  };

  // Функція видалення
  const deletePlane = (id) => {
    setPlanes(planes.filter(p => p.id !== id));
  };

  // Функція редагування 
  const updatePlane = (updatedPlane) => {
    setPlanes(planes.map(p => (p.id === updatedPlane.id ? updatedPlane : p)));
  };

  return (
    <PlaneContext.Provider value={{ planes, addPlane, deletePlane, updatePlane }}>
      {children}
    </PlaneContext.Provider>
  );
};

export const usePlanes = () => useContext(PlaneContext);
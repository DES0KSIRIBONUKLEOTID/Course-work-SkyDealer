import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Завантажуємо юзера з пам'яті браузера
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Список ID обраних літаків
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('userFavorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // Зберігаємо юзера при змінах
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
  };

  // Оновлення профілю 
  const updateUserProfile = (newAvatarUrl) => {
    if (user) {

      setUser({ ...user, avatar: newAvatarUrl });
    }
  };

  const toggleFavorite = (planeId) => {
    if (!user) {
      alert("Будь ласка, увійдіть в систему, щоб додавати в обране!");
      return;
    }
    if (favorites.includes(planeId)) {
      setFavorites(favorites.filter(id => id !== planeId));
    } else {
      setFavorites([...favorites, planeId]);
    }
  };

  return (

    <AuthContext.Provider value={{ user, login, logout, favorites, toggleFavorite, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Відновлення сесії з бекенду при оновленні сторінки 
  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://skydealer-backend.onrender.com/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFavorites(data.favorites || []);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Помилка відновлення сесії:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://skydealer-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user); 
        setFavorites(data.user.favorites || []); // Беремо обране з бази
        localStorage.setItem('token', data.token); 
        return { success: true };
      } else {
        return { success: false, error: data.error }; 
      }
    } catch (error) {
      return { success: false, error: "Помилка підключення до сервера" };
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('token'); 
  };

  // функція для відправки змін у MongoDB
  const syncProfileWithServer = async (updatedData) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://skydealer-backend.onrender.com/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
    } catch (error) {
      console.error("Помилка збереження на сервері", error);
    }
  };

  // Оновлення профілю (ПФП)
  const updateUserProfile = (newAvatarUrl) => {
    if (user) {
      setUser({ ...user, avatar: newAvatarUrl });
      // Відправляємо новий аватар в БД
      syncProfileWithServer({ avatar: newAvatarUrl }); 
    }
  };

  // Оновлення обраного
  const toggleFavorite = (planeId) => {
    if (!user) {
      alert("Будь ласка, увійдіть в систему, щоб додавати в обране!");
      return;
    }

    let newFavorites;
    if (favorites.includes(planeId)) {
      newFavorites = favorites.filter(id => id !== planeId);
    } else {
      newFavorites = [...favorites, planeId];
    }

    setFavorites(newFavorites);
    syncProfileWithServer({ favorites: newFavorites }); 
  };

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, favorites, toggleFavorite, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
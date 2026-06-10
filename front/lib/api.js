/**
 * Простой axios клиент для общения с бэкендом.
 */

import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Методы для работы с избранном
export const favoritesApi = {
  // Получить все схемы
  getAll: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Сохранить схему
  save: async (name, schemaData) => {
    const response = await api.post('/favorites', {
      name,
      schema_data: schemaData,
    });
    return response.data;
  },

  // Удалить схему
  delete: async (id) => {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  },
};

// Утилита для загрузки JSON по ссылке
export const fetchJsonFromUrl = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};
// service.js
import Query from '../models/Query.js';
/**
 * Сервіс для отримання збережених запитів
 * @returns {Array} - Повертає список збережених запитів
 * @requires Query - Модель запиту з бази даних
 * @throws {Error} Помилка у випадку невдачі
 */
const getSavedQueriesService = async () => {
  try {
    const queries = await Query.find();
    return queries;
  } catch (error) {
    throw error;
  }
};

export { getSavedQueriesService };

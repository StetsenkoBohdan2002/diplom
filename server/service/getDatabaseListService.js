// service.js
import mongoose from 'mongoose'; // Import the appropriate module for mongoose
/**
 * Сервіс для отримання доступних колекцій
 * @returns {Promise<string[]>} Повертає проміс, що надає масив імен доступних колекцій.
 * @requires mongoose - Бібліотека доступу до MongoDB
 * @throws {Error} Помилка у випадку невдачі
 */
const getDatabaseListService = async () => {
  try {
    return await mongoose.connection.db
      .listCollections()
      .toArray()
      .then((result) => {
        let collectionList = result.map((item) => {
          return item.name;
        });
        return collectionList;
      });
  } catch (error) {
    throw error;
  }
};
export { getDatabaseListService };

// service.js
import mongoose from 'mongoose'; // Import the appropriate module for mongoose
import flattenObjectArray from './flattenObjectArray.js';
import { getPropertiesHierarchy } from './getPropertiesHierarchy.js';
/**
 * Сервіс для отримання списку полів з ієрархії властивостей об'єкта для пошуку по базі даних.
 * @param {Object} req - Об'єкт запиту, з якого буде отримано назву бази даних
 * @requires getPropertiesHierarchy - Функція для отримання ієрархії властивостей об'єкта зі значенням у вигляді списку можливих варіантів
 * @requires flattenObjectArray - Функція, що сплющує масив об'єктів і повертає об'єкт з унікальними значеннями масивів
 * @requires mongoose - Бібліотека доступу до MongoDB
 * @returns {object} - Повертає списку полів з ієрархії властивостей об'єкта
 * @throws {Error} Помилка у випадку невдачі
 */
const getLabelsListService = async (req) => {
  try {
    return await mongoose.connection.db
      .collection(req.params.collectionName)
      .find({})
      .toArray()
      .then((result) => {
        let arr = [];
        for (let index = 0; index < result.length; index++) {
          let item = getPropertiesHierarchy(result[index]);
          arr.push(item);
          arr = [...new Set(arr.flat())];
        }
        let labelsObj = flattenObjectArray(arr);
        delete labelsObj['__v'];
        return labelsObj;
      });
  } catch (error) {
    throw error;
  }
};

export { getLabelsListService };

// service.js
import Query from '../models/Query.js';
/**
 * Сервіс для видалення збереженого запиту.
 * @param {number} id - Поле з ідентифікатором для видалення
 * @requires Query - Модель запиту з бази даних
 * @throws {Error} Помилка у випадку невдачі
 */

const deleteSavedQueryService = async (id) => {
  try {
    await Query.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
};
export { deleteSavedQueryService };

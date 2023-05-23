/* istanbul ignore file */
import Query from '../models/Query.js';

/**
 * Сервіс для створення нового запиту.
 * @param {Object} body - Об'єкт з даними запиту
 * @requires Query - Модель запиту з бази даних
 * @throws {Error} Помилка у випадку невдачі
 */

const createNewQueryService = async (body) => {
  try {
    let name = body.name;
    let queryList = [];
    for (let index = 0; index < body.data.length; index++) {
      queryList.push(...body.data[index].queries);
    }
    queryList = [
      ...new Set(
        queryList.map((item) => {
          return item.type;
        })
      ),
    ];
    const newQuery = new Query({
      name,
      queryList,
      query: JSON.stringify(body.data),
    });
    await newQuery.save();
  } catch (error) {
    throw error;
  }
};

export { createNewQueryService };

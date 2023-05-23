import {createError} from './createError.js';

/**
 * Функція-обгортка, що додає обробку помилок до контролера.
 *
 * @param {function} controller - Контролер, який потрібно обгорнути
 * @returns {function} - Функція-обгортка з обробкою помилок
 * @requires createError - Створює об'єкт помилки з вказаним статусом та повідомленням
 */
const asyncWrapper = (controller) => {
  return (req, res, next) => {
    try {
      return controller(req, res, next);
    } catch (err) {
      next(createError(500));
    }
  };
};

export default asyncWrapper;

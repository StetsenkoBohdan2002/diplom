/**
 * Створює об'єкт помилки з вказаним статусом та повідомленням.
 * @param {number} status - Статус помилки
 * @param {string} message - Повідомлення помилки
 * @returns {Error} - Об'єкт помилки
 */
const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

export { createError };

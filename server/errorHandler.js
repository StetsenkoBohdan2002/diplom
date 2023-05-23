/**
 * Функція обробки помилок, що відправляє відповідь з вказаним статусом та повідомленням.
 *
 * @param {Error} err - Об'єкт помилки
 * @param {Object} req - Об'єкт запиту
 * @param {Object} res - Об'єкт відповіді
 * @param {Function} next - Функція переходу до наступного обробника
 */
 const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'String';
    res.status(status).json({ message });
  }
  
  export default errorHandler;
  
import { createError } from '../createError.js';

describe('createError', () => {
  it("Повинно створювати об'єкт помилки з правильними властивостями", () => {
    const status = 404;
    const message = 'Сторінка не знайдена';

    // Викликаємо функцію для створення об'єкта помилки
    const error = createError(status, message);

    // Перевірка властивостей об'єкта помилки
    expect(error instanceof Error).toBe(true);
    expect(error.status).toBe(status);
    expect(error.message).toBe(message);
  });
});

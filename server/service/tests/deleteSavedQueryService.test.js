import { deleteSavedQueryService } from '../deleteSavedQueryService.js';
import Query from '../../models/Query.js';
import { jest } from '@jest/globals';

describe('deleteSavedQueryService', () => {
  it('Повинно видаляти збережений запит за його ідентифікатором', async () => {
    // Мокуємо функцію deleteOne моделі Query
    const deleteOneMock = jest.fn().mockResolvedValue();

    // Підміняємо оригінальну функцію deleteOne на фейкову функцію
    Query.deleteOne = deleteOneMock;

    const id = '123456789';

    // Викликаємо функцію для тестування
    await deleteSavedQueryService(id);

    // Перевірка викликів функцій
    expect(deleteOneMock).toHaveBeenCalledWith({ _id: id });
  });

  it('Повинно викидати помилку, якщо виникає виключна ситуація', async () => {
    // Мокуємо функцію deleteOne моделі Query, щоб викликати помилку
    const deleteOneMock = jest.fn().mockRejectedValue(new Error('Помилка бази даних'));

    // Підміняємо оригінальну функцію deleteOne на фейкову функцію
    Query.deleteOne = deleteOneMock;

    const id = '123456789';

    // Викликаємо функцію для тестування і перевіряємо, що вона викидає помилку
    await expect(deleteSavedQueryService(id)).rejects.toThrow('Помилка бази даних');
  });

});

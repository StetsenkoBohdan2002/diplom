import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getDatabaseListService } from '../getDatabaseListService.js';
import { jest } from '@jest/globals';

describe('getDatabaseListService', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Повинно повертати список колекцій бази даних', async () => {
    // Мокуємо результат запиту до бази даних
    const mockResult = [{ name: 'collection1' }, { name: 'collection2' }, { name: 'collection3' }];
    const listCollectionsMock = jest.fn().mockResolvedValue(mockResult);
    jest.spyOn(mongoose.connection.db, 'listCollections').mockReturnValue({ toArray: listCollectionsMock });

    // Очікуваний результат
    const expectedCollectionList = ['collection1', 'collection2', 'collection3'];

    // Викликаємо функцію для тестування
    const collectionList = await getDatabaseListService();

    // Перевірка викликів функцій та результату
    expect(mongoose.connection.db.listCollections).toHaveBeenCalled();
    expect(collectionList).toEqual(expectedCollectionList);
  });

  it('Повинно викидати помилку, якщо виникає виключна ситуація', async () => {
    // Мокуємо функцію listCollections, щоб викликати помилку
    const listCollectionsMock = jest.fn().mockRejectedValue(new Error('Помилка бази даних'));
    jest.spyOn(mongoose.connection.db, 'listCollections').mockReturnValue({ toArray: listCollectionsMock });

    // Викликаємо функцію для тестування і перевіряємо, що вона викидає помилку
    await expect(getDatabaseListService()).rejects.toThrow('Помилка бази даних');
  });
});

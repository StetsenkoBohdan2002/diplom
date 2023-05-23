import { getSavedQueriesService } from '../getSavedQueriesService.js';
import Query from '../../models/Query.js';
import { jest } from '@jest/globals';

describe('getSavedQueriesService', () => {
  it('Повинна повернути масив запитів', async () => {
    const mockQueries = [
      { id: 1, query: 'SELECT * FROM table1' },
      { id: 2, query: 'SELECT * FROM table2' },
    ];
    Query.find = jest.fn().mockResolvedValue(mockQueries);
    const result = await getSavedQueriesService();
    expect(result).toEqual(mockQueries);
    expect(Query.find).toHaveBeenCalledTimes(1);
    expect(Query.find).toHaveBeenCalledWith();
  });

  it('Повинна кинути помилку, якщо Query.find() не вдається', async () => {
    const errorMessage = 'Помилка підключення до бази даних';
    Query.find = jest.fn().mockRejectedValue(new Error(errorMessage));
    await expect(getSavedQueriesService()).rejects.toThrow(errorMessage);
    expect(Query.find).toHaveBeenCalledTimes(1);
  });
});

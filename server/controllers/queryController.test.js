import supertest from 'supertest';
import app from '../_app.js';
import { jest } from '@jest/globals';
import Query from '../models/Query.js';
import { createNewQueryService } from '../service/createNewQueryService.js';
import { getLabelsListService } from '../service/getLabelsListService.js';
import { buildOperation } from './queryController.js';
import { getData } from './queryController.js';
const request = supertest(app);

describe('GET /api/queries', () => {
  it('Повинен повернути список збережених запитів зі статусом 200', async () => {
    const response = await request.get('/api/queries').expect(200);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Query created successfully');
    expect(Array.isArray(response.body.queries)).toBe(true);
  });
  it('Повинен обробити помилку сервера і повернути статус 500', async () => {
    // Створення фейкової помилки для спровокування виклику catch блоку
    jest.spyOn(Query, 'find').mockImplementationOnce(() => {
      throw new Error('Fake server error');
    });

    const response = await request.get('/api/queries').expect(500);

    expect(response.body.message).toBe('Server error');
  });
});

describe('POST /api/queries', () => {
  it('Повинен створити новий запит та повернути повідомлення про успіх', async () => {
    // Очікуване повідомлення
    const expectedMessage = { message: 'Query created successfully' };

    // Виконання запиту
    const response = await supertest(app)
      .post('/api/queries')
      .send({
        name: 'test',
        data: [
          { id: 1, queries: [{ queryId: 1688763958016, type: 'from', value: 'socialmediamessages', delete: false }] },
        ],
      });

    // Перевірка статусу відповіді та повідомлення
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedMessage);
  });
  it('Повинен обробити помилку сервера і повернути статус 500', async () => {
    const response = await request.post('/api/queries').send({}).expect(500);
    expect(response.body.message).toBe('Server error');
  });
});

describe('DELETE /api/queries/data/:id', () => {
  it('Повинен видалити запит і повернути повідомлення про успішне видалення', async () => {
    // Очікуване повідомлення
    const expectedMessage = { message: 'Query deleted successfully' };
    const testId = '64693dc30ddc3fdf408f9755';
    // Виконання запиту
    const response = await supertest(app).delete(`/api/queries/data/${testId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedMessage.message);
  });
  it('Повинен обробити помилку сервера і повернути статус 500', async () => {
    const response = await supertest(app).delete(`/api/queries/data/1`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Server error');
  });
});

describe('GET /api/queries/databases-list', () => {
  it('Повинен повернути інформацію про те, що список баз даних надано успішно', async () => {
    // Очікуване повідомлення
    const expectedMessage = { message: 'Collection received successfully' };
    // Виконання запиту
    const response = await supertest(app).get(`/api/queries/databases-list`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedMessage.message);
  });
});

describe('GET /api/queries/labels-list/:collectionName', () => {
  it('Повинен повернути інформацію про те, що список ієрархій властивостей надано успішно', async () => {
    // Очікуване повідомлення
    const expectedMessage = { message: 'Labels recieved successfully' };
    // Виконання запиту
    const response = await supertest(app).get('/api/queries/labels-list/queries');
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedMessage.message);
  });
});

describe('buildOperation', () => {
  it("Повинно повертати правильний об'єкт для операції match", () => {
    const operationType = 'match';
    const operationProperties = {
      label: 'name',
      operation: '$equal',
      values: ['John'],
    };
    const operationProperties1 = {
      label: 'name',
      operation: '$not_equal',
      values: ['John'],
    };
    const operationProperties2 = {
      label: 'name',
      operation: '$in',
      values: ['John'],
    };
    const operationProperties3 = {
      label: 'name',
      operation: '$not_in',
      values: ['John'],
    };

    const result = buildOperation(operationType, operationProperties);
    const result1 = buildOperation(operationType, operationProperties1);
    const result2 = buildOperation(operationType, operationProperties2);
    const result3 = buildOperation(operationType, operationProperties3);
    expect(result).toEqual({
      $match: {
        name: {
          $eq: 'John',
        },
      },
    });
    expect(result1).toEqual({
      $match: {
        name: {
          $ne: 'John',
        },
      },
    });

    expect(result2).toEqual({
      $match: {
        name: {
          $in: ['John'],
        },
      },
    });

    expect(result3).toEqual({
      $match: {
        name: {
          $nin: ['John'],
        },
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції project", () => {
    const operationType = 'project';
    const operationProperties = {
      labels: ['name', 'age'],
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $project: {
        name: 1,
        age: 1,
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції sample", () => {
    const operationType = 'sample';
    const operationProperties = {
      size: 10,
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $sample: {
        size: 10,
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції limit", () => {
    const operationType = 'limit';
    const operationProperties = {
      size: 5,
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $limit: 5,
    });
  });

  it("Повинно повертати правильний об'єкт для операції sort при сортуванні за зростанням", () => {
    const operationType = 'sort';
    const operationProperties = {
      label: 'name',
      sort: '$asc',
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $sort: {
        name: 1,
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції sort при сортуванні за спаданням", () => {
    const operationType = 'sort';
    const operationProperties = {
      label: 'name',
      sort: '$desc',
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $sort: {
        name: -1,
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції subtract", () => {
    const operationType = 'subtract';
    const operationProperties = {
      newField: 'result',
      firstValue: 'value1',
      secondValue: 'value2',
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $addFields: {
        result: {
          $subtract: ['$value1', '$value2'],
        },
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції union", () => {
    const operationType = 'union';
    const operationProperties = {
      collection: 'otherCollection',
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $unionWith: {
        coll: 'otherCollection',
      },
    });
  });

  it("Повинно повертати правильний об'єкт для операції intersect", () => {
    const operationType = 'intersect';
    const operationProperties = {
      collection: 'otherCollection',
      comparisonFieldMain: 'field1',
      comparisonFieldAdditional: 'field2',
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toEqual({
      $lookup: {
        from: 'otherCollection',
        localField: 'field1',
        foreignField: 'field2',
        as: expect.stringMatching(/^intersection\d+$/), // Перевірка, що as використовує випадковий унікальний ідентифікатор
      },
    });
  });

  it('Повинно повертати undefined для невідомої операції', () => {
    const operationType = 'unknown';
    const operationProperties = {
      // Немає значення, бо не має значення в default case
    };

    const result = buildOperation(operationType, operationProperties);

    expect(result).toBeUndefined();
  });
});

describe('getData', () => {
  it('Повинно повертати правильні дані після обробки та агрегації зі статусом 200, якщо запит успішний', async () => {
    // Arrange
    const req = {
      body: [
        {
          id: 1,
          queries: [
            {
              queryId: 1687593307884,
              type: 'from',
              value: 'socialmediamessages',
              delete: true,
            },
            {
              queryId: 1686456823083,
              type: 'intersect',
              collection: 'TwitterMessages1',
              comparisonFieldMain: 'author.name',
              comparisonFieldAdditional: 'author.name',
              delete: true,
            },
            {
              queryId: 1690546299991,
              type: 'subtract',
              newField: 'new_field',
              firstValue: 'author.followersCount',
              secondValue: 'content.metadata.likesCount',
              delete: true,
            },
            {
              queryId: 1693255182500,
              type: 'project',
              labels: ['author.name', 'author.username', 'author.followersCount'],
              delete: true,
            },
          ],
        },
      ],
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Act
    await getData(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully',
      queryResult: expect.any(Array),
    });
  });

  it('Повинно повертати статус 500 та повідомлення "Server error", якщо виникає помилка', async () => {
    // Arrange
    const req = {
      body: [
        {
          id: 1,
          queries: [
            {
              queryId: 1688763958016,
              type: 'from',
              value: 'error', // Викликати помилку
              delete: false,
            },
          ],
        },
      ],
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Act
    await getData(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
    });
  });
  it('Повинно повертати правильну відповідь при успішному виконанні операцій агрегування', async () => {
    // Arrange
    const req = {
      body: [
        {
          id: 1,
          queries: [
            {
              queryId: 1687593307884,
              type: 'from',
              value: 'socialmediamessages',
              delete: true,
            },
            {
              queryId: 1686456823083,
              type: 'intersect',
              collection: 'TwitterMessages1',
              comparisonFieldMain: 'author.name',
              comparisonFieldAdditional: 'author.name',
              delete: true,
            },
          ],
        },
      ],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await getData(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully',
      queryResult: expect.any(Array),
    });
  });
  it('Повинно повертати помилку, якщо результат порожній', async () => {
    // Arrange
    const req = {
      body: [
        {
          id: 1,
          queries: [
            {
              queryId: 1687593307884,
              type: 'from',
              value: 'test12344',
              delete: true,
            },
          ],
        },
      ],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await getData(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});

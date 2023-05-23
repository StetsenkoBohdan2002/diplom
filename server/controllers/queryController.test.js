import supertest from 'supertest';
import app from '../_app.js';
import { jest } from '@jest/globals';
import Query from '../models/Query.js';
import { createNewQueryService } from '../service/createNewQueryService.js';
import { getLabelsListService } from '../service/getLabelsListService.js';

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
  it('Повинен повернути інформацію про те, що список міток надано успішно', async () => {
    // Очікуване повідомлення
    const expectedMessage = { message: 'Labels recieved successfully' };
    // Виконання запиту
    const response = await supertest(app).get('/api/queries/labels-list/queries');
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(expectedMessage.message);
  });
});
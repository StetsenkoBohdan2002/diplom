import errorHandler from '../errorHandler.js';
import { jest } from '@jest/globals';

describe('errorHandler', () => {
  it('Має встановити статус і повідомлення від об’єкта помилки', () => {
    const err = { status: 400, message: 'Bad Request' };
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
  });

  it('Має встановити статус і повідомлення за замовчуванням, якщо вони не надані в об’єкті помилки', () => {
    const err = {};
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'String' });
  });
});

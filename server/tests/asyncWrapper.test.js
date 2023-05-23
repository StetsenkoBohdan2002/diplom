import asyncWrapper from '../asyncWrapper.js';
import { createError } from '../createError.js';
import { jest } from '@jest/globals';

describe('asyncWrapper', () => {
  it('Повинен викликати контролер і повернути його результат', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const controller = jest.fn().mockResolvedValue('Результат контролера');

    const wrappedController = asyncWrapper(controller);

    await wrappedController(req, res, next);

    expect(controller).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('Повинен перехоплювати помилки, створювати помилку зі статусом 500 і передавати її через next', async () => {
    const mockController = jest.fn(() => {
      throw new Error('Test error');
    });
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const wrappedController = asyncWrapper(mockController);
    wrappedController(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(500));
  });
});

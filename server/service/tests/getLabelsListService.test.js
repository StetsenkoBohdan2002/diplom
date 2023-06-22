import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getLabelsListService } from '../getLabelsListService.js';
import flattenObjectArray from '../flattenObjectArray.js';
import {getPropertiesHierarchy} from '../getPropertiesHierarchy.js';
import { jest } from '@jest/globals';

describe('getLabelsListService', () => {
  let mongoServer;
  let db;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    db = mongoose.connection.db;

    const fakeCollection = () => ({
      find: () => ({
        toArray: async () => [],
      }),
    });

    jest.spyOn(db, 'collection').mockImplementation(fakeCollection);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("Повинно повертати об'єкт полів з колекції", async () => {
    const req = {
      params: {
        collectionName: 'testCollection',
      },
    };

    const labelsObj = await getLabelsListService(req);

    expect(db.collection).toHaveBeenCalledWith('testCollection');
    expect(labelsObj).toEqual({});
  });

  it("Повинно повертати сплющений об'єкт полів без дублікатів", async () => {
    const req = {
      params: {
        collectionName: 'testCollection',
      },
    };

    const mockResult = [{ label: 'Мітка 1' }, { label: 'Мітка 2' }, { label: 'Мітка 2' }];
    const toArrayMock = jest.fn().mockResolvedValue(mockResult);
    jest.spyOn(db, 'collection').mockReturnValue({ find: jest.fn().mockReturnValue({ toArray: toArrayMock }) });

    const expectedLabelsObj = {
      label: ['Мітка 1', 'Мітка 2'],
    };

    const labelsObj = await getLabelsListService(req);

    expect(db.collection).toHaveBeenCalledWith('testCollection');
    expect(toArrayMock).toHaveBeenCalled();
    expect(labelsObj).toEqual(expectedLabelsObj);
  });

  it('Повинно викидати помилку, якщо виникає виключна ситуація', async () => {
    const req = {
      params: {
        collectionName: 'testCollection',
      },
    };

    const toArrayMock = jest.fn().mockRejectedValue(new Error('Помилка бази даних'));
    jest.spyOn(db, 'collection').mockReturnValue({ find: jest.fn().mockReturnValue({ toArray: toArrayMock }) });

    await expect(getLabelsListService(req)).rejects.toThrow('Помилка бази даних');
  });
});

// Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom
import { createError } from '../createError.js';
import mongoose from 'mongoose';
import Query from '../models/Query.js';

import { createNewQueryService } from '../service/createNewQueryService.js';
import { getSavedQueriesService } from '../service/getSavedQueriesService.js';
import { deleteSavedQueryService } from '../service/deleteSavedQueryService.js';
import { getDatabaseListService } from '../service/getDatabaseListService.js';

import { validationResult } from 'express-validator';
import { combines } from './queriesCombines.js';
import { getLabelsListService } from '../service/getLabelsListService.js';
/**
 * @module queryController
 */
/**
 * Асинхронна функція, яка створює новий запит.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const createNewQuery = async (req, res, next) => {
  try {
    await createNewQueryService(req.body);
    res.status(200).json({ message: 'Query created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * Асинхронна функція, отримує збережені запити.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const getSavedQueries = async (req, res, next) => {
  try {
    const queries = await getSavedQueriesService();
    res.status(200).json({ message: 'Query created successfully', queries });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * Асинхронна функція, видаляє збережений запит.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const deleteSavedQuery = async (req, res, next) => {
  try {
    const id = req.params.id;
    let deleteAnswer = await deleteSavedQueryService(id);
    const queries = await getSavedQueriesService();
    res.status(200).json({ message: 'Query deleted successfully', queries });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Функція для побудови відповідної операції агрегування.
 *
 * @param {string} operationType - Тип операції для створення запиту
 * @param {Object} operationProperties - Параметри операції
 * @returns {Object} Повертає об'єкт з побудований запитом, відповідно до параметрів
 */
function buildOperation(operationType, operationProperties) {
  switch (operationType) {
    case 'match':
      let type;
      let resObj;
      if (operationProperties.operation === '$in') {
        type = operationProperties.operation;
        resObj = { [type]: operationProperties.values };
      } else if (operationProperties.operation === '$not_in') {
        type = '$nin';
        resObj = { [type]: operationProperties.values };
      } else if (operationProperties.operation === '$equal') {
        type = '$eq';
        resObj = { [type]: operationProperties.values[0] };
      } else if (operationProperties.operation === '$not_equal') {
        type = '$ne';
        resObj = { [type]: operationProperties.values[0] };
      }
      return {
        [`$${operationType}`]: {
          [operationProperties.label]: resObj,
        },
      };
    case 'project':
      let labelsObj = {};
      const labelsList = operationProperties.labels;
      labelsList.forEach((label) => {
        labelsObj[label] = 1;
      });
      return {
        [`$${operationType}`]: labelsObj,
      };
    case 'sample':
      return {
        [`$${operationType}`]: { size: +operationProperties.size },
      };
    case 'limit':
      return { [`$${operationType}`]: +operationProperties.size };
    case 'sort':
      return { [`$${operationType}`]: { [operationProperties.label]: operationProperties.sort === '$asc' ? 1 : -1 } };
    case 'subtract':
      return {
        $addFields: {
          [operationProperties.newField]: {
            [`$${operationType}`]: [`$${operationProperties.firstValue}`, `$${operationProperties.secondValue}`],
          },
        },
      };
    case 'union':
      return {
        $unionWith: {
          coll: operationProperties.collection,
        },
      };
    case 'intersect':
      return {
        $lookup: {
          from: operationProperties.collection,
          localField: operationProperties.comparisonFieldMain,
          foreignField: operationProperties.comparisonFieldAdditional,
          as: `intersection${parseInt(Date.now() + Math.random() * Math.pow(10, 10))}`,
        },
      };
    default:
      return;
  }
}

/**
 * Асинхронна функція, яка відправляє результат побудови агрегування та надає отримані дані.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const getData = async (req, res, next) => {
  try {
    const requestList = req.body;
    let resultList = [];
    for (let index = 0; index < requestList.length; index++) {
      const certaintRequest = requestList[index];
      const aggregateList = [];
      const databaseFromName = certaintRequest.queries[0].value;
      const queriesList = certaintRequest.queries.slice(1);
      for (const query of queriesList) {
        const [, , ...queryPropertiesTemplate] = Object.entries(query);
        queryPropertiesTemplate.pop();
        const queryProperties = Object.fromEntries(queryPropertiesTemplate);
        let operation = buildOperation(query.type, queryProperties);
        if (operation && JSON.stringify(operation) !== JSON.stringify({})) {
          aggregateList.push(operation);
        }
      }
      const projectObject = {
        $project: {},
      };
      const matchObject = {
        $match: {},
      };
      let newList = JSON.parse(JSON.stringify(aggregateList))
        .filter((obj) => obj['$lookup'] && obj['$lookup']['as'])
        .map((obj) => obj['$lookup']['as']);

      let findNewField = aggregateList.filter((item) => item['$addFields']);
      let findLookup = aggregateList.filter((item) => item['$lookup']);
      let findProject = aggregateList.find((item) => item['$project']);

      if ((findNewField && findNewField.length > 0) || (findLookup && findLookup.length > 0)) {
        if (findProject) {
          if (findNewField) {
            findNewField.forEach((item) => {
              const fields = Object.values(Object.values(Object.values(item)[0])[0]).flat();
              fields.forEach((item) => {
                findProject['$project'][item.slice(1)] = 1;
              });
            });
          }
          if (findLookup) {
            findLookup.forEach((item) => {
              let name = item['$lookup']['as'];
              findProject['$project'][name] = 1;
            });
          }
        } else {
          if (findLookup) {
            for (const value of newList) {
              if (value) {
                projectObject.$project[value] = 1;
                matchObject.$match[value] = {
                  $ne: [],
                };
              }
            }
          }
        }
      }

      const lookupObjects = [];
      const addFieldsObjects = [];
      const otherObjects = [];

      aggregateList.forEach((obj) => {
        if ('$lookup' in obj) {
          lookupObjects.push(obj);
        } else if ('$addFields' in obj) {
          addFieldsObjects.push(obj);
        } else {
          otherObjects.push(obj);
        }
      });
      let newArr = otherObjects.concat(lookupObjects).concat(addFieldsObjects);
      if (JSON.stringify(projectObject['$project']) !== JSON.stringify({})) {
        newArr.push(projectObject);
        newArr.push(matchObject);
      }
      const queryResult = await mongoose.connection.db.collection(databaseFromName).aggregate(newArr).toArray();

      resultList.push(...queryResult);
    }
    if (resultList.length > 0) {
      res.status(200).json({ message: 'Successfully', queryResult: resultList });
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Асинхронна функція, яка надає список доступних колекцій з бази даних.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const getDatabaseList = async (req, res, next) => {
  try {
    const collectionList = await getDatabaseListService();
    res.status(200).json({ message: 'Collection received successfully', collectionList });
  } catch (error) {
    /* istanbul ignore next */
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Асинхронна функція, яка надає список доступних ієрархічних полів з бази даних.
 *
 * @param {Object} req - Об'єкт запиту Express.
 * @param {Object} res - Об'єкт відповіді Express.
 * @param {Function} next - Функція next Express.
 * @returns {Promise<void>} Повертає проміс без значення.
 * @throws {Error} Помилка у випадку невдачі
 */
const getLabelsList = async (req, res, next) => {
  try {
    const labelsObj = await getLabelsListService(req);
    res.status(200).json({ message: 'Labels recieved successfully', labelsObj });
  } catch (error) {
    /* istanbul ignore next */
    res.status(500).json({ message: 'Server error' });
  }
};

export { createNewQuery, getLabelsList, getDatabaseList, getData, deleteSavedQuery, getSavedQueries, buildOperation };

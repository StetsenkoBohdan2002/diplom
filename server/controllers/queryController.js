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
      return {
        [`$${operationType}`]: {
          [operationProperties.label]: {
            [operationProperties.operation]: operationProperties.values,
          },
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
        // $project:{
        //   [operationProperties.firstValue]:1,
        //   [operationProperties.secondValue]:1,
        // }
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
// const getData = async (req, res, next) => {
//   try {
//     const requestList = req.body;
//     let resultList = [];
//     requestList.forEach((certaintRequest) => {
//       const aggregateList = [];
//       const databaseFromName = certaintRequest.queries[0].type === 'from' ? certaintRequest.queries[0].value : 'error';
//       if (databaseFromName === 'error') {
//         throw new Error();
//       } else {
//         const queriesList = certaintRequest.queries.slice(1);
//         queriesList.forEach((query) => {
//           const [, , ...queryPropertiesTemplate] = Object.entries(query);
//           queryPropertiesTemplate.pop();
//           const queryProperties = Object.fromEntries(queryPropertiesTemplate);
//           let operation = buildOperation(query.type, queryProperties);
//           if (operation && JSON.stringify(operation) !== JSON.stringify({})) {
//             aggregateList.push(operation);
//           }
//         });
//         // console.log(JSON.stringify(aggregateList));
//         const queryResult = await mongoose.connection.db
//           .collection(databaseFromName)
//           .aggregate(aggregateList)
//           .toArray()
//           // .then(await (queryResult) => {
//           //   // console.log(queryResult);
//           //   for (let index = 0; index < queryResult.length; index++) {
//           //     // console.log(queryResult[index]);
//           //     resultList.push(queryResult[index]);
//           //   }
//           //   // console.log(resultList);
//           //   // res.status(200).json({ message: 'Successfully', queryResult });
//           // });
//       }
//     });
//     console.log(resultList);
//     // if (resultList.length > 0) {
//     //   res.status(200).json({ message: 'Successfully', queryResult });
//     // } else {
//     //   throw new Error();
//     // }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const getData = async (req, res, next) => {
  try {
    const requestList = req.body;
    let resultList = [];
    for (const certaintRequest of requestList) {
      const aggregateList = [];
      const databaseFromName = certaintRequest.queries[0].type === 'from' ? certaintRequest.queries[0].value : 'error';
      if (databaseFromName === 'error') {
        throw new Error();
      } else {
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
        let findNewField = aggregateList.filter((item) => item['$addFields']);
        if (findNewField && findNewField.length > 0) {
          let findProject = aggregateList.find((item) => item['$project']);
          findNewField.forEach((item) => {
            let arr = Object.values(Object.values(Object.values(item)[0])[0]).flat();
            arr.forEach((item)=>{
              findProject['$project'][item.slice(1)] = 1
            })
          });
        }
        let newList = JSON.parse(JSON.stringify(aggregateList));
        console.log(aggregateList);
        newList = newList.map((obj) => {
          if ('$lookup' in obj && 'as' in obj['$lookup']) {
            return obj['$lookup']['as'];
          }
        });
        const matchObject = {
          $project: {},
        };
        for (const value of newList) {
          if (value) {
            matchObject.$project[value] = 0;
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
        if (JSON.stringify(matchObject['$project']) !== JSON.stringify({})) {
          newArr.push(matchObject);
        }

        const queryResult = await mongoose.connection.db.collection(databaseFromName).aggregate(newArr).toArray();

        resultList.push(...queryResult);
      }
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

export { createNewQuery, getLabelsList, getDatabaseList, getData, deleteSavedQuery, getSavedQueries };

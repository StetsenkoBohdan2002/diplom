// Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom
import express from 'express';
import asyncWrapper from '../asyncWrapper.js';
import {
  createNewQuery,
  getSavedQueries,
  getData,
  deleteSavedQuery,
  getDatabaseList,
  getLabelsList,
} from '../controllers/queryController.js';
const router = express.Router();

//create query
router.post('/', asyncWrapper(createNewQuery));
//get all saved queries
router.get('/', asyncWrapper(getSavedQueries));
//get data
router.post('/data', asyncWrapper(getData));
//delete saved query
router.delete('/data/:id', asyncWrapper(deleteSavedQuery));
//get databases list
router.get('/databases-list', asyncWrapper(getDatabaseList));
//get labels list
router.get('/labels-list/:collectionName', asyncWrapper(getLabelsList));

export default router;

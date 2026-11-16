import express from 'express';
import { createTheater, deleteTheater, getAllTheaters, getTheater, updateTheater } from '../controllers/theater.controllers.js';
import validate from '../middleware/validate.js';
import {theaterValidationSchema , updateTheaterValidationSchema} from '../validators/theater.validator.js';

const router = express.Router();

router.get('/mba/api/v1/theaters/:id' , getTheater);
router.get('/mba/api/v1/theaters' , getAllTheaters);
router.post('/mba/api/v1/theaters' , validate(theaterValidationSchema) , createTheater);
router.put('/mba/api/v1/theaters/:id' , validate(updateTheaterValidationSchema) ,  updateTheater);
router.delete('/mba/api/v1/theaters/:id' , deleteTheater);


export default router;
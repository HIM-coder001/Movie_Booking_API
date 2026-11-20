import express from 'express';
import { createTheater, deleteTheater, getAllTheaters, getTheater, updateTheater } from '../controllers/theater.controllers.js';
import validate from '../middleware/validate.js';
import {theaterValidationSchema , updateTheaterValidationSchema} from '../validators/theater.validator.js';
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/mba/api/v1/theaters/:id' , getTheater);
router.get('/mba/api/v1/theaters' , getAllTheaters);
router.post('/mba/api/v1/theaters' , protect, restrictTo("admin"), validate(theaterValidationSchema) , createTheater);
router.put('/mba/api/v1/theaters/:id' , protect, restrictTo("admin"), validate(updateTheaterValidationSchema) ,  updateTheater);
router.delete('/mba/api/v1/theaters/:id' , protect, restrictTo("admin"), deleteTheater);


export default router;
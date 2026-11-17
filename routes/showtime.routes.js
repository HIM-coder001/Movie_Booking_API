import express from "express";
import { createShowtime , getAllShowtimes , getShowtime , updateShowtime , deleteShowtime } from "../controllers/showtime.controllers.js";
import validate from "../middleware/validate.js";
import { showtimeValidationSchema , updateShowtimeValidation } from "../validators/showtime.validator.js";

const router = express.Router();

router.post("/mba/api/v1/showtimes" , validate(showtimeValidationSchema) , createShowtime);
router.get("/mba/api/v1/showtimes" , getAllShowtimes);
router.get("/mba/api/v1/showtimes/:id" , getShowtime);
router.put("/mba/api/v1/showtimes/:id" , validate(updateShowtimeValidation) , updateShowtime);
router.delete("/mba/api/v1/showtimes/:id" , deleteShowtime);


export default router;
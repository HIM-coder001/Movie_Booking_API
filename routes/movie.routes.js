import express from "express";
import { createMovie, deleteMovie , getAllMovies ,getMovie , updateMovie} from "../controllers/movie.controllers.js";
import validate from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import movieValidationSchema  from '../validators/movie.validator.js';
import { updateMovieValidationSchema } from "../validators/movie.validator.js";

const router = express.Router();

router.post("/mba/api/v1/movies" , protect, restrictTo("admin"), validate(movieValidationSchema), createMovie);
router.get("/mba/api/v1/movies" , getAllMovies);
router.get("/mba/api/v1/movies/:id" , getMovie);
router.put("/mba/api/v1/movies/:id" , protect, restrictTo("admin"), validate(updateMovieValidationSchema) , updateMovie);
router.delete("/mba/api/v1/movies/:id" , protect, restrictTo("admin"), deleteMovie);


export default router;
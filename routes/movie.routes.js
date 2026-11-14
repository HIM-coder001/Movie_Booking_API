import express from "express";
import { createMovie , getAllMovies , getMovie , updateMovie , deleteMovie} from "../controllers/movie.controllers.js";

const router = express.Router();

router.post("/mba/api/v1/movies" , createMovie);
//router.get("/mba/api/v1/movies" , getAllMovies);
//router.get("/mba/api/v1/movies/:id" , getMovie);
//router.put("/mba/api/v1/movies/:id" , updateMovie);
//router.delete("/mba/api/v1/movies/:id" , deleteMovie);


export default router;
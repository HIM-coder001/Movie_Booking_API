import Movie from "../models/movie.model.js";
import { sendSuccess , sendError } from "../utils/response.utils.js";

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      releaseDate,
      trailerUrl,
      language,
      director,
      casts,
      releaseStatus,
    } = req.body;
    if (
      !title ||
      !description ||
      !releaseDate ||
      !trailerUrl ||
      !language ||
      !director ||
      !casts ||
      !releaseStatus
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      error: {},
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
      data: {},
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    //Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = Math.min(limit , 100)
    const offset = (page - 1) * safeLimit;

    //Filtering logic
    const filter = {};

    //Exact matches for language and releaseStatus
    if (req.query.language) {
      filter.language = req.query.language;
    }

    if (req.query.releaseStatus) {
      filter.releaseStatus = req.query.releaseStatus;
    }

    //Partial matches for title,director & casts using regex and case-insensitive search
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    if (req.query.director) {
      filter.director = { $regex: req.query.director, $options: "i" };
    }

    if (req.query.casts) {
      filter.casts = { $regex: req.query.casts, $options: "i" };
    }

    //Sorting logic
    const sortBy = req.query.sortBy || "releaseDate";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const [movies, totalMovies] = await Promise.all([
      Movie.find(filter).sort(sortOptions).skip(offset).limit(safeLimit),
      Movie.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalMovies / safeLimit);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        limit: safeLimit,
        totalMovies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: movies,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
      data: {},
    });
  }
};

export const getMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
        message: "Movie not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      error: {},
      message: "Movie retrieved successfully",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
      data: {},
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      releaseDate,
      trailerUrl,
      language,
      director,
      casts,
      releaseStatus,
    } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        description,
        releaseDate,
        trailerUrl,
        language,
        director,
        casts,
        releaseStatus,
      },
      { returnDocument: true, runValidators: true },
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
        message: "Movie not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      error: {},
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
      data: {},
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
        message: "Movie not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      error: {},
      message: "Movie deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error",
      data: {},
    });
  }
};

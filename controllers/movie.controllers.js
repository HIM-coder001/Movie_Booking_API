import Movie from "../models/movie.model.js";

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

/**export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      success: true,
      error: {},
      message: "Movies retrieved successfully",
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
    if(!movie) {
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
*/
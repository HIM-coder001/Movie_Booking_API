import Showtime from "../models/showtime.model.js";
import Movie from "../models/movie.model.js";
import Theater from "../models/theater.model.js";

//1. Create a new showtime
export const createShowtime = async (req, res, next) => {
  try {
    const { movie, theater } = req.body;

    // Verify that the referenced movie actually exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      const error = new Error("Referenced movie not found");
      error.statusCode = 404;
      return next(error);
    }

    // Verify that the referenced movie actually exists
    const theaterExists = await Theater.findById(theater);
    if (!theaterExists) {
      const error = new Error("Referenced theater not found");
      error.statusCode = 404;
      return next(error);
    }

    const showtime = await Showtime.create(req.body);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Showtime created successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all showtimes (with pagination and optional filtering)
export const getAllShowtimes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = Math.min(limit, 100);
    const offset = (page - 1) * safeLimit;

    //Allow filtering by movie ID or theater ID
    const filter = {};
    if (req.query.movie) {
      filter.movie = req.query.movie;
    }

    if (req.query.theater) {
      filter.theater = req.query.theater;
    }

    const [showtimes, totalShowtimes] = await Promise.all([
      Showtime.find(filter)
        .populate("movie", "title posterImage duration genre releaseDate")
        .populate("theater", "name location address totalScreens")
        .skip(offset)
        .limit(safeLimit)
        .sort({ startTime: 1 }),
      Showtime.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalShowtimes / safeLimit);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Showtimes fetched successfully",
      pagination: {
        currentPage: page,
        totalPages,
        limit: safeLimit,
        totalShowtimes,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};

//3.Get single showtime by ID
export const getShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie")
      .populate("theater");

    if (!showtime) {
      const error = new Error("Showtime not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Showtime fetched successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

//4.Update showtime
export const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: true,
    })
      .populate("movie")
      .populate("theater");

    if (!showtime) {
      const error = new Error("Showtime not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Showtime updated successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

//5.Delete showtime
export const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) {
      const error = new Error("Showtime not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Showtime deleted successfully",
        data: {},
    });

  } catch (error) {
    next(error);
  }
};

import Theater from "../models/theater.model.js";

//1.Create a new Theater
export const createTheater = async (req, res, next) => {
  {
    try {
      const theater = await Theater.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Theater created successfully",
        data: theater,
      });
    } catch (error) {
      next(error);
    }
  }
};

//2.Get all theaters
export const getAllTheaters = async (req, res, next) => {
  try {
    //Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = Math.min(limit, 100);
    const offset = (page - 1) * safeLimit;

    //Filtering logic
    const filter = {};

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const [theaters, totalTheaters] = await Promise.all([
      Theater.find(filter).skip(offset).limit(safeLimit),
      Theater.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalTheaters / safeLimit);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Theaters fetched successfully",
      pagination: {
        currentPage: page,
        totalPages,
        limit: safeLimit,
        totalTheaters,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: theaters,
    });
  } catch (error) {
    next(error);
  }
};

//3.Get a single Theater
export const getTheater = async (req, res, next) => {
  try {
    const id = req.params.id;
    const theater = await Theater.findById(id);

    if (!theater) {
      const error = new Error("Theater not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Theater fetched successfully",
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

//4.Update Theater
export const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: true,
    });

    if (!theater) {
      const error = new Error("Theater not found");
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Theater updated successfully",
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

//5.Delete Theater
export const deleteTheater = async (req, res , next) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);

    if (!theater) {
      const error = new Error("Theater not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Theater deleted successfully",
      data: {}
    });

  } catch (error) {
    next(error)
  }
};

import Booking from "../models/booking.model.js";
import Showtime from "../models/showtime.model.js";
import crypto from "crypto";

//1.Create a booking with automatic seat locking
export const createBooking = async (req, res, next) => {
  try {
    const { showtime: showtimeId, seatsBooked } = req.body;

    const userId = req.user.id;

    // Fetch showtime to verify existence and get ticket price
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      const error = new Error("Showtime not found");
      error.statusCode = 404;
      return next(error);
    }

    // --- ATOMIC SEAT LOCKING ---
    // We update the showtime ONLY IF NONE of the requested seats are already in bookedSeats.
    // { $nin: seatsBooked } guarantees zero race conditions or double-bookings.
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        bookedSeats: { $nin: seatsBooked },
      },
      {
        $push: { bookedSeats: { $each: seatsBooked } },
      },
      { returnDocument: true },
    );

    // If updatedShowtime is null, it means another user grabbed those seats milliseconds ago!
    if (!updatedShowtime) {
      const error = new Error(
        "One or more selected seats are already booked. Please choose different seats.",
      );
      error.statusCode = 409; // 409 Conflict
      return next(error);
    }

    // Securely calculate total amount on the server (never trust client math)
    const totalAmount = seatsBooked.length * showtime.ticketPrice;

    // Generate a unique human-readable ticket confirmation reference
    const bookingReference = `BKG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    let booking;
    try {
      booking = await Booking.create({
        showtime: showtimeId,
        user: userId,
        seatsBooked,
        totalAmount,
        bookingReference,
        paymentStatus: "pending",
      });
    } catch (error) {
      await Showtime.findByIdAndUpdate(showtimeId, {
        $pull: { bookedSeats: { $in: seatsBooked } },
      });
      throw error;
    }

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Booking created successfully. Seats locked.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

//2. Get all bookings (with deep population of showtime, movie, theater, and user)
export const getAllBookings = async (req, res, next) => {
  try {
    //Pagination logic
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (page - 1) * safeLimit;

    // Customers only see their own bookings; admins may optionally filter by user.
    const filter = {};
    if (req.user.roles !== "admin") {
      filter.user = req.user.id;
    } else if (req.query.user) {
      filter.user = req.query.user;
    }
    if (req.query.showtime) {
      filter.showtime = req.query.showtime;
    }

    const totalBookings = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title posterImage duration genre" },
          { path: "theater", select: "name location address" },
        ],
      })
      .populate("user", "name email")
      .skip(offset)
      .limit(safeLimit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bookings fetched successfully",
      pagination: {
        totalDocs: totalBookings,
        totalPages: Math.ceil(totalBookings / safeLimit),
        currentPage: page,
        limit: safeLimit,
      },
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
      next(error);
  }
};

//3.Get single booking by ID
export const getBooking = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.roles !== "admin") {
      filter.user = req.user.id;
    }

    const booking = await Booking.findOne(filter)
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title posterImage duration genre" },
          { path: "theater", select: "name location address" },
        ],
      })
      .populate("user", "name email");

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

//4. Update booking payment status (and release seats if cancelled)
export const updateBooking = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.roles !== "admin") {
      filter.user = req.user.id;
    }

    const booking = await Booking.findOne(filter);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    if (booking.paymentStatus === "completed") {
      const error = new Error(
        "Cannot cancel a booking that is already completed",
      );
      error.statusCode = 400;
      return next(error);
    }

    booking.paymentStatus = "cancelled";
    await booking.save();

    // Release the seats back to the showtime pool
    await Showtime.findByIdAndUpdate(booking.showtime, {
      $pull: { bookedSeats: { $in: booking.seatsBooked } },
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking cancelled and seats released successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

//5.Delete Booking
export const deleteBooking = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.roles !== "admin") {
      filter.user = req.user.id;
    }

    const booking = await Booking.findOne(filter);
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    // If the booking wasn't already cancelled, release its seats back to the showtime pool
    if (booking.paymentStatus !== "cancelled") {
      await Showtime.findByIdAndUpdate(booking.showtime, {
        $pull: { bookedSeats: { $in: booking.seatsBooked } },
      });
    }

    await booking.deleteOne();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking deleted and seats released successfully",
      data: null,
    });
  } catch (error) {
  next(error);
  }
};

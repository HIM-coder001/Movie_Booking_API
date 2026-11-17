import Booking from "../models/booking.model.js";
import Showtime from "../models/showtime.model.js";
import crypto from "crypto";

//1.Create a booking with automatic seat locking
export const createBooking = async (req, res , next) => {
  try {
    const { showtime: showtimeId, seatsBooked } = req.body;

    // For now, we grab user ID from req.body (will come from JWT auth middleware later)
    const userId = req.body.user;

    if (!userId) {
      const error = new Error("User identification is required for booking");
      error.statusCode = 400;
      return next(error);
    }

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

    const booking = await Booking.create({
      showtime: showtimeId,
      user: userId,
      seatsBooked,
      totalAmount,
      bookingReference,
      paymentStatus: "pending",
    });

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
export const getAllBookings = async (req, res , next) => {
  try {
    //Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const safeLimit = Math.min(limit, 100);
    const offset = (page - 1) * safeLimit;

    //Filtering logic
    const filter = {};
    if (req.query.user) {
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
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bookings fetched successfully",
      pagination: {
        totalDocs: totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
        currentPage: page,
        limit,
      },
      count: bookings.length,
      data: bookings,
    });

  } catch (error) {
    next(error)
  }
};

//3.Get single booking by ID
export const getBooking = async ( req, res, next ) => {
  try {
    const booking = await Booking.findById( req.params.id )
    .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title posterImage duration genre' },
          { path: 'theater', select: 'name location address' }
        ]
      })
      .populate('user', 'name email');


    if(!booking){
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    };

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking fetched successfully",
      data: booking,
    });
    
  } catch (error) {
    next(error);
  }
}

//4. Update booking payment status (and release seats if cancelled)
export const updateBooking = async ( req , res , next ) => {
  try {
    const booking = await Booking.findByIdAndUpdate( req.params.id );
    if(!booking){
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    };

    if(booking.paymentStatus === 'completed') {
      const error = new Error("Cannot cancel a booking that is already completed");
      error.statusCode = 400;
      return next(error);
    };
     
    booking.paymentStatus = 'cancelled';
    await booking.save();

    // Release the seats back to the showtime pool
    await Showtime.findByIdAndUpdate(booking.showtime, {
      $pull: { bookedSeats: { $in: booking.seatsBooked } }
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Booking cancelled and seats released successfully",
      data: booking,
    });
    
  } catch (error) {
    next(error)
  }
};

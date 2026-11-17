import Booking from "../models/booking.model.js";
import Showtime from "../models/showtime.model.js";

//1.Create a booking with automatic seat locking
export const createBooking = async (req, res) => {
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

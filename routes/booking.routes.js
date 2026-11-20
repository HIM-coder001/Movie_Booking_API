import express from "express";
import { createBooking, deleteBooking, getAllBookings, getBooking, updateBooking } from "../controllers/booking.controllers.js";
import validate from "../middleware/validate.js";
import { bookingValidationSchema, cancelBookingSchema } from "../validators/booking.validator.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/mba/api/v1/bookings" , protect, validate(bookingValidationSchema) , createBooking );
router.get("/mba/api/v1/bookings" , protect, getAllBookings );
router.get("/mba/api/v1/bookings/:id" , protect, getBooking );
router.patch("/mba/api/v1/bookings/:id" , protect, validate(cancelBookingSchema) , updateBooking );
router.delete("/mba/api/v1/bookings/:id" , protect, deleteBooking );

export default router;
import express from "express";
import { createBooking, deleteBooking, getAllBookings, getBooking, updateBooking } from "../controllers/booking.controllers.js";
import validate from "../middleware/validate.js";
import { bookingValidationSchema, cancelBookingSchema } from "../validators/booking.validator.js";

const router = express.Router();

router.post("/mba/api/v1/bookings" , validate(bookingValidationSchema) , createBooking );
router.get("/mba/api/v1/bookings" ,getAllBookings );
router.get("/mba/api/v1/bookings/:id" , getBooking );
router.patch("/mba/api/v1/bookings/:id" , validate(cancelBookingSchema) , updateBooking );
router.delete("/mba/api/v1/bookings/:id" , deleteBooking );

export default router;
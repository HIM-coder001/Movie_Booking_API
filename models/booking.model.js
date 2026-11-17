import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  showtime: {
    type: mongoose.Types.ObjectId,
    ref: "Showtime",
    required: [true, "Booking must be linked to a showtime"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", //Will be linked to your User model when authentication is added
    required: [true, "Booking must be linked to a user"],
  },
  seatsBooked: {
    type: [String],
    required: [true, "At least one seat must be selected"],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A booking must contain at least one seat",
    },
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount cannot be negative"],
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ["pending", "completed", "cancelled"],
      message: "Status must be one of pending, completed, or cancelled",
    },
    default: 'pending' // Automatically sets to pending on creation
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true,
  },
}, 
{
    timestamps: true
});

// Indexing for quick user booking lookups and showtime audits
bookingSchema.index({ showtime: 1 });
bookingSchema.index({ user: 1 });

const Booking = mongoose.model( 'Booking' , bookingSchema);

export default Booking;
import { z } from "zod";

export const bookingValidationSchema = z.object({
  showtime: z.string().min(1, "Showtime ID is required"),
  seatsBooked: z
    .array(z.string().min(1, "Seat identifier cannot be empty"))
    .min(1, "At least one seat must be selected"),
});

export const updateBookingStatusSchema = z.object({
  paymentStatus: z.enum(["pending", "completed", "cancelled"], {
    errorMap: () => ({
      message: "Status must be pending, completed, or cancelled",
    }),
  }),
});

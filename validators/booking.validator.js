import { z } from 'zod';

export const bookingValidationSchema = z.object({
  showtime: z.string().min(1, "Showtime ID is required"),
  seatsBooked: z
    .array(z.string().min(1, "Seat identifier cannot be empty"))
    .min(1, "At least one seat must be selected"),
});

// Users can only cancel their own bookings; completion is handled via payment webhooks
export const cancelBookingSchema = z.object({
  paymentStatus: z.literal('cancelled', {
    errorMap: () => ({ message: "Status can only be updated to cancelled by the user" }),
  }),
});
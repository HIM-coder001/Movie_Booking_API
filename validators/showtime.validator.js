import { z } from "zod";

const showtimeValidationSchema = z.object({
    movie: z.string().min( 1 , "Movie ID is required"),
    theater: z.string().min( 1 , "Theater ID is required"),
    screenNumber: z.number().int().min( 1 , "Screen number must be at least 1"),
    startTime: z.iso.datetime({ message: "Invalid ISO datetime formart for start time"}),
    ticketPrice: z.number().min( 0 , "Ticket price cannot be negative"),
    totalSeats: z.number().int().min( 1 , "Total seats must be at least 1"),
    isActive: z.boolean().optional()
})

export default showtimeValidationSchema;

export const updateShowtimeValidation = showtimeValidationSchema.partial();
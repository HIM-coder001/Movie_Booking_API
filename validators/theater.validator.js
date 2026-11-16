import { z } from "zod";

export const theaterValidationSchema = z.object({
    name: z.string().trim().min( 1 , "Theater name cannot be empty"),
    location: z.string().trim().min(1, "Location/City is required"),
    address: z.string().trim().min(1 , "Address is required"),
    totalScreens: z.number().int().min(1 , "A theater must have at least 1 screen"),
    amenities: z.array(z.string()).optional(),
    isActive:  z.boolean().optional()
});

export const updateTheaterValidationSchema = theaterValidationSchema.partial();
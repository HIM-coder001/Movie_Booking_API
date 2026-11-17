import { z } from "zod";
const urlRegex = /^https?:\/\/.+/;

const movieValidationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters"),

  casts: z
    .array(
      z
        .string({
          required_error: "Cast member is required",
          invalid_type_error: "Each cast member must be a string",
        })
        .trim()
        .min(1, "Cast member cannot be empty"),
    )
    .min(1, "Casts cannot be empty"),

  trailerUrl: z.url({
    required_error: "Trailer URL is required",
    invalid_type_error: "Trailer URL must be a valid URL",
  }),

  language: z
    .string({
      required_error: "Language is required",
      invalid_type_error: "Language must be a string",
    })
    .trim()
    .min(1, "Language cannot be empty"),

  releaseDate: z.coerce.date({
    required_error: "ReleaseDate is required",
    invalid_type_error: "ReleaseDate must be a valid date",
  }),

  director: z
    .string({
      required_error: "Director is required",
      invalid_type_error: "Director must be a string",
    })
    .trim()
    .min(1, "Director cannot be empty"),

  duration: z
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .min(1, "Duration must be at least 1 minute"),

  genre: z
    .array(
      z
        .string({
          required_error: "Genre is required",
          invalid_type_error: "Each genre must be a string",
        })
        .trim()
        .min(1, "Genre cannot be empty"),
    )
    .min(1, "At least one genre is required"),

  posterImage: z
    .string({
      required_error: "Poster image URL is required",
      invalid_type_error: "Poster image URL must be a string",
    })
    .regex(urlRegex, "Poster image must be a valid HTTP or HTTPS URL"),

  releaseStatus: z.enum(["RELEASED", "COMING SOON", "BLOCKED", "ENDED"], {
    errorMap: () => ({
      message:
        "Release status must be one of 'RELEASED', 'COMING SOON', 'BLOCKED', 'ENDED'",
    }),
  }),
});

export const updateMovieValidationSchema = movieValidationSchema.partial();

export default movieValidationSchema;

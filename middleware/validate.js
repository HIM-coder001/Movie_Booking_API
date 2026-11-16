import { ZodError } from 'zod';

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod stores validation issues in .issues, not .errors
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: formattedErrors,
        });
      }

      // Pass non-Zod errors down to your global error handler
      next(error);
    }
  };
};

export default validate;
const errorHandler = (err , req ,res , next ) => {
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || 'Internal Server Error';

    if(err.name === 'CastError'){
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    if(err.code === 11000){
        statusCode = 409;
        message = `A record with this unique field already exists`;
    }

    if(err.name === 'ValidationError'){
        statusCode = 400;
        message = Object.values(err.errors).map((value) => value.message).join(', ');
    }

    console.error({
    timestamp: new Date().toISOString(),
    statusCode,
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    // Only show stack trace if we are in development mode for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // 4. Send the final standardized error response to the client
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Include stack trace only during development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
export const sendSuccess = (res, data, message = 'success', statusCode = 200, pagination = null) => {
    const response = {
        success: true,
        message,
        data
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
}

export const sendError = (res, error, message = 'error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error
    })
}

 
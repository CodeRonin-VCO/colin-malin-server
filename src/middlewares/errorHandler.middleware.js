const { NODE_ENV } = process.env;

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || 500;
    const isDev = NODE_ENV === "dev";

    console.error({
        method: req.method,
        path: req.originalUrl,
        statusCode,
        name: error.name,
        message: error.message,
        stack: error.stack
    });

    // Message visible côté client
    const clientMessage =
        error.expose === true
            ? error.message
            : "Internal server error";

    if (isDev) {
        return res.status(statusCode).json({
            statusCode,
            name: error.name,
            message: clientMessage,
            stack: error.stack
        });
    }

    return res.status(statusCode).json({
        message: clientMessage
    });
}

export default errorHandler;
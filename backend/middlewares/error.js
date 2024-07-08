export default (err, req, res, next) => {

    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    if(process.env.NODE_DEV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
        });
    }

    if(process.env.NODE_DEV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message,
        });
    }

};
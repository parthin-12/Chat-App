import ErrorHandler from "../utils/utilsErrorHandler.js";

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Sever Error";

// wrong mongodb id error
    if (err.name == "CastError") {
        const message = `Resource not found : Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

// duplicate key error

    if(err.code==11000){
        const message = `Already this ${Object.keys(err.keyValue)} exists`;
        err = new ErrorHandler(message, 400);       
    }

// JWT token error

    if(err.name=="JsonWebTokenError"){
        const message = `Token invalid,Try again`;
        err = new ErrorHandler(message, 400);     
    }

// JWT token expires

     if(err.name=="TokenExpireError"){
        const message = `Token is Expried,Try again`;
        err = new ErrorHandler(message, 400);     
    }   

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
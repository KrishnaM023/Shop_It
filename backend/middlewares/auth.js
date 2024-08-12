import catchAssyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorhandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Check if user is authenticated or not
export default isAuthenticatedUser = catchAssyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);

    next();
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`, 
                    403
                )
            );
        }

        next();
    };
};

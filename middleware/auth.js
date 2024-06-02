import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Add the decoded token to the request object

            // Check if user exists
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token could not be decoded",
            });
        }

    } catch (err) {
        console.error("Error in auth middleware:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};

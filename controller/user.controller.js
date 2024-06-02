import User from "../models/user.model.js"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


//register User controller
export const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;

        // Check for required fields
        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // Check if user already exists
        const existUser = await User.findOne({
            $or: [{ mobile }, { email }],
        });
        if (existUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email or mobile",
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 12);

        // Create the user
        const userData = await User.create({ ...req.body, password: hashPassword });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userData,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error User connot created",
        });
    }
};


//login User controler

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // Check if user exists
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        // Verify password
        const isMatchPassword = await bcrypt.compare(password, existUser.password);
        if (!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Create JWT token
        const payload = {
            id: existUser._id,
            email: existUser.email,
            mobile: existUser.mobile,
            role: existUser.role,
        };

        const options = {
            expiresIn: "24h",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        existUser.token = token
        await existUser.save()

        // Set token as a cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
        };

        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                mobile: existUser.mobile,
                role: existUser.role,
            },
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Update the user document to set the token to undefined
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { token: undefined } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Clear the token cookie
        res.cookie("token", "", {
             expires: new Date(0), httpOnly: true,
            }).status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "unable to logout",
        });
    }
};

//get userby id 
export const getByIdUser = async(req , res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            data:user,
            message : "User data is fetched"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "Cannot fetch user",
        });
    }
}
//get all user with pagination
export const getAllUser = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 
        const page = parseInt(req.query.page) || 1; 
        const skip = (page - 1) * limit;

        const users = await User.find().limit(limit).skip(skip).exec();

        const totalCount = await User.countDocuments();

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        res.status(200).json({
            success: true,
            data: users,
            totalCount,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                limit,
            },
            message: "User data fetched successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//delete user
export const deleteUser = async(req , res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            message : "User deleted successfully"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "Cannot delete user",
        });
    }
}

//upadate user
export const updateUser = async(req , res)=>{
    try{
        const userId = req.user.id;
        const hashPassword = await bcrypt.hash(req.body.password , 12)

        const user = await User.findByIdAndUpdate(userId , {...req.body , password : hashPassword} , {new : true});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            data:user,
            message : "User data is updated"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "user cannot be updated",
        });
    }
}


//change password
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, re_typePassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (newPassword !== re_typePassword) {
            return res.status(400).json({
                success: false,
                message: "New password and re_type password do not match."
            });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect old password."
            });
        }

       
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, { $set: { password: hashedNewPassword } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password."
        });
    }
};

//forget password
export const forgetPassword = async (req, res) => {
    try {
        const { email, password, re_typePassword } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }
        
        const existUser = await User.findOne({ email });

        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered.",
            });
        }

        if (password !== re_typePassword) {
            return res.status(400).json({
                success: false,
                message: "New password and re_type password do not match.",
            });
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(existUser._id, {$set : {password: hashedNewPassword} }, {new : true});

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password.",
        });
    }
};

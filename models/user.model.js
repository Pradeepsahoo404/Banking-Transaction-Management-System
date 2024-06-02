import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "manager", "regularUser"],
        default: "regularUser",
    },
    token: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

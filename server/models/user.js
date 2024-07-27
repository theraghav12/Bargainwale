import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Accountant", "Approver"]
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            email: this.email,
            Allow: this.Allow,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "72h",
        }
    );
};

const User = mongoose.model("Users", userSchema);
export default User;
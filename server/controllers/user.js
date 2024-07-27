import User from "../models/user.js";
import bcrypt from "bcrypt";

const UserController = {
    register: async (req, res) => {
        try {
            const { email, password, role } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({
                    success: "false",
                    message: "Email, password and role are required"
                })
            }
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    success: "false",
                    message: "User already exists"
                })
            }
            const newUser = new User({ email, password, role });
            await newUser.save();
            return res.status(200).json({
                success: "true",
                message: "User Added"
            })
        }
        catch (err) {
            return res.status(404).json({
                success: "false",
                message: err.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.send(400).json({
                    success: "false",
                    message: "Email and password both are required"
                })
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(409).json({
                    success: "false",
                    message: "User not found"
                })
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: "false",
                    message: "Invalid credentials"
                })
            }
            const token = await user.generateRefreshToken();
            return res.status(200).json({
                success: "true",
                message: "Logged in successfully",
                token
            })
        }
        catch (err) {
            return res.status(400).json({
                success: "false",
                message: err.message
            })
        }
    },
}

export default UserController;
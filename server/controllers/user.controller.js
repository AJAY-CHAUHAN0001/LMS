import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All field are required.'
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exits with this email."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            success: true,
            message: "Register Successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register."
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email."
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password."
            })
        }

        user = await User.findOne({ email }).select("-password");

        generateToken(res, user, `welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login."
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out Successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout."
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate({ path: "enrolledCourses", populate: { path: "creator", select: "-password" } });

        if (!user) {
            return res.status(404).json({
                message: "Profile not found.",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile."
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        // extract public id of the old image form the url is it exits.
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0] //extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updateData = { name, photoUrl }
        const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            user: updateUser,
            message: "Profile Updated Successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile."
        })
    }
}
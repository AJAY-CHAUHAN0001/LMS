import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })

        return res.status(201).json({
            success: true,
            message: "Course created.",
            course
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course.",
            success: false
        })
    }
}

export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;

        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }

        // if categories selected
        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }

        // define the sorting order
        const sortOptions = {};
        if (sortByPrice === 'low') {
            sortOptions.coursePrice = 1; // sort by price in ascending order
        } else if (sortByPrice === 'high') {
            sortOptions.coursePrice = -1; // sort by price in descending order
        }

        let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses || []
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to search course.",
            success: false
        })
    }
}

export const getPublishedCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                success: false,
                message: "Courses not found."
            })
        }

        return res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get publish courses.",
            success: false
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;

        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
                courses: []
            })
        }

        return res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch course.",
            success: false
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "CourseTitle and Category are required."
            })
        }

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            })
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            // upload thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            course
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit course.",
            success: false
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!."
            })
        }

        return res.status(200).json({
            course
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course By ID.",
            success: false
        })
    }
}

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                success: false,
                message: "LectureTitle is required."
            })
        }

        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            success: true,
            message: "Lecture created successfully.",
            lecture
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture.",
            success: false
        })
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!."
            })
        }

        return res.status(200).json({
            success: true,
            lectures: course.lectures
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture.",
            success: false
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found!."
            })
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures?.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully.",
            lecture
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lecture.",
            success: false
        })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found!."
            })
        }

        // delete lecture form cloudinary 

        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId)
        }

        // Remove the lecture reference from the associated course

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )

        return res.status(200).json({
            message: "Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture.",
            success: false
        })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!."
            })
        }

        // delete thumbnail from cloudinary
        if (course.courseThumbnail) {
            await deleteMediaFromCloudinary(course.courseThumbnail);
        }

        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        )

        await CoursePurchase.deleteMany({ courseId: courseId });

        await CourseProgress.deleteMany({ courseId: courseId });

        return res.status(200).json({
            success: true,
            message: "Course removed successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture.",
            success: false
        })
    }
}

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found!."
            })
        }

        return res.status(200).json({
            lecture
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture By Id.",
            success: false
        })

    }
}

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            })
        }

        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished"
        return res.status(200).json({
            success: true,
            message: `Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status.",
            success: false
        })
    }
}
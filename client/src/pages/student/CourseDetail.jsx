import { BuyCourseButton } from "@/components/BuyCourseButton";
import { CourseDetailSkeleton } from "@/components/CourseDetailSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

export const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;

  const navigate = useNavigate();

  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetCourseWithStatusQuery(courseId);
    
  const { course, purchased } = data || {};

  useEffect(() => {
    refetch();
  }, [data]);

  if (isLoading) return <CourseDetailSkeleton course={course} />;

  if (isError)
    return (
      <h1 className="flex justify-center items-center min-h-120 md:min-h-screen text-2xl md:text-xl font-bold text-gray-400 dark:text-gray-100">
        Failed to load course detail..
      </h1>
    );

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };


  return (
    <div className="mt-15 space-y-5 dark:bg-[#141414]">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course.subTitle}</p>
          <p>
            Created By{""}{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last Updated {course?.createdAt.split("T")[0]} </p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm dark:text-gray-50"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className={"space-y-3"}>
              {course.lectures.map((lecture) => (
                <div
                  key={lecture?._id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span>
                    {lecture.isPreviewFree && purchased ? (
                     <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture?.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className=" flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width={"100%"}
                  height={"100%"}
                  url={course?.lectures[0]?.videoUrl}
                  controls={true}
                />
              </div>
              <h1>{course?.lectures[0]?.lectureTitle}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                ₹{course.coursePrice}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center ">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-xl"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

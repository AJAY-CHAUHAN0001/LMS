import { CourseProgressSkeleton } from "@/components/CourseProgressSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { ArrowLeft, CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch, error } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [
    completeCourse,
    {
      data: markCompleteData,
      isSuccess: completedSuccess,
      error: markCompleteError,
      isError: markCompleteIsError,
    },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    {
      data: markInCompleteData,
      isSuccess: inCompletedSuccess,
      error: inCompleteError,
      isError: inCompleteIsError,
    },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  const { courseDetails, progress, completed } = data?.data || {};
  const { courseTitle } = courseDetails || {};

  // initialize the first lecture is not exits
  const initialLecture =
    currentLecture || (courseDetails?.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    // handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message || "Mark as complete");
    }

    if (markCompleteIsError) {
      toast.error(markCompleteError?.data?.message || "Fail to mark.");
    }
  }, [completedSuccess, markCompleteIsError]);

  useEffect(() => {
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData?.message || "Mark as incomplete");
    }

    if (inCompleteIsError) {
      toast.error(inCompleteError?.data?.message || "Fail to Unmark");
    }
  }, [inCompletedSuccess, inCompleteIsError]);

  if (isLoading) {
    return <CourseProgressSkeleton courseDetails={courseDetails} />;
  }

  if (isError)
    return (
      <h1 className="flex justify-center items-center min-h-120 md:min-h-screen text-2xl md:text-xl font-bold text-gray-400 dark:text-gray-100">
        Failed to load course detail..
      </h1>
    );

  return (
    <div>
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* display course name. */}
      <div className="flex justify-between mb-8">
        <div className="flex gap-3">
          <Link to={`/course-detail/${courseId}`}>
          <Button
            variant={"outline"}
            size="icon"
            className={"rounded-full cursor-pointer"}
          >
            <ArrowLeft />
          </Button>
          </Link>
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
        </div>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          className={"cursor-pointer"}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as completd"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* video section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(
                  currentLecture?._id || initialLecture?._id
                )
              }
            />
          </div>

          <div className="mt-2">
            <h3 className="text-lg font-medium">
              {`Lecture ${
                courseDetails?.lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture?._id)
                ) + 1
              } : ${
                currentLecture?.lectureTitle || initialLecture?.lectureTitle
              }`}
            </h3>
          </div>
        </div>
        {/* lecture sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures?.map((lecture) => (
              <Card
                key={lecture?._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture?._id === currentLecture?._id
                    ? "bg-gray-200 dark:text-gray-800"
                    : "dark:bg-gray-800"
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture?.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture?._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600 "
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>

    </div>
  );
};

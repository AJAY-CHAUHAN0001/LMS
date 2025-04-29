import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { toast } from "sonner";
import { Lecture } from "./Lecture";

export const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();

  const params = useParams();
  const courseId = params.courseId;

  const [createLecture, { data, error, isSuccess, isLoading, isError }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    error: lectureError,
    isError: lectureIsError,
    isSuccess: lectureIsSuccess,
    isLoading: lectureIsLoading,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created.");
      refetch();
    }

    if (isError) {
      toast.error(error?.data?.message || "Fail to create.");
    }
  }, [data, isSuccess, isError]);

  return (
    <div className="flex-1 mx-10 ">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture.
        </h1>
        <p className="text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates,
          eaque.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            name="courseTitle"
            placeholder="Your lecture title name"
          />
        </div>
        <div className="flex items-center gap-3 ">
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button
            disabled={isLoading}
            onClick={createLectureHandler}
            className={"cursor-pointer"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait..
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureIsLoading ? (
            <p className="text-lg font-bold text-gray-400 dark:text-gray-100">
              Loading lectures..
            </p>
          ) : lectureIsError ? (
            <p className="text-lg font-bold text-gray-400 dark:text-gray-100">
              Failed to load lectures..
            </p>
          ) : lectureData?.lectures?.length === 0 ? (
            <p className="text-lg font-bold text-gray-400 dark:text-gray-100">
              No Lectures Available
            </p>
          ) : (
            lectureData?.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

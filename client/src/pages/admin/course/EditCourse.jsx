import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { CourseFormSkeleton, CourseTab } from "./CourseTab";
import { useGetCourseByIdQuery } from "@/features/api/courseApi";

export const EditCourse = () => {
  const params = useParams();
  const courseId = params.courseId;

  const {isLoading} = useGetCourseByIdQuery(courseId);

  if (isLoading) return <CourseFormSkeleton />;

  return (
    <div className="flex-1 p-5 md:p-0">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to={"lecture"}>
          <Button
            variant={"link"}
            className={"cursor-pointer hover:text-blue-600"}
          >
            Go to lectures page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

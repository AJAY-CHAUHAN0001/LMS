import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";
import { Course } from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

export const Courses = () => {
  const { data, isLoading, isError, refetch } =
    useGetPublishedCourseQuery();

  if (isError) {
    <h1 className="flex justify-center text-lg font-bold text-gray-400 dark:text-gray-100">
      Some Error Occurred while fetching courses.
    </h1>;
  }

  useEffect(() => {
    refetch();
  }, [data]);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: data?.courses?.length }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden dark:bg-[#141414]">
      <Skeleton className="w-full h-36 bg-gray-300 dark:bg-gray-200" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-200" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-200" />
          </div>
          <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-200" />
        </div>
        <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-200" />
      </div>
    </div>
  );
};

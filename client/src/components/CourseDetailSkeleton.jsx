import React from "react";
import { Skeleton } from "./ui/skeleton";

export const CourseDetailSkeleton = ({ course }) => {
  return (
    <div className="mt-15 space-y-5">
      <div className=" text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <Skeleton className="h-8 w-3/4 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-5 w-1/2 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-4 w-1/3 bg-gray-300 dark:bg-gray-200" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-200" />
            <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-200" />
          </div>
          <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-200" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <Skeleton className="h-6 w-40 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-20 w-full bg-gray-300 dark:bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/4 bg-gray-300 dark:bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-200" />
            {course?.lectures?.map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <Skeleton className="w-full aspect-video mb-4 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-5 w-3/4 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-6 w-20 my-2 bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-10 w-full mt-4 bg-gray-300 dark:bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Skeleton } from "./ui/skeleton";

export const CourseProgressSkeleton = ({courseDetails}) => {
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* Course title and completion button */}
      <div className="flex justify-between mb-4">
        <Skeleton className="h-8 w-1/3 bg-gray-300 dark:bg-gray-200" />
        <Skeleton className="h-8 w-24 bg-gray-300 dark:bg-gray-200" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <Skeleton className="w-full aspect-video rounded-md bg-gray-300 dark:bg-gray-200" />
          <div className="mt-2">
            <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-200" />
          </div>
        </div>

        {/* Lecture list */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <Skeleton className="h-6 w-1/2 mb-4 bg-gray-300 dark:bg-gray-200" />
          <div className="flex-1 space-y-3">
            {courseDetails?.lectures.map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-200" />
                  <Skeleton className="h-5 w-24 bg-gray-300 dark:bg-gray-200" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-gray-300 dark:bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

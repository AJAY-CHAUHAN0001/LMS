import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { ArrowLeft, Edit } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CourseTable = () => {
  const { data, isLoading, refetch } = useGetCreatorCourseQuery();

  const navigate = useNavigate();

  if (isLoading) {
    <h1 className="flex items-center justify-center h-screen w-full">
      Loading...
    </h1>;
  }

  useEffect(() => {
    refetch();
  }, []);

  const courseLength = data?.courses.length;

  return (
    <div className="p-3 md:p-0">
      <div className="flex gap-4">
        <Link to="/admin/dashboard">
          <Button
            variant={"outline"}
            size="icon"
            className={"lg:hidden rounded-full cursor-pointer"}
          >
            <ArrowLeft />
          </Button>
        </Link>
        <Button className={"cursor-pointer"}>
          <Link to="create">Create a new course</Link>
        </Button>
      </div>
      {courseLength === 0 ? (
        <h1 className="text-lg font-bold text-gray-400 dark:text-gray-100 mt-10">
          You have not created any courses. To Create a Course Click On Create a
          new course.
        </h1>
      ) : (
        <Table className="mt-10">
          <TableCaption>A list of your recent Courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.courses.map((course) => (
              <TableRow key={course?._id}>
                <TableCell className="font-medium truncate">
                  {course?.courseTitle || "NA"}
                </TableCell>
                <TableCell>{course?.coursePrice || "NA"}</TableCell>
                <TableCell>
                  <Badge>
                    {course?.isPublished ? "Published" : "Draft" || "NA"}
                  </Badge>{" "}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    className={"cursor-pointer"}
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => navigate(`${course._id}`)}
                  >
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

export const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, error, isError, isLoading, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created.");
      navigate("/admin/course");
    }

    if (isError) {
      toast.error(error?.data?.message || "Fail to create course.");
    }
  }, [error, isError, isSuccess]);

  return (
    <div className="flex-1 mx-10 ">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add course, add some basic course details for your new course.
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
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            name="courseTitle"
            placeholder="Your Course Name"
          />
        </div>
        <div className="space-y-3">
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="data science">data science</SelectItem>
                <SelectItem value="data analyst">data analyst</SelectItem>
                <SelectItem value="react js">react js</SelectItem>
                <SelectItem value="mern stack development">
                  mern stack development
                </SelectItem>
                <SelectItem value="java full stack">java full stack</SelectItem>
                <SelectItem value="frontend development">
                  frontend development
                </SelectItem>
                <SelectItem value="backend development">
                  backend development
                </SelectItem>
                <SelectItem value="python full stack">
                  python full stack
                </SelectItem>
                <SelectItem value="python">python</SelectItem>
                <SelectItem value="javascript">javascript</SelectItem>
                <SelectItem value="mongodb">mongodb</SelectItem>
                <SelectItem value="machine learning">
                  machine learning
                </SelectItem>
                <SelectItem value="next js">next js</SelectItem>
                <SelectItem value="docker">docker</SelectItem>
                <SelectItem value="html">html</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 ">
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={() => navigate("/admin/course")}
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            onClick={createCourseHandler}
            className={"cursor-pointer"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait..
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

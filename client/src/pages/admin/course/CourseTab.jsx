import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const CourseTab = () => {
  const params = useParams();
  const courseId = params.courseId;

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const navigate = useNavigate();

  const [
    removeCourse,
    {
      data: removeData,
      isLoading: removeIsLoading,
      isSuccess: removeIsSuccess,
      error: removeError,
      isError: removeIsError,
    },
  ] = useRemoveCourseMutation();

  const [editCourse, { data, error, isError, isLoading, isSuccess }] =
    useEditCourseMutation();

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const { data: courseByIdData, refetch } = useGetCourseByIdQuery(courseId);

  const course = courseByIdData?.course || {};

  useEffect(() => {
    refetch();
    if (course) {
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
      setPreviewThumbnail(course.courseThumbnail);
    }
  }, [course]);

  const [publishCourse, { isLoading: publishIsLoading }] =
    usePublishCourseMutation();

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });

      if (response.data) {
        refetch();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message);
    }
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  };

  const removeCourseHandler = async () => {
    if (course?.lectures.length === 0) {
      await removeCourse(courseId);
    } else {
      toast(
        "Before remove the course,Please remove all lecture inside this course."
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Updated.");
    }

    if (isError) {
      toast.error(error?.data?.message || "Fail to update");
    }
  }, [data, isSuccess, isError]);

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData?.message || "remove course");
    }

    if (removeIsError) {
      toast.error(removeError?.response?.data?.message || "Fail to remove!!");
    }
  }, [removeIsSuccess, removeIsError, removeError]);

  return (
    <Card>
      <CardHeader className={"flex flex-row justify-between"}>
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save When you're done.
          </CardDescription>
        </div>
        <div className="space-x-3 flex">
          <Button
            disabled={
              courseByIdData?.course.lectures.length === 0 || publishIsLoading
            }
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {publishIsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait.
              </>
            ) : (
              <>
                {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
              </>
            )}
          </Button>
          <Button disabled={removeIsLoading} onClick={removeCourseHandler} className={"cursor-pointer"}>
            {removeIsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />Please wait.
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Title"
            />
          </div>
          <div className="space-y-2">
            <Label>SubTitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="SubTitle"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5 ">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select onValueChange={selectCategory}>
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
                    <SelectItem value="java full stack">
                      java full stack
                    </SelectItem>
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
            <div className="space-y-2">
              <Label>Course Level *</Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Course Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price in [INR] *</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="₹"
                className={"w-fit"}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Course Thumbnail *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={selectThumbnail}
              className={"w-fit cursor-pointer"}
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64"
                alt="courseThumbnail"
              />
            )}
          </div>
          <div className="space-x-2">
            <Button
              variant={"outline"}
              className={"cursor-pointer"}
              onClick={() => navigate("/admin/course")}
            >
              Cancel
            </Button>
            <Button
              className={"cursor-pointer"}
              disabled={isLoading}
              onClick={updateCourseHandler}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait.
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CourseFormSkeleton = () => {
  return (
    <div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-6 w-[300px] bg-gray-300 dark:bg-gray-200" />
          <Skeleton className="h-8 w-[140px] bg-gray-300 dark:bg-gray-200" />
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-60 bg-gray-300 dark:bg-gray-200" />
            <Skeleton className="h-4 w-80 bg-gray-300 dark:bg-gray-200" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-24 bg-gray-300 dark:bg-gray-200" />
            <Skeleton className="h-10 w-28 bg-gray-300 dark:bg-gray-200" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mt-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-300 dark:bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-300 dark:bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-40 w-full bg-gray-300 dark:bg-gray-200" />
            </div>

            <div className="flex items-center gap-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-200" />
                <Skeleton className="h-10 w-[180px] bg-gray-300 dark:bg-gray-200" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-200" />
                <Skeleton className="h-10 w-[180px] bg-gray-300 dark:bg-gray-200" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28 bg-gray-300 dark:bg-gray-200" />
                <Skeleton className="h-10 w-[120px] bg-gray-300 dark:bg-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-10 w-64 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-32 w-64 rounded-md bg-gray-300 dark:bg-gray-200" />
            </div>

            <div className="space-x-2 flex">
              <Skeleton className="h-10 w-24 bg-gray-300 dark:bg-gray-200" />
              <Skeleton className="h-10 w-28 bg-gray-300 dark:bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

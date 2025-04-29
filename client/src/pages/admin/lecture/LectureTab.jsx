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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetCourseByIdQuery,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "https://lms-xwnv.onrender.com/api/v1/media";

export const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;

  const [editLecture, { data, error, isError, isSuccess, isLoading }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeLectureData,
      error: removeLectureError,
      isSuccess: removeLectureIsSuccess,
      isLoading: removeLectureIsLoading,
      isError: removeLectureIsError,
    },
  ] = useRemoveLectureMutation();

  const { data: lectureByIdData, refetch } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureByIdData?.lecture;

  useEffect(() => {
    refetch();
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const fileChangeHandler = async (e) => {
    const file = e.target?.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res?.data?.data?.url,
            publicId: res?.data?.data?.public_id,
          });
          setBtnDisable(false);

          toast.success(res?.data?.message || "Video Uploaded.");
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Video Upload failed.");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Update lecture.");
    }

    if (isError) {
      toast.error(error?.data?.message || "Fail to update lecture.");
    }
  }, [data, isSuccess, isError]);

  useEffect(() => {
    if (removeLectureIsSuccess) {
      toast.success(removeLectureData?.message || "Remove lecture.");
    }

    if (removeLectureIsError) {
      toast.error(
        removeLectureError?.data?.message || "Fail to remove lecture."
      );
    }
  }, [removeLectureData, removeLectureIsSuccess, removeLectureIsError]);

  return (
    <Card>
      <CardHeader className={"justify-between space-y-2"}>
        <div className="space-y-2">
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>
            Make Changes and Click Save When done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 ">
          <Button
            disabled={removeLectureIsLoading}
            variant={"destructive"}
            className={"cursor-pointer"}
            onClick={removeLectureHandler}
          >
            {removeLectureIsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait..
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={"space-y-5"}>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            placeholder="LectureTitle"
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Video<span className="text-red-600">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className={"w-fit cursor-pointer"}
          />
          {lecture?.videoUrl ? (
            <div className="text-sm text-gray-500 dark:text-gray-100">
              Video is available
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-100">
              Video not uploaded
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is This Video Free ?</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
          <Button
            disabled={isLoading}
            className={"cursor-pointer"}
            onClick={editLectureHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait..
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

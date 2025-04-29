import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { LectureTab } from "./LectureTab";

export const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  return (
    <div>
      <div className="flex items-center justify-between mb-5 space-y-5 ">
        <div className="flex items-center gap-5">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button
              size="icon"
              variant={"outline"}
              className={"rounded-full cursor-pointer"}
            >
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Update Your Lecture</h1>
        </div>
      </div>
        <LectureTab />
    </div>
  );
};

import { useGetCourseWithStatusQuery } from "@/features/api/purchaseApi";
import React from "react";
import { Navigate, useParams } from "react-router-dom";

export const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();

  const { data, isLoading } = useGetCourseWithStatusQuery(courseId);

  if (isLoading) return <p>Loading..</p>;

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};

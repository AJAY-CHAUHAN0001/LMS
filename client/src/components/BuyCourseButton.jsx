import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, error, isLoading, isSuccess, isError },
  ] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(
          error?.response?.data?.message || "Invalid response from server."
        );
      }
    }

    if (isError) {
      toast.error(
        error?.response?.data?.message || "Fail to create checkout session."
      );
    }
  }, [isSuccess, isError, error, data]);
  return (
    <>
      <Button
        disabled={isLoading}
        onClick={purchaseCourseHandler}
        className="w-full cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait..
          </>
        ) : (
          "Purchase Course"
        )}
      </Button>
    </>
  );
};

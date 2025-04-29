import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Course } from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

export const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data,isLoading,refetch } = useLoadUserQuery();

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      error,
      isSuccess,
      isError,
      
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const user = data && data.user;

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile Updated.");
    }

    if (isError) {
      toast.error(error?.data?.message || "Fail to update profile.");
    }
  }, [updateUserData, error, isSuccess, isError]);

  if(isLoading) return <ProfileSkeleton user={user}/>
  
  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center ">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="photoUrl"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-200 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-200 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-200 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2 hover:cursor-pointer">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make Changes to your profile here. Click save When you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    onChange={onChangeHandler}
                    accept="image/*"
                    className="col-span-3 cursor-pointer"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                  className="cursor-pointer"
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Please wait..
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="text-lg font-medium mt-10">
          Courses you're enrolled in :
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length === 0 ? (
            <h1>You haven't enrolled yet.</h1>
          ) : (
            user?.enrolledCourses?.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton = ({user}) => {

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <Skeleton className="h-8 w-32 mb-4 mx-auto md:mx-0 bg-gray-300 dark:bg-gray-200" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Skeleton className="h-32 w-32 rounded-full mb-4 bg-gray-300 dark:bg-gray-200" />
        </div>

        <div className="w-full">
          <div className="mb-2">
            <Skeleton className="h-6 w-48 bg-gray-300 dark:bg-gray-200" />
          </div>
          <div className="mb-2">
            <Skeleton className="h-6 w-64 bg-gray-300 dark:bg-gray-200" />
          </div>
          <div className="mb-4">
            <Skeleton className="h-6 w-40 bg-gray-300 dark:bg-gray-200" />
          </div>

          <Skeleton className="h-9 w-24 bg-gray-300 dark:bg-gray-200" />
        </div>
      </div>

      <div>
        <Skeleton className="h-6 w-72 mt-10 mb-4 bg-gray-300 dark:bg-gray-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length === 0 ? (
            <Skeleton className="h-6 w-full bg-gray-300 dark:bg-gray-200" />
          ) : (
           user?.enrolledCourses?.map((course) => (
              <Skeleton
                key={course?._id}
                className="h-40 w-full rounded-xl bg-gray-300 dark:bg-gray-200"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

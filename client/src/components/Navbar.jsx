import { LogOut, Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkMode } from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess, isError, error }] =
    useLogoutUserMutation();

  const navigate = useNavigate();

  const logoutUserHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout Successfully.");
      navigate("/login");
    }
    if (isError) {
      toast.error(error.message || "Fail to logout.");
    }
  }, [isSuccess, isError, error]);

  return (
    <div className="h-16 dark:bg-[#141414] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 ">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2 ml-10">
          <School size={"30"} />
          <h1
            className="hidden md:block font-extrabold text-2xl md:cursor-pointer"
            onClick={() => navigate("/")}
          >
            E-Learning
          </h1>
        </div>
        {/* user icon */}
        <div className="flex items-center gap-8 mr-10">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                    className={"cursor-pointer"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutUserHandler}
                    className={"cursor-pointer gap-33"}
                  >
                    Log out
                    <LogOut className="text-gray-800 dark:text-gray-100" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-lg justify-center text-blue-900 dark:text-blue-300 font-semibold">
                      <Link to="admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className=" flex items-center gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className=" font-extrabold text-2xl" onClick={() => navigate("/")}>
          E-Learning
        </h1>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

const MobileNavbar = ({ user }) => {
  const [logoutUser, { data, isSuccess, isError, error }] =
    useLogoutUserMutation();

  const navigate = useNavigate();

  const logoutUserHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout Successfully.");
      navigate("/login");
    }
    if (isError) {
      toast.error(error.message || "Fail to logout.");
    }
  }, [isSuccess, isError, error]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gray-200 hover:cursor-pointer"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetClose>
            <SheetTitle onClick={() => navigate("/")}>E-Learning</SheetTitle>
          </SheetClose>
          <SheetClose>
            <div className="flex mt-5">
              <DarkMode />
            </div>
          </SheetClose>
        </SheetHeader>
        {/* <Separator className="mr-2" /> */}
        {user ? (
          <>
            <nav className="flex flex-col space-y-4 p-3">
              <span onClick={() => navigate("my-learning")}>My Learning</span>
              <span onClick={() => navigate("profile")}>Edit Profile</span>
              <p onClick={logoutUserHandler} className="flex gap-33">
                Log Out
                <span className="hidden">
                  <LogOut
                    size={"20"}
                    className="text-gray-800 dark:text-gray-100"
                  />
                </span>
              </p>
            </nav>
            {user?.role === "instructor" && (
              <SheetFooter className="mt-0">
                <SheetClose asChild>
                  <Button
                    onClick={() => navigate("/admin/dashboard")}
                    type="submit"
                  >
                    Dashboard
                  </Button>
                </SheetClose>
              </SheetFooter>
            )}
          </>
        ) : (
          <SheetFooter className="mt-0">
            <SheetClose>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => navigate("/login")}
                  type="submit"
                  variant={"outline"}
                >
                  Login
                </Button>
                <Button onClick={() => navigate("/login")} type="submit">
                  Signup
                </Button>
              </div>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

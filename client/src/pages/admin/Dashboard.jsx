import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Dashboard = () => {
  const { data, isError, isLoading, refetch } = useGetPurchasedCoursesQuery();

  useEffect(() => {
    refetch();
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError)
    return (
      <h1 className="text-2xl md:text-xl font-bold text-gray-400 dark:text-gray-100">
        Failed to get purchased course.
      </h1>
    );

  const { purchasedCourses } = data || [];

  const courseData = purchasedCourses?.map((course) => ({
    name: course?.courseId?.courseTitle,
    price: course?.courseId?.coursePrice,
  }));

  const totalRevenue = purchasedCourses?.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );

  const totalSales = purchasedCourses?.length;

  return (
    <div>
      <div className="lg:hidden mb-5">
        <Link to="/admin/course">
          <Button variant={"outline"}>Go to create course</Button>
        </Link>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-30 ">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-30">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">
              Course Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={250}
              className={"dark:text-black"}
            >
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30} // Rotated labels for better visibility
                  textAnchor="end"
                  interval={0} // Display all labels
                />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2" // Changed color to a different shade of blue
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Total Sales Skeleton */}
      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-30 p-4 rounded-xl bg-muted">
        <Skeleton className="h-6 w-32 mb-4 bg-gray-300 dark:bg-gray-200" />
        <Skeleton className="h-8 w-24 bg-gray-300 dark:bg-gray-200" />
      </div>

      {/* Total Revenue Skeleton */}
      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-30 p-4 rounded-xl bg-muted">
        <Skeleton className="h-6 w-32 mb-4 bg-gray-300 dark:bg-gray-200" />
        <Skeleton className="h-8 w-24 bg-gray-300 dark:bg-gray-200" />
      </div>

      {/* Line Chart Skeleton */}
      <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 p-4 rounded-xl bg-muted">
        <Skeleton className="h-6 w-48 mb-6 bg-gray-300 dark:bg-gray-200" />
        <Skeleton className="h-64 w-full bg-gray-300 dark:bg-gray-200" />
      </div>
    </div>
  );
};

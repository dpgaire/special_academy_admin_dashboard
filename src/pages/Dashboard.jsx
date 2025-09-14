import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  Layers,
  FileText,
  PlusCircle,
  Edit,
  Trash2,
  LogIn,
} from "lucide-react";
import {
  statsAPI,
  activityLogAPI,
} from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { Clock } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const response = await statsAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
        return { users: 0, categories: 0, subcategories: 0, items: 0 };
      }
    },
  });

  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      try {
        const response = await activityLogAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        toast.error("Failed to load activity logs");
        return [];
      }
    },
    select: (data) =>
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users,
      icon: Users,
      description: "Registered users in the system",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Categories",
      value: stats?.categories,
      icon: FolderOpen,
      description: "Main content categories",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Subcategories",
      value: stats?.subcategories,
      icon: Layers,
      description: "Content subcategories",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Items",
      value: stats?.items,
      icon: FileText,
      description: "Total content items",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const actionIcons = {
    create: <PlusCircle className="h-4 w-4 text-green-500" />,
    update: <Edit className="h-4 w-4 text-blue-500" />,
    delete: <Trash2 className="h-4 w-4 text-red-500" />,
    login: <LogIn className="h-4 w-4 text-gray-500" />,
  };

  if (isLoadingStats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="mt-2">Welcome to Special Academy Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold ">{card.value}</div>
                <p className="text-xs  mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Stay updated with the latest system changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="flex justify-center py-6">
                <LoadingSpinner />
              </div>
            ) : activityLogs?.length ? (
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-start space-x-3 border-b last:border-none pb-3"
                  >
                    <div className="mt-1">
                      {actionIcons[log.action] || (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {log.entity}{" "}
                        <span className="text-muted-foreground">
                          {log.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.timestamp), "PPpp")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div
                onClick={() => navigate("/categories")}
                className="p-3 border rounded-lg cursor-pointer transition-colors"
              >
                <p className="font-medium text-sm">Add New Category</p>
                <p className="text-xs ">Create a new content category</p>
              </div>
              <div
                onClick={() => navigate("/users")}
                className="p-3 border rounded-lg cursor-pointer transition-colors"
              >
                <p className="font-medium text-sm">Manage Users</p>
                <p className="text-xs ">View and edit user accounts</p>
              </div>
              <div
                onClick={() => navigate("/items")}
                className="p-3 border rounded-lg cursor-pointer transition-colors"
              >
                <p className="font-medium text-sm">Upload Content</p>
                <p className="text-xs ">Add new learning materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

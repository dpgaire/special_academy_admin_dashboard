import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, Layers, FileText } from 'lucide-react';
import { usersAPI, categoriesAPI, subcategoriesAPI, itemsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    subcategories: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, categoriesRes, subcategoriesRes, itemsRes] = await Promise.all([
        usersAPI.getAll(),
        categoriesAPI.getAll(),
        subcategoriesAPI.getAll(),
        itemsAPI.getAll(),
      ]);

      setStats({
        users: usersRes.data.length || 0,
        categories: categoriesRes.data.length || 0,
        subcategories: subcategoriesRes.data.length || 0,
        items: itemsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      description: 'Registered users in the system',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      description: 'Main content categories',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Subcategories',
      value: stats.subcategories,
      icon: Layers,
      description: 'Content subcategories',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Items',
      value: stats.items,
      icon: FileText,
      description: 'Total content items',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="mt-2">
          Welcome to Special Academy Admin Dashboard
        </p>
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
                <div className="text-2xl font-bold ">
                  {card.value}
                </div>
                <p className="text-xs  mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm ">
                  System initialized and ready for content management
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm ">
                  Admin dashboard is fully operational
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm ">
                  All CRUD operations are available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div onClick={() => navigate('/categories')} className="p-3 border rounded-lg cursor-pointer transition-colors">
                <p className="font-medium text-sm">Add New Category</p>
                <p className="text-xs ">Create a new content category</p>
              </div>
              <div onClick={() => navigate('/users')} className="p-3 border rounded-lg cursor-pointer transition-colors">
                <p className="font-medium text-sm">Manage Users</p>
                <p className="text-xs ">View and edit user accounts</p>
              </div>
              <div onClick={() => navigate('/items')} className="p-3 border rounded-lg cursor-pointer transition-colors">
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


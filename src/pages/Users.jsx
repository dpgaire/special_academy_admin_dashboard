import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Save,
  EyeOff,
  Eye,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usersAPI } from '../services/api';
import { userSchema, userUpdateSchema } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import { generateUniqueId } from '@/lib/utils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
    setValue: setValueCreate,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    setIsSubmitting(true);
    try {
      const userToSubmit = {...data,_id:generateUniqueId()}
      await usersAPI.create(userToSubmit);
      toast.success('User created successfully!');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (data) => {
    setIsSubmitting(true);
    try {
      // Remove password if empty
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      await usersAPI.update(editingUser._id, updateData);
      toast.success('User updated successfully!');
      setIsEditModalOpen(false);
      setEditingUser(null);
      resetEdit();
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    resetEdit({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate(handleCreateUser)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-fullName"
                    placeholder="Enter full name"
                    className="pl-10"
                    {...registerCreate('fullName')}
                  />
                </div>
                {errorsCreate.fullName && (
                  <p className="text-sm text-red-600">{errorsCreate.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="Enter email address"
                    className="pl-10"
                    {...registerCreate('email')}
                  />
                </div>
                {errorsCreate.email && (
                  <p className="text-sm text-red-600">{errorsCreate.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  placeholder="Enter password"
                  {...registerCreate('password')}
                />
                {errorsCreate.password && (
                  <p className="text-sm text-red-600">{errorsCreate.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select  onValueChange={(value) => setValueCreate('role', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                {errorsCreate.role && (
                  <p className="text-sm text-red-600">{errorsCreate.role.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create User</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
    <Card>
  <CardHeader>
    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
    <CardDescription>
      Manage user accounts and their permissions
    </CardDescription>
  </CardHeader>

  <CardContent>
    {filteredUsers.length === 0 ? (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          {searchTerm
            ? 'No users found matching your search.'
            : 'No users found.'}
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {/* Left section */}
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white break-words">
                  {user.fullName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <Badge variant="default" className="w-fit">
                {user.role}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(user)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteUser(user._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEditUser)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-fullName"
                  placeholder="Enter full name"
                  className="pl-10"
                  {...registerEdit('fullName')}
                />
              </div>
              {errorsEdit.fullName && (
                <p className="text-sm text-red-600">{errorsEdit.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email address"
                  className="pl-10"
                  {...registerEdit('email')}
                />
              </div>
              {errorsEdit.email && (
                <p className="text-sm text-red-600">{errorsEdit.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...registerEdit('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errorsEdit.password && (
                <p className="text-sm text-red-600">{errorsEdit.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select onValueChange={(value) => setValueEdit('role', value)} defaultValue={editingUser?.role}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger >
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              {errorsEdit.role && (
                <p className="text-sm text-red-600">{errorsEdit.role.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Update User</span>
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;


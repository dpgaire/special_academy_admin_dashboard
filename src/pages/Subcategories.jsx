import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Layers,
  FolderOpen,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { subcategoriesAPI, categoriesAPI } from "../services/api";
import { subcategorySchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Subcategories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const { data: subcategories = [], isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ["subcategories"],
      queryFn: async () => {
        const response = await subcategoriesAPI.getAll();
        return response.data || [];
      },
      onError: (error) => {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories");
      },
    });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
    setValue: setValueCreate,
  } = useForm({
    resolver: yupResolver(subcategorySchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm({
    resolver: yupResolver(subcategorySchema),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
    const { categoryId, ...rest } = data;
    const transformedData = {
      ...rest,
      category_id: categoryId, // rename field
    };

    return subcategoriesAPI.create(transformedData);
  },
    onSuccess: () => {
      toast.success("Subcategory created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create subcategory";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const { categoryId, ...rest } = data;
      const transformedData = {
        ...rest,
        category_id: categoryId, // rename field
      };

      return subcategoriesAPI.update(id, transformedData);
    },
    onSuccess: () => {
      toast.success("Subcategory updated successfully!");
      setIsEditModalOpen(false);
      setEditingSubcategory(null);
      resetEdit();
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update subcategory";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subcategoriesAPI.delete,
    onSuccess: () => {
      toast.success("Subcategory deleted successfully!");
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete subcategory";
      toast.error(message);
    },
  });

  const handleCreateSubcategory = (data) => {
    createMutation.mutate(data);
  };

  const handleEditSubcategory = (data) => {
    updateMutation.mutate({ id: editingSubcategory._id, data });
  };

  const handleDeleteSubcategory = (subcategoryId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this subcategory? This will also delete all associated items."
      )
    ) {
      return;
    }
    deleteMutation.mutate(subcategoryId);
  };

  const openEditModal = (subcategory) => {
    setEditingSubcategory(subcategory);
    resetEdit({
      name: subcategory.name,
      description: subcategory.description || "",
      categoryId: subcategory.categoryId,
    });
    setIsEditModalOpen(true);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const filteredSubcategories = subcategories
    .filter(
      (subcategory) =>
        subcategory.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategory.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getCategoryName(subcategory.categoryId)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (isLoadingSubcategories || isLoadingCategories) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subcategories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage subcategories within parent categories
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Subcategory</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Subcategory</DialogTitle>
              <DialogDescription>
                Add a new subcategory to organize content
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateSubcategory)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="create-name">Subcategory Name</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-name"
                    placeholder="Enter subcategory name"
                    className="pl-10"
                    {...registerCreate("name")}
                  />
                </div>
                {errorsCreate.name && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-categoryId">Select Category</Label>
                <Select
                  onValueChange={(value) => setValueCreate("categoryId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorsCreate.categoryId && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="create-description"
                  placeholder="Enter subcategory description"
                  rows={3}
                  {...registerCreate("description")}
                />
                {errorsCreate.description && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1"
                >
                  {createMutation.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create Subcategory</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createMutation.isLoading}
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
              placeholder="Search subcategories by name, description, or parent category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subcategories List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Subcategories ({filteredSubcategories.length})
          </CardTitle>
          <CardDescription>
            Manage subcategories and their parent categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubcategories.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No subcategories found matching your search."
                  : "No subcategories found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubcategories.map((subcategory) => (
                <div
                  key={subcategory._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {subcategory.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {getCategoryName(subcategory?.category_id?._id)}
                        </Badge>
                      </div>
                      {subcategory.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {subcategory.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created:{" "}
                        {new Date(subcategory.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(subcategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubcategory(subcategory._id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteMutation.isLoading}
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

      {/* Edit Subcategory Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update subcategory information
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(handleEditSubcategory)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subcategory Name</Label>
              <div className="relative">
                <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  placeholder="Enter subcategory name"
                  className="pl-10"
                  {...registerEdit("name")}
                />
              </div>
              {errorsEdit.name && (
                <p className="text-sm text-red-600">
                  {errorsEdit.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">Parent Category</Label>
              <Select
                onValueChange={(value) => setValueEdit("categoryId", value)}
                defaultValue={editingSubcategory?.categoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorsEdit.categoryId && (
                <p className="text-sm text-red-600">
                  {errorsEdit.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter subcategory description"
                rows={3}
                {...registerEdit("description")}
              />
              {errorsEdit.description && (
                <p className="text-sm text-red-600">
                  {errorsEdit.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isLoading}
                className="flex-1"
              >
                {updateMutation.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Update Subcategory</span>
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={updateMutation.isLoading}
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

export default Subcategories;

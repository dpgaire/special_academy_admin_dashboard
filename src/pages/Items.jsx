import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  File,
  Link,
  Save,
  Youtube,
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
import { itemsAPI, subcategoriesAPI, categoriesAPI } from "../services/api";
import { itemSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Items = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: items = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await itemsAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
    },
  });

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
    control: controlCreate,
  } = useForm({
    resolver: yupResolver(itemSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
    control: controlEdit,
  } = useForm({
    resolver: yupResolver(itemSchema),
  });

  const createType = useWatch({ control: controlCreate, name: "type" });
  const editType = useWatch({ control: controlEdit, name: "type" });

  const createMutation = useMutation({
    mutationFn: itemsAPI.create,
    onSuccess: () => {
      toast.success("Item created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create item";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const { subcategoryId, ...rest } = data;
      const transformedData = {
        ...rest,
        subcategory_id: subcategoryId, // rename field
      };

      return itemsAPI.update(id, transformedData);
    },
    onSuccess: () => {
      toast.success("Item updated successfully!");
      setIsEditModalOpen(false);
      setEditingItem(null);
      resetEdit();
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update item";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: itemsAPI.delete,
    onSuccess: () => {
      toast.success("Item deleted successfully!");
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete item";
      toast.error(message);
    },
  });

  const handleCreateItem = (data) => {
    createMutation.mutate(data);
  };

  const handleEditItem = (data) => {
    updateMutation.mutate({ id: editingItem._id, data });
  };

  const handleDeleteItem = (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    deleteMutation.mutate(itemId);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    resetEdit({
      name: item.name,
      description: item.description || "",
      type: item.type,
      subcategoryId: item.subcategoryId,
      file_path: item.file_path || "",
      youtube_url: item.youtube_url || "",
    });
    setIsEditModalOpen(true);
  };

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId);
    return subcategory ? subcategory.name : "Unknown Subcategory";
  };


  const getCategoryName = (subcategoryId) => {
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId);   
    if (subcategory) {
      const category = categories.find(
      (cat) => cat._id === subcategory?.category_id?._id
    );
    return category ? category?.name : "Unknown Category fdsfasf";
    }
    
  };
  const filteredItems = items
    .filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSubcategoryName(item.subcategoryId)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getCategoryName(item.subcategoryId)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (isLoadingItems || isLoadingSubcategories || isLoadingCategories) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Items
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage content items (PDFs and YouTube videos)
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>
                Add a new content item (PDF or YouTube video)
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateItem)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-name"
                    placeholder="Enter item name"
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
                <Label htmlFor="create-subcategoryId">Subcategory</Label>
                <Select
                  onValueChange={(value) =>
                    setValueCreate("subcategoryId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory._id} value={subcategory._id}>
                        {getCategoryName(subcategory._id)} → {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorsCreate.subcategoryId && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.subcategoryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-type">Type</Label>
                <Select
                  onValueChange={(value) => setValueCreate("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="youtube_url">YouTube Video</SelectItem>
                  </SelectContent>
                </Select>
                {errorsCreate.type && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.type.message}
                  </p>
                )}
              </div>

              {/* Conditional fields based on type */}
              {createType === "pdf" && (
                <div className="space-y-2">
                  <Label htmlFor="create-file_path">File Path</Label>
                  <div className="relative">
                    <File className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="create-file_path"
                      placeholder="Enter file path or upload URL"
                      className="pl-10"
                      {...registerCreate("file_path")}
                    />
                  </div>
                  {errorsCreate.file_path && (
                    <p className="text-sm text-red-600">
                      {errorsCreate.file_path.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter the file path or URL where the PDF is stored
                  </p>
                </div>
              )}

              {createType === "youtube_url" && (
                <div className="space-y-2">
                  <Label htmlFor="create-youtube_url">YouTube URL</Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="create-youtube_url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="pl-10"
                      {...registerCreate("youtube_url")}
                    />
                  </div>
                  {errorsCreate.youtube_url && (
                    <p className="text-sm text-red-600">
                      {errorsCreate.youtube_url.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter the full YouTube video URL
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="create-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="create-description"
                  placeholder="Enter item description"
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
                      <span>Create Item</span>
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
              placeholder="Search items by title, description, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Items ({filteredItems.length})</CardTitle>
          <CardDescription>
            Manage content items and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <section className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No items found matching your search."
                  : "No items found."}
              </p>
            </section>
          ) : (
            <section className="space-y-4">
              {filteredItems.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Left section */}
                  <section className="flex items-start sm:items-center gap-4 w-full">
                    <section
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                        item.type === "pdf" ? "bg-black" : "bg-red-600"
                      }`}
                    >
                      {item.type === "pdf" ? (
                        <File className="h-5 w-5" />
                      ) : (
                        <Youtube className="h-5 w-5" />
                      )}
                    </section>

                    <section className="flex-1">
                      <section className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <Badge
                          variant={
                            item.type === "pdf" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {item.type === "pdf" ? "PDF" : "YouTube"}
                        </Badge>
                      </section>

                      <section className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{getCategoryName(item?.subcategory_id?._id)}</span>
                    <span>-&gt;</span>
                      <span>{getSubcategoryName(item?.subcategory_id?._id)}</span>
                      </section>

                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      )}

                      {item.type === "youtube_url" && item.youtube_url && (
                        <section className="flex items-center gap-2 mt-1">
                          <Link className="h-3 w-3 text-gray-400" />
                          <a
                            href={item.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 truncate max-w-[160px] sm:max-w-xs"
                          >
                            {item.youtube_url}
                          </a>
                        </section>
                      )}

                      {item.type === "pdf" && item.file_path && (
                        <section className="flex items-center gap-2 mt-1">
                          <File className="h-3 w-3 text-gray-400" />
                          <a
                            href={item.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 truncate max-w-[160px] sm:max-w-xs"
                          >
                            {item.file_path}
                          </a>
                        </section>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </section>
                  </section>

                  {/* Right section (buttons) */}
                  <section className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </section>
                </article>
              ))}
            </section>
          )}
        </CardContent>
      </Card>

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item information</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(handleEditItem)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  placeholder="Enter item name"
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
              <Label htmlFor="edit-subcategoryId">Subcategory</Label>
              <Select
                onValueChange={(value) => setValueEdit("subcategoryId", value)}
                defaultValue={editingItem?.subcategoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {getCategoryName(subcategory._id)} → {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorsEdit.subcategoryId && (
                <p className="text-sm text-red-600">
                  {errorsEdit.subcategoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                onValueChange={(value) => setValueEdit("type", value)}
                defaultValue={editingItem?.type}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="youtube_url">YouTube Video</SelectItem>
                </SelectContent>
              </Select>
              {errorsEdit.type && (
                <p className="text-sm text-red-600">
                  {errorsEdit.type.message}
                </p>
              )}
            </div>

            {/* Conditional fields based on type */}
            {editType === "pdf" && (
              <div className="space-y-2">
                <Label htmlFor="edit-file_path">File Path</Label>
                <div className="relative">
                  <File className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="edit-file_path"
                    placeholder="Enter file path or upload URL"
                    className="pl-10"
                    {...registerEdit("file_path")}
                  />
                </div>
                {errorsEdit.file_path && (
                  <p className="text-sm text-red-600">
                    {errorsEdit.file_path.message}
                  </p>
                )}
              </div>
            )}

            {editType === "youtube_url" && (
              <div className="space-y-2">
                <Label htmlFor="edit-youtube_url">YouTube URL</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="edit-youtube_url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="pl-10"
                    {...registerEdit("youtube_url")}
                  />
                </div>
                {errorsEdit.youtube_url && (
                  <p className="text-sm text-red-600">
                    {errorsEdit.youtube_url.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter item description"
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
                    <span>Update Item</span>
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

export default Items;

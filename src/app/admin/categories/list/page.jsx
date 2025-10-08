"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import PermissionGuard from "@/components/PermissionGuard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CategoriesList = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
  }, [preferredLanguage, i18n]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Estado para editar
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  // Estado para eliminar
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchData(endpoints.category_getAll());
        if (!data.error) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = async (id) => {
    try {
      const data = await fetchData(endpoints.category_delete(id), {
        method: "DELETE",
      });
      if (data.error) return;
      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.categoryDeleted"),
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("toast.error.title"),
        description: t("toast.error.serverConnection"),
      });
    }
  };

  const handleEditCategory = async () => {
    try {
      const data = await fetchData(
        endpoints.category_update(selectedCategory.id),
        {
          method: "PUT",
          body: JSON.stringify(editForm),
        }
      );
      if (data.error) {
        return toast({
          variant: "destructive",
          title: t("toast.error.title"),
          description: data.error,
        });
      }
      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.categoryEdited"),
      });
      setEditOpen(false);
      setConfirmOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("toast.error.title"),
        description: t("toast.error.serverConnection"),
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.categoryList.title")}</CardTitle>
          <CardDescription>
            {t("admin.categoryList.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <Input
                type="search"
                placeholder={t("admin.categoryList.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      {t("admin.categoryList.table.headers.item")}
                    </TableHead>
                    <TableHead>
                      {t("admin.categoryList.table.headers.name")}
                    </TableHead>
                    <TableHead>
                      {t("admin.categoryList.table.headers.description")}
                    </TableHead>
                    <TableHead>
                      {t("admin.categoryList.table.headers.createdAt")}
                    </TableHead>
                    <TableHead>
                      {t("admin.categoryList.table.headers.updatedAt")}
                    </TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(category.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onInteractOutside={(e) => {
                                if (editOpen || deleteOpen) {
                                  e.preventDefault();
                                }
                              }}>
                              <DropdownMenuLabel>
                                {t("common.actions")}
                              </DropdownMenuLabel>
                              <PermissionGuard
                                requiredPermission={permissions.role_update}
                              >
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedCategory(category);
                                    setEditForm({
                                      name: category.name,
                                      description: category.description,
                                    });
                                    setEditOpen(true);
                                  }}
                                >
                                  <Pencil />{" "}
                                  {t(
                                    "admin.categoryList.table.body.editCategory"
                                  )}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard
                                requiredPermission={permissions.role_delete}
                              >
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDeleteOpen(true);
                                    setSelectedCategory(category);
                                  }}
                                >
                                  <Trash2 color="red" />
                                  <span className="text-red-500">
                                    {t(
                                      "admin.categoryList.table.body.deleteCategory"
                                    )}
                                  </span>
                                </DropdownMenuItem>
                              </PermissionGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("admin.roleList.table.body.noCategories")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.categoryEdit.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.categoryEdit.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <label className="text-sm font-medium">
              {t("admin.categoryEdit.fields.name")}
            </label>
            <Input
              placeholder={t("admin.categoryEdit.placeholders.name")}
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <label className="text-sm font-medium">
              {t("admin.categoryEdit.fields.description")}
            </label>
            <Input
              placeholder={t("admin.categoryEdit.placeholders.description")}
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={() => setConfirmOpen(true)}>
              {t("common.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de edición */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.categoryEdit.confirmationDialog.title")}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditCategory}>
              {t("common.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmación de eliminación */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.categoryList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.categoryList.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => handleDeleteCategory(selectedCategory?.id)}
            >
              {t("common.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default withAuth(CategoriesList, permissions.role_list);

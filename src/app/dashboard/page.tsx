"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

import { useProducts } from "@/hooks/useProducts";
import { useAdmins } from "@/hooks/useAdmins";
import { toast } from "react-hot-toast";
import { useOrders } from "@/hooks/useOrders";
import { QRCodeSVG } from "qrcode.react";
import { useThemeStore } from "@/store/themeStore";
import { useQueryClient } from '@tanstack/react-query';

// Define interfaces
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
  discount?: number;
  img: string;
  description: string;
}

interface Admin {
  id: number;
  fullName: string;
  idCard: string;
  password?: string;
}

interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  discount?: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  placeNumber: string;
  description?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className="p-6"
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const router = useRouter();
  const { admin, logout, isAuthenticated } = useAuth();
  const {
    products,
    isLoading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const {
    admins,
    isLoading: adminsLoading,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    error,
  } = useAdmins();
  const { orders, isLoading: ordersLoading, updateOrderStatus } = useOrders();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"add" | "edit">(
    "add"
  );
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    category: "",
    description: "",
    img: "",
    stock: 0,
    discount: 0,
  });

  // Product delete confirmation modal
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Admin modal states
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalMode, setAdminModalMode] = useState<"add" | "edit">("add");
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [adminFormData, setAdminFormData] = useState<Omit<Admin, "id">>({
    fullName: "",
    idCard: "AD",
    password: "",
  });

  // Admin delete confirmation modal
  const [deleteAdminModalOpen, setDeleteAdminModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  // Add state for password validation
  const [passwordError, setPasswordError] = useState<string>("");

  // Add order state and handlers
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Refetch data based on the selected tab
    switch (newValue) {
      case 0: // Dashboard tab
        // Refetch all data
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        break;
      case 1: // Products tab
        queryClient.invalidateQueries({ queryKey: ['products'] });
        break;
      case 2: // Admins tab
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        break;
      case 3: // Orders tab
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        break;
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Product modal handlers
  const handleOpenAddProductModal = () => {
    setProductFormData({
      title: "",
      price: 0,
      category: "",
      description: "",
      img: "",
      stock: 0,
      discount: 0,
    });
    setProductModalMode("add");
    setProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product: Product) => {
    setCurrentProduct(product);
    setProductFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      img: product.img,
      stock: product.stock,
      discount: product.discount,
    });
    setProductModalMode("edit");
    setProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setCurrentProduct(null);
  };

  const handleProductFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name as string]:
        name === "price" || name === "stock" || name === "discount"
          ? Number(value)
          : value,
    });
  };

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError("");

    if (file) {
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.filePath;
    } catch (error: any) {
      setUploadError(error.message || "Error uploading image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Update product submit handler
  const handleSubmitProduct = async () => {
    try {
      let imagePath = productFormData.img;

      // If a new file is selected, upload it
      if (selectedFile) {
        imagePath = await uploadImage();
      }

      const productData = {
        ...productFormData,
        img: imagePath,
        price: Number(productFormData.price),
        stock: Number(productFormData.stock),
        discount: Number(productFormData.discount),
      };

      if (productModalMode === "add") {
        await addProduct.mutateAsync(productData);
        toast.success("Product added successfully");
      } else if (productModalMode === "edit" && currentProduct) {
        await updateProduct.mutateAsync({
          id: currentProduct.id.toString(),
          input: productData,
        });
        toast.success("Product updated successfully");
      }

      // Reset file state
      setSelectedFile(null);
      setPreviewUrl("");

      handleCloseProductModal();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Error saving product");
    }
  };

  // Product delete handlers
  const handleOpenDeleteProductModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteProductModalOpen(true);
  };

  const handleCloseDeleteProductModal = () => {
    setDeleteProductModalOpen(false);
    setProductToDelete(null);
  };

  // Update delete product handler
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.id.toString());
      toast.success("Product deleted successfully");
      handleCloseDeleteProductModal();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Error deleting product");
    }
  };

  // Admin modal handlers
  const handleOpenAddAdminModal = () => {
    setAdminModalMode("add");
    setAdminFormData({
      fullName: "",
      idCard: "AD",
      password: "",
    });
    setAdminModalOpen(true);
  };

  const handleOpenEditAdminModal = (admin: Admin) => {
    setCurrentAdmin(admin);
    setAdminFormData({
      fullName: admin.fullName,
      idCard: admin.idCard,
      password: "",
    });
    setAdminModalMode("edit");
    setAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setAdminModalOpen(false);
    setCurrentAdmin(null);
    setPasswordError("");
  };

  const handleAdminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For idCard field, ensure it always starts with "AD"
    if (name === "idCard") {
      // If user tries to delete the "AD" prefix, keep it
      if (!value.startsWith("AD")) {
        setAdminFormData({
          ...adminFormData,
          [name]: `AD${value.replace(/^AD/i, "")}`,
        });
      } else {
        setAdminFormData({
          ...adminFormData,
          [name]: value,
        });
      }
    } else if (name === "password") {
      // Validate password length
      if (value.length > 0 && value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError("");
      }
      setAdminFormData({
        ...adminFormData,
        [name]: value,
      });
    } else {
      setAdminFormData({
        ...adminFormData,
        [name]: value,
      });
    }
  };

  // Update admin submit handler to use toast
  const handleSubmitAdmin = async () => {
    // Validate password length for new admins or when changing password
    if (
      (adminModalMode === "add" ||
        (adminFormData.password && adminFormData.password.length > 0)) &&
      adminFormData.password &&
      adminFormData.password.length < 6
    ) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    try {
      if (adminModalMode === "add") {
        // Add new admin
        await addAdmin.mutateAsync({
          fullName: adminFormData.fullName,
          idCard: adminFormData.idCard,
          password: adminFormData.password || "",
        });
        toast.success("Admin added successfully");
      } else if (currentAdmin) {
        // Edit existing admin
        const updateData: any = {
          fullName: adminFormData.fullName,
          idCard: adminFormData.idCard,
        };

        // Only include password if it's provided (not empty)
        if (adminFormData.password) {
          updateData.password = adminFormData.password;
        }

        await updateAdmin.mutateAsync({
          id: currentAdmin.id.toString(),
          input: updateData,
        });
        toast.success("Admin updated successfully");
      }

      // Close modal and reset form
      handleCloseAdminModal();
    } catch (error) {
      console.error("Error submitting admin:", error);
      toast.error("Failed to save admin");
    }
  };

  // Admin delete handlers
  const handleOpenDeleteAdminModal = (admin: Admin) => {
    setAdminToDelete(admin);
    setDeleteAdminModalOpen(true);
  };

  const handleCloseDeleteAdminModal = () => {
    setDeleteAdminModalOpen(false);
    setAdminToDelete(null);
  };

  // Update delete admin handler
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin.mutateAsync(adminToDelete.id.toString());
      toast.success("Admin deleted successfully");
      handleCloseDeleteAdminModal();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  // Add order handlers
  const handleOpenOrderDetailsModal = (order: Order) => {
    setCurrentOrder(order);
    setOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setOrderDetailsModalOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id, status });
      toast.success(`Order ${id} marked as ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="flex h-screen bg-light-secondary dark:bg-dark-secondary">
        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          className="w-64"
        >
          <Box
          //  className="w-64"
          className={` w-64 h-screen ${isDarkMode ? 'dark bg-secondary' : ''}`}
          >
            <Box className="p-4 bg-blue-600 text-white">
              <Typography variant="h6" className="font-bold">
                Admin Panel
              </Typography>
              <div className="flex items-center mt-4">
                <Avatar className="mr-3 bg-blue-300">
                  {admin?.fullName?.charAt(0) || "A"}
                </Avatar>
                <Typography>{admin?.fullName || "Admin"}</Typography>
              </div>
            </Box>
            <Divider />
            <List>
              <ListItemButton
                selected={tabValue === 0}
                onClick={() => setTabValue(0)}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton
                selected={tabValue === 1}
                onClick={() => setTabValue(1)}
              >
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
              <ListItemButton
                selected={tabValue === 2}
                onClick={() => setTabValue(2)}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Admins" />
              </ListItemButton>
              <ListItemButton
                selected={tabValue === 3}
                onClick={() => setTabValue(3)}
              >
                <ListItemIcon>
                  <PrintIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </List>
            <Divider />
            <List>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                className="mr-2"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="flex-grow">
                Admin Dashboard
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              className="bg-blue-700"
              indicatorColor="secondary"
              textColor="inherit"
            >
              <Tab label="Dashboard" />
              <Tab label="Products" />
              <Tab label="Admins" />
              <Tab label="Orders" />
            </Tabs>
          </AppBar>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4">
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h4" className="mb-6">
              Welcome to the Admin Dashboard
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Paper className="p-6 shadow-md">
                <Typography variant="h6" className="mb-2">
                  Total Products
                </Typography>
                <Typography variant="h3" className="font-bold text-blue-600">
                  {products?.length || 0}
                </Typography>
              </Paper>

              <Paper
                elevation={3}
                className={`p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className={isDarkMode ? "text-white" : ""}>
                    Total Admins
                  </Typography>
                  <PeopleIcon className={isDarkMode ? "text-white" : "text-gray-600"} />
                </Box>
                {adminsLoading ? (
                  <Box className="flex justify-center items-center h-16">
                    <CircularProgress size={24} />
                  </Box>
                ) : error ? (
                  <Typography variant="h3" className="font-bold text-red-600">
                    Error
                  </Typography>
                ) : (
                  <Typography variant="h3" className="font-bold text-green-600">
                    {admins.length}
                  </Typography>
                )}
              </Paper>

              <Paper className="p-6 shadow-md">
                <Typography variant="h6" className="mb-2">
                  Total Orders
                </Typography>
                <Typography variant="h3" className="font-bold text-purple-600">
                  {orders?.length || 0}
                </Typography>
              </Paper>

              <Paper className="p-6 shadow-md">
                <Typography variant="h6" className="mb-2">
                  Total Stock
                </Typography>
                <Typography variant="h3" className="font-bold text-purple-600">
                  {(products as Product[])?.reduce(
                    (total: number, product: Product) =>
                      total + (product.stock || 0),
                    0
                  ) || 0}
                </Typography>
              </Paper>

              <Paper className="p-6 shadow-md">
                <Typography variant="h6" className="mb-2">
                Pending Orders
                </Typography>
                <Typography variant="h3" className="font-bold text-red-600 dark:text-red-400" >
                {orders?.filter((order: Order) => order.status === "pending")
                    .length || 0}
                </Typography>
              </Paper>
              </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <div className="flex justify-between items-center mb-6">
            <Typography variant="h4">Products Management</Typography>
            <Fab color="primary" aria-label="add" size="medium"onClick={handleOpenAddProductModal}>
                  <AddIcon />
                </Fab>
            </div>
            <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead className={`${isDarkMode ? 'dark bg-secondary' : ''}`}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price ($)</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Loading products...
                        </TableCell>
                      </TableRow>
                    ) : (
                      (products as Product[])?.map((product: Product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.title}</TableCell>
                          {(product.discount ?? 0) > 0 ? (
                                <TableCell>
                                  $
                                  {(
                                    product.price *
                                    (1 - (product.discount ?? 0) / 100)
                                  ).toFixed(2)}
                                <span className="ml-2 text-red-600 dark:text-red-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                                </TableCell>
                              
                            ) : (
                              <TableCell>
                                ${product.price.toFixed(2)}
                              </TableCell>
                            )}
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>{(product.discount ?? 0) > 0
                              ? `${product.discount ?? 0}%`
                              : "-"}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">
                            <IconButton
                            onClick={() =>
                              handleOpenEditProductModal(product)
                            }
                              color="primary"
                              size="small"
                              className="mr-1"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleOpenDeleteProductModal(product)
                              } color="error" size="small">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
                            
            <TabPanel value={tabValue} index={2}>
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h4">Admins Management</Typography>
                <Fab color="primary" aria-label="add" size="medium" onClick={handleOpenAddAdminModal}>
                  <AddIcon />
                </Fab>
              </div>
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead className={`${isDarkMode ? 'dark bg-secondary' : ''}`}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>ID Card</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Loading admins...
                        </TableCell>
                      </TableRow>
                    ) : (
                      admins?.map((admin: Admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>{admin.id}</TableCell>
                          <TableCell>{admin.fullName}</TableCell>
                          <TableCell>{admin.idCard}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => handleOpenEditAdminModal(admin)}
                              color="primary"
                              size="small"
                              className="mr-1"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small" 
                              onClick={() => handleOpenDeleteAdminModal(admin)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          

          <TabPanel value={tabValue} index={3}>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h4">Orders Management</Typography>
            </div>
            <TableContainer component={Paper} className="shadow-md">
              <Table>
                <TableHead className={`${isDarkMode ? 'dark bg-secondary' : ''}`}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Place #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : orders && orders.length > 0 ? (
                    orders.map((order: Order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerPhone || "N/A"}</TableCell>
                        <TableCell>{order.placeNumber || "N/A"}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor:
                                order.status === "completed"
                                  ? "success.light"
                                  : order.status === "pending"
                                  ? "warning.light"
                                  : "error.light",
                              color:
                                order.status === "completed"
                                  ? "success.dark"
                                  : order.status === "pending"
                                  ? "warning.dark"
                                  : "error.dark",
                            }}
                          >
                            {order.status
                              ? order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)
                              : ""}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "row", md: "column" },
                              gap: { md: 1 },
                              alignItems: "flex-end",
                            }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenOrderDetailsModal(order)}
                              sx={{
                                mb: { xs: 0, md: 1 },
                                mr: { xs: 2, md: 0 },
                              }}
                            >
                              Details
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, "completed")
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </main>
        </div>
      </div>

      {/* Product modal */}
      <Dialog
        open={productModalOpen}
        onClose={handleCloseProductModal}
        maxWidth="lg"
        fullWidth
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitProduct();
          }}
        >
          <DialogTitle className="flex items-center justify-between p-4 border-b">
            <Typography variant="h6">
              {productModalMode === "add" ? "Add Product" : "Edit Product"}
            </Typography>
            <IconButton
              onClick={handleCloseProductModal}
              size="small"
            >
              <CloseIcon className="h-6 w-6" />
            </IconButton>
          </DialogTitle>
          <DialogContent 
          style={{paddingTop: '15px', margin: '2px'}}
          className="flex flex-col gap-4 ">
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productFormData.title}
              onChange={handleProductFormChange}
              autoFocus
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={productFormData.price}
              onChange={handleProductFormChange}
              inputProps={{ min: 0, step: "0.01" }}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={productFormData.stock}
              onChange={handleProductFormChange}
              required
              inputProps={{ min: 0, step: 1 }}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Discount (%)"
              name="discount"
              type="number"
              value={productFormData.discount}
              onChange={handleProductFormChange}
              inputProps={{ min: 0, max: 100, step: "0.1" }}
              helperText="Enter discount percentage (0-100)"
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={productFormData.category}
              onChange={handleProductFormChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={productFormData.description}
              onChange={handleProductFormChange}
              multiline
              rows={4}
              className="mb-4"
            />

            {/* Image upload section */}
            <Box className="mt-4">
              <Typography variant="subtitle2" className="mb-2">
                Product Image
              </Typography>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <Box className="flex items-center mb-4 gap-4">
                <Button
                  variant="contained"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  startIcon={<PhotoCameraIcon />}
                  className="btn-primary"
                >
                  {uploading ? "Uploading..." : "Choose Image"}
                </Button>

                {!selectedFile && productFormData.img && (
                  <TextField
                    name="img"
                    value={productFormData.img}
                    onChange={handleProductFormChange}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                )}
              </Box>

              {uploadError && (
                <Alert severity="error" className="mb-4">
                  {uploadError}
                </Alert>
              )}

              {/* Image preview */}
              {(previewUrl || productFormData.img) && (
                <Box className="mt-4">
                  <Typography variant="subtitle2" className="mb-2">
                    Image Preview
                  </Typography>
                  <Box className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl || productFormData.img}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions className="p-4 border-t">
            <Button
              onClick={handleCloseProductModal}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={uploading || addProduct.isPending || updateProduct.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {uploading || addProduct.isPending || updateProduct.isPending ? (
                <CircularProgress size={24} className="text-white" />
              ) : productModalMode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Product delete confirmation modal */}
      <Dialog
        open={deleteProductModalOpen}
        onClose={handleCloseDeleteProductModal}
        maxWidth="sm"
        fullWidth
        className="fixed inset-0 z-50"
      >
        <DialogContent className="p-8">
          Delete Product
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button
            onClick={handleCloseDeleteProductModal}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProduct}
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin modal */}
      <Dialog
        open={adminModalOpen}
        onClose={handleCloseAdminModal}
        maxWidth="sm"
        fullWidth
        className="fixed inset-0 z-50"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmitAdmin();
        }}>
          <DialogTitle className="flex items-center justify-between p-4 border-b">
            <Typography variant="h6">
              {adminModalMode === "add" ? "Add Admin" : "Edit Admin"}
            </Typography>
            <IconButton
              onClick={handleCloseAdminModal}
              size="small"
            >
              <CloseIcon className="h-6 w-6" />
            </IconButton>
          </DialogTitle>
          <DialogContent
          style={{paddingTop: '15px', margin: '2px'}}
          className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={adminFormData.fullName}
              onChange={handleAdminFormChange}
              required
              autoFocus
              className="mb-4"
            />
            <TextField
              fullWidth
              label="ID Card"
              name="idCard"
              value={adminFormData.idCard}
              onChange={handleAdminFormChange}
              required
              helperText="ID Card will always start with AD"
              className="mb-4"
            />
            <TextField
              fullWidth
              label={adminModalMode === "add" ? "Password" : "New Password (leave empty to keep current)"}
              name="password"
              type="password"
              value={adminFormData.password}
              onChange={handleAdminFormChange}
              required={adminModalMode === "add"}
              error={!!passwordError}
              helperText={passwordError || "Password must be at least 6 characters long"}
              className="mb-4"
            />
          </DialogContent>
          <DialogActions className="p-4 border-t">
            <Button
              onClick={handleCloseAdminModal}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                (adminModalMode === "add" &&
                  (!adminFormData.fullName ||
                    !adminFormData.idCard ||
                    !adminFormData.password ||
                    !!passwordError)) ||
                (adminModalMode === "edit" &&
                  (!adminFormData.fullName ||
                    !adminFormData.idCard ||
                    (!!adminFormData.password && !!passwordError)))
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {adminModalMode === "add" ? "Add" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Admin delete confirmation modal */}
      <Dialog
        open={deleteAdminModalOpen}
        onClose={handleCloseDeleteAdminModal}
        maxWidth="sm"
        fullWidth
        className="fixed inset-0 z-50 "
      >
        <DialogContent className="p-6">
          Delete Admin
          <DialogContentText>
            Are you sure you want to delete this admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button
            onClick={handleCloseDeleteAdminModal}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAdmin}
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog
        open={orderDetailsModalOpen}
        onClose={handleCloseOrderDetailsModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "bg-white",
          sx: {
            margin: { xs: 2, sm: 3 },
            "& .MuiTableCell-root": {
              padding: "8px 16px",
              color: "#000",
            },
            "& .MuiTableHead-root .MuiTableCell-root": {
              backgroundColor: "#f5f5f5",
              color: "#000",
            },
            "& .MuiTypography-root": {
              color: "#000",
            },
            "& .MuiDialogTitle-root": {
              color: "#000",
            },
            "& .MuiDialogContent-root": {
              backgroundColor: "#fff",
            },
            "& .MuiDialogActions-root": {
              backgroundColor: "#fff",
            },
          },
        }}
      >
        <DialogTitle className="bg-white">
          <Typography variant="h6" sx={{ color: "#000" }}>Order Details</Typography>
        </DialogTitle>
        <DialogContent className="bg-white">
          <Box id="printable-order" sx={{ color: "#000" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                mb: 3,
              }}
            >
              <Typography variant="h4" align="center" sx={{ flex: 1, color: "#000" }}>
                Order Receipt
              </Typography>
              <Box sx={{ width: 100, height: 100 }}>
                {currentOrder && (
                  <QRCodeSVG value={currentOrder.id} size={100} level="H" />
                )}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: "#000" }}>
                    Customer Details:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Name:</strong> {currentOrder?.customerName || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Phone:</strong>{" "}
                    {currentOrder?.customerPhone || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Place Number:</strong>{" "}
                    {currentOrder?.placeNumber || "N/A"}
                  </Typography>
                  {currentOrder?.description && (
                    <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
                      <strong>Special Instructions:</strong>{" "}
                      {currentOrder.description}
                    </Typography>
                  )}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: "#000" }}>
                    Order Information:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Order ID:</strong> {currentOrder?.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Date:</strong>{" "}
                    {currentOrder?.createdAt
                      ? new Date(currentOrder.createdAt).toLocaleString()
                      : ""}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    <strong>Status:</strong>{" "}
                    {currentOrder?.status
                      ? currentOrder.status.charAt(0).toUpperCase() +
                        currentOrder.status.slice(1)
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#000" }}>Item</TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>Original Price</TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>Discount</TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>Final Price</TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentOrder?.items.map((item: OrderItem, index: number) => {
                    const originalPrice =
                      item.price / (1 - (item.discount || 0) / 100);
                    const discountedPrice = item.price;
                    const itemTotal = discountedPrice * item.quantity;
                    const savings = item.discount
                      ? (originalPrice - discountedPrice) * item.quantity
                      : 0;

                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "#000" }}>{item.title}</TableCell>
                        <TableCell align="right" sx={{ color: "#000" }}>
                          ${originalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#000" }}>
                          {item.discount ? <>{item.discount}%</> : "-"}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#000" }}>
                          ${discountedPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#000" }}>{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ color: "#000" }}>
                          ${itemTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={5} align="right" sx={{ color: "#000" }}>
                      <strong>Subtotal:</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>
                      $
                      {currentOrder?.items
                        .reduce((total, item) => {
                          const originalPrice =
                            item.price / (1 - (item.discount || 0) / 100);
                          return total + originalPrice * item.quantity;
                        }, 0)
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {currentOrder?.items.some((item) => item.discount) && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="right"
                        sx={{ color: "success.main" }}
                      >
                        <strong>Total Savings:</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "success.main" }}>
                        -$
                        {currentOrder?.items
                          .reduce((total, item) => {
                            if (!item.discount) return total;
                            const originalPrice =
                              item.price / (1 - item.discount / 100);
                            const savings =
                              (originalPrice - item.price) * item.quantity;
                            return total + savings;
                          }, 0)
                          .toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={5} align="right" sx={{ color: "#000" }}>
                      <strong>Final Total:</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#000" }}>
                      <strong>${currentOrder?.totalAmount.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions className="bg-white">
          <Button
            onClick={() => {
              const printContent = document.getElementById("printable-order");

              if (printContent) {
                // Create a new window
                const printWindow = window.open("", "_blank");
                if (!printWindow) return;

                // Add necessary styles for printing
                const styles = `
                  <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: white; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; color: #000; }
                    th { background-color: #f5f5f5; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .success-text { color: #2e7d32; }
                    .strike-through { text-decoration: line-through; color: #d32f2f; }
                    @media print {
                      button { display: none; }
                    }
                  </style>
                `;

                // Write the content to the new window
                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Order Receipt - ${currentOrder?.id}</title>
                      ${styles}
                    </head>
                    <body>
                      ${printContent.innerHTML}
                      <script>
                        window.onload = function() {
                          window.print();
                        }
                      </script>
                    </body>
                  </html>
                `);

                printWindow.document.close();
              }
            }}
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print Receipt
          </Button>
          <Button onClick={handleCloseOrderDetailsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

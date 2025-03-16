"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  ListItemButton,
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
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

// Define product interface
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock?: number;
  img: string;
  description: string;
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
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { admin, logout, isAuthenticated } = useAuth();
  const { products, isLoading } = useProducts();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Sample data for admins
  const admins = [
    { id: 1, name: "John Smith", idCard: "AD123456" },
    { id: 2, name: "Jane Doe", idCard: "AD789012" },
  ];

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        {/* Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          className="w-64"
        >
          <Box className="w-64">
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
            </Tabs>
          </AppBar>

          <main className="flex-1 overflow-y-auto p-4">
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h4" className="mb-6">
                Welcome to the Admin Dashboard
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Paper className="p-6 shadow-md">
                  <Typography variant="h6" className="mb-2">
                    Total Products
                  </Typography>
                  <Typography variant="h3" className="font-bold text-blue-600">
                    {products?.length || 0}
                  </Typography>
                </Paper>
                <Paper className="p-6 shadow-md">
                  <Typography variant="h6" className="mb-2">
                    Total Admins
                  </Typography>
                  <Typography variant="h3" className="font-bold text-green-600">
                    {admins.length}
                  </Typography>
                </Paper>
                <Paper className="p-6 shadow-md">
                  <Typography variant="h6" className="mb-2">
                    Total Stock
                  </Typography>
                  <Typography
                    variant="h3"
                    className="font-bold text-purple-600"
                  >
                    {(products as Product[])?.reduce(
                      (total: number, product: Product) => total + (product.stock || 0),
                      0
                    ) || 0}
                  </Typography>
                </Paper>
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h4">Products Management</Typography>
                <Fab color="primary" aria-label="add" size="medium">
                  <AddIcon />
                </Fab>
              </div>
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead className="bg-gray-100">
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price ($)</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
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
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              size="small"
                              className="mr-1"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" size="small">
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
                <Fab color="primary" aria-label="add" size="medium">
                  <AddIcon />
                </Fab>
              </div>
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead className="bg-gray-100">
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>ID Card</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>{admin.id}</TableCell>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.idCard}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            size="small"
                            className="mr-1"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </main>
        </div>
      </div>
    </>
  );
}

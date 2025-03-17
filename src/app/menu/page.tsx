'use client';

import { useState, Fragment } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  Skeleton,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useOrders } from '@/hooks/useOrders';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import PrintIcon from '@mui/icons-material/Print';
import { useQueryClient } from '@tanstack/react-query';

// Get unique categories from products
const getCategories = (products: any[] = []) => {
  const categories = products?.map(product => product.category) || [];
  return ['all', ...new Set(categories)];
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { products, isLoading } = useProducts();
  const { createOrder } = useOrders();
  const queryClient = useQueryClient();
  
  // Cart state
  const { 
    items, 
    addItem, 
    removeItem, 
    increaseQuantity, 
    decreaseQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCartStore();
  
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    placeNumber: '',
    notes: ''
  });

  const categories = getCategories(products);

  const filteredProducts = products?.filter((product: { category: string; }) => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };
  
  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) return; // Prevent adding if out of stock
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      discount: product.discount,
      stock: product.stock,
    });
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };
  
  const handleOpenOrderDialog = () => {
    setOrderId(`ORDER-${Date.now()}`);
    setOrderDialogOpen(true);
  };
  
  const handleCheckout = async () => {
    // Validate customer information
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.placeNumber) {
      setOrderError('Please fill in all customer information');
      return;
    }

    setOrderDialogOpen(false);
    
    try {
      // Format cart items for the order with discounted prices
      const orderItems = items.map(item => ({
        productId: item.id.toString(),
        title: item.title,
        originalPrice: item.price,
        price: calculateDiscountedPrice(item.price, item.discount),
        discount: item.discount || 0,
        quantity: item.quantity,
      }));
      
      // Create the order
      const result = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CreateOrder($input: OrderInput!) {
              createOrder(input: $input) {
                id
                items {
                  productId
                  title
                  price
                  originalPrice
                  discount
                  quantity
                }
                totalAmount
                status
                createdAt
                customerName
                customerPhone
                placeNumber
                description
              }
            }
          `,
          variables: {
            input: {
              id: orderId,
              items: orderItems,
              totalAmount: getTotalPrice(),
              customerName: customerInfo.name,
              customerPhone: customerInfo.phone,
              placeNumber: customerInfo.placeNumber,
              description: customerInfo.notes,
            },
          },
        }),
      });

      const response = await result.json();
      
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      
      // Clear the cart, customer info, and order ID
      clearCart();
      setCustomerInfo({ name: '', phone: '', placeNumber: '', notes: '' });
      setOrderId('');
      setOrderSuccess(true);
      setOrderError(null);
      setCartOpen(false); // Close the cart drawer after successful order

      // Refresh the products data to show updated stock
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      console.error('Error creating order:', error);
      setOrderError(error.message || 'Failed to create order');
    }
  };

  // Check if item can be increased based on stock
  const canIncreaseQuantity = (productId: number) => {
    const item = items.find(item => item.id === productId);
    const product = products?.find((p: any) => p.id === productId);
    if (!item || !product) return false;
    return item.quantity < product.stock;
  };

  const calculateDiscountedPrice = (price: number, discount: number | undefined) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1">
          Our Menu
        </Typography>
        
        <IconButton 
          color="primary" 
          onClick={toggleCart}
          sx={{ position: 'relative' }}
        >
          <Badge badgeContent={getTotalItems()} color="error">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>

      {/* Category Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {categories.map((category) => (
            <Tab 
              className='text-secondary dark:text-dark-secondary'
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {isLoading ? (
          // Loading skeletons
          [...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          // Actual products
          filteredProducts?.map((product: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: product.stock > 0 ? 'scale(1.02)' : 'none',
                  },
                  opacity: product.stock > 0 ? 1 : 0.7,
                  position: 'relative',
                }}
              >
                {product.stock <= 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      bgcolor: 'error.main',
                      color: 'white',
                      py: 1,
                      px: 3,
                      borderRadius: 1,
                      zIndex: 1,
                      width: '200%',
                      textAlign: 'center',
                      transform: 'translate(-50%, -50%) rotate(-45deg)',
                    }}
                  >
                    <Typography variant="h6">
                      Sold Out
                    </Typography>
                  </Box>
                )}
                <CardMedia
                  component="img"
                  className='w-full h-54 object-cover'
                  image={product.img}
                  alt={product.title}
                  sx={{ opacity: product.stock > 0 ? 1 : 0.5 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Box>
                    {(product.discount ?? 0) > 0 ? (
                      <>
                        <Typography variant="h6" color="primary" component="span">
                          ${calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
                        </Typography>
                        <Typography
                          component="span"
                          color="error"
                          sx={{ ml: 1, textDecoration: 'line-through' }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          sx={{ mt: 0.5 }}
                        >
                          {product.discount}% OFF
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h6" color="primary">
                        ${product.price.toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="body2" color={product.stock <= 5 ? "error.main" : "text.secondary"}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {items.find(item => item.id === product.id) ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => decreaseQuantity(product.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>
                        {items.find(item => item.id === product.id)?.quantity || 0}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => increaseQuantity(product.id)}
                        disabled={!canIncreaseQuantity(product.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      fullWidth
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={toggleCart}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Shopping Cart
          </Typography>
          
          <List>
            {items.map((item) => (
              <Fragment key={item.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <>
                        {(item.discount ?? 0) > 0 ? (
                          <>
                            ${calculateDiscountedPrice(item.price, item.discount).toFixed(2)}
                            <Typography
                              component="span"
                              color="error"
                              sx={{ ml: 1, textDecoration: 'line-through', fontSize: '0.875rem' }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>
                          </>
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                        {` × ${item.quantity}`}
                        {products?.find((p: any) => p.id === item.id)?.stock <= 5 && (
                          <Typography
                            component="span"
                            color="error.main"
                            sx={{ ml: 1, fontSize: '0.75rem' }}
                          >
                            (Only {products?.find((p: any) => p.id === item.id)?.stock} left)
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={() => increaseQuantity(item.id)}
                      disabled={!canIncreaseQuantity(item.id)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => removeItem(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </List>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Total: ${getTotalPrice().toFixed(2)}
            </Typography>
            {items.some(item => item.discount) && (
              <Typography variant="body2" color="success.main">
                You Save: ${items.reduce((total, item) => {
                  const savings = item.discount 
                    ? (item.price * item.quantity) - (calculateDiscountedPrice(item.price, item.discount) * item.quantity)
                    : 0;
                  return total + savings;
                }, 0).toFixed(2)}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleOpenOrderDialog}
              disabled={items.length === 0}
              sx={{ mt: 2 }}
            >
              Checkout
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearCart}
              disabled={items.length === 0}
              sx={{ mt: 1 }}
            >
              Clear Cart
            </Button>
          </Box>
        </Box>
      </Drawer>
      
      {/* Checkout Confirmation Dialog */}
      <Dialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              name="customerName"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              name="customerPhone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Place Number"
              margin="normal"
              name="placeNumber"
              value={customerInfo.placeNumber}
              onChange={(e) => setCustomerInfo({ ...customerInfo, placeNumber: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Special Instructions / Notes"
              margin="normal"
              name="notes"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              multiline
              rows={3}
              placeholder="Add any special instructions or notes here..."
            />
          </Box>
          <Box id="printable-order">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Typography variant="h4" align="center" sx={{ flex: 1 }}>
                Order Receipt
              </Typography>
              <Box sx={{ width: 100, height: 100 }}>
                {customerInfo.name && orderId && (
                  <QRCodeSVG
                    value={orderId}
                    size={100}
                    level="H"
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Customer Information:
              </Typography>
              <Typography variant="body1">
                Name: {customerInfo.name}
              </Typography>
              <Typography variant="body1">
                Phone: {customerInfo.phone}
              </Typography>
              <Typography variant="body1">
                Place Number: {customerInfo.placeNumber}
              </Typography>
              {customerInfo.notes && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Special Instructions: {customerInfo.notes}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Order ID: {orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date().toLocaleString()}
              </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Original Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Final Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const originalPrice = item.price;
                  const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
                  const itemTotal = discountedPrice * item.quantity;
                  const savings = (originalPrice - discountedPrice) * item.quantity;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell align="right">${originalPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {item.discount ? `${item.discount}%` : '-'}
                      </TableCell>
                      <TableCell align="right">${discountedPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${itemTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                    Subtotal:
                  </TableCell>
                  <TableCell align="right">
                    ${items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </TableCell>
                </TableRow>
                {items.some(item => item.discount) && (
                  <TableRow>
                    <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      Total Savings:
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      -${items.reduce((total, item) => {
                        const savings = item.discount 
                          ? (item.price * item.quantity) - (calculateDiscountedPrice(item.price, item.discount) * item.quantity)
                          : 0;
                        return total + savings;
                      }, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                    Final Total:
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${getTotalPrice().toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              const printContent = document.getElementById('printable-order');
              
              if (printContent) {
                const printWindow = window.open('', '_blank');
                if (!printWindow) {
                  alert('Please allow popups to print the receipt');
                  return;
                }

                printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Order Receipt</title>
                      <style>
                        body { 
                          font-family: Arial, sans-serif; 
                          padding: 20px; 
                          max-width: 800px; 
                          margin: 0 auto; 
                        }
                        .header {
                          display: flex;
                          justify-content: space-between;
                          align-items: start;
                          margin-bottom: 20px;
                        }
                        .header h1 {
                          flex: 1;
                          text-align: center;
                          margin: 0;
                        }
                        .qr-code {
                          width: 100px;
                          height: 100px;
                        }
                        .customer-info { 
                          margin-bottom: 20px; 
                          padding: 15px;
                          border: 1px solid #ddd;
                          border-radius: 4px;
                        }
                        .notes {
                          margin: 15px 0;
                          padding: 10px;
                          background-color: #f9f9f9;
                          border-left: 4px solid #2196f3;
                        }
                        .divider {
                          border-top: 1px solid #ddd;
                          margin: 15px 0;
                        }
                        table { 
                          width: 100%; 
                          border-collapse: collapse; 
                          margin-top: 20px; 
                        }
                        th, td { 
                          border: 1px solid #ddd; 
                          padding: 8px; 
                          text-align: left; 
                        }
                        th { background-color: #f5f5f5; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        .success-text { color: #2e7d32; }
                        .strike-through { text-decoration: line-through; color: #d32f2f; }
                        .total-row {
                          font-weight: bold;
                          background-color: #f9f9f9;
                        }
                        @media print {
                          body { padding: 0; }
                          .customer-info {
                            border: none;
                            padding: 0;
                          }
                          .no-print { display: none; }
                          @page {
                            margin: 0.5cm;
                          }
                        }
                      </style>
                    </head>
                    <body>
                      ${printContent.innerHTML}
                      <script>
                        window.print();
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
            Print Order
          </Button>
          <Button onClick={() => setOrderDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCheckout} color="primary" variant="contained">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={orderSuccess}
        autoHideDuration={6000}
        onClose={() => setOrderSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOrderSuccess(false)} 
          severity="success"
          variant="filled"
        >
          Your order has been placed successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!orderError}
        autoHideDuration={6000}
        onClose={() => setOrderError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOrderError(null)} 
          severity="error"
          variant="filled"
        >
          {orderError}
        </Alert>
      </Snackbar>
    </Container>
  );
} 
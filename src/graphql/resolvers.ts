import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAdmins,
  getAdmin,
  loginAdmin,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} from '@/lib/db';

export const resolvers = {
  Query: {
    admins: () => getAdmins(),
    admin: (_: any, { id }: { id: string }) => getAdmin(id),
    
    products: () => getProducts(),
    product: (_: any, { id }: { id: string }) => getProduct(id),
    
    productsByCategory: async (_: any, { category }: { category: string }) => {
      const products = await getProducts();
      return products.filter(product => product.category === category);
    },
      
    orders: () => getOrders(),
    order: (_: any, { id }: { id: string }) => getOrder(id),
  },

  Mutation: {
    addProduct: async (_: any, { input }: { input: any }) => {
      const result = await addProduct(input);
      return { id: result.insertedId, ...input };
    },

    updateProduct: async (_: any, { id, input }: { id: string; input: any }) => {
      await updateProduct(id, input);
      return { id, ...input };
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      const result = await deleteProduct(id);
      return result.deletedCount > 0;
    },

    loginAdmin: async (_: any, { idCard, password }: { idCard: string; password: string }) => {
      const admin = await loginAdmin(idCard, password);
      if (!admin) throw new Error('Invalid credentials');
      return admin;
    },

    addAdmin: async (_: any, { input }: { input: any }) => {
      // Check if admin with same idCard already exists
      const admins = await getAdmins();
      const existingAdmin = admins.find(admin => admin.idCard === input.idCard);
      if (existingAdmin) throw new Error('Admin with this ID Card already exists');

      const result = await addAdmin(input);
      return { id: result.insertedId, ...input };
    },

    updateAdmin: async (_: any, { id, input }: { id: string; input: any }) => {
      const admins = await getAdmins();
      const existingAdmin = admins.find(admin => 
        admin._id?.toString() !== id && admin.idCard === input.idCard
      );
      if (existingAdmin) throw new Error('Another admin with this ID Card already exists');

      await updateAdmin(id, input);
      return { id, ...input };
    },

    deleteAdmin: async (_: any, { id }: { id: string }) => {
      const result = await deleteAdmin(id);
      return result.deletedCount > 0;
    },
    
    createOrder: async (_: unknown, { input }: { input: any }) => {
      const newOrder = {
        id: input.id || `ORDER-${Date.now()}`,
        items: input.items.map((item: any) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          originalPrice: item.price,
          discount: item.discount || 0,
          quantity: item.quantity
        })),
        totalAmount: input.totalAmount,
        status: input.status || 'pending',
        createdAt: input.createdAt || new Date().toISOString(),
        customerName: input.customerName || '',
        customerPhone: input.customerPhone || '',
        placeNumber: input.placeNumber || '',
        description: input.description || ''
      };
      const result = await createOrder(newOrder);
      return { _id: result.insertedId, ...newOrder };
    },
    
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      await updateOrderStatus(id, status);
      const order = await getOrder(id);
      return order;
    },
  },
}; 
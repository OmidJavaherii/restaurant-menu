import db from '../data/db.json';
import fs from 'fs';
import path from 'path';

let products = [...db.products];
let admins = [...db.admins];
let orders = db.orders || [];

// Add interface at the top of the file
interface OrderItem {
  productId: string;
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
  customerName?: string;
  customerPhone?: string;
  placeNumber?: string;
  description?: string;
}

interface OrderInput {
  id?: string;
  items: OrderItem[];
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  placeNumber?: string;
  description?: string;
}

// Function to save data back to db.json
const saveData = () => {
  const dbPath = path.join(process.cwd(), 'src/data/db.json');
  const data = { products, admins, orders };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const resolvers = {
  Query: {
    admins: () => admins,
    admin: (_: any, { id }: { id: string }) => 
      admins.find(admin => admin.id === parseInt(id)),
    
    products: () => products,
    product: (_: any, { id }: { id: string }) => 
      products.find(product => product.id === parseInt(id)),
    
    productsByCategory: (_: any, { category }: { category: string }) =>
      products.filter(product => product.category === category),
      
    orders: () => orders,
    order: (_: any, { id }: { id: string }) =>
      orders.find(order => order.id === id),
  },

  Mutation: {
    addProduct: (_: any, { input }: { input: any }) => {
      const newProduct = {
        id: products.length + 1,
        ...input,
      };
      products.push(newProduct);
      saveData();
      return newProduct;
    },

    updateProduct: (_: any, { id, input }: { id: string; input: any }) => {
      const index = products.findIndex(product => product.id === parseInt(id));
      if (index === -1) throw new Error('Product not found');

      products[index] = {
        ...products[index],
        ...input,
      };
      saveData();
      return products[index];
    },

    deleteProduct: (_: any, { id }: { id: string }) => {
      const index = products.findIndex(product => product.id === parseInt(id));
      if (index === -1) throw new Error('Product not found');

      products = products.filter(product => product.id !== parseInt(id));
      saveData();
      return true;
    },

    loginAdmin: (_: any, { idCard, password }: { idCard: string; password: string }) => {
      const admin = admins.find(
        admin => admin.idCard === idCard && admin.password === password
      );
      if (!admin) throw new Error('Invalid credentials');
      return admin;
    },

    addAdmin: (_: any, { input }: { input: any }) => {
      // Check if admin with same idCard already exists
      const existingAdmin = admins.find(admin => admin.idCard === input.idCard);
      if (existingAdmin) throw new Error('Admin with this ID Card already exists');

      const newAdmin = {
        id: admins.length + 1,
        ...input,
      };
      admins.push(newAdmin);
      saveData();
      return newAdmin;
    },

    updateAdmin: (_: any, { id, input }: { id: string; input: any }) => {
      const index = admins.findIndex(admin => admin.id === parseInt(id));
      if (index === -1) throw new Error('Admin not found');

      // Check if idCard is being changed and if it conflicts with another admin
      if (input.idCard !== admins[index].idCard) {
        const existingAdmin = admins.find(admin => 
          admin.id !== parseInt(id) && admin.idCard === input.idCard
        );
        if (existingAdmin) throw new Error('Another admin with this ID Card already exists');
      }

      admins[index] = {
        ...admins[index],
        ...input,
      };
      saveData();
      return admins[index];
    },

    deleteAdmin: (_: any, { id }: { id: string }) => {
      const index = admins.findIndex(admin => admin.id === parseInt(id));
      if (index === -1) throw new Error('Admin not found');

      admins = admins.filter(admin => admin.id !== parseInt(id));
      saveData();
      return true;
    },
    
    createOrder: (_: any, { input }: { input: OrderInput }) => {
      // Check stock availability for all items
      for (const item of input.items) {
        const product = products.find(p => p.id.toString() === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.title}`);
        }
      }

      // Update stock for all items
      input.items.forEach((item: OrderItem) => {
        const productIndex = products.findIndex(p => p.id.toString() === item.productId);
        if (productIndex !== -1) {
          products[productIndex].stock -= item.quantity;
        }
      });

      const newOrder = {
        id: input.id || `ORDER-${Date.now()}`,
        items: input.items,
        totalAmount: input.totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        placeNumber: input.placeNumber,
        description: input.description,
      };
      orders.push(newOrder);
      saveData();
      return newOrder;
    },
    
    updateOrderStatus: (_: any, { id, status }: { id: string; status: string }) => {
      const index = orders.findIndex(order => order.id === id);
      if (index === -1) throw new Error('Order not found');
      
      orders[index] = {
        ...orders[index],
        status,
      };
      saveData();
      return orders[index];
    },
  },
}; 
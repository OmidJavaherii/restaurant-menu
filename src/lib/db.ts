import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  title: string;
  img: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  discount?: number;
}

export interface Admin {
  _id?: ObjectId;
  fullName: string;
  idCard: string;
  password: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  discount?: number;
  quantity: number;
}

export interface Order {
  _id?: ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  placeNumber?: string;
  description?: string;
}

const COLLECTIONS = {
  PRODUCTS: 'products',
  ADMINS: 'admins',
  ORDERS: 'orders',
};

export async function getProducts() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.PRODUCTS).find({}).toArray();
}

export async function getProduct(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(id) });
}

export async function addProduct(product: Omit<Product, '_id'>) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.PRODUCTS).insertOne(product);
}

export async function updateProduct(id: string, product: Omit<Product, '_id'>) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.PRODUCTS).updateOne(
    { _id: new ObjectId(id) },
    { $set: product }
  );
}

export async function deleteProduct(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(id) });
}

export async function getAdmins() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).find({}).toArray();
}

export async function getAdmin(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).findOne({ _id: new ObjectId(id) });
}

export async function loginAdmin(idCard: string, password: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).findOne({ idCard, password });
}

export async function addAdmin(admin: Omit<Admin, '_id'>) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).insertOne(admin);
}

export async function updateAdmin(id: string, admin: Omit<Admin, '_id'>) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).updateOne(
    { _id: new ObjectId(id) },
    { $set: admin }
  );
}

export async function deleteAdmin(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ADMINS).deleteOne({ _id: new ObjectId(id) });
}

export async function getOrders() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ORDERS).find({}).toArray();
}

export async function getOrder(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ORDERS).findOne({ _id: new ObjectId(id) });
}

export async function createOrder(order: Omit<Order, '_id'>) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ORDERS).insertOne(order);
}

export async function updateOrderStatus(id: string, status: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTIONS.ORDERS).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
} 
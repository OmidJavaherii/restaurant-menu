export interface OrderItemInput {
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  discount?: number;
  quantity: number;
}

export interface OrderInput {
  id?: string;
  items: OrderItemInput[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
  customerName?: string;
  customerPhone?: string;
  placeNumber?: string;
  description?: string;
}

export interface Order extends Required<OrderInput> {
  id: string;
  status: string;
  createdAt: string;
} 
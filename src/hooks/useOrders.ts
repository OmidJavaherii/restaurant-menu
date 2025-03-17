import { useMutation, useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';

// GraphQL queries and mutations
const GET_ORDERS = gql`
  query GetOrders {
    orders {
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
`;

const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
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
`;

const CREATE_ORDER = gql`
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
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  discount?: number;
  quantity: number;
}

export interface Order {
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

export const useOrders = () => {
  // Get all orders
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await client.query({
        query: GET_ORDERS,
      });
      return data.orders;
    },
  });

  // Get a specific order
  const getOrder = (id: string) => {
    return useQuery({
      queryKey: ['order', id],
      queryFn: async () => {
        const { data } = await client.query({
          query: GET_ORDER,
          variables: { id },
        });
        return data.order;
      },
    });
  };

  // Create a new order
  const createOrder = useMutation({
    mutationFn: async (orderData: {
      id?: string;
      items: OrderItem[];
      totalAmount: number;
      customerName?: string;
      customerPhone?: string;
      placeNumber?: string;
      description?: string;
    }) => {
      const { data } = await client.mutate({
        mutation: CREATE_ORDER,
        variables: { input: orderData },
      });
      return data.createOrder;
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await client.mutate({
        mutation: UPDATE_ORDER_STATUS,
        variables: { id, status },
      });
      return data.updateOrderStatus;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    orders: data,
    isLoading,
    getOrder,
    createOrder,
    updateOrderStatus,
  };
}; 
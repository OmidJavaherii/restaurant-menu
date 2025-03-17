import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  img: string;
  discount?: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      increaseQuantity: (id) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        
        if (item && item.stock > item.quantity) {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        }
      },
      
      decreaseQuantity: (id) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        
        if (item?.quantity === 1) {
          set({ items: items.filter((i) => i.id !== id) });
        } else {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.discount 
            ? item.price * (1 - item.discount / 100) 
            : item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 
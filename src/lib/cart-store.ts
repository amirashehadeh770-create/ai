import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartsByStore = Record<string, CartItem[]>;

type CartState = {
  cartsByStore: CartsByStore;
  addItem: (storeSlug: string, item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (storeSlug: string, productId: string) => void;
  setQuantity: (storeSlug: string, productId: string, quantity: number) => void;
  clearCart: (storeSlug: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartsByStore: {},
      addItem: (storeSlug, item, quantity = 1) =>
        set((state) => {
          const existing = state.cartsByStore[storeSlug] ?? [];
          const idx = existing.findIndex((i) => i.productId === item.productId);
          let updated: CartItem[];
          if (idx >= 0) {
            updated = existing.map((i, index) =>
              index === idx ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            updated = [...existing, { ...item, quantity }];
          }
          return { cartsByStore: { ...state.cartsByStore, [storeSlug]: updated } };
        }),
      removeItem: (storeSlug, productId) =>
        set((state) => {
          const existing = state.cartsByStore[storeSlug] ?? [];
          return {
            cartsByStore: {
              ...state.cartsByStore,
              [storeSlug]: existing.filter((i) => i.productId !== productId),
            },
          };
        }),
      setQuantity: (storeSlug, productId, quantity) =>
        set((state) => {
          const existing = state.cartsByStore[storeSlug] ?? [];
          const updated =
            quantity <= 0
              ? existing.filter((i) => i.productId !== productId)
              : existing.map((i) => (i.productId === productId ? { ...i, quantity } : i));
          return { cartsByStore: { ...state.cartsByStore, [storeSlug]: updated } };
        }),
      clearCart: (storeSlug) =>
        set((state) => ({
          cartsByStore: { ...state.cartsByStore, [storeSlug]: [] },
        })),
    }),
    { name: "marketplace-cart" }
  )
);

const EMPTY_CART: CartItem[] = [];

export function useCartItems(storeSlug: string): CartItem[] {
  return useCartStore((state) => state.cartsByStore[storeSlug] ?? EMPTY_CART);
}

export function cartTotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

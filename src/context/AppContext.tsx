import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, CartItem, Order, Subscription, Address, PaymentMethod, NotificationSettings } from '@/types/app';
import { restaurantsData as initialRestaurantsData, RestaurantData } from '@/data/restaurants';
import { groceryShopsData as initialGroceryShopsData, GroceryShop } from '@/data/groceryShops';
import { API_ENDPOINTS } from '@/lib/api-config';
import { seedFirestore, fetchRestaurantsFromFirestore, fetchGroceryShopsFromFirestore } from '@/lib/firestore-service';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  dailyBudget: number;
  setDailyBudget: (budget: number) => void;
  restaurants: RestaurantData[];
  fetchRestaurants: () => Promise<void>;
  groceryShops: GroceryShop[];
  fetchGroceryShops: () => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  addOrder: (order: Order) => void;
  subscription: Subscription | null;
  setSubscription: (sub: Subscription | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  // New Profile related methods
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  topUpWallet: (amount: number) => void;
}

const DEFAULT_USER: User = {
  id: '1',
  name: 'Dharanish M',
  email: 'user@example.com',
  phone: '+91 98765 43210',
  dailyBudget: 200,
  addresses: [
    { id: '1', type: 'Home', label: 'Home', address: '123, Green Valley, Bangalore, 560001', isDefault: true },
    { id: '2', type: 'Work', label: 'Office', address: 'Tech Park, Whitefield, Bangalore, 560066', isDefault: false },
  ],
  paymentMethods: [
    { id: '1', type: 'UPI', label: 'GPay', maskedNumber: 'user@okaxis', isDefault: true },
    { id: '2', type: 'Card', label: 'HDFC Bank', maskedNumber: 'XXXX XXXX XXXX 4321', isDefault: false },
  ],
  notificationSettings: {
    orderUpdates: true,
    offers: true,
    reminders: false,
    sound: true,
    vibration: true,
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [dailyBudget, setDailyBudget] = useState(user?.dailyBudget || 200);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>({
    id: 'sub_1',
    type: 'all',
    budget: 500,
    walletBalance: 1250, // Initial balance for demo
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    mealsDelivered: 0,
    totalMeals: 90
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    const saved = localStorage.getItem('app_onboarded');
    return saved === 'true';
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('app_user');
    return !!saved;
  });

  // Persistence
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('app_user', JSON.stringify(user));
    }
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('app_onboarded', isOnboarded.toString());
  }, [isOnboarded]);

  // Firestore Data Synchronization
  React.useEffect(() => {
    const syncData = async () => {
      try {
        if (isLoggedIn) {
          // 1. Ensure Firestore has data
          await seedFirestore();

          // 2. Fetch fresh data
          const fsRestaurants = await fetchRestaurantsFromFirestore();
          const fsGroceries = await fetchGroceryShopsFromFirestore();

          if (fsRestaurants.length > 0) setRestaurants(fsRestaurants as any);
          if (fsGroceries.length > 0) setGroceryShops(fsGroceries as any);

          console.log('✅ AppContext: Firestore sync successful');
        }
      } catch (error) {
        console.error('❌ AppContext: Firestore sync failed', error);
      }
    };
    syncData();
  }, [isLoggedIn]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) setDailyBudget(newUser.dailyBudget);
  };

  const addAddress = (address: Address) => {
    if (!user) return;
    const newAddresses = address.isDefault
      ? user.addresses.map(a => ({ ...a, isDefault: false })).concat(address)
      : [...user.addresses, address];
    setUser({ ...user, addresses: newAddresses });
  };

  const updateAddress = (address: Address) => {
    if (!user) return;
    const newAddresses = user.addresses.map(a =>
      a.id === address.id ? address : (address.isDefault ? { ...a, isDefault: false } : a)
    );
    setUser({ ...user, addresses: newAddresses });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    setUser({ ...user, addresses: user.addresses.filter(a => a.id !== id) });
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    if (!user) return;
    const newMethods = method.isDefault
      ? user.paymentMethods.map(m => ({ ...m, isDefault: false })).concat(method)
      : [...user.paymentMethods, method];
    setUser({ ...user, paymentMethods: newMethods });
  };

  const deletePaymentMethod = (id: string) => {
    if (!user) return;
    setUser({ ...user, paymentMethods: user.paymentMethods.filter(m => m.id !== id) });
  };

  const updateNotificationSettings = (settings: NotificationSettings) => {
    if (!user) return;
    setUser({ ...user, notificationSettings: settings });
  };

  const [restaurants, setRestaurants] = useState<RestaurantData[]>(initialRestaurantsData);

  const fetchRestaurants = async () => {
    try {
      // Try Firestore First
      const fsData = await fetchRestaurantsFromFirestore();
      if (fsData.length > 0) {
        setRestaurants(fsData as any);
        return;
      }

      // Fallback to API if Firestore is empty/fails
      const response = await fetch(API_ENDPOINTS.RESTAURANTS);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((r: any) => {
          const original = initialRestaurantsData.find(m => m.name === r.name);
          return {
            ...original,
            ...r,
            id: r.id.toString(),
            emoji: original?.emoji || '🍽️',
            cuisines: r.category ? [r.category] : (original?.cuisines || ['Indian']),
            deliveryFee: 0,
            distance: r.distance || (original?.distance || '2.5 km'),
            reviewCount: original?.reviewCount || 150,
            menu: original?.menu || []
          };
        });
        setRestaurants(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setRestaurants(initialRestaurantsData);
    }
  };

  const [groceryShops, setGroceryShops] = useState<GroceryShop[]>(initialGroceryShopsData);

  const fetchGroceryShops = async () => {
    try {
      // Try Firestore First
      const fsData = await fetchGroceryShopsFromFirestore();
      if (fsData.length > 0) {
        setGroceryShops(fsData as any);
        return;
      }

      const response = await fetch(API_ENDPOINTS.GROCERIES);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((shop: any) => ({
          ...shop,
          id: shop.id.toString(),
          items: shop.items.map((item: any) => ({
            ...item,
            id: item.id.toString()
          }))
        }));
        setGroceryShops(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch grocery shops:', error);
      setGroceryShops(initialGroceryShopsData);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchGroceryShops();
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === item.menuItem.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(i =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const addOrder = async (order: Order) => {
    try {
      // Sync to backend
      const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...order,
          itemsJson: JSON.stringify(order.items), // Send items as JSON string for backend
        }),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setOrders(prev => [order, ...prev]);
        console.log('Order saved to backend:', savedOrder);
      }
    } catch (error) {
      console.error('Failed to sync order to backend:', error);
      // Fallback to local only if backend fails
      setOrders(prev => [order, ...prev]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dailyBudget,
        setDailyBudget,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        orders,
        addOrder,
        subscription,
        setSubscription,
        isOnboarded,
        setIsOnboarded,
        isLoggedIn,
        setIsLoggedIn,
        addAddress,
        updateAddress,
        deleteAddress,
        addPaymentMethod,
        deletePaymentMethod,
        updateNotificationSettings,
        restaurants,
        fetchRestaurants,
        groceryShops,
        fetchGroceryShops,
        topUpWallet: (amount: number) => {
          if (subscription) {
            setSubscription({
              ...subscription,
              walletBalance: subscription.walletBalance + amount
            });
          }
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

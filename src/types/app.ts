export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  address: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'UPI' | 'Card' | 'Wallet' | 'COD';
  label: string;
  maskedNumber?: string;
  isDefault: boolean;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  offers: boolean;
  reminders: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dailyBudget: number;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  notificationSettings: NotificationSettings;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisines: string[];
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  isHomeMade: boolean;
  isVeg?: boolean;
  priceRange: 1 | 2 | 3;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  category: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface MealSuggestion {
  id: string;
  name: string;
  restaurant: string;
  isHomeMade: boolean;
  price: number;
  image: string;
  isVeg: boolean;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  calories?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal?: number;
  deliveryCharge?: number;
  gst?: number;
  platformFee?: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  deliveryOtp: string;
  estimatedTime: string;
  deliveryAddress: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'all';
  budget: number;
  walletBalance: number;
  planName?: string;
  durationMonths?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  mealsDelivered: number;
  totalMeals: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  benefits: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  category: string;
}

export interface MedicalShop {
  id: string;
  name: string;
  distance: string;
  rating: number;
  phone: string;
  isOpen: boolean;
  address: string;
}

export interface VehicleOption {
  id: string;
  type: 'bike' | 'auto' | 'car' | 'premium';
  name: string;
  price: number;
  eta: string;
  capacity: string;
}

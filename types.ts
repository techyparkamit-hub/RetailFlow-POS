export enum Page {
  DASHBOARD = 'Dashboard',
  POS = 'POS',
  SALES_HISTORY = 'Sales History',
  PRODUCTS_LIST = 'Products List',
  ADD_PRODUCT = 'Add Product',
  CATEGORIES = 'Categories',
  CUSTOMERS = 'Customers',
  SUPPLIERS = 'Suppliers',
  EXPENSES = 'Expenses',
  REPORTS = 'Reports',
  SETTINGS = 'Settings'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card';
  customerId?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  topSelling: Product[];
}
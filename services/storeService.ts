import { Product, Order, Customer } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CUSTOMERS } from '../constants';

// Simulating a backend service with LocalStorage for persistence in this demo
const STORAGE_KEYS = {
  PRODUCTS: 'retailflow_products',
  ORDERS: 'retailflow_orders',
  CUSTOMERS: 'retailflow_customers',
};

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (stored) return JSON.parse(stored);
  return MOCK_PRODUCTS;
};

export const saveProduct = (product: Product): Product[] => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  let newProducts;
  if (index >= 0) {
    newProducts = [...products];
    newProducts[index] = product;
  } else {
    newProducts = [...products, product];
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
  return newProducts;
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (stored) return JSON.parse(stored);
  return MOCK_ORDERS;
};

export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (stored) return JSON.parse(stored);
  return MOCK_CUSTOMERS;
};

export const createOrder = (order: Order, currentProducts: Product[]): { orders: Order[], products: Product[], customers: Customer[] } => {
  const orders = getOrders();
  const newOrders = [order, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));

  // Update Inventory
  const newProducts = currentProducts.map(p => {
    const soldItem = order.items.find(item => item.id === p.id);
    if (soldItem) {
      return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
    }
    return p;
  });
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));

  // Update Customer Loyalty
  let newCustomers = getCustomers();
  if (order.customerId) {
    newCustomers = newCustomers.map(c => {
      if (c.id === order.customerId) {
        const pointsEarned = Math.floor(order.total); // 1 point per dollar spent
        const pointsRedeemed = order.pointsRedeemed || 0;
        
        return {
          ...c,
          totalSpent: c.totalSpent + order.total,
          points: Math.max(0, c.points - pointsRedeemed + pointsEarned)
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(newCustomers));
  }

  return { orders: newOrders, products: newProducts, customers: newCustomers };
};
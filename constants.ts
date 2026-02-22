import { Product, Customer, Order } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', category: 'Apparel', price: 25.00, stock: 120, sku: 'TS-001', image: 'https://picsum.photos/200/200?random=1' },
  { id: '2', name: 'Slim Fit Denim Jeans', category: 'Apparel', price: 65.50, stock: 45, sku: 'DN-002', image: 'https://picsum.photos/200/200?random=2' },
  { id: '3', name: 'Canvas Sneakers', category: 'Footwear', price: 45.00, stock: 8, sku: 'SN-003', image: 'https://picsum.photos/200/200?random=3' },
  { id: '4', name: 'Leather Belt', category: 'Accessories', price: 22.00, stock: 30, sku: 'AC-004', image: 'https://picsum.photos/200/200?random=4' },
  { id: '5', name: 'Summer Floral Dress', category: 'Apparel', price: 55.00, stock: 12, sku: 'DR-005', image: 'https://picsum.photos/200/200?random=5' },
  { id: '6', name: 'Running Shoes', category: 'Footwear', price: 89.99, stock: 5, sku: 'RS-006', image: 'https://picsum.photos/200/200?random=6' },
  { id: '7', name: 'Wool Scarf', category: 'Accessories', price: 18.50, stock: 50, sku: 'SC-007', image: 'https://picsum.photos/200/200?random=7' },
  { id: '8', name: 'Graphic Hoodie', category: 'Apparel', price: 42.00, stock: 25, sku: 'HD-008', image: 'https://picsum.photos/200/200?random=8' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alice Freeman', email: 'alice@example.com', phone: '555-0123', points: 150, totalSpent: 450.00 },
  { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0198', points: 40, totalSpent: 120.00 },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'o1', date: new Date(Date.now() - 86400000).toISOString(), items: [], total: 125.00, subtotal: 115.00, tax: 10.00, discount: 0, paymentMethod: 'card' },
  { id: 'o2', date: new Date(Date.now() - 172800000).toISOString(), items: [], total: 210.50, subtotal: 195.00, tax: 15.50, discount: 0, paymentMethod: 'cash' },
  { id: 'o3', date: new Date(Date.now() - 43200000).toISOString(), items: [], total: 45.00, subtotal: 41.50, tax: 3.50, discount: 0, paymentMethod: 'card' },
];

export const APP_NAME = "RetailFlow";
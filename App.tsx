import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { SalesHistory } from './components/SalesHistory';
import { Page, Product, CartItem, Order, Customer } from './types';
import { getProducts, getOrders, getCustomers, createOrder, saveProduct } from './services/storeService';
import { Menu, Bell, User, Search, Settings } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Global State (simulating a real backend connection)
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    // Simulate API latency
    setTimeout(() => {
      setProducts(getProducts());
      setOrders(getOrders());
      setCustomers(getCustomers());
      setLoading(false);
    }, 800);
  }, []);

  // Handlers
  const handleOrderComplete = (
    items: CartItem[], 
    totals: { subtotal: number, tax: number, discount: number, total: number }, 
    paymentMethod: 'cash' | 'card',
    customer?: Customer,
    pointsRedeemed?: number
  ) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items,
      total: totals.total,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      paymentMethod,
      customerId: customer?.id,
      pointsRedeemed
    };
    
    // Optimistic update
    const result = createOrder(newOrder, products);
    setOrders(result.orders);
    setProducts(result.products);
    setCustomers(result.customers);
  };

  const handleProductUpdate = (product: Product) => {
    const updatedProducts = saveProduct(product);
    setProducts(updatedProducts);
  };

  // View Routing
  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard products={products} orders={orders} />;
      case Page.POS:
        return <POS products={products} onCompleteOrder={handleOrderComplete} />;
      case Page.SALES_HISTORY:
        return <SalesHistory orders={orders} />;
      case Page.PRODUCTS_LIST:
        return <Inventory products={products} onUpdateProduct={handleProductUpdate} />;
      case Page.CUSTOMERS:
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-4">
                    <User size={48} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Management</h2>
                <div className="w-full max-w-4xl mt-6 text-left">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 text-left font-semibold text-gray-600">Customer</th>
                          <th className="p-4 text-left font-semibold text-gray-600">Contact</th>
                          <th className="p-4 text-center font-semibold text-gray-600">Loyalty Points</th>
                          <th className="p-4 text-right font-semibold text-gray-600">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(c => (
                          <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{c.name}</td>
                            <td className="p-4 text-gray-500 text-sm">{c.email}<br/>{c.phone}</td>
                            <td className="p-4 text-center">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{c.points} pts</span>
                            </td>
                            <td className="p-4 text-right font-medium">${c.totalSpent.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
        );
      
      // Placeholder pages for the full-suite feel
      case Page.ADD_PRODUCT:
      case Page.CATEGORIES:
      case Page.SUPPLIERS:
      case Page.EXPENSES:
      case Page.REPORTS:
      case Page.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed animate-fade-in">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Settings size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{currentPage}</h3>
            <p className="text-sm text-gray-500 max-w-md text-center">
              This module is part of the Enterprise plan. Please upgrade to access detailed {currentPage.toLowerCase()} features.
            </p>
          </div>
        );
        
      default:
        return <Dashboard products={products} orders={orders} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Top Header - Karbar Style (Clean, White) */}
        <header className="h-16 bg-white border-b border-gray-200/60 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Context Breadcrumb or Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-64">
               <Search size={16} className="text-gray-400" />
               <input 
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400" 
                  placeholder="Global Search..." 
               />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
               <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
               </button>
            </div>
            
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-gray-800">John Doe</p>
                <p className="text-[11px] text-gray-500 font-medium">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-slate-50/50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
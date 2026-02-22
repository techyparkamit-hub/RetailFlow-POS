import React from 'react';
import { Page } from '../types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileBarChart, 
  Settings, 
  LogOut, 
  Store,
  History,
  Tags,
  PlusCircle,
  Truck,
  Wallet
} from 'lucide-react';
import { APP_NAME } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isMobileOpen, onCloseMobile }) => {
  
  const sections = [
    {
      title: 'Main',
      items: [
        { page: Page.DASHBOARD, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      ]
    },
    {
      title: 'Sales & Operations',
      items: [
        { page: Page.POS, icon: <ShoppingCart size={18} />, label: 'POS System' },
        { page: Page.SALES_HISTORY, icon: <History size={18} />, label: 'Sales History' },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { page: Page.PRODUCTS_LIST, icon: <Package size={18} />, label: 'Products List' },
        { page: Page.ADD_PRODUCT, icon: <PlusCircle size={18} />, label: 'Add Product' },
        { page: Page.CATEGORIES, icon: <Tags size={18} />, label: 'Categories' },
      ]
    },
    {
      title: 'People',
      items: [
        { page: Page.CUSTOMERS, icon: <Users size={18} />, label: 'Customers' },
        { page: Page.SUPPLIERS, icon: <Truck size={18} />, label: 'Suppliers' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { page: Page.EXPENSES, icon: <Wallet size={18} />, label: 'Expenses' },
        { page: Page.REPORTS, icon: <FileBarChart size={18} />, label: 'Reports' },
      ]
    },
    {
      title: 'System',
      items: [
        { page: Page.SETTINGS, icon: <Settings size={18} />, label: 'Settings' },
      ]
    }
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:block shadow-xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-700/50 bg-[#0f172a]">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
             <Store size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide leading-tight">{APP_NAME}</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Business Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleNav(item.page)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                      currentPage === item.page 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className={`relative z-10 ${currentPage === item.page ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    <span className="relative z-10 text-sm font-medium">{item.label}</span>
                    {currentPage === item.page && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-700/50 bg-[#0f172a]">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium border border-slate-700">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
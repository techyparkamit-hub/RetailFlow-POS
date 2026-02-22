import React, { useState } from 'react';
import { Order } from '../types';
import { Search, Filter, Download, Eye, Printer, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

interface SalesHistoryProps {
  orders: Order[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(order => 
    (order.id.includes(searchTerm) || (order.customerId && order.customerId.includes(searchTerm))) &&
    (statusFilter === 'All' || statusFilter === 'Completed') // Mock status logic
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales History</h2>
          <p className="text-sm text-gray-500">Manage and view all transaction records</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
             <Download size={16} />
             Export CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors">
             <Printer size={16} />
             Print Report
           </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by Invoice ID or Customer..." 
             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
           <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 whitespace-nowrap">
             <Calendar size={16} /> Date Range
           </button>
           <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 whitespace-nowrap">
             <Filter size={16} /> Status: All
           </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice No</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 text-sm font-bold text-blue-600">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                       {order.customerId ? (
                         <span className="flex items-center gap-1.5 text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
                           <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                           Member
                         </span>
                       ) : (
                         <span className="text-gray-500">Walk-in Customer</span>
                       )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 capitalize">
                       <div className="flex items-center gap-2">
                         {order.paymentMethod === 'card' ? <span className="p-1 bg-purple-100 text-purple-600 rounded"><ArrowUpRight size={12}/></span> : <span className="p-1 bg-green-100 text-green-600 rounded"><ArrowDownRight size={12}/></span>}
                         {order.paymentMethod}
                       </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-800 text-right">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Completed
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
           <p className="text-xs text-gray-500">Showing <span className="font-bold">{filteredOrders.length}</span> entries</p>
           <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 border border-blue-600 rounded text-xs font-medium text-white">1</button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">2</button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};
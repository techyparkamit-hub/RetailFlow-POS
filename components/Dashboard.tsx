import React, { useMemo } from 'react';
import { Product, Order } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight, Package } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  orders: Order[];
}

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  subtext?: string;
  icon: React.ReactNode; 
  trend?: 'up' | 'down';
  trendValue?: string;
  colorClass: string 
}> = ({ title, value, subtext, icon, trend, trendValue, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.replace('bg-', 'text-')}`}>
       {React.cloneElement(icon as React.ReactElement<any>, { size: 60 })}
    </div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-lg ${colorClass} text-white shadow-lg shadow-blue-100`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ products, orders }) => {
  
  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    // Mocking some extra data for the "Business Suite" look
    const purchase = revenue * 0.6; 
    const expense = revenue * 0.15;
    const profit = revenue - purchase - expense;
    
    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      lowStockCount: lowStock,
      purchase,
      expense,
      profit
    };
  }, [products, orders]);

  // Mock data for charts
  const chartData = useMemo(() => {
    return [
      { name: 'Mon', sales: 4000, purchase: 2400 },
      { name: 'Tue', sales: 3000, purchase: 1398 },
      { name: 'Wed', sales: 2000, purchase: 9800 },
      { name: 'Thu', sales: 2780, purchase: 3908 },
      { name: 'Fri', sales: 1890, purchase: 4800 },
      { name: 'Sat', sales: 2390, purchase: 3800 },
      { name: 'Sun', sales: 3490, purchase: 4300 },
    ];
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Sales" 
          value={`$${metrics.totalRevenue.toLocaleString()}`} 
          trend="up"
          trendValue="+12%"
          icon={<DollarSign size={20} />} 
          colorClass="bg-blue-500" 
        />
        <MetricCard 
          title="Total Purchase" 
          value={`$${metrics.purchase.toLocaleString()}`} 
          subtext="60% of revenue"
          icon={<ShoppingBag size={20} />} 
          colorClass="bg-purple-500" 
        />
        <MetricCard 
          title="Total Expenses" 
          value={`$${metrics.expense.toLocaleString()}`} 
          trend="down"
          trendValue="-2.5%"
          icon={<CreditCard size={20} />} 
          colorClass="bg-orange-500" 
        />
        <MetricCard 
          title="Net Profit" 
          value={`$${metrics.profit.toLocaleString()}`} 
          trend="up"
          trendValue="+8.4%"
          icon={<TrendingUp size={20} />} 
          colorClass="bg-emerald-500" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sales & Purchase Overview</h3>
              <p className="text-xs text-gray-400">Comparing performance over the last 7 days</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg p-1 text-gray-600 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="purchase" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPurchase)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
          <div className="mb-4">
             <h3 className="text-lg font-bold text-gray-800">Low Stock Alert</h3>
             <p className="text-xs text-gray-400">Products needing immediate attention</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {products.filter(p => p.stock < 10).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-red-50 bg-red-50/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{p.stock}</p>
                  <p className="text-[10px] text-gray-400">Left</p>
                </div>
              </div>
            ))}
            {products.filter(p => p.stock < 10).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Package size={40} className="mb-2 opacity-20"/>
                <p>All stock levels good</p>
              </div>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            View All Inventory
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
            <p className="text-xs text-gray-400">Latest sales from POS</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Sales</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-blue-600">#{order.id.slice(-6)}</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-gray-800 font-medium">{order.customerId ? 'Loyalty Member' : 'Walk-in Customer'}</td>
                  <td className="p-4 text-sm text-gray-600 capitalize">{order.paymentMethod}</td>
                  <td className="p-4 text-sm font-bold text-gray-800 text-right">${order.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
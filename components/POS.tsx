import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, CartItem, Customer } from '../types';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, CheckCircle, Printer, ShoppingBag, Scan, User, X, Gift } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getCustomers } from '../services/storeService';

interface POSProps {
  products: Product[];
  onCompleteOrder: (items: CartItem[], totals: { subtotal: number, tax: number, discount: number, total: number }, paymentMethod: 'cash' | 'card', customer?: Customer, pointsRedeemed?: number) => void;
}

export const POS: React.FC<POSProps> = ({ products, onCompleteOrder }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Customer & Loyalty State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Scanner Logic
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isScannerOpen) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scanner.render((decodedText) => {
        setScanResult(decodedText);
        
        // Find product by SKU or ID
        const product = products.find(p => p.sku === decodedText || p.id === decodedText);
        if (product) {
          addToCart(product);
          setIsScannerOpen(false); // Close scanner on success
          setScanResult(null);
        } else {
           // If not found, set search query so user can see what was scanned
           setSearchQuery(decodedText);
        }
      }, (error) => {
        // console.warn(error);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScannerOpen, products]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  // Loyalty Redemption: 10 points = $1.00
  const discountAmount = (pointsToRedeem / 10); 
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  const handleCheckout = () => {
    onCompleteOrder(
      cart, 
      { subtotal, tax, discount: discountAmount, total: grandTotal }, 
      paymentMethod,
      selectedCustomer || undefined,
      pointsToRedeem
    );
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckoutModalOpen(false);
      setCart([]);
      setSelectedCustomer(null);
      setPointsToRedeem(0);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
      {/* Left Side: Product Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex gap-2">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button 
                onClick={() => setIsScannerOpen(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
                title="Scan Barcode"
             >
                <Scan size={20} />
                <span className="hidden sm:inline">Scan</span>
             </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/50">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group flex flex-col"
            >
              <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{product.name}</h4>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-emerald-600 font-bold">${product.price.toFixed(2)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock} left
                </span>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-12">
               <Search size={48} className="mb-2 opacity-50"/>
               <p>No products found.</p>
             </div>
          )}
        </div>

        {/* Scanner Modal Overlay */}
        {isScannerOpen && (
          <div className="absolute inset-0 z-50 bg-gray-900/90 flex flex-col items-center justify-center p-4">
             <div className="bg-white p-4 rounded-xl w-full max-w-sm relative">
                <button 
                  onClick={() => setIsScannerOpen(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-200"
                >
                  <X size={32} />
                </button>
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Scan Product Barcode</h3>
                <div id="reader" className="w-full bg-black rounded-lg overflow-hidden"></div>
                <p className="text-center text-sm text-gray-500 mt-4">Point camera at a barcode or QR code.</p>
             </div>
          </div>
        )}
      </div>

      {/* Right Side: Cart */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            Cart
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
          </h2>
          <button 
            onClick={() => setCart([])} 
            className="text-xs text-red-500 hover:text-red-700 font-medium"
            disabled={cart.length === 0}
          >
            Clear
          </button>
        </div>
        
        {/* Customer Section */}
        <div className="p-4 border-b border-gray-100">
           {selectedCustomer ? (
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1"><User size={14}/> {selectedCustomer.name}</h4>
                    <p className="text-xs text-blue-700">{selectedCustomer.points} Points Available</p>
                 </div>
                 <button onClick={() => { setSelectedCustomer(null); setPointsToRedeem(0); }} className="text-blue-400 hover:text-blue-600"><X size={16}/></button>
               </div>
               
               {/* Redemption Slider */}
               {selectedCustomer.points > 0 && (subtotal + tax) > 0 && (
                 <div className="mt-2 pt-2 border-t border-blue-100">
                    <label className="flex justify-between text-xs font-medium text-blue-800 mb-1">
                       <span>Redeem Points</span>
                       <span>-{pointsToRedeem} pts (${(pointsToRedeem / 10).toFixed(2)})</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.min(selectedCustomer.points, Math.ceil((subtotal + tax) * 10))} 
                      step="10"
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                 </div>
               )}
             </div>
           ) : (
             <button 
               onClick={() => setIsCustomerModalOpen(true)}
               className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
             >
               <User size={16} /> Add Customer
             </button>
           )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-sm">Scan an item or click the grid to add</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-100" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)} / unit</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Minus size={14}/></button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Plus size={14}/></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
             <div className="flex justify-between text-sm text-green-600 font-medium animate-pulse">
               <span className="flex items-center gap-1"><Gift size={14}/> Discount</span>
               <span>-${discountAmount.toFixed(2)}</span>
             </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl w-full max-w-md shadow-2xl h-[500px] flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Select Customer</h3>
                 <button onClick={() => setIsCustomerModalOpen(false)}><X size={20} className="text-gray-400"/></button>
              </div>
              <div className="p-4 border-b border-gray-100">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      autoFocus
                      placeholder="Search by name, email or phone"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                    />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                 {filteredCustomers.map(customer => (
                    <button 
                      key={customer.id}
                      onClick={() => { setSelectedCustomer(customer); setIsCustomerModalOpen(false); setCustomerSearch(''); }}
                      className="w-full text-left p-3 hover:bg-blue-50 rounded-lg group transition-colors flex justify-between items-center"
                    >
                       <div>
                          <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                          <p className="text-xs text-gray-500">{customer.email} • {customer.phone}</p>
                       </div>
                       <div className="text-right">
                          <span className="block font-bold text-blue-600">{customer.points} pts</span>
                       </div>
                    </button>
                 ))}
                 {filteredCustomers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                       <p>No customers found.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
            {orderSuccess ? (
              <div className="p-8 flex flex-col items-center text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                {selectedCustomer && (
                   <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                      {Math.floor(grandTotal)} points earned
                   </div>
                )}
                <p className="text-gray-500 mb-6">Receipt sent to email.</p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Printer size={18} /> Print
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Complete Payment</h3>
                  <p className="text-gray-500 text-sm mt-1">Total Amount: <span className="text-blue-600 font-bold text-lg">${grandTotal.toFixed(2)}</span></p>
                </div>
                <div className="p-6 space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <CreditCard size={24} className="mb-2"/>
                      <span className="font-medium">Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Banknote size={24} className="mb-2"/>
                      <span className="font-medium">Cash</span>
                    </button>
                  </div>
                  
                  {paymentMethod === 'cash' && (
                     <div className="mt-4">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Cash Received</label>
                        <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0.00" />
                     </div>
                  )}

                  <button 
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                  >
                    Confirm Payment
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex justify-center">
                   <button onClick={() => setIsCheckoutModalOpen(false)} className="text-gray-500 text-sm hover:underline">Cancel Transaction</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
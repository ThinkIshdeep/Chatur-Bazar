import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Mic, 
  Trash2, 
  Download, 
  CloudUpload, 
  Clock, 
  TrendingUp,
  CreditCard,
  Plus,
  AlertTriangle,
  X,
  Smartphone,
  CheckCircle,
  Menu,
  ChevronRight,
  Zap,
  Package,
  Barcode,
  Receipt,
  Activity,
  Send,
  RefreshCcw,
  PackagePlus,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { Product, CartItem, ToastMessage } from './types';
import { audioEngine } from './services/audioEngine';
import { INITIAL_INVENTORY } from './services/mockData';

// --- Types ---

interface NewItemModalProps {
  barcode: string;
  onSave: (name: string, price: number, category: string) => void;
  onClose: () => void;
}

interface PaymentModalProps {
  cart: CartItem[];
  total: number;
  onConfirm: () => void;
  onClose: () => void;
}

interface RestockPromptProps {
  product: Product;
  onClose: () => void;
  onConfirm: (qty: number) => void;
}

interface ReceiveModalProps {
  inventory: Product[];
  onConfirm: (product: Product, quantity: number) => void;
  onClose: () => void;
}

// --- Helper Components ---

const Toast: React.FC<{ msg: ToastMessage }> = ({ msg }) => (
  <div className={`fixed top-4 left-4 right-4 md:left-auto md:w-auto z-[70] px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-xl animate-slide-up md:animate-slide-in flex items-center gap-3
    ${msg.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' : 
      msg.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400' : 
      'bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400'}`}>
    {msg.type === 'success' && <CheckCircle size={24} className="animate-bounce" />}
    {msg.type === 'error' && <AlertTriangle size={24} className="animate-pulse" />}
    <span className="font-bold text-sm tracking-wide">{msg.message}</span>
  </div>
);

const ComboIndicator: React.FC<{ count: number }> = ({ count }) => {
  if (count < 2) return null;
  return (
    <div className="fixed top-24 right-4 md:right-12 z-40 pointer-events-none animate-combo-pop">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-zinc-900/90 border border-blue-500/50 text-blue-400 px-6 py-2 rounded-full font-black italic text-2xl shadow-xl flex items-center gap-2 transform -rotate-3">
          <Zap size={24} fill="currentColor" />
          {count}x COMBO!
        </div>
      </div>
    </div>
  );
};

const RestockPrompt: React.FC<RestockPromptProps> = ({ product, onClose, onConfirm }) => {
  const [qty, setQty] = useState(50); // Default reorder quantity
  const [step, setStep] = useState<'analyzing' | 'confirm'>('analyzing');

  useEffect(() => {
    // Simulate system analysis
    const timer = setTimeout(() => setStep('confirm'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[80] animate-slide-in">
      <div className="bg-white dark:bg-zinc-900/95 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl w-80 overflow-hidden relative">
         {/* Top Accent */}
         <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse-fast"></div>
         
         <div className="p-5">
           <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold uppercase tracking-wider text-xs">
                <Activity size={14} className="animate-pulse" />
                Auto-Pacing System
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-white"><X size={14}/></button>
           </div>

           {step === 'analyzing' ? (
             <div className="py-6 flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
                <RefreshCcw size={32} className="animate-spin text-blue-500" />
                <span className="text-xs font-mono">Analyzing Stock Velocity...</span>
             </div>
           ) : (
             <div className="animate-fade-in">
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">Stock critical ({product.stock} units). Initiate reorder?</p>
                
                <div className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-4 flex items-center justify-between">
                   <span className="text-zinc-500 text-xs font-bold uppercase">Order Qty</span>
                   <div className="flex items-center gap-2">
                     <button onClick={() => setQty(Math.max(10, qty - 10))} className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">-</button>
                     <span className="font-mono text-zinc-900 dark:text-white font-bold w-8 text-center">{qty}</span>
                     <button onClick={() => setQty(qty + 10)} className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">+</button>
                   </div>
                </div>

                <button 
                  onClick={() => onConfirm(qty)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                  <Send size={16} /> Approve & WhatsApp
                </button>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

const ReceiveModal: React.FC<ReceiveModalProps> = ({ inventory, onConfirm, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState('');

  const filtered = inventory.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.barcode && p.barcode.includes(search))
  );

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && qty) {
      onConfirm(selectedProduct, parseInt(qty));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <PackagePlus className="text-blue-500" /> Receive Stock
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
           {!selectedProduct ? (
             <div className="space-y-4">
               <input 
                 autoFocus
                 className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                 placeholder="Scan barcode or search item name..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
               
               <div className="space-y-2 mt-4">
                 {search && filtered.length === 0 && (
                   <div className="text-center text-zinc-500 py-4">No products found.</div>
                 )}
                 {filtered.map(p => (
                   <div 
                    key={p.id} 
                    onClick={() => setSelectedProduct(p)}
                    className="flex justify-between items-center p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer group transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                   >
                      <div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white">{p.name}</div>
                        <div className="text-xs text-zinc-500">Current Stock: {p.stock}</div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-400 group-hover:text-blue-600 dark:text-zinc-600 dark:group-hover:text-white" />
                   </div>
                 ))}
               </div>
             </div>
           ) : (
             <form onSubmit={handleConfirm} className="space-y-6">
               <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Product</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{selectedProduct.name}</div>
                  <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                     <span>Current: <span className="text-zinc-900 dark:text-white">{selectedProduct.stock}</span></span>
                     <span>Price: <span className="text-zinc-900 dark:text-white">₹{selectedProduct.price}</span></span>
                  </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Quantity Received</label>
                 <input 
                   autoFocus
                   type="number"
                   className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 font-mono text-2xl text-green-600 dark:text-green-400 focus:ring-2 focus:ring-green-500 outline-none"
                   placeholder="0"
                   value={qty}
                   onChange={(e) => setQty(e.target.value)}
                 />
               </div>

               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => {setSelectedProduct(null); setQty('');}} className="flex-1 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold">Back</button>
                 <button type="submit" className="flex-[2] py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-900/20">Confirm Receipt</button>
               </div>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

const NewItemModal: React.FC<NewItemModalProps> = ({ barcode, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    onSave(name, parseFloat(price), category);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-md z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white dark:bg-zinc-900 md:border border-t border-zinc-200 dark:border-zinc-700 md:rounded-2xl rounded-t-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">New Arrival</h2>
             <p className="text-zinc-500 text-xs mt-1">Assign details to barcode</p>
          </div>
          <span className="font-mono text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/20">{barcode}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Item Name</label>
            <input 
              autoFocus
              className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 text-lg text-zinc-900 dark:text-white"
              placeholder="e.g. Cyber Widget"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Price (₹)</label>
              <input 
                type="number"
                className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 font-mono text-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
               <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Category</label>
               <select 
                className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
               >
                 <option>General</option>
                 <option>Food</option>
                 <option>Drink</option>
                 <option>Household</option>
                 <option>Tech</option>
               </select>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-bold text-zinc-600 dark:text-zinc-400 transition-colors">Dismiss</button>
            <button type="submit" className="flex-[2] py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]">
              Add to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ cart, total, onConfirm, onClose }) => {
  const handleWhatsApp = () => {
    const itemsList = cart.map(i => `${i.name} x${i.quantity} (₹${i.price * i.quantity})`).join('\n');
    const text = `🧾 *Chatur Bazar Receipt*\n----------------\n${itemsList}\n----------------\n*Total: ₹${total.toFixed(2)}*\n\nThanks for visiting!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-auto">
        
        {/* Left Side: Actions */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between relative order-2 md:order-1 border-t md:border-t-0 border-zinc-200 dark:border-zinc-800">
           <button onClick={onClose} className="absolute top-4 left-4 md:left-auto md:right-auto text-zinc-500 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-white transition-colors flex items-center gap-2">
             <X size={24}/> <span className="md:hidden">Close</span>
           </button>

           <div className="mt-8 md:mt-0">
             <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-1">Confirm Order</h2>
             <p className="text-zinc-500 text-sm mb-6">Review the generated bill</p>
             
             <div className="space-y-4">
               <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold py-4 rounded-xl transition-all border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500 group">
                 <Smartphone size={20} className="text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform"/> Send to WhatsApp
               </button>
               
               <button onClick={onConfirm} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:scale-[1.02] hover:shadow-blue-900/60 z-10">
                 <CheckCircle size={20} /> Process Payment <span className="hidden md:inline text-blue-200 font-normal ml-1">(Space)</span>
               </button>
             </div>
           </div>
           
           <div className="text-center text-xs text-zinc-500 font-mono mt-6">ID: {Date.now().toString(36).toUpperCase()}</div>
        </div>

        {/* Right Side: Bill Receipt */}
        <div className="bg-zinc-100 dark:bg-zinc-950 p-8 md:w-1/2 md:border-l border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden order-1 md:order-2 dark:bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
           
           {/* Receipt Paper */}
           <div className="bg-white text-zinc-900 w-full max-w-sm p-6 shadow-2xl relative transform md:rotate-1 animate-slide-up overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-4 after:bg-[linear-gradient(-45deg,transparent_16px,#fff_16px),linear-gradient(45deg,transparent_16px,#fff_16px)] after:bg-[length:24px_24px] after:bg-repeat-x after:translate-y-2">
              
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-zinc-300 pb-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                   <Package size={20} className="text-zinc-900" />
                   <h3 className="font-black text-xl tracking-tight uppercase">Chatur Bazar</h3>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Smart Retail OS</p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">{new Date().toLocaleString()}</p>
              </div>

              {/* Items */}
              <div className="min-h-[200px] max-h-[300px] overflow-y-auto pr-2 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-zinc-300">
                 <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase border-b border-zinc-100 pb-1">
                    <span>Item</span>
                    <span>Amt</span>
                 </div>
                 {cart.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-800">{item.name}</span>
                        <span className="text-[10px] text-zinc-500">{item.quantity} x ₹{item.price}</span>
                      </div>
                      <span className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</span>
                   </div>
                 ))}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-dashed border-zinc-300 pt-4 mt-4 space-y-1">
                 <div className="flex justify-between text-xl font-black mt-2 pt-2 border-t border-zinc-100">
                   <span>TOTAL MRP</span>
                   <span>₹{total.toFixed(2)}</span>
                 </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center opacity-70">
                 <div className="h-8 bg-zinc-900 w-full mb-1 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)] opacity-20"></div>
                 </div>
                 <p className="text-[10px] font-mono">THANK YOU FOR VISITING</p>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
};

// --- Main App Component ---

function App() {
  // State
  const [inventory, setInventory] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [newItemData, setNewItemData] = useState<{barcode: string} | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [shiftStart] = useState(new Date());
  const [shiftDuration, setShiftDuration] = useState('00:00:00');
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Crazy Features State
  const [comboCount, setComboCount] = useState(0);
  const comboTimeoutRef = useRef<number | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  
  // Auto-Pacing State
  const [activeRestock, setActiveRestock] = useState<Product | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const keyBuffer = useRef<string>('');
  const lastKeyTime = useRef<number>(0);
  const velocityTrapLimit = 50; 

  // --- Initialization ---

  useEffect(() => {
    const savedInv = localStorage.getItem('smartstock_inventory');
    const savedRev = localStorage.getItem('smartstock_revenue');
    
    if (savedInv) setInventory(JSON.parse(savedInv));
    else {
      setInventory(INITIAL_INVENTORY);
      localStorage.setItem('smartstock_inventory', JSON.stringify(INITIAL_INVENTORY));
    }

    if (savedRev) setDailyRevenue(parseFloat(savedRev));
  }, []);

  useEffect(() => {
    localStorage.setItem('smartstock_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('smartstock_revenue', dailyRevenue.toString());
  }, [dailyRevenue]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - shiftStart.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setShiftDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [shiftStart]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ id: Date.now().toString(), message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    audioEngine.click();
  };

  // --- Core Logic ---

  const incrementCombo = () => {
    setComboCount(prev => prev + 1);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = window.setTimeout(() => setComboCount(0), 3000); 
  };

  const handleRestockConfirm = (qty: number) => {
     if (!activeRestock) return;
     
     // Construct WhatsApp Message
     const text = `🤖 *AUTO-RESTOCK ORDER* 📦\n\n` +
                  `Item: *${activeRestock.name}*\n` +
                  `ID: ${activeRestock.id}\n` +
                  `Current Stock: ${activeRestock.stock}\n` +
                  `------------------\n` +
                  `*ORDER QUANTITY: ${qty}*\n` +
                  `------------------\n` +
                  `Please confirm delivery time.`;
     
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
     setActiveRestock(null);
     showToast('Restock Order Initiated', 'success');
  };

  const handleReceiveStock = (product: Product, quantity: number) => {
    setInventory(prev => prev.map(p => 
      p.id === product.id ? { ...p, stock: p.stock + quantity } : p
    ));
    audioEngine.beep();
    showToast(`Received ${quantity} units of ${product.name}`, 'success');
    setShowReceiveModal(false);
  };

  const addToCart = useCallback((product: Product) => {
    // 1. Check Stock
    if (product.stock <= 0) {
      audioEngine.buzz();
      showToast(`${product.name} is Out of Stock!`, 'error');
      return;
    }

    audioEngine.beep();
    incrementCombo();
    
    setLastScanned(product.name);
    setTimeout(() => setLastScanned(null), 1000);

    // Calculate new stock immediately for trigger logic
    const newStock = product.stock - 1;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Decrease inventory
    setInventory(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));

    // --- AUTO PACING TRIGGER ---
    if (newStock === 5 || newStock === 2) {
       // Using 5 as a warning threshold and 2 as critical
       // We pass the product object with the NEW stock value to the prompt
       setActiveRestock({ ...product, stock: newStock });
       audioEngine.click(); // Subtle alert sound
    }

  }, []);

  const removeFromCart = (item: CartItem) => {
    audioEngine.click();
    // Restore inventory
    setInventory(prev => prev.map(p => p.id === item.id ? { ...p, stock: p.stock + item.quantity } : p));
    // Remove from cart
    setCart(prev => prev.filter(i => i.id !== item.id));
  };

  const clearCart = () => {
    audioEngine.click();
    // Restore all inventory
    setInventory(prev => {
      const newInv = [...prev];
      cart.forEach(cartItem => {
        const productIndex = newInv.findIndex(p => p.id === cartItem.id);
        if (productIndex > -1) {
           newInv[productIndex] = {
             ...newInv[productIndex],
             stock: newInv[productIndex].stock + cartItem.quantity
           };
        }
      });
      return newInv;
    });
    setCart([]);
  };

  const handlePaymentConfirm = () => {
    audioEngine.chaching();
    setShowPayment(false);
    setIsMobileCartOpen(false);
    setComboCount(0);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setDailyRevenue(prev => prev + total);
    setCart([]); // Inventory is already deducted, so just clear cart
    
    showToast(`Transaction Complete: ₹${total.toFixed(2)}`, 'success');
  };

  // --- Input Handlers ---

  const startVoice = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      audioEngine.click();
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const matchedProduct = inventory.find(p => transcript.includes(p.name.toLowerCase()));
        if (matchedProduct) {
          addToCart(matchedProduct);
          showToast(`Voice Add: ${matchedProduct.name}`, 'success');
        } else {
           showToast(`No item found for "${transcript}"`, 'error');
           audioEngine.buzz();
        }
      };
      
      recognition.onerror = () => {
        audioEngine.buzz();
        showToast("Voice command failed. Try again.", "error");
      };
    } else {
      showToast("Voice not supported on this device.", "error");
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      audioEngine.init();

      const now = Date.now();
      const timeDiff = now - lastKeyTime.current;
      lastKeyTime.current = now;

      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;

      // Modal/Nav Shortcuts
      if (e.code === 'Space' && !isSearchFocused && !newItemData && cart.length > 0) {
        e.preventDefault();
        if (showPayment) handlePaymentConfirm();
        else {
           setShowPayment(true);
           audioEngine.click();
        }
        return;
      }

      if (e.key === '/' && !isSearchFocused && !newItemData && !showPayment && !showReceiveModal) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        setShowPayment(false);
        setShowReceiveModal(false);
        setNewItemData(null);
        setIsMobileCartOpen(false);
        setActiveRestock(null);
        searchInputRef.current?.blur();
        return;
      }

      // Hotkeys (1-9)
      if (!isSearchFocused && !newItemData && !showPayment && !showReceiveModal && /^[1-9]$/.test(e.key)) {
        const product = inventory.find(p => p.shortcut === e.key);
        if (product) {
          addToCart(product);
          return;
        }
      }

      // Velocity Trap
      if (e.key === 'Enter') {
        if (keyBuffer.current.length > 0) {
          const scannedCode = keyBuffer.current;
          const product = inventory.find(p => p.barcode === scannedCode);
          
          if (product) {
            addToCart(product);
            showToast(`Scanned: ${product.name}`, 'success');
          } else {
            audioEngine.click();
            setNewItemData({ barcode: scannedCode });
          }
          keyBuffer.current = '';
        }
      } else {
        if (timeDiff < velocityTrapLimit) {
          if (e.key.length === 1) keyBuffer.current += e.key;
        } else {
          if (!isSearchFocused && !newItemData && !showReceiveModal) keyBuffer.current = ''; 
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inventory, isSearchFocused, newItemData, showPayment, cart, addToCart, showReceiveModal]);

  const handleCloudSync = () => {
    setIsCloudSyncing(true);
    audioEngine.click();
    setTimeout(() => {
      setIsCloudSyncing(false);
      showToast("Cloud Database Synced", 'success');
      audioEngine.beep();
    }, 2000);
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock"];
    const rows = inventory.map(p => [p.id, p.name, p.category, p.price, p.stock].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `ChaturBazar_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast("Inventory CSV Exported", 'info');
  };

  const filteredProducts = inventory.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
    <div className="h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative transition-colors duration-300">
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none z-0"></div>
      
      {toast && <Toast msg={toast} />}
      <ComboIndicator count={comboCount} />

      {/* --- Restock Prompt (Auto Pacing) --- */}
      {activeRestock && (
        <RestockPrompt 
          product={activeRestock} 
          onClose={() => setActiveRestock(null)} 
          onConfirm={handleRestockConfirm} 
        />
      )}

      {/* --- Header --- */}
      <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-4 md:px-6 z-50 shrink-0 relative transition-colors duration-300">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
            <Package size={20} className="text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-none">Chatur Bazar</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500 font-semibold">Smart Retail</span>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-3 md:mx-8 relative group">
          <div className={`absolute inset-0 bg-blue-500/20 blur-xl rounded-full transition-opacity ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`}></div>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isSearchFocused ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-600'}`} size={16} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search catalog..." 
            className="w-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-full py-2.5 pl-11 pr-12 focus:outline-none focus:bg-white dark:focus:bg-black focus:border-blue-500/50 transition-all text-sm relative z-10 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 z-10">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded hidden md:block">/</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="hidden lg:flex flex-col items-end">
             <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                <Clock size={12} /> {shiftDuration}
             </div>
          </div>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider hidden sm:block">Revenue</span>
            <div className="text-green-600 dark:text-green-400 font-mono font-bold flex items-center gap-1.5 text-sm md:text-base bg-green-100 dark:bg-green-900/10 px-2 py-0.5 rounded border border-green-200 dark:border-green-900/20">
              <TrendingUp size={14} /> ₹{dailyRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Workspace --- */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Left Panel: Catalog */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/50 dark:bg-zinc-900/30 md:mr-0 transition-colors duration-300">
          
          {/* Action Bar */}
          <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide shrink-0 border-b border-zinc-200 dark:border-white/5">
             <button onClick={() => setShowReceiveModal(true)} className="glass-panel hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-700 dark:text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-2 text-sm font-medium active:scale-95 border-blue-500/30 bg-blue-50 dark:bg-blue-500/5">
               <PackagePlus size={16} className="text-blue-500 dark:text-blue-400" /> <span className="hidden sm:inline">Receive Stock</span><span className="sm:hidden">Receive</span>
             </button>
             <button onClick={startVoice} className="glass-panel hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-700 dark:text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-2 text-sm font-medium active:scale-95">
               <Mic size={16} className="text-red-500 dark:text-red-400" /> <span className="hidden sm:inline">Voice Command</span><span className="sm:hidden">Voice</span>
             </button>
             <button onClick={handleCloudSync} className="glass-panel hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-700 dark:text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-2 text-sm font-medium active:scale-95">
               {isCloudSyncing ? <div className="w-4 h-4 border-2 border-t-transparent border-zinc-500 dark:border-white rounded-full animate-spin"></div> : <CloudUpload size={16} className="text-blue-500 dark:text-blue-400" />} 
               <span className="hidden sm:inline">Sync Data</span>
             </button>
             <button onClick={handleExport} className="glass-panel hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-700 dark:text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-2 text-sm font-medium active:scale-95">
               <Download size={16} className="text-green-500 dark:text-green-400" /> <span className="hidden sm:inline">Export CSV</span>
             </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
               {/* Quick Add Card */}
               <div 
                 onClick={() => setNewItemData({barcode: 'MANUAL-' + Date.now()})}
                 className="aspect-[4/3] border border-dashed border-zinc-300 dark:border-zinc-700/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden bg-white/60 dark:bg-zinc-900/40">
                 <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-lg">
                   <Plus size={24} className="text-zinc-400 group-hover:text-white" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-300">New Item</span>
               </div>

               {filteredProducts.map(product => (
                 <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className={`relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 rounded-2xl p-4 cursor-pointer transition-all group flex flex-col justify-between overflow-hidden shadow-sm
                    ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                    ${product.stock < 10 && product.stock > 0 ? 'border-red-500/20' : ''} active:scale-95`}
                 >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate max-w-[80px] bg-zinc-100 dark:bg-black/40 px-1.5 py-0.5 rounded">{product.category}</span>
                        {product.shortcut && <span className="bg-zinc-200 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 text-[10px] px-1.5 rounded font-mono min-w-[1.25rem] h-5 flex items-center justify-center hidden md:flex border border-zinc-300 dark:border-white/5">{product.shortcut}</span>}
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{product.name}</h3>
                      
                      {/* Stock Display Logic */}
                      <div className="mt-2 flex items-center gap-2">
                         {product.stock <= 5 ? (
                            <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded border ${product.stock === 0 ? 'text-zinc-500 border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800' : 'text-red-500 dark:text-red-400 border-red-500/20 bg-red-100 dark:bg-red-500/10 animate-pulse'}`}>
                              <AlertTriangle size={10} /> {product.stock === 0 ? 'Out of Stock' : `${product.stock} Left`}
                            </span>
                         ) : (
                            <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/5">
                              {product.stock} Units
                            </span>
                         )}
                      </div>

                    </div>
                    <div className="mt-4 flex items-end justify-between relative z-10">
                      <span className="font-mono text-lg font-bold text-zinc-900 dark:text-white">₹{product.price}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg ${product.stock > 0 ? 'bg-blue-600 opacity-0 group-hover:opacity-100 shadow-blue-900/40' : 'bg-zinc-400 dark:bg-zinc-700 opacity-100 cursor-not-allowed'}`}>
                         {product.stock > 0 ? <Plus size={16} /> : <X size={16} />}
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Cart (Desktop: Static, Mobile: Drawer) */}
        <div className={`
          fixed inset-y-0 right-0 w-full md:w-[400px] z-[55] md:z-auto bg-white/95 dark:bg-zinc-950/50 backdrop-blur-2xl md:backdrop-blur-xl border-l border-zinc-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:static md:inset-auto md:translate-x-0
          ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Header */}
          <div className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 bg-zinc-50 dark:bg-zinc-900/50">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <ShoppingCart size={20} className="text-zinc-700 dark:text-zinc-100" />
                 {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItemCount}</span>}
               </div>
               <span className="font-bold text-zinc-900 dark:text-white">Current Order</span>
             </div>
             <button onClick={() => setIsMobileCartOpen(false)} className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-200 dark:bg-white/5 rounded-full">
               <X size={20} />
             </button>
             <button onClick={clearCart} className="hidden md:flex text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
               <Trash2 size={12} /> Clear
             </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
             {cart.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-4 opacity-50 pointer-events-none">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center animate-pulse">
                    <Barcode size={48} strokeWidth={1} />
                  </div>
                  <p className="text-sm font-medium">Ready to scan...</p>
               </div>
             ) : (
               cart.map((item, idx) => (
                 <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-200 dark:border-white/5 rounded-xl group animate-slide-in relative overflow-hidden transition-all shadow-sm dark:shadow-none">
                    {/* Quantity Badge */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-black/40 flex items-center justify-center text-sm font-mono font-bold text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-white/5 shadow-inner shrink-0">
                      {item.quantity}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-xs text-zinc-500 font-mono">₹{item.price} / unit</div>
                    </div>
                    
                    <div className="text-right">
                       <div className="font-mono font-bold text-zinc-900 dark:text-white">₹{item.price * item.quantity}</div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item);
                      }}
                      className="absolute right-0 top-0 h-full w-12 bg-red-100 dark:bg-red-500/10 hover:bg-red-500 dark:hover:bg-red-500/80 flex items-center justify-center text-red-500 hover:text-white translate-x-full group-hover:translate-x-0 transition-transform duration-200 backdrop-blur-sm">
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))
             )}
          </div>

          {/* Totals Section */}
          <div className="bg-gray-50 dark:bg-zinc-950 p-6 border-t border-zinc-200 dark:border-white/10 space-y-5 pb-8 md:pb-6 relative z-20">
             <div className="space-y-2">
               <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                 <span>Subtotal</span>
                 <span className="font-mono">₹{cartTotal.toFixed(2)}</span>
               </div>
             </div>

             <div className="flex justify-between items-end border-t border-dashed border-zinc-300 dark:border-zinc-800 pt-4">
               <span className="text-zinc-500 font-bold uppercase tracking-wider text-xs">Total Payable</span>
               <span className="font-mono text-3xl font-bold text-green-600 dark:text-green-400 tracking-tight">₹{cartTotal.toFixed(2)}</span>
             </div>

             <button 
               onClick={() => cart.length > 0 && setShowPayment(true)}
               disabled={cart.length === 0}
               className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg overflow-hidden relative group
                 ${cart.length > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}`}
             >
               <span className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${cart.length === 0 ? 'hidden' : ''}`}></span>
               <CreditCard size={20} />
               Checkout
             </button>
          </div>
        </div>

      </main>

      {/* --- Mobile Bottom Floating Bar --- */}
      <div className={`fixed bottom-6 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-4 rounded-2xl shadow-2xl z-40 md:hidden flex items-center justify-between transition-transform duration-300 ${isMobileCartOpen ? 'translate-y-[150%]' : 'translate-y-0'}`}>
         <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 text-blue-600 dark:text-blue-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
              {cartItemCount}
            </div>
            <div className="flex flex-col">
               <span className="text-xs text-zinc-500 font-bold uppercase">Total</span>
               <span className="text-lg font-bold font-mono text-zinc-900 dark:text-white">₹{cartTotal.toFixed(2)}</span>
            </div>
         </div>
         <button 
           onClick={() => setIsMobileCartOpen(true)}
           className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors text-sm"
         >
           Pay <ChevronRight size={16} />
         </button>
      </div>

      {/* --- Modals --- */}
      {showPayment && (
        <PaymentModal 
          cart={cart}
          total={cartTotal} 
          onConfirm={handlePaymentConfirm} 
          onClose={() => setShowPayment(false)} 
        />
      )}

      {showReceiveModal && (
        <ReceiveModal 
          inventory={inventory} 
          onConfirm={handleReceiveStock} 
          onClose={() => setShowReceiveModal(false)}
        />
      )}

      {newItemData && (
        <NewItemModal
          barcode={newItemData.barcode}
          onClose={() => setNewItemData(null)}
          onSave={(name, price, category) => {
            const newItem: Product = {
              id: `p-${Date.now()}`,
              name,
              price,
              category,
              stock: 100,
              barcode: newItemData.barcode
            };
            setInventory(prev => [...prev, newItem]);
            addToCart(newItem);
            setNewItemData(null);
            showToast(`Database Updated: ${name}`, 'success');
            audioEngine.beep();
          }}
        />
      )}
    </div>
    </div>
  );
}

export default App;
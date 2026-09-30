import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Users, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchOrders, importProductsBulk } from '../api';

export default function AdminPortal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'import'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import state
  const [importJsonText, setImportJsonText] = useState('');
  const [clearExisting, setClearExisting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      if (file.name.endsWith('.csv')) {
        const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const productsArray = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const item = {};
          headers.forEach((h, idx) => {
            item[h] = values[idx] || '';
          });
          return {
            name: item.name || 'Handloom Silk Saree',
            category: item.category || 'Banarasi Silk',
            fabric: item.fabric || 'Pure Silk',
            occasion: item.occasion || 'Festive / Wedding',
            work: item.work || 'Zari Weaving',
            color: item.color || 'Red',
            price: parseFloat(item.price) || 4999,
            mrp: parseFloat(item.mrp) || 8999,
            image_url: item.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
            description: item.description || 'Authentic handcrafted silk saree.'
          };
        });
        setImportJsonText(JSON.stringify(productsArray, null, 2));
      } else {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRunImport = async () => {
    setImportStatus(null);
    setImporting(true);
    try {
      const parsed = JSON.parse(importJsonText);
      const products = Array.isArray(parsed) ? parsed : (parsed.products || []);
      if (!products.length) {
        throw new Error('No valid product items found in JSON array.');
      }
      const res = await importProductsBulk(products, clearExisting);
      setImportStatus({ type: 'success', message: res.message });
      setImportJsonText('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setImportStatus({ type: 'error', message: err.message || 'Failed to import product catalog.' });
    } finally {
      setImporting(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-canvas w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto border border-subtle p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
          <div>
            <h2 className="font-serif font-normal text-2xl text-obsidian tracking-wider uppercase">
              Riddhi Collection Admin Portal
            </h2>
            <p className="text-xs text-muted font-light tracking-wide">Live Customer Orders & Bulk Catalog Import</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-obsidian" aria-label="Close Admin">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-subtle pb-3 mb-4">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`text-xs font-serif uppercase tracking-widest px-4 py-2 transition-all ${
              activeTab === 'orders' ? 'bg-obsidian text-champagne-400 font-medium' : 'bg-white text-stone-600 border border-subtle'
            }`}
          >
            Live Customer Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={`text-xs font-serif uppercase tracking-widest px-4 py-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'import' ? 'bg-obsidian text-champagne-400 font-medium' : 'bg-white text-stone-600 border border-subtle'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import Catalog (CSV / JSON)
          </button>
        </div>

        {activeTab === 'orders' ? (
          <>
            {/* Analytics KPI Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 border border-subtle text-left">
                <div className="flex items-center gap-2 text-obsidian text-xs font-medium uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-champagne-600" />
                  <span>Total Revenue</span>
                </div>
                <div className="text-xl font-serif font-medium text-obsidian mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white p-4 border border-subtle text-left">
                <div className="flex items-center gap-2 text-obsidian text-xs font-medium uppercase tracking-wider">
                  <Package className="w-4 h-4 text-champagne-600" />
                  <span>Total Orders</span>
                </div>
                <div className="text-xl font-serif font-medium text-obsidian mt-1">
                  {orders.length}
                </div>
              </div>

              <div className="bg-white p-4 border border-subtle text-left">
                <div className="flex items-center gap-2 text-obsidian text-xs font-medium uppercase tracking-wider">
                  <Users className="w-4 h-4 text-champagne-600" />
                  <span>Active Customers</span>
                </div>
                <div className="text-xl font-serif font-medium text-obsidian mt-1">
                  {orders.length}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="flex-1 overflow-y-auto border border-subtle bg-white">
              {loading ? (
                <div className="p-8 text-center text-xs text-stone-400 font-light">Loading live orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-400 font-light">No orders placed yet. Test by placing an order from the shopping bag!</div>
              ) : (
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-canvas text-obsidian font-serif font-medium uppercase text-[10px] tracking-widest border-b border-subtle sticky top-0">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Shipping Address</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-canvas">
                        <td className="p-3 font-mono font-medium text-obsidian">{o.id}</td>
                        <td className="p-3 font-medium text-obsidian">{o.customer_name}<br/><span className="text-[10px] text-muted font-light">{o.customer_phone}</span></td>
                        <td className="p-3 max-w-xs truncate font-light">{o.shipping_address}, {o.pincode}</td>
                        <td className="p-3 font-light">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="line-clamp-1">
                              {it.quantity}x {it.name}
                            </div>
                          ))}
                        </td>
                        <td className="p-3">
                          <span className="bg-canvas border border-subtle px-2 py-0.5 text-[10px] font-medium text-obsidian uppercase tracking-wider">{o.payment_method}</span>
                        </td>
                        <td className="p-3 text-right font-serif font-medium text-obsidian">
                          ₹{o.total_amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 text-left">
            <div className="bg-white p-4 border border-subtle text-xs text-obsidian space-y-1">
              <h4 className="font-serif font-normal text-base text-obsidian uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-champagne-600" />
                Bulk Product Import (Surat Saree Catalog)
              </h4>
              <p className="font-light">Upload a <strong className="font-medium">CSV</strong> or <strong className="font-medium">JSON</strong> file containing your saree products, prices, fabrics, and image links.</p>
              <p className="text-[11px] text-muted font-light">CSV Headers Supported: <code>name, category, fabric, occasion, work, color, price, mrp, image_url, description</code></p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex-1 cursor-pointer bg-white border border-dashed border-subtle p-4 text-center hover:border-champagne-500 transition-all">
                <FileText className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-obsidian block">Click to select CSV / JSON catalog file</span>
                <span className="text-[10px] text-muted font-light">.csv or .json files accepted</span>
                <input type="file" accept=".csv, .json" onChange={handleFileUpload} className="hidden" />
              </label>

              <label className="flex items-center gap-2 text-xs font-light text-obsidian cursor-pointer bg-white p-3 border border-subtle">
                <input 
                  type="checkbox" 
                  checked={clearExisting} 
                  onChange={(e) => setClearExisting(e.target.checked)}
                  className="accent-champagne-500" 
                />
                Replace current catalog items
              </label>
            </div>

            {importStatus && (
              <div className={`p-3 text-xs font-medium flex items-center gap-2 ${
                importStatus.type === 'success' ? 'bg-stone-100 text-obsidian border border-subtle' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-champagne-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{importStatus.message}</span>
              </div>
            )}

            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-obsidian block mb-1">JSON / CSV Data Preview:</label>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[{"name": "Surat Zari Silk Saree", "category": "Banarasi Silk", "fabric": "Pure Silk", "occasion": "Bridal", "price": 8999, "mrp": 14999, "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"}]'
                className="w-full font-mono text-xs p-3 border border-subtle focus:outline-none focus:border-champagne-500 bg-white text-obsidian"
              />
            </div>

            <button
              onClick={handleRunImport}
              disabled={importing || !importJsonText.trim()}
              className="w-full bg-obsidian text-canvas py-3.5 font-serif text-xs uppercase tracking-[0.2em] hover:bg-champagne-500 hover:text-obsidian transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md border border-champagne-500/30"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Importing Products...' : 'Execute Import to Riddhi Collection'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


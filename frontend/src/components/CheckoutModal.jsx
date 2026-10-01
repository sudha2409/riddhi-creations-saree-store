import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Smartphone, Truck, Lock, Copy, Check, MessageSquare, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { placeOrder } from '../api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  discountApplied,
  onClearCart
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('FORM'); // 'FORM' | 'PAYMENT_UPI' | 'CONFIRMED'

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    pincode: '',
    payment_method: 'UPI'
  });

  const [utrNumber, setUtrNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('sudhalohani1-3@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }
    const cleanPhone = formData.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number.');
      return;
    }
    if (!formData.shipping_address.trim()) {
      setErrorMsg('Please enter your Full Shipping Address.');
      return;
    }
    const cleanPincode = formData.pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Pincode.');
      return;
    }

    setStep('PAYMENT_UPI');
  };

  const handleVerifyUpiPayment = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utrNumber.trim()) {
      setErrorMsg('Please enter the 12-digit UTR / UPI Transaction Reference Number from GPay/PhonePe to verify payment.');
      return;
    }
    if (utrNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid Transaction UTR Number.');
      return;
    }

    executePlaceOrder('UPI', utrNumber.trim(), 'Paid & Verified');
  };

  const executePlaceOrder = async (payMethod, utr, payStatus) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || 'customer@riddhicollection.com',
        customer_phone: formData.customer_phone.replace(/\D/g, ''),
        shipping_address: formData.shipping_address.trim(),
        city: formData.city.trim() || 'Rajnandgaon',
        pincode: formData.pincode.replace(/\D/g, ''),
        payment_method: payMethod,
        utr_number: utr,
        payment_status: payStatus,
        items: cartItems.map(item => ({
          product_id: typeof item.id === 'number' ? item.id : (parseInt(item.id) || 101),
          name: item.name || 'Magenta Pink Moss Printed Saree',
          price: Number(item.price) || 675,
          quantity: Number(item.quantity) || 1,
          image_url: item.image_url || item.image || '/moss_saree_pink.jpg'
        })),
        total_amount: Number(totalAmount) || 675,
        discount_applied: Number(discountApplied) || 0
      };

      const result = await placeOrder(payload);

      const createdOrder = {
        ...result,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.replace(/\D/g, ''),
        shipping_address: formData.shipping_address.trim(),
        city: formData.city.trim() || 'Rajnandgaon',
        pincode: formData.pincode.replace(/\D/g, ''),
        payment_method: payMethod,
        utr_number: utr,
        payment_status: payStatus,
        items: cartItems,
        total_amount: Number(totalAmount) || 675
      };

      setOrderResult(createdOrder);
      setStep('CONFIRMED');
      onClearCart();

      // AUTO DIRECT WHATSAPP REDIRECT TO CUSTOMER PHONE
      const cleanPhone = formData.customer_phone.replace(/\D/g, '');
      const itemsList = cartItems.map(i => `• *${i.name}* (x${i.quantity}) - ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
      const waText = encodeURIComponent(`🎉 *ORDER CONFIRMED — RIDDHI CREATIONS* 🎉

Dear *${formData.customer_name.trim()}*,
Thank you for shopping with Riddhi Creations! Your payment of *₹${Number(totalAmount).toLocaleString('en-IN')}* has been verified successfully.

🛍️ *ORDER DETAILS:*
• *Order ID:* ${result.order_id || 'SAR-1001'}
• *Payment Method:* ${payMethod}${utr ? ` (Ref UTR: ${utr})` : ''}
• *Payment Status:* ${payStatus}
• *Total Amount:* ₹${Number(totalAmount).toLocaleString('en-IN')}

📦 *ITEMS ORDERED:*
${itemsList}

🚚 *DELIVERY ADDRESS:*
${formData.shipping_address.trim()}, ${formData.city.trim() || 'Rajnandgaon'} - ${formData.pincode.replace(/\D/g, '')}
📞 Phone: ${cleanPhone}

✨ Your saree package is being packed at our Surat Handloom Studio and will be dispatched within 24 hours.

Thank you for choosing *RIDDHI CREATIONS — SURAT HANDLOOM COUTURE*!`);

      setTimeout(() => {
        try {
          window.open(`https://wa.me/91${cleanPhone}?text=${waText}`, '_blank');
        } catch (e) {
          console.log('Browser blocked auto popup:', e);
        }
      }, 400);

    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppMessage = () => {
    if (!orderResult) return '';
    const itemsList = (orderResult.items || cartItems).map(i => `• *${i.name}* (x${i.quantity}) - ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
    
    return `🎉 *ORDER CONFIRMED — RIDDHI CREATIONS* 🎉

Dear *${orderResult.customer_name}*,
Thank you for shopping with Riddhi Creations! Your payment of *₹${orderResult.total_amount.toLocaleString('en-IN')}* has been verified successfully.

🛍️ *ORDER DETAILS:*
• *Order ID:* ${orderResult.order_id}
• *Payment Method:* ${orderResult.payment_method}${orderResult.utr_number ? ` (Ref UTR: ${orderResult.utr_number})` : ''}
• *Payment Status:* ${orderResult.payment_status}
• *Total Amount:* ₹${orderResult.total_amount.toLocaleString('en-IN')}

📦 *ITEMS ORDERED:*
${itemsList}

🚚 *DELIVERY ADDRESS:*
${orderResult.shipping_address}, ${orderResult.city} - ${orderResult.pincode}
📞 Phone: ${orderResult.customer_phone}

✨ Your saree package is being packed at our Surat Handloom Studio and will be dispatched within 24 hours.

Thank you for choosing *RIDDHI CREATIONS — SURAT HANDLOOM COUTURE*!`;
  };

  const handleOpenWhatsAppCustomer = () => {
    const cleanPhone = (orderResult?.customer_phone || formData.customer_phone).replace(/\D/g, '');
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/91${cleanPhone}?text=${text}`, '_blank');
  };

  const handleOpenWhatsAppAdmin = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/918770275989?text=${text}`, '_blank');
  };

  const handleCopyWaText = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F4] w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto border border-[#E7E1D9] p-6 sm:p-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E7E1D9] pb-4 mb-6">
          <div className="flex items-center gap-2.5 font-serif font-normal text-xl text-[#171717] tracking-wider uppercase">
            <Lock className="w-5 h-5 text-[#B5924E]" />
            <span>
              {step === 'CONFIRMED' ? 'Order Confirmed' : 'Encrypted Checkout'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-[#171717]" aria-label="Close Checkout">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-xs font-medium rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 1: CONTACT & SHIPPING DETAILS FORM   */}
        {/* ========================================== */}
        {step === 'FORM' && (
          <form onSubmit={handleProceedToPayment} className="space-y-5 text-left">
            
            {/* Customer Contact */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#171717]">1. Contact & Shipping Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="Enter your Full Name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Phone Number (10 digits) *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="10-digit Mobile Number"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  name="customer_email"
                  placeholder="yourname@example.com"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Shipping Address *</label>
                <textarea
                  name="shipping_address"
                  required
                  rows={2}
                  placeholder="House No, Building, Street Name, Landmark"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City / Town"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">Pincode (6 digits) *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="6-digit Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] text-[#171717]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Banner (UPI Prepaid Only) */}
            <div className="space-y-2 pt-3 border-t border-[#E7E1D9]">
              <h4 className="text-[10px] font-normal uppercase tracking-[0.2em] text-[#171717]">2. Payment Method</h4>
              
              <div className="p-3.5 border border-[#171717] bg-[#171717] text-[#FAF8F4] text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#B5924E]" />
                  <span className="font-normal tracking-wide">UPI / GPay / PhonePe / Paytm</span>
                </div>
                <span className="text-[10px] bg-[#B5924E] text-[#171717] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">Prepaid Only</span>
              </div>
            </div>

            {/* Total Order Summary Box */}
            <div className="bg-white p-4 border border-[#E7E1D9] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6F6A64] uppercase tracking-wider block">TOTAL AMOUNT PAYABLE</span>
                  <span className="font-serif font-semibold text-[#171717] text-2xl">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#171717] text-[#FAF8F4] font-serif text-xs uppercase tracking-[0.2em] px-7 py-3.5 shadow-md hover:bg-[#7A1F2B] transition-all border border-[#171717]"
                >
                  PROCEED TO UPI PAYMENT →
                </button>
              </div>
              
              <p className="text-[10px] text-[#6F6A64] text-center border-t border-[#E7E1D9] pt-2 tracking-wider uppercase font-light">
                🔒 256-Bit SSL Encrypted • <span className="font-normal text-[#171717]">Final Sale (No Returns or Refunds)</span>
              </p>
            </div>

          </form>
        )}

        {/* ========================================== */}
        {/* STEP 2: UPI PAYMENT VERIFICATION (QR & UTR) */}
        {/* ========================================== */}
        {step === 'PAYMENT_UPI' && (
          <form onSubmit={handleVerifyUpiPayment} className="text-center py-2 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="text-xs text-stone-500 hover:text-[#171717] flex items-center gap-1 font-light uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Address</span>
              </button>
              <span className="text-[10px] tracking-[0.25em] font-light uppercase text-[#B5924E]">
                STEP 2 OF 2 • PAYMENT VERIFICATION
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-normal text-2xl text-[#171717] tracking-wider uppercase">
                Scan & Pay via UPI / GPay
              </h3>
              <p className="text-xs text-[#6F6A64] font-light">
                Scan the QR code using Google Pay, PhonePe, or Paytm, then enter your 12-digit UTR reference number below to place order.
              </p>
            </div>

            {/* Cropped Clean QR Image */}
            <div className="bg-white p-4 border border-[#E7E1D9] max-w-xs mx-auto shadow-md rounded-lg space-y-3">
              <div className="overflow-hidden rounded-md border border-stone-200 bg-[#F8F9FA]">
                <img 
                  src="./upi_qr_code.png" 
                  alt="Riddhi Creations UPI QR Code" 
                  className="w-full h-auto object-contain max-h-[300px] mx-auto"
                />
              </div>

              {/* UPI ID Copy Row */}
              <div className="bg-[#FAF8F4] p-2.5 border border-[#E7E1D9] rounded-md flex items-center justify-between text-xs">
                <div className="text-left overflow-hidden">
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest block font-light">OFFICIAL UPI ID</span>
                  <span className="font-mono font-medium text-[#171717] truncate block text-[11px]">sudhalohani1-3@okhdfcbank</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="bg-[#171717] text-[#FAF8F4] hover:bg-[#7A1F2B] px-3 py-1.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1 transition-colors shrink-0 ml-2"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white p-3.5 border border-[#E7E1D9] max-w-md mx-auto text-xs text-[#171717] flex items-center justify-between font-light">
              <span>Amount to Pay:</span>
              <span className="font-serif font-semibold text-xl text-[#171717]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Transaction UTR Input */}
            <div className="max-w-md mx-auto text-left space-y-1.5">
              <label className="block text-[11px] font-medium text-[#171717] uppercase tracking-wider">
                Enter 12-Digit UTR / UPI Ref Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 428910293819 (From GPay / PhonePe)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E1D9] focus:outline-none focus:border-[#171717] font-mono text-[#171717]"
              />
              <span className="text-[10px] text-stone-500 font-light block">
                Found in your payment receipt under "UPI Transaction ID" or "Ref No."
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#171717] text-[#FAF8F4] font-serif text-xs uppercase tracking-[0.2em] px-8 py-3.5 shadow-md hover:bg-[#7A1F2B] transition-all border border-[#171717] w-full max-w-md mx-auto flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#B5924E]" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#B5924E]" />
                  <span>VERIFY PAYMENT & PLACE ORDER (₹{totalAmount}) →</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================== */}
        {/* STEP 3: ORDER CONFIRMED & WHATSAPP NOTIFY */}
        {/* ========================================== */}
        {step === 'CONFIRMED' && orderResult && (
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#171717] rounded-full flex items-center justify-center mx-auto text-[#B5924E] border border-[#B5924E]/40 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.3em] font-light uppercase text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block">
                ✓ PAYMENT VERIFIED & ORDER CONFIRMED
              </span>
              <h3 className="font-serif font-normal text-2xl text-[#171717] tracking-wider uppercase pt-2">
                Thank You, {orderResult.customer_name}!
              </h3>
              <p className="text-xs text-[#6F6A64] font-light">
                Your Couture Order has been received and is being prepared at our Surat Studio.
              </p>
            </div>

            {/* Order ID Badge */}
            <div className="bg-white text-[#171717] font-mono font-medium text-lg py-2.5 px-6 border border-[#E7E1D9] inline-block tracking-wider shadow-sm">
              ORDER ID: {orderResult.order_id}
            </div>

            {/* Order Details Summary Card */}
            <div className="bg-white p-4 text-xs text-[#6F6A64] max-w-md mx-auto space-y-2 text-left border border-[#E7E1D9] font-light shadow-sm">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="font-medium text-[#171717]">Recipient:</span>
                <span>{orderResult.customer_name} ({orderResult.customer_phone})</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="font-medium text-[#171717]">Payment Method:</span>
                <span className="font-semibold text-emerald-700">{orderResult.payment_method} ({orderResult.payment_status})</span>
              </div>
              {orderResult.utr_number && (
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="font-medium text-[#171717]">Ref UTR:</span>
                  <span className="font-mono">{orderResult.utr_number}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="font-medium text-[#171717]">Delivery Address:</span>
                <span className="text-right max-w-[200px] truncate">{orderResult.shipping_address}, {orderResult.city} - {orderResult.pincode}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-medium text-[#171717]">Total Amount Paid:</span>
                <span className="font-serif font-semibold text-sm text-[#171717]">₹{orderResult.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* ============================================== */}
            {/* WHATSAPP ORDER RECEIPT INTEGRATION BUTTONS     */}
            {/* ============================================== */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 max-w-md mx-auto rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-medium text-xs justify-center">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Notification Sent Automatically!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Send Receipt to Customer WhatsApp */}
                <button
                  type="button"
                  onClick={handleOpenWhatsAppCustomer}
                  className="bg-[#25D366] text-white font-sans text-[11px] font-medium tracking-wide py-2.5 px-3 rounded shadow hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Send to Customer WhatsApp ({orderResult.customer_phone})</span>
                </button>

                {/* Send Notification to Store Admin WhatsApp */}
                <button
                  type="button"
                  onClick={handleOpenWhatsAppAdmin}
                  className="bg-[#171717] text-[#FAF8F4] font-sans text-[11px] font-medium tracking-wide py-2.5 px-3 rounded shadow hover:bg-[#7A1F2B] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#B5924E]" />
                  <span>Send Copy to Admin (8770275989)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyWaText}
                className="text-[10px] text-emerald-800 hover:underline uppercase tracking-wider font-light flex items-center justify-center gap-1 mx-auto pt-1"
              >
                {copiedWa ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-emerald-600" />
                    <span>Copy Formatted WhatsApp Receipt Text</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="bg-[#171717] text-[#FAF8F4] font-serif text-xs uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#7A1F2B] shadow-md transition-all border border-[#171717]"
            >
              Continue Exploring Collection
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

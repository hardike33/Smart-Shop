import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingBag, AlertCircle,
  Smartphone, CreditCard, Landmark, Wallet, Banknote, CheckCircle2,
  ChevronRight, ShieldCheck, Loader2, PlusCircle, MapPin, Sparkles, Clock, Zap, Leaf,
  History, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Switch } from '@/components/ui/switch';

const deliveryTypes = [
  { id: 'express', name: 'Express', price: 29, time: '25-30 mins', desc: 'Fastest delivery, directly to you!', icon: Zap, oldPrice: 39 },
  { id: 'standard', name: 'Standard', price: 19, time: '30-40 mins', desc: 'Minimal order grouping', icon: Clock },
  { id: 'eco', name: 'Eco Saver', price: 9, time: '45-55 mins', desc: 'Lesser CO2 by order grouping', icon: Leaf }
];

const externalPaymentOptions = [
  { id: 'gpay', name: 'Google Pay', type: 'UPI', icon: Smartphone, highlight: 'Preferred' },
  { id: 'phonepe', name: 'PhonePe', type: 'UPI', icon: Smartphone },
  { id: 'paytm', name: 'Paytm Wallet', type: 'Wallet', icon: Wallet },
  { id: 'netbanking', name: 'Net Banking', type: 'Bank', icon: Landmark },
  { id: 'cod', name: 'Cash on Delivery', type: 'Cash', icon: Banknote },
];

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart, updateQuantity, removeFromCart, cartTotal,
    dailyBudget, clearCart, addOrder, subscription, setSubscription, user
  } = useApp();

  const [useSubscription, setUseSubscription] = useState(false);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [lastUsedPaymentMethodId, setLastUsedPaymentMethodId] = useState<string | null>(() => {
    return localStorage.getItem('last_used_payment_method');
  });
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedDelivery = deliveryTypes.find(d => d.id === deliveryType) || deliveryTypes[1];
  const deliveryCharge = selectedDelivery.price;
  const platformFee = 5;
  const gst = Math.round(cartTotal * 0.05);
  const totalPayable = cartTotal + deliveryCharge + platformFee + gst;

  const savings = (selectedDelivery.oldPrice ? selectedDelivery.oldPrice - selectedDelivery.price : 0) + (subscription?.isActive ? 20 : 0);

  const isOverBudget = totalPayable > dailyBudget;

  const subscriptionDeduction = useMemo(() => {
    if (!subscription || !subscription.isActive || !useSubscription) return 0;
    return Math.min(subscription.walletBalance, totalPayable);
  }, [subscription, totalPayable, useSubscription]);

  const finalAmountToPay = totalPayable - subscriptionDeduction;
  const isFullyCoveredByWallet = finalAmountToPay === 0 && useSubscription;
  const isAnyPaymentSelected = useSubscription || selectedPaymentMethodId !== null;

  // Real-world Swiggy logic: If fully covered, lock external payment methods
  useEffect(() => {
    if (isFullyCoveredByWallet) {
      // No specific external method needed
    }
  }, [isFullyCoveredByWallet]);

  const selectedPaymentMethod = isFullyCoveredByWallet
    ? { label: 'Subscription Wallet', type: 'Wallet' }
    : user?.paymentMethods.find(m => m.id === selectedPaymentMethodId) ||
    externalPaymentOptions.find(o => o.id === selectedPaymentMethodId) ||
    { label: 'Select Method', type: 'N/A' };

  const defaultAddress = user?.addresses.find(a => a.isDefault) || user?.addresses[0];

  const handlePlaceOrder = async () => {
    if (!isFullyCoveredByWallet && !selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    // Simulate real swiggy-style payment processing
    await new Promise(r => setTimeout(r, 2000));

    const getMethodDisplayLabel = (m: any) => {
      if (!m) return 'Direct Payment';
      return m.label || m.name || 'Direct Payment';
    };

    const paymentMethodLabel = isFullyCoveredByWallet
      ? 'Subscription Wallet'
      : (finalAmountToPay < totalPayable
        ? `Split: Wallet + ${getMethodDisplayLabel(selectedPaymentMethod)}`
        : getMethodDisplayLabel(selectedPaymentMethod));

    const order = {
      id: `ORD${Date.now()}`,
      items: cart,
      subtotal: cartTotal,
      deliveryCharge,
      gst,
      platformFee,
      discount: subscriptionDeduction,
      total: finalAmountToPay,
      status: 'confirmed' as const,
      paymentMethod: paymentMethodLabel,
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      estimatedTime: selectedDelivery.time,
      deliveryAddress: defaultAddress?.label || 'Home',
      createdAt: new Date(),
    };

    // Update subscription balance
    if (subscription && subscriptionDeduction > 0) {
      setSubscription({
        ...subscription,
        walletBalance: subscription.walletBalance - subscriptionDeduction
      });
    }

    // Save last used payment method
    localStorage.setItem('last_used_payment_method', isFullyCoveredByWallet ? 'wallet' : (selectedPaymentMethodId || ''));

    addOrder(order);
    clearCart();
    setIsProcessing(false);
    setIsConfirmDrawerOpen(false);
    toast.success(isFullyCoveredByWallet ? 'Order placed via Subscription Wallet!' : 'Payment successful & Order placed!');
    navigate('/order-success', { state: { order } });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'UPI': return Smartphone;
      case 'Card': return CreditCard;
      case 'Wallet': return Wallet;
      default: return Banknote;
    }
  };

  if (cart.length === 0) {
    return (
      <MobileLayout>
        <header className="px-5 pt-6 pb-4 flex items-center gap-4 bg-white sticky top-0 z-50">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-black text-slate-900">Your Cart</h1>
        </header>
        <div className="flex flex-col items-center justify-center h-[60vh] px-10 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Cart is empty</h2>
          <p className="text-slate-500 font-medium mb-8">Add components to your meal and fuel your day!</p>
          <Button
            size="xl"
            className="w-full rounded-2xl font-black uppercase tracking-widest"
            onClick={() => navigate('/home')}
          >
            Explore Restaurants
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header Swiggy Style */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between bg-white border-b border-slate-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-900 leading-tight">Checkout</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {defaultAddress?.label || 'Select Address'}
            </p>
          </div>
        </div>
      </header>

      {/* Savings Notification Swiggy Style */}
      {savings > 0 && (
        <div className="bg-success/10 px-5 py-2.5 flex items-center gap-2 border-b border-success/10">
          <Sparkles className="w-3.5 h-3.5 text-success fill-success/20" />
          <p className="text-[11px] font-black text-success">
            ₹{savings} saved! <span className="font-medium opacity-80">Including delivery fee savings</span>
          </p>
        </div>
      )}

      <div className="px-5 space-y-6 pt-4 pb-48">
        {/* Delivery Type Section Swiggy Style */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 border-l-4 border-primary pl-3">Delivery Type</h3>
          </div>
          <Card className="border-none shadow-card rounded-[28px] overflow-hidden bg-white divide-y divide-slate-50">
            {deliveryTypes.map(type => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setDeliveryType(type.id)}
                  className={cn(
                    "p-5 flex items-start gap-4 cursor-pointer transition-all active:bg-slate-50",
                    deliveryType === type.id ? "bg-primary/[0.02]" : ""
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                    deliveryType === type.id ? "border-primary bg-primary" : "border-slate-200"
                  )}>
                    {deliveryType === type.id && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={cn("text-sm font-black", deliveryType === type.id ? "text-primary" : "text-slate-800")}>
                          {type.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{type.time}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          {type.oldPrice && <span className="text-[10px] text-slate-400 line-through font-bold">₹{type.oldPrice}</span>}
                          <span className="text-[10px] font-black text-slate-900">₹{type.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Payment Section - Re-worked for Real World Options */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-l-4 border-indigo-500 pl-3">Payment Methods</h3>

          {/* 1. Subscription Wallet Primary Card */}
          {subscription && subscription.isActive && (
            <Card className={cn(
              "p-5 border-none shadow-card rounded-[28px] overflow-hidden relative transition-all",
              useSubscription ? "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white" : "bg-slate-50 text-slate-400"
            )}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                    useSubscription ? "bg-white/20 border-white/20 text-white" : "bg-slate-200 border-slate-200 text-slate-400"
                  )}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5", useSubscription ? "text-indigo-100" : "text-slate-400")}>
                      Subscription Wallet
                    </p>
                    <p className={cn("text-xl font-black", useSubscription ? "text-white" : "text-slate-600")}>
                      ₹{subscription.walletBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {lastUsedPaymentMethodId === 'wallet' && <span className="text-[8px] font-black uppercase text-indigo-300 bg-white/10 px-2 py-0.5 rounded-full">Last Used</span>}
                    <Switch
                      checked={useSubscription}
                      onCheckedChange={setUseSubscription}
                      className="data-[state=checked]:bg-white data-[state=unchecked]:bg-slate-400"
                    />
                  </div>
                  <p className={cn("text-[8px] font-black uppercase tracking-widest", useSubscription ? "text-indigo-100" : "text-slate-400")}>
                    {useSubscription ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              {isFullyCoveredByWallet && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Fully Covered • No other payment needed</p>
                </div>
              )}
            </Card>
          )}

          {/* 2. External Payment Options - Locked if fully covered */}
          <div className="space-y-3 transition-all">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select External Method</p>
            </div>

            {/* Saved User Methods */}
            {user?.paymentMethods.map(method => {
              const Icon = getPaymentIcon(method.type);
              return (
                <Card
                  key={method.id}
                  onClick={() => setSelectedPaymentMethodId(method.id)}
                  className={cn(
                    "p-4 border-2 rounded-[24px] cursor-pointer transition-all",
                    selectedPaymentMethodId === method.id
                      ? "border-primary bg-primary/[0.02] shadow-sm"
                      : "border-slate-50 bg-white hover:border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedPaymentMethodId === method.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-900">{method.label}</p>
                        {method.isDefault && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        {lastUsedPaymentMethodId === method.id && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">Last used</span>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{method.maskedNumber}</p>
                    </div>
                    {selectedPaymentMethodId === method.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </Card>
              );
            })}

            {/* General Options */}
            {externalPaymentOptions.map(option => (
              <Card
                key={option.id}
                onClick={() => setSelectedPaymentMethodId(option.id)}
                className={cn(
                  "p-4 border-2 rounded-[24px] cursor-pointer transition-all",
                  selectedPaymentMethodId === option.id
                    ? "border-primary bg-primary/[0.02] shadow-sm"
                    : "border-slate-50 bg-white hover:border-slate-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    selectedPaymentMethodId === option.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    <option.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900">{option.name}</p>
                      {option.highlight && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-success/10 text-success rounded-full border border-success/10">{option.highlight}</span>}
                      {lastUsedPaymentMethodId === option.id && <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">Last used</span>}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {option.type === 'UPI' ? 'Instant payment' : option.type === 'Cash' ? 'Pay at doorstep' : 'Secure gateway'}
                    </p>
                  </div>
                  {selectedPaymentMethodId === option.id && (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Bill Summary Swiggy Style */}
        <section className="space-y-3 pb-8">
          <Card className="p-6 border-none shadow-card rounded-[32px] bg-white ring-1 ring-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-success rounded-sm" />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Bill Details</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Item Total</span>
                <span className="text-slate-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Delivery Charge ({selectedDelivery.name})</span>
                <div className="flex items-center gap-2">
                  {selectedDelivery.oldPrice && <span className="line-through opacity-40">₹{selectedDelivery.oldPrice}</span>}
                  <span className="text-slate-900">₹{deliveryCharge}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>GST (5%)</span>
                <span className="text-slate-900">₹{gst}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Platform Fee</span>
                <span className="text-slate-900">₹{platformFee}</span>
              </div>

              {subscriptionDeduction > 0 && (
                <div className="flex justify-between items-center p-3 bg-success/5 rounded-xl border border-success/10 text-success animate-in fade-in slide-in-from-right-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Subscription Benefit</span>
                    <span className="text-[10px] font-bold opacity-80">Paid via wallet</span>
                  </div>
                  <span className="text-sm font-black">-₹{subscriptionDeduction.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 leading-tight">Total Amount</span>
                  <span className="text-[10px] font-black text-success uppercase tracking-wider mt-1">₹{savings} saved on this order!</span>
                </div>
                <div className="text-right">
                  <span className={cn("text-3xl font-black text-primary")}>
                    ₹{finalAmountToPay.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Sticky Bottom Bar Swiggy Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-12 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        {!isAnyPaymentSelected && (
          <div className="flex items-center gap-2 justify-center bg-amber-50 py-2 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Please select a payment method to continue</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 group">
              <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center p-1">
                {isFullyCoveredByWallet ? <Wallet className="w-3 h-3 text-indigo-600" /> : <CreditCard className="w-3 h-3 text-slate-400" />}
              </div>
              <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Pay Using</span>
            </div>
            <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">
              {!isAnyPaymentSelected
                ? 'Select Method'
                : (isFullyCoveredByWallet ? 'Sub. Wallet' : ((selectedPaymentMethod as any).label || (selectedPaymentMethod as any).name || 'Direct Pay'))}
            </p>
          </div>

          <Button
            onClick={() => setIsConfirmDrawerOpen(true)}
            disabled={!isAnyPaymentSelected}
            className={cn(
              "h-14 flex-1 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 group overflow-hidden",
              !isAnyPaymentSelected ? "bg-slate-200 text-slate-400" : (isFullyCoveredByWallet ? "bg-success hover:bg-success/90" : "bg-primary hover:bg-primary/90")
            )}
          >
            <div className="flex items-center gap-2">
              <span>
                {!isAnyPaymentSelected
                  ? 'Confirm Order'
                  : (isFullyCoveredByWallet ? 'Confirm & Place Order' : `Pay ₹${finalAmountToPay.toFixed(0)}`)}
              </span>
              {isAnyPaymentSelected && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </div>
          </Button>
        </div>
      </div>

      {/* Final Order Confirmation Drawer */}
      <Drawer open={isConfirmDrawerOpen} onOpenChange={setIsConfirmDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto rounded-t-[40px] px-2 outline-none">
          <DrawerHeader className="text-center pb-2">
            <div className="w-20 h-2 bg-slate-100 rounded-full mx-auto mb-6" />
            <DrawerTitle className="text-2xl font-black text-slate-900">Confirm Order</DrawerTitle>
            <DrawerDescription className="text-xs font-bold uppercase tracking-widest text-primary mt-1">
              Swiggy-Style Secure Checkout
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Delivery Address */}
            <Card className="p-5 border-none bg-slate-50 rounded-[28px] ring-1 ring-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Deliver to</h4>
                  <p className="font-black text-slate-900 text-sm">{defaultAddress?.label || 'Home'}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{defaultAddress?.address}</p>
                </div>
              </div>
            </Card>

            {/* Bill Summary Confirmation */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Payment Breakdown</h4>

              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Order Subtotal</span>
                  <span className="text-xs font-black text-slate-900">₹{(cartTotal + deliveryCharge + platformFee + gst).toFixed(2)}</span>
                </div>

                {subscriptionDeduction > 0 && (
                  <div className="flex justify-between items-center text-success">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Subscription Wallet Used</span>
                    </div>
                    <span className="text-sm font-black">-₹{subscriptionDeduction.toFixed(2)}</span>
                  </div>
                )}

                {finalAmountToPay > 0 && (
                  <div className="flex justify-between items-center text-slate-900 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest">Payable via {(selectedPaymentMethod as any).label || (selectedPaymentMethod as any).name || 'Selected Method'}</span>
                    </div>
                    <span className="text-sm font-black">₹{finalAmountToPay.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  size="xl"
                  disabled={isProcessing}
                  className={cn(
                    "w-full h-18 rounded-[24px] shadow-2xl transition-all group relative overflow-hidden",
                    isFullyCoveredByWallet ? "bg-success hover:bg-success/95" : "bg-primary hover:bg-primary/95"
                  )}
                  onClick={handlePlaceOrder}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-7 h-7 animate-spin text-white" />
                      <span className="text-lg font-black uppercase tracking-widest text-white">Placing Order...</span>
                    </div>
                  ) : (
                    <span className="text-xl font-black uppercase tracking-widest text-white">
                      {isFullyCoveredByWallet ? 'Confirm & Place Order' : `Pay & Place Order`}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DrawerFooter className="pb-10 pt-4 bg-white border-t border-slate-50">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-[0.2em]">
                PCI-DSS Secure Checkout
              </p>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
}

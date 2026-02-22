import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, Search, Phone, MapPin, Star, Clock,
  Plus, Pill, ClipboardList, Stethoscope, Activity,
  CheckCircle2, Loader2, CreditCard, Wallet, Banknote, Smartphone,
  FileText, Trash2
} from 'lucide-react';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const medicalShops = [
  {
    id: '1',
    name: 'Apollo Pharmacy',
    distance: '0.5 km',
    rating: 4.7,
    phone: '+91 98765 43210',
    isOpen: true,
    address: '123 Main Street, Near City Mall',
    timing: '24 hours',
  },
  {
    id: '2',
    name: 'MedPlus',
    distance: '0.8 km',
    rating: 4.5,
    phone: '+91 98765 43211',
    isOpen: true,
    address: '45 Park Road, Sector 5',
    timing: '8 AM - 11 PM',
  },
  {
    id: '3',
    name: 'Wellness Forever',
    distance: '1.2 km',
    rating: 4.4,
    phone: '+91 98765 43212',
    isOpen: false,
    address: '78 Market Lane, Downtown',
    timing: '9 AM - 10 PM',
  },
  {
    id: '4',
    name: 'NetMeds Store',
    distance: '1.5 km',
    rating: 4.6,
    phone: '+91 98765 43213',
    isOpen: true,
    address: '90 Health Plaza, Ring Road',
    timing: '8 AM - 10 PM',
  },
];

const serviceOptions = [
  { id: 'Medicine purchase', label: 'Medicine purchase', icon: Pill, color: 'bg-blue-100 text-blue-600' },
  { id: 'Lab test', label: 'Lab test', icon: Activity, color: 'bg-purple-100 text-purple-600' },
  { id: 'Doctor consultation', label: 'Doctor consultation', icon: Stethoscope, color: 'bg-green-100 text-green-600' },
  { id: 'Other medical service', label: 'Other service', icon: ClipboardList, color: 'bg-orange-100 text-orange-600' },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: Smartphone },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'cash', name: 'Cash on Delivery', icon: Banknote },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
];

type OrderStep = 'SERVICE_SELECT' | 'FORM' | 'PRICING' | 'PAYMENT' | 'CONFIRMED';

export default function Medical() {
  const navigate = useNavigate();
  const { addOrder } = useApp();
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<OrderStep>('SERVICE_SELECT');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [serviceType, setServiceType] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', quantity: 1 }]);
  const [prescription, setPrescription] = useState<File | null>(null);

  // Order Process State
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [finalOrder, setFinalOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleOrderOnline = (shop: any) => {
    if (!shop.isOpen) {
      toast.error('This shop is currently closed');
      return;
    }
    setSelectedShop(shop);
    setCurrentStep('SERVICE_SELECT');
    setIsDrawerOpen(true);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', quantity: 1 }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: string, value: any) => {
    const newMedicines = [...medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setMedicines(newMedicines);
  };

  const calculateTotal = () => {
    const medicineTotal = medicines.length * 150; // Mock price
    const serviceCharge = 0;
    const tokenFee = 0;
    return {
      medicinePrice: medicineTotal,
      serviceCharge,
      tokenFee,
      total: medicineTotal + serviceCharge + tokenFee
    };
  };

  const handleCreateOrder = async () => {
    if (!serviceType) return;
    setIsProcessing(true);

    const pricing = calculateTotal();
    const orderData = {
      shopName: selectedShop.name,
      shopAddress: selectedShop.address,
      serviceType: serviceType,
      medicineNames: medicines.map(m => `${m.name} (x${m.quantity})`).join(', '),
      quantity: medicines.reduce((sum, m) => sum + m.quantity, 0),
      medicinePrice: pricing.medicinePrice,
      serviceCharge: pricing.serviceCharge,
      tokenFee: pricing.tokenFee,
      totalAmount: pricing.total,
      contactDetails: selectedShop.phone
    };

    try {
      const res = await fetch('http://localhost:8080/api/medical/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.id);
        setCurrentStep('PRICING');
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('Backend unavailable, using mock order');
      setOrderId(Math.floor(Math.random() * 9000) + 1000);
      setCurrentStep('PRICING');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const pricing = calculateTotal();

    try {
      if (orderId && orderId > 8000) { // If it was real (mock check for demo)
        await fetch(`http://localhost:8080/api/medical/${orderId}/pay?method=${paymentMethod}`, {
          method: 'POST'
        });
      }

      // Delay for success feel
      await new Promise(r => setTimeout(r, 2000));

      // Add to global order history
      addOrder({
        id: orderId ? `MED-${orderId}` : 'MED-8273',
        items: medicines.map(m => ({
          menuItem: {
            id: Math.random().toString(),
            name: m.name,
            description: 'Medical Order',
            price: pricing.medicinePrice / medicines.length,
            image: '',
            isVeg: false,
            category: 'medical'
          },
          quantity: m.quantity,
          restaurantId: selectedShop.id,
          restaurantName: selectedShop.name
        })),
        total: pricing.total,
        status: 'delivered',
        deliveryOtp: '1234',
        estimatedTime: '25 min',
        deliveryAddress: 'Home',
        createdAt: new Date()
      });

      setFinalOrder({
        token: orderId ? `TK-${orderId}` : 'TK-8273',
        amount: pricing.total,
        time: '20-30 mins',
        shop: selectedShop
      });
      setCurrentStep('CONFIRMED');
      toast.success('Medical order confirmed!');
    } catch (e) {
      toast.error('Payment failed. Using mock confirmation for demo.');

      addOrder({
        id: 'MED-8273',
        items: medicines.map(m => ({
          menuItem: {
            id: Math.random().toString(),
            name: m.name,
            description: 'Medical Order',
            price: pricing.medicinePrice / medicines.length,
            image: '',
            isVeg: false,
            category: 'medical'
          },
          quantity: m.quantity,
          restaurantId: selectedShop.id,
          restaurantName: selectedShop.name
        })),
        total: pricing.total,
        status: 'delivered',
        deliveryOtp: '1234',
        estimatedTime: '25 min',
        deliveryAddress: 'Home',
        createdAt: new Date()
      });

      setFinalOrder({
        token: 'TK-8273',
        amount: pricing.total,
        time: '20-30 mins',
        shop: selectedShop
      });
      setCurrentStep('CONFIRMED');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MobileLayout showNav={!isDrawerOpen}>
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Health & Pharmacy</h1>
            <p className="text-sm text-muted-foreground">Certified medical care</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search medicines or health tests..."
            className="pl-12 h-12 bg-slate-50 border-none rounded-2xl"
          />
        </div>
      </header>

      {/* Quick Access */}
      <div className="px-5 pb-6">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
          {serviceOptions.map(opt => (
            <Card key={opt.id} className="min-w-[120px] p-4 flex flex-col items-center gap-2 border-none shadow-soft active:scale-95 transition-transform text-center cursor-pointer">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", opt.color)}>
                <opt.icon className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-tight text-slate-800">{opt.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Shops List */}
      <div className="px-5 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Trusted Pharmacies</h2>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary">Nearby</Badge>
        </div>

        {medicalShops.map(shop => (
          <Card key={shop.id} className="p-4 border-none shadow-md overflow-hidden relative group">
            {!shop.isOpen && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Badge variant="destructive" className="px-4 py-2 text-sm font-bold shadow-lg">CLOSED</Badge>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg">{shop.name}</h4>
                  {shop.isOpen && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {shop.address}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-0.5 rounded-lg text-xs font-black">
                  {shop.rating} <Star className="w-3 h-3 fill-white" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{shop.distance}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-5 bg-slate-50 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                {shop.timing}
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-primary" />
                Online Delivery Available
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200"
                onClick={() => window.open(`tel:${shop.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                onClick={() => handleOrderOnline(shop)}
              >
                Order Online
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Multi-step Multi Ordering Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto max-h-[90vh]">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <DrawerTitle className="text-2xl font-black">Medical Order</DrawerTitle>
              <Badge className="bg-primary/10 text-primary border-none">{selectedShop?.name}</Badge>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-4 px-4">
              {['Service', 'Details', 'Payment', 'Done'].map((label, idx) => {
                const stepIdx = ['SERVICE_SELECT', 'FORM', 'PAYMENT', 'CONFIRMED'].indexOf(currentStep);
                const isActive = idx <= stepIdx || (currentStep === 'PRICING' && idx === 1);
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                      isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      {idx < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase", isActive ? "text-primary" : "text-slate-400")}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </DrawerHeader>

          <div className="p-5 overflow-y-auto">
            {currentStep === 'SERVICE_SELECT' && (
              <div className="space-y-6 py-4">
                <h3 className="text-xl font-bold text-center">What is the hospital or doctor asking for?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {serviceOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setServiceType(opt.id);
                        setCurrentStep('FORM');
                      }}
                      className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-100 hover:border-primary hover:bg-primary/[0.02] transition-all text-left group"
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", opt.color)}>
                        <opt.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg text-slate-800">{opt.label}</p>
                        <p className="text-sm text-slate-500">Tap to start order</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'FORM' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Medicines & Quantity</Label>
                    <Button variant="ghost" size="sm" onClick={addMedicine} className="text-primary font-bold h-8">
                      <Plus className="w-4 h-4 mr-1" /> Add More
                    </Button>
                  </div>
                  {medicines.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-end animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex-1">
                        <Input
                          placeholder="Paracetamol, Insulin, etc."
                          value={m.name}
                          onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                          className="h-12 border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="1"
                          value={m.quantity}
                          onChange={(e) => updateMedicine(idx, 'quantity', parseInt(e.target.value))}
                          className="h-12 border-slate-200 rounded-xl text-center"
                        />
                      </div>
                      {medicines.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeMedicine(idx)} className="h-12 w-12 text-destructive">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-bold">Upload Prescription (Optional)</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setPrescription(e.target.files?.[0] || null)}
                    />
                    {prescription ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-10 h-10 text-primary mb-2" />
                        <p className="text-xs font-bold text-slate-800">{prescription.name}</p>
                        <p className="text-[10px] text-muted-foreground">Tap to change file</p>
                      </div>
                    ) : (
                      <>
                        <Pill className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-bold text-slate-600">Click or drag prescription here</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">JPEG, PNG or PDF</p>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  size="xl"
                  className="w-full h-16 rounded-2xl font-black text-lg"
                  onClick={handleCreateOrder}
                  disabled={isProcessing || !medicines[0].name}
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Items & See Pricing'}
                </Button>
              </div>
            )}

            {currentStep === 'PRICING' && (
              <div className="space-y-6">
                <div className="bg-slate-100 p-4 rounded-2xl flex items-center justify-between border-2 border-primary/20">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Order Token</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">TK-{orderId || '8273'}</p>
                  </div>
                  <div className="text-center bg-white px-3 py-2 rounded-xl shadow-sm">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Estimated Time</p>
                    <p className="text-sm font-black text-primary">25 MINS</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Pricing Breakdown</h4>
                  <Card className="p-5 space-y-3 border-none shadow-soft bg-slate-50">
                    <div className="flex justify-between text-sm font-bold border-b pb-3 border-slate-200">
                      <span className="text-slate-500">Medicine Price</span>
                      <span>₹{calculateTotal().medicinePrice}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-slate-900">Total Amount</span>
                      <span className="text-2xl font-black text-primary">₹{calculateTotal().total}</span>
                    </div>
                  </Card>
                </div>

                <Button
                  size="xl"
                  className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/30"
                  onClick={() => setCurrentStep('PAYMENT')}
                >
                  Proceed to Payment
                </Button>
                <Button variant="ghost" className="w-full text-slate-400 font-bold" onClick={() => setCurrentStep('FORM')}>
                  Edit Order Items
                </Button>
              </div>
            )}

            {currentStep === 'PAYMENT' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Payment Details</h3>
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl">
                    <p className="text-xl font-black text-slate-900 leading-tight">{selectedShop?.name}</p>
                    <p className="text-xs text-muted-foreground font-medium mb-2">{selectedShop?.address}</p>
                    <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black uppercase">Token: TK-{orderId}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl text-left transition-all border-2",
                        paymentMethod === method.id
                          ? "border-primary bg-primary/[0.02]"
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-xl",
                        paymentMethod === method.id ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                      )}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{method.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Secure Payment</p>
                      </div>
                      {paymentMethod === method.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                    </button>
                  ))}
                </div>

                <Button
                  size="xl"
                  className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/30"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay ₹${calculateTotal().total} & Confirm`}
                </Button>
              </div>
            )}

            {currentStep === 'CONFIRMED' && finalOrder && (
              <div className="py-8 space-y-8 animate-in zoom-in fade-in duration-500">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Order Confirmed!</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Reference: {finalOrder.token}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[32px] p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Token No</p>
                      <p className="text-xl font-black text-primary">{finalOrder.token}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Pick-up Time</p>
                      <p className="text-xl font-black text-slate-900">{finalOrder.time}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-muted-foreground">Pharmacy Contact</p>
                        <p className="font-bold text-slate-900">{finalOrder.shop.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-muted-foreground">Paid Amount</p>
                        <p className="font-bold text-slate-900">₹{finalOrder.amount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  size="xl"
                  className="w-full h-16 rounded-2xl font-black text-lg bg-slate-900"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/orders');
                  }}
                >
                  View My Orders
                </Button>
              </div>
            )}
          </div>

          <DrawerFooter className="pb-8 pt-0 border-t">
            <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
              Digital Healthcare Partner • DailyPlate Health
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </MobileLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import {
  Clock, RotateCcw, ChevronRight, Bike,
  MapPin, CheckCircle2, Navigation, Wallet,
  Calendar, ArrowRightLeft, History, ShoppingBag,
  Stethoscope, ChefHat, Pill, Activity, FlaskConical, User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export default function Orders() {
  const navigate = useNavigate();
  const { orders, addToCart, clearCart, subscription, topUpWallet } = useApp();
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [rideHistory, setRideHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const mockFoodOrders = [
    {
      id: 'ORD123456',
      restaurant: 'Sharma Kitchen',
      items: ['Paneer Butter Masala Thali', 'Roti (4)'],
      total: 180,
      discount: 180, // Paid via subscription
      status: 'delivered',
      date: '22 Jan 2026',
      emoji: '🍛',
      paymentStatus: 'Paid via Subscription'
    },
    {
      id: 'ORD123455',
      restaurant: 'Fresh Bites',
      items: ['Grilled Chicken Salad', 'Fresh Lime Soda'],
      total: 220,
      discount: 100, // Partial subscription
      status: 'delivered',
      date: '21 Jan 2026',
      emoji: '🥗',
      paymentStatus: 'Paid'
    },
  ];

  const mockMedicalOrders = [
    {
      id: 'MED88273',
      pharmacy: 'Apollo Pharmacy',
      medicines: 'Paracetamol 650mg, Vitamin C',
      prescriptionRequired: 'No',
      total: 120,
      status: 'delivered',
      date: '22 Feb 2026',
      time: '10:30',
      type: 'Medical',
      emoji: '💊',
      paymentStatus: 'Paid via UPI'
    },
    {
      id: 'MED88274',
      pharmacy: 'MedPlus',
      medicines: 'Digital Thermometer',
      prescriptionRequired: 'No',
      total: 350,
      status: 'delivered',
      date: '21 Feb 2026',
      time: '14:20',
      type: 'Medical',
      emoji: '🌡️',
      paymentStatus: 'Paid via Wallet'
    }
  ];

  const mockHomemadeOrders = [
    {
      id: 'HME99283',
      chef: 'Sunita Mehra',
      dish: 'Moong Dal Khichdi & Papad',
      veg: true,
      prepTime: '25 min',
      total: 180,
      status: 'ongoing',
      date: '22 Feb 2026',
      time: '15:45',
      type: 'Homemade',
      emoji: '👩‍🍳',
      paymentStatus: 'Pending'
    },
    {
      id: 'HME99284',
      chef: 'Rajesh Uncle',
      dish: 'Chicken Curry & Rice',
      veg: false,
      prepTime: '40 min',
      total: 250,
      status: 'delivered',
      date: '21 Feb 2026',
      time: '19:10',
      type: 'Homemade',
      emoji: '🥘',
      paymentStatus: 'Paid via Cash'
    }
  ];

  const allFoodOrders = [...orders.filter(o => o.items[0]?.menuItem?.category === 'meal' || !o.items[0]?.menuItem?.category).map(o => ({
    ...o,
    restaurant: o.items[0]?.restaurantName || 'Restaurant',
    items: o.items.map(i => i.menuItem.name),
    date: new Date(o.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    emoji: '🍽️',
    rawItems: o.items,
    type: 'Food',
    paymentStatus: o.discount > 0 ? 'Paid via Subscription' : 'Paid'
  })), ...mockFoodOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allMedicalOrders = [...orders.filter(o => o.items[0]?.menuItem?.category === 'medical').map(o => ({
    ...o,
    pharmacy: o.items[0]?.restaurantName || 'Pharmacy',
    medicines: o.items.map(i => i.menuItem.name).join(', '),
    date: new Date(o.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }),
    emoji: '💊',
    type: 'Medical',
    prescriptionRequired: 'No',
    paymentStatus: 'Paid'
  })), ...mockMedicalOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allHomemadeOrders = [...orders.filter(o => o.items[0]?.menuItem?.category === 'homemade').map(o => ({
    ...o,
    chef: o.items[0]?.restaurantName || 'Home Chef',
    dish: o.items[0]?.menuItem?.name || 'Home Cooked Meal',
    veg: o.items[0]?.menuItem?.isVeg ?? true,
    prepTime: '30 min',
    date: new Date(o.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }),
    emoji: '🏠',
    type: 'Homemade',
    paymentStatus: 'Paid'
  })), ...mockHomemadeOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activeRes, historyRes] = await Promise.all([
        fetch('http://localhost:8080/api/rides/active'),
        fetch('http://localhost:8080/api/rides/history')
      ]);

      if (activeRes.ok) setActiveRides(await activeRes.json());
      if (historyRes.ok) setRideHistory(await historyRes.json());
    } catch (e) {
      console.warn('Backend offline, using mock data');
      setRideHistory([
        {
          id: 1,
          rider: { name: 'Rahul Kumar' },
          pickupLocation: 'HSR Layout, Sector 2',
          dropLocation: 'Indiranagar Metro',
          fare: 150,
          discount: 150, // Paid via subscription
          status: 'COMPLETED',
          bookingTime: '2026-02-02T10:30:00',
          paymentMethod: 'Elite Subscription'
        },
        {
          id: 2,
          rider: { name: 'Suresh Raina' },
          pickupLocation: 'Koramangala 4th Block',
          dropLocation: 'MG Road',
          fare: 85,
          discount: 0,
          status: 'COMPLETED',
          bookingTime: '2026-02-01T15:45:00',
          paymentMethod: 'UPI'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = () => {
    const amount = window.prompt("Enter amount to top up your subscription wallet:", "500");
    if (amount && !isNaN(parseFloat(amount))) {
      topUpWallet(parseFloat(amount));
      toast.success(`₹${amount} added to your ${subscription?.planName || 'Wallet'}!`);
    }
  };

  const handleReorder = (order: any) => {
    if (order.rawItems) {
      clearCart();
      order.rawItems.forEach((item: any) => addToCart(item));
      toast.success(`Items from ${order.restaurant} added to cart`);
      navigate('/cart');
    } else {
      toast.success(`Reordering from ${order.restaurant}...`);
      navigate('/home');
    }
  };

  const handleViewDetails = (activity: any) => {
    if (activity.items && !activity.fare) {
      // It's a food order, go to tracking
      navigate('/tracking', { state: { order: activity } });
      return;
    }
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  const [showAllFood, setShowAllFood] = useState(false);
  const [showAllMedical, setShowAllMedical] = useState(false);
  const [showAllHomemade, setShowAllHomemade] = useState(false);

  const getDayMonth = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success" className="bg-green-500/10 text-green-600 border-none">Completed</Badge>;
      case 'ASSIGNED': return <Badge variant="warning" className="bg-yellow-500/10 text-yellow-600 border-none animate-pulse">On the way</Badge>;
      case 'PAID': return <Badge variant="outline" className="text-primary border-primary/20">Finding Rider</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <MobileLayout>
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activities</h1>
        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Rides & Orders</p>
      </header>

      <div className="px-5 space-y-6">
        {/* Subscription Wallet Card */}
        <Card className="p-6 bg-slate-900 text-white border-none rounded-[32px] shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Current Balance</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-black tracking-tight">₹{subscription?.walletBalance.toFixed(2) || '0.00'}</h2>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none mb-1">Active Plan</p>
                <p className="text-sm font-black text-white">{subscription?.planName || 'No Active Plan'} — Active</p>
              </div>
              <Button
                onClick={handleAddMoney}
                variant="ghost"
                className="text-xs font-black uppercase text-white hover:bg-white/10 h-10 px-6 rounded-2xl border border-white/20 active:scale-95 transition-all"
              >
                Add Money
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="rides" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-slate-100 p-1 rounded-2xl h-12">
            <TabsTrigger value="rides" className="rounded-xl font-black uppercase text-[8px] tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">Rides</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl font-black uppercase text-[8px] tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">Food</TabsTrigger>
            <TabsTrigger value="medical" className="rounded-xl font-black uppercase text-[8px] tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">Medical</TabsTrigger>
            <TabsTrigger value="homemade" className="rounded-xl font-black uppercase text-[8px] tracking-tight data-[state=active]:bg-white data-[state=active]:shadow-sm">Home Made</TabsTrigger>
          </TabsList>

          <TabsContent value="rides" className="mt-6 space-y-6 pb-24">
            {activeRides.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Current Rides</h3>
                </div>
                {activeRides.map(ride => (
                  <Card key={ride.id} className="p-5 border-none shadow-xl ring-1 ring-slate-100 rounded-[28px] bg-white group active:scale-[0.98] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Bike className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase text-slate-400">Rider</p>
                          <p className="font-bold text-slate-900">{ride.rider?.name || 'Assigning...'}</p>
                        </div>
                      </div>
                      {getStatusBadge(ride.status)}
                    </div>
                    <div className="space-y-3 pl-2 border-l-2 border-dashed border-slate-100 py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <p className="text-xs font-bold text-slate-600 line-clamp-1">{ride.pickupLocation}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <p className="text-xs font-bold text-slate-600 line-clamp-1">{ride.dropLocation}</p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-50 text-slate-900 hover:bg-slate-100 border-none shadow-none"
                      onClick={() => navigate('/vehicle')}
                    >
                      Track Ride
                    </Button>
                  </Card>
                ))}
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Ride History</h3>
                </div>
                <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-200">Last 30 Days</Badge>
              </div>

              {rideHistory.length === 0 && !loading && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Bike className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No past rides found</p>
                </div>
              )}

              {rideHistory.map(ride => (
                <Card key={ride.id} className="p-5 border-none shadow-md ring-1 ring-slate-100 rounded-[28px] overflow-hidden relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                        {new Date(ride.bookingTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <h4 className="font-bold text-slate-900">{ride.rider?.name || 'Ride Completed'}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">₹{ride.fare}</p>
                      <p className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        ride.discount > 0 ? "text-success" : "text-slate-400"
                      )}>
                        {ride.discount > 0 ? 'Paid via Subscription' : (ride.paymentMethod || 'Paid')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0" />
                      <p className="text-[10px] font-bold text-slate-500 truncate">{ride.pickupLocation}</p>
                    </div>
                    <ArrowRightLeft className="w-3 h-3 text-slate-300" />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <p className="text-[10px] font-bold text-slate-500 truncate">{ride.dropLocation}</p>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full"
                      onClick={() => handleViewDetails(ride)}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Button>
                  </div>
                </Card>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Past Food Orders</h3>
              </div>
              <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-200">Last 30 Days</Badge>
            </div>

            {allFoodOrders.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">No past food orders found</p>
                <Button onClick={() => navigate('/home')} variant="ghost" className="text-xs font-black uppercase text-primary">Order Something Now</Button>
              </div>
            )}

            {(showAllFood ? allFoodOrders : allFoodOrders.slice(0, 2)).map(order => (
              <Card key={order.id} className="p-5 border-none shadow-md ring-1 ring-slate-100 rounded-[28px] overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {order.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{order.date}</p>
                        <h4 className="font-bold text-slate-900">{order.restaurant}</h4>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{order.total}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-success">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase border-none px-2",
                        order.status === 'delivered' ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                      )}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-2 line-clamp-1">{
                      Array.isArray(order.items) && typeof order.items[0] === 'string'
                        ? order.items.join(', ')
                        : 'Custom Meal Order'
                    }</p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleReorder(order)}
                        className="flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Reorder
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {allFoodOrders.length > 2 && !showAllFood && (
              <Button
                onClick={() => setShowAllFood(true)}
                variant="ghost"
                className="w-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl py-6"
              >
                View More Food History
              </Button>
            )}
          </TabsContent>

          <TabsContent value="medical" className="mt-6 space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Medical Orders</h3>
              </div>
              <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-200">History</Badge>
            </div>

            {allMedicalOrders.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Stethoscope className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">No medical orders found</p>
                <Button onClick={() => navigate('/medical')} variant="ghost" className="text-xs font-black uppercase text-primary">Buy Medicines</Button>
              </div>
            )}

            {(showAllMedical ? allMedicalOrders : allMedicalOrders.slice(0, 2)).map(order => (
              <Card key={order.id} className="p-5 border-none shadow-md ring-1 ring-slate-100 rounded-[28px] overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {order.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{order.date}</p>
                        <h4 className="font-bold text-slate-900">{order.pharmacy}</h4>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{order.total}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-success">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-[8px] font-black uppercase border-none px-2 mt-2 bg-green-500/10 text-green-600">
                      {order.status}
                    </Badge>
                    <p className="text-[11px] font-bold text-slate-500 mt-2 line-clamp-1">{order.medicines}</p>
                    <Button
                      variant="ghost"
                      onClick={() => handleViewDetails(order)}
                      className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-600 mt-3"
                    >
                      View Receipt
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {allMedicalOrders.length > 2 && !showAllMedical && (
              <Button
                onClick={() => setShowAllMedical(true)}
                variant="ghost"
                className="w-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl py-6"
              >
                View More Medical History
              </Button>
            )}
          </TabsContent>

          <TabsContent value="homemade" className="mt-6 space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Home Made Orders</h3>
              </div>
              <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-200">History</Badge>
            </div>

            {allHomemadeOrders.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ChefHat className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">No home made orders found</p>
                <Button onClick={() => navigate('/home')} variant="ghost" className="text-xs font-black uppercase text-primary">Browse Home Chefs</Button>
              </div>
            )}

            {(showAllHomemade ? allHomemadeOrders : allHomemadeOrders.slice(0, 2)).map(order => (
              <Card key={order.id} className="p-5 border-none shadow-md ring-1 ring-slate-100 rounded-[28px] overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {order.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{order.date}</p>
                        <h4 className="font-bold text-slate-900">{order.chef}</h4>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{order.total}</p>
                        <p className={cn(
                          "text-[8px] font-black uppercase tracking-widest",
                          order.paymentStatus === 'Pending' ? "text-amber-500" : "text-success"
                        )}>
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none px-2 mt-2",
                      order.status === 'delivered' ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                    )}>
                      {order.status}
                    </Badge>
                    <p className="text-[11px] font-bold text-slate-500 mt-2 line-clamp-1">{order.dish}</p>
                    <div className="flex gap-2 mt-3">
                      {order.veg && <Badge variant="outline" className="text-[7px] border-green-500/30 text-green-600 bg-green-50/50">VEG</Badge>}
                      <Badge variant="outline" className="text-[7px] border-slate-200 text-slate-400">{order.prepTime}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleViewDetails(order)}
                      className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-600 mt-3"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {allHomemadeOrders.length > 2 && !showAllHomemade && (
              <Button
                onClick={() => setShowAllHomemade(true)}
                variant="ghost"
                className="w-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl py-6"
              >
                View More Home Made History
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Drawer */}
      <Drawer open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DrawerContent className="max-w-lg mx-auto">
          <DrawerHeader className="text-left border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">
                {selectedActivity?.emoji || (selectedActivity?.fare ? '🏍️' : '🍽️')}
              </div>
              <div>
                <DrawerTitle className="text-xl font-black">
                  {selectedActivity?.pharmacy || selectedActivity?.chef || selectedActivity?.restaurant || selectedActivity?.rider?.name || 'Activity Details'}
                </DrawerTitle>
                <DrawerDescription className="text-xs font-bold uppercase tracking-widest text-primary">
                  {selectedActivity?.id ? `ID: ${selectedActivity.id}` : 'Recent Activity'}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="p-5 space-y-6">
            {/* Conditional Content: Food vs Ride vs Medical vs Homemade */}
            {selectedActivity?.type === 'Medical' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Medical Details</h3>
                <Card className="p-4 bg-blue-50/50 border-none rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Medicines</p>
                      <p className="text-sm font-bold text-slate-700">{selectedActivity.medicines}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Prescription Required</p>
                      <p className="text-sm font-bold text-slate-700">{selectedActivity.prescriptionRequired}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : selectedActivity?.type === 'Homemade' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Chef Details</h3>
                <Card className="p-4 bg-orange-50/50 border-none rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Dish Name</p>
                      <p className="text-sm font-bold text-slate-700">{selectedActivity.dish}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Preparation Time</p>
                      <p className="text-sm font-bold text-slate-700">{selectedActivity.prepTime}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : selectedActivity?.items ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Order Items</h3>
                <div className="space-y-3">
                  {Array.isArray(selectedActivity.items) && typeof selectedActivity.items[0] === 'string'
                    ? selectedActivity.items.map((item: string, k: number) => (
                      <div key={k} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                        <span className="text-xs font-black text-slate-400">x1</span>
                      </div>
                    ))
                    : <p className="text-sm font-bold text-slate-500">View items in app</p>
                  }
                </div>
              </div>
            ) : selectedActivity?.pickupLocation && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Ride Route</h3>
                <Card className="p-4 bg-slate-50 border-none rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <p className="text-sm font-bold text-slate-600 truncate">{selectedActivity.pickupLocation}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-sm font-bold text-slate-600 truncate">{selectedActivity.dropLocation}</p>
                  </div>
                </Card>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-dashed">
              <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Customer Name</span>
                <span className="font-bold text-slate-900">Dharanish M</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>{selectedActivity?.fare ? 'Ride Fare' : 'Item Total'}</span>
                <span>₹{selectedActivity?.subtotal || selectedActivity?.fare || selectedActivity?.total}</span>
              </div>

              {selectedActivity?.deliveryCharge !== undefined && (
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Delivery Charge</span>
                  <span>₹{selectedActivity.deliveryCharge}</span>
                </div>
              )}
              {selectedActivity?.gst !== undefined && (
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>GST</span>
                  <span>₹{selectedActivity.gst}</span>
                </div>
              )}
              {selectedActivity?.platformFee !== undefined && (
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Platform Fee</span>
                  <span>₹{selectedActivity.platformFee}</span>
                </div>
              )}

              {selectedActivity?.discount !== undefined && selectedActivity.discount > 0 && (
                <div className="mt-2 p-3 bg-success/5 rounded-xl border border-success/10 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between items-center text-success">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Subscription Balance Used</span>
                    </div>
                    <span className="font-black">-₹{selectedActivity.discount}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-900">Total Paid</span>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-0.5">
                    via {selectedActivity?.paymentMethod || 'UPI/Cash'}
                  </span>
                </div>
                <span className="text-2xl font-black text-primary">
                  ₹{selectedActivity?.total || (selectedActivity?.fare - (selectedActivity?.discount || 0))}
                </span>
              </div>
            </div>

            <Button size="xl" className="w-full h-14 rounded-2xl font-black text-lg shadow-elevated" onClick={() => setIsDetailsOpen(false)}>
              Perfect!
            </Button>
          </div>
          <DrawerFooter className="pb-8 border-t border-slate-50 bg-slate-50/50">
            <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
              Secured & Managed by DailyPlate Elite
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
}

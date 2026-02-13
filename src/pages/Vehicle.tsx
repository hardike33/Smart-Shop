import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, MapPin, Navigation, Clock, Users,
  CreditCard, Wallet, Banknote, Smartphone,
  CheckCircle2, Loader2, Phone, Star, X, Home,
  PhoneCall, PhoneOff, PhoneForwarded
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const vehicleOptions = [
  {
    id: 'Bike',
    type: 'Bike',
    name: 'Bike Taxi',
    price: 45,
    eta: '3 min',
    capacity: '1',
    emoji: '🏍️',
  },
  {
    id: 'Auto',
    type: 'Auto',
    name: 'Auto Rickshaw',
    price: 85,
    eta: '5 min',
    capacity: '3',
    emoji: '🛺',
  },
  {
    id: 'Cab',
    type: 'Cab',
    name: 'Mini Car',
    price: 150,
    eta: '7 min',
    capacity: '4',
    emoji: '🚗',
  },
];

const paymentMethods = [
  { id: 'subscription', name: 'Elite Subscription', icon: Wallet, isSub: true },
  { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: Smartphone },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
];

type BookingStatus = 'IDLE' | 'SELECTING' | 'PAYMENT' | 'PROCESSING' | 'CONFIRMED' | 'ASSIGNED';
type CallState = 'NONE' | 'RINGING' | 'CONNECTED' | 'ENDED';

export default function Vehicle() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('My Current Location');
  const [drop, setDrop] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicleOptions[0] | null>(null);
  const [status, setStatus] = useState<BookingStatus>('IDLE');
  const [paymentMethod, setPaymentMethod] = useState('subscription');
  const [rideId, setRideId] = useState<number | null>(null);
  const [rider, setRider] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [subBalance, setSubBalance] = useState<number>(0);

  const { subscription, setSubscription } = useApp();

  // Call State
  const [callState, setCallState] = useState<CallState>('NONE');

  const canBook = pickup && drop && selectedVehicle;

  const handleBookClick = async () => {
    if (!selectedVehicle) {
      toast.error('Please select a ride first');
      return;
    }
    if (!drop) {
      setDrop('Central Park, New York'); // Default for demo
    }
    setStatus('PAYMENT');
    setIsDrawerOpen(true);
  };

  const handlePayment = async () => {
    if (!subscription || !selectedVehicle) return;

    const rideFare = selectedVehicle.price;
    let walletDeduction = 0;
    let otherPayable = 0;

    if (paymentMethod === 'subscription') {
      walletDeduction = Math.min(subscription.walletBalance, rideFare);
      otherPayable = rideFare - walletDeduction;
    } else {
      otherPayable = rideFare;
    }

    setStatus('PROCESSING');

    try {
      // Update subscription balance in real-time
      if (walletDeduction > 0) {
        setSubscription({
          ...subscription,
          walletBalance: subscription.walletBalance - walletDeduction
        });
      }

      // 1. Create Ride (Try real backend, fallback to mock)
      let currentRideId = null;
      let assignedRider = null;

      try {
        const rideRes = await fetch('http://localhost:8080/api/rides/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickupLocation: pickup,
            dropLocation: drop,
            rideType: selectedVehicle?.id,
            fare: rideFare,
            walletDeduction, // Send deduction info to backend
            paidAmount: otherPayable
          })
        });

        if (rideRes.ok) {
          const rideData = await rideRes.json();
          currentRideId = rideData.id;
          setRideId(currentRideId);
        }
      } catch (e) {
        console.warn('Backend unavailable, using mock flow');
      }

      // 2. Process Payment UI delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Update Status and Assign Rider
      if (currentRideId) {
        try {
          const payRes = await fetch(`http://localhost:8080/api/rides/${currentRideId}/pay?method=${paymentMethod}`, {
            method: 'POST'
          });
          if (payRes.ok) {
            const updatedRide = await payRes.json();
            assignedRider = updatedRide.rider;
          }
        } catch (e) {
          console.warn('Backend failed during payment update');
        }
      }

      // Fallback rider if backend failed or wasn't there
      if (!assignedRider) {
        assignedRider = {
          name: "Rahul Kumar",
          photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
          vehicleNumber: "KA 01 J 1234",
          vehicleType: selectedVehicle?.type || "Bike"
        };
      }

      setStatus('CONFIRMED');
      if (walletDeduction > 0 && otherPayable > 0) {
        toast.success(`Split payment: ₹${walletDeduction} from wallet, ₹${otherPayable} via ${paymentMethod}`);
      } else if (walletDeduction > 0) {
        toast.success('Paid fully using subscription wallet!');
      } else {
        toast.success(`Paid ₹${rideFare} via ${paymentMethod}`);
      }

      // Wait a bit before showing rider
      setTimeout(() => {
        // First close the drawer
        setIsDrawerOpen(false);

        // Then after a tiny delay to allow drawer to start closing, switch the view
        setTimeout(() => {
          setRider(assignedRider);
          setStatus('ASSIGNED');
          toast.success('Ride confirmed and rider assigned!');
        }, 300);
      }, 2000);

    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Payment failed. Please try again.');
      setStatus('PAYMENT');
    }
  };

  const handleCompleteRide = async () => {
    setIsDrawerOpen(true); // Re-use drawer for completion success

    try {
      if (rideId) {
        await fetch(`http://localhost:8080/api/rides/${rideId}/complete`, { method: 'POST' });
      }
      toast.success('Ride completed! Moved to history.');
    } catch (e) {
      toast.success('Demo: Ride completed and moved to history!');
    }

    setTimeout(() => {
      setStatus('IDLE');
      setRider(null);
      navigate('/orders');
    }, 2000);
  };

  const handleCallRider = () => {
    setCallState('RINGING');

    // Simulated Backend Call Status Update
    if (rideId) {
      fetch(`http://localhost:8080/api/rides/${rideId}/call-status?status=RINGING`, { method: 'POST' }).catch(() => { });
    }

    // Call Sequence Simulation
    setTimeout(() => {
      setCallState('CONNECTED');
      if (rideId) {
        fetch(`http://localhost:8080/api/rides/${rideId}/call-status?status=CONNECTED`, { method: 'POST' }).catch(() => { });
      }
    }, 3000);

    setTimeout(() => {
      setCallState('ENDED');
      if (rideId) {
        fetch(`http://localhost:8080/api/rides/${rideId}/call-status?status=ENDED`, { method: 'POST' }).catch(() => { });
      }
      setTimeout(() => setCallState('NONE'), 2000);
    }, 8000);
  };

  const handleCancelRide = () => {
    setStatus('IDLE');
    setRider(null);
    toast.info('Ride cancelled');
  };

  if (status === 'ASSIGNED' && rider) {
    return (
      <MobileLayout showNav={false}>
        <header className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStatus('IDLE')}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Live Tracking</h1>
          </div>
          <Badge variant="success" className="animate-pulse">Live Update</Badge>
        </header>

        <div className="px-5 space-y-6 pb-32">
          {/* Map View */}
          <Card className="h-72 relative overflow-hidden bg-slate-100 rounded-3xl shadow-lg border-none ring-1 ring-slate-200">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
              alt="Map"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center animate-bounce shadow-2xl z-20">
                  <Navigation className="text-white w-7 h-7 rotate-45" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full animate-ping" />
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl text-sm font-black flex items-center gap-3 border border-white">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Rider arriving in 3 mins
            </div>
          </Card>

          {/* Rider Details Card */}
          <Card className="p-6 shadow-xl border-none ring-1 ring-slate-100 rounded-[32px] bg-white">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={rider.photoUrl}
                  alt={rider.name}
                  className="w-20 h-20 rounded-[24px] object-cover border-4 border-slate-50 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full px-2 py-0.5 border-2 border-white flex items-center gap-0.5">
                  <span className="text-[10px] font-black text-white">4.8</span>
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900">{rider.name}</h3>
                <p className="text-sm font-bold text-primary uppercase tracking-tight">{rider.vehicleType}</p>
                <Badge variant="secondary" className="mt-2 font-black tracking-widest bg-slate-100 text-slate-600 border-none">
                  {rider.vehicleNumber}
                </Badge>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                className="w-full h-14 rounded-2xl font-black text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 gap-3"
                onClick={handleCallRider}
              >
                <Phone className="w-5 h-5 fill-white" /> Call Rider
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-black text-lg border-2 border-green-600 text-green-600 hover:bg-green-50 shadow-none gap-3"
                onClick={handleCompleteRide}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Complete Ride
              </Button>
            </div>
          </Card>

          {/* Ride Route Info */}
          <div className="p-6 bg-slate-50 rounded-[32px] space-y-5 border-none">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 bg-secondary rounded-full shadow-sm" />
                <div className="w-0.5 h-10 bg-slate-200 my-1" />
                <div className="w-3 h-3 bg-primary rounded-full shadow-sm" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Pickup Point</p>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{pickup}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Destination</p>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{drop}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Option */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full h-12 text-destructive font-black uppercase tracking-widest text-[10px] hover:bg-destructive/5">
                Cancel Ride
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[32px] max-w-[90%] mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black">Cancel Ride?</AlertDialogTitle>
                <AlertDialogDescription className="text-base font-medium">
                  Rider is almost here. Are you sure you want to cancel?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3">
                <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-2 font-black">Hold On</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelRide} className="flex-1 h-14 rounded-2xl bg-destructive font-black text-white border-none">Cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Global Back to Home Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Button
            size="xl"
            variant="secondary"
            className="w-16 h-16 rounded-full shadow-2xl bg-slate-900 border-4 border-white text-white hover:bg-slate-800 active:scale-90 transition-all p-0 flex items-center justify-center group"
            onClick={() => navigate('/home')}
          >
            <Home className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </Button>
          <p className="text-center text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Back Home</p>
        </div>

        {/* Calling Overlay */}
        {callState !== 'NONE' && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-between py-24 text-white animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <img src={rider.photoUrl} alt={rider.name} className="w-full h-full object-cover" />
                </div>
                {callState === 'RINGING' && (
                  <div className="absolute inset-0 rounded-[40px] border-4 border-primary animate-ping" />
                )}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black">{rider.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    callState === 'RINGING' ? "bg-yellow-400 animate-pulse" :
                      callState === 'CONNECTED' ? "bg-green-500" : "bg-red-500"
                  )} />
                  <p className="text-xl font-bold tracking-tight uppercase">
                    {callState === 'RINGING' ? 'Calling...' :
                      callState === 'CONNECTED' ? 'Connected' : 'Call Ended'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-12">
                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20">
                  <Smartphone className="w-8 h-8" />
                </Button>
                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20">
                  <Users className="w-8 h-8" />
                </Button>
              </div>
              <Button
                onClick={() => setCallState('NONE')}
                className="w-20 h-20 rounded-full bg-destructive shadow-2xl shadow-destructive/40 flex items-center justify-center border-none"
              >
                <PhoneOff className="w-10 h-10 text-white" />
              </Button>
            </div>
          </div>
        )}
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Book a Ride</h1>
            <p className="text-sm text-muted-foreground">Safe and reliable transport</p>
          </div>
        </div>
      </header>

      <div className="px-5 space-y-6 pb-32">
        {/* Location Inputs */}
        <Card className="p-5 shadow-md border-none ring-1 ring-slate-200">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-3">
                <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
                <div className="w-0.5 h-12 bg-slate-200 my-1" />
                <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    className="pl-12 bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <div className="relative group">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    placeholder="Where to?"
                    value={drop}
                    onChange={e => setDrop(e.target.value)}
                    className="pl-12 bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Map Placeholder */}
        <Card className="h-44 relative bg-slate-100 overflow-hidden rounded-2xl group">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
            alt="Map Background"
            className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-600 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
              Enter destination for route preview
            </p>
          </div>
        </Card>

        {/* Vehicle Selection */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Suggested Rides</h2>
            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">FASTEST</span>
          </div>
          <div className="space-y-3">
            {vehicleOptions.map(vehicle => (
              <Card
                key={vehicle.id}
                className={cn(
                  'p-4 cursor-pointer transition-all duration-300 border-none ring-1 ring-slate-100',
                  selectedVehicle?.id === vehicle.id
                    ? 'ring-2 ring-primary bg-primary/[0.02] shadow-md -translate-y-1'
                    : 'hover:shadow-lg hover:ring-slate-200'
                )}
                onClick={() => {
                  if (selectedVehicle?.id === vehicle.id) {
                    handleBookClick();
                  } else {
                    setSelectedVehicle(vehicle);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                    {vehicle.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{vehicle.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-primary" />
                        {vehicle.eta}
                      </span>
                      <span className="flex items-center gap-1 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                        <Users className="w-3 h-3" />
                        {vehicle.capacity} seater
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 leading-none">₹{vehicle.price}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mt-1">fare total</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-lg max-w-lg mx-auto border-t border-slate-100 z-[40]">
        <Button
          size="xl"
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          disabled={!selectedVehicle}
          onClick={handleBookClick}
        >
          {selectedVehicle
            ? `Book ${selectedVehicle.name} • ₹${selectedVehicle.price}`
            : 'Choose your ride'}
        </Button>
      </div>

      {/* Payment Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto z-[100]">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-black flex items-center justify-between">
              Confirm Payment
              <span className="text-primary text-3xl font-black">₹{selectedVehicle?.price}</span>
            </DrawerTitle>
            <DrawerDescription className="text-base">
              Rider will arrive in {selectedVehicle?.eta} at {pickup}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Payment Method</h3>
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
                    <p className="text-xs text-muted-foreground">Fastest and secure</p>
                  </div>
                  {paymentMethod === method.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                </button>
              ))}
            </div>

            {status === 'CONFIRMED' ? (
              <div className="bg-green-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border-2 border-green-200 py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-green-900">Payment Success!</h3>
                <p className="text-green-700 font-medium">Your ride is confirmed. Finding rider...</p>
                <div className="pt-4">
                  <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                </div>
              </div>
            ) : status === 'PROCESSING' ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="font-bold text-slate-600">Securely processing your payment...</p>
              </div>
            ) : (
              <Button
                size="xl"
                className="w-full h-16 rounded-2xl text-xl font-black mt-4 shadow-xl shadow-primary/30"
                onClick={handlePayment}
              >
                Pay & Confirm Ride
              </Button>
            )}
          </div>
          <DrawerFooter className="pb-8">
            <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-tighter">
              Secure 256-bit SSL encrypted payment by DailyPay
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
}

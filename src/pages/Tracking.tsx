import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, MapPin, Phone, CheckCircle2,
  Clock, ShoppingBag, ShieldCheck, Star,
  Zap, Navigation, Bike, ChefHat, PackageCheck,
  RotateCcw, Info, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Simulated Map Component using SVG for premium feel
const SimulatedMap = ({ progress }: { progress: number }) => {
  // progress goes from 0 to 1 (0 = Restaurant, 1 = Home)
  const pathRef = useRef<SVGPathElement>(null);
  const [point, setPoint] = useState({ x: 50, y: 350 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      const currentPos = pathRef.current.getPointAtLength(length * progress);
      const nextPos = pathRef.current.getPointAtLength(Math.min(length, length * progress + 0.1));

      setPoint({ x: currentPos.x, y: currentPos.y });

      const angle = Math.atan2(nextPos.y - currentPos.y, nextPos.x - currentPos.x) * (180 / Math.PI);
      setRotation(angle);
    }
  }, [progress]);

  return (
    <div className="relative w-full h-full bg-[#f0f4f8] overflow-hidden rounded-[32px]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Simplified City Map Blocks */}
        <rect x="20" y="20" width="80" height="120" rx="4" fill="#E2E8F0" />
        <rect x="120" y="20" width="160" height="60" rx="4" fill="#E2E8F0" />
        <rect x="300" y="20" width="80" height="80" rx="4" fill="#E2E8F0" />
        <rect x="20" y="160" width="100" height="100" rx="4" fill="#E2E8F0" />
        <rect x="140" y="100" width="120" height="180" rx="4" fill="#E2E8F0" />
        <rect x="280" y="120" width="100" height="140" rx="4" fill="#E2E8F0" />
        <rect x="20" y="280" width="140" height="100" rx="4" fill="#E2E8F0" />
        <rect x="180" y="300" width="200" height="80" rx="4" fill="#E2E8F0" />

        {/* The Route Path */}
        <path
          ref={pathRef}
          d="M 50 350 L 170 350 L 170 190 L 330 190 L 330 50"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 350 L 170 350 L 170 190 L 330 190 L 330 50"
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1, 8"
          className="animate-pulse"
        />

        {/* Restaurant Marker */}
        <g transform="translate(50, 350)">
          <circle r="12" fill="white" className="shadow-sm" />
          <ChefHat className="w-5 h-5 -translate-x-2.5 -translate-y-2.5 text-primary" />
        </g>

        {/* Destination Marker */}
        <g transform="translate(330, 50)">
          <circle r="12" fill="white" className="shadow-sm" />
          <MapPin className="w-5 h-5 -translate-x-2.5 -translate-y-2.5 text-success fill-success/20" />
        </g>

        {/* Moving Rider Marker */}
        <g transform={`translate(${point.x}, ${point.y}) rotate(${rotation})`}>
          <circle r="16" fill="#2563eb" className="animate-pulse opacity-20" />
          <circle r="8" fill="#2563eb" />
          <Bike className="w-5 h-5 -translate-x-4 -translate-y-2.5 text-white" style={{ transform: 'scaleX(-1)' }} />
        </g>
      </svg>
    </div>
  );
};

export default function Tracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [rideProgress, setRideProgress] = useState(0); // 0 to 1
  const [eta, setEta] = useState(25);
  const [hasMapPermission, setHasMapPermission] = useState(true);

  const timelineSteps = [
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Order placed successfully' },
    { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chef is preparing your meal' },
    { id: 'out_for_delivery', label: 'Picked Up', icon: PackageCheck, desc: 'Rider has picked up your order' },
    { id: 'on_the_way', label: 'On the Way', icon: Bike, desc: 'Rider is on the way to you' },
    { id: 'delivered', label: 'Delivered', icon: Star, desc: 'Order delivered. Enjoy!' }
  ];

  // Simulation Logic based on real elapsed time
  useEffect(() => {
    if (!order) return;

    const createdAt = new Date(order.createdAt).getTime();
    const now = Date.now();
    const elapsed = (now - createdAt) / 1000; // seconds

    // Calculate initial status based on elapsed time
    if (elapsed > 1200) { // 20 mins+ = Delivered
      setCurrentStatus('delivered');
      setRideProgress(1);
      setEta(0);
      return;
    } else if (elapsed > 600) { // 10 mins+ = On the way
      setCurrentStatus('on_the_way');
      // Calculate progress (600 to 1200 maps to 0.1 to 1.0)
      const p = Math.min(1, 0.1 + ((elapsed - 600) / 600) * 0.9);
      setRideProgress(p);
      setEta(Math.max(2, 25 - (elapsed / 60)));
    } else if (elapsed > 300) { // 5 mins+ = Picked up
      setCurrentStatus('out_for_delivery');
      setRideProgress(0.05);
      setEta(Math.max(10, 25 - (elapsed / 60)));
    } else if (elapsed > 60) { // 1 min+ = Preparing
      setCurrentStatus('preparing');
      setRideProgress(0);
      setEta(25);
    }

    // Dynamic Timers for remaining simulation
    const timer1 = elapsed < 60 ? setTimeout(() => setCurrentStatus('preparing'), Math.max(0, 4000 - elapsed * 1000)) : null;
    const timer2 = elapsed < 300 ? setTimeout(() => {
      setCurrentStatus('out_for_delivery');
      toast.info('Rider Arjun has picked up your order!', { icon: <PackageCheck className="text-primary" /> });
    }, Math.max(0, 10000 - elapsed * 1000)) : null;
    const timer3 = elapsed < 600 ? setTimeout(() => setCurrentStatus('on_the_way'), Math.max(0, 15000 - elapsed * 1000)) : null;

    // Simulated movement timer
    const moveTimer = setInterval(() => {
      setRideProgress(prev => {
        if (prev >= 1) {
          setCurrentStatus('delivered');
          clearInterval(moveTimer);
          return 1;
        }
        // Only move if status is on_the_way or out_for_delivery
        if (currentStatus === 'on_the_way' || currentStatus === 'out_for_delivery') {
          return Math.min(1, prev + 0.005);
        }
        return prev;
      });

      setEta(prev => Math.max(prev > 5 ? 2 : 0, prev - 0.1));
    }, 2000);

    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
      if (timer3) clearTimeout(timer3);
      clearInterval(moveTimer);
    };
  }, [order, currentStatus]);

  const currentStepIndex = timelineSteps.findIndex(s => s.id === currentStatus);
  const restaurantName = order?.items[0]?.restaurantName || 'DailyPlate Kitchen';

  if (!order) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Finding your order...</h2>
          <p className="text-slate-500 font-medium mb-8">If you just placed an order, it will appear here shortly.</p>
          <Button onClick={() => navigate('/home')} size="lg" className="rounded-2xl px-12 font-black uppercase tracking-widest">
            Back to Home
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      {/* Header Info Swiggy Style */}
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 z-50 border-b border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')} className="rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 px-4">
            <h1 className="text-lg font-black text-slate-900 leading-tight truncate">{restaurantName}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID: #{order.id.slice(-6)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHasMapPermission(!hasMapPermission)}
            className="text-[8px] font-black uppercase text-slate-400"
          >
            {hasMapPermission ? 'Map ON' : 'Map OFF'}
          </Button>
          <button className="text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10 ml-2">
            Help
          </button>
        </div>

        {/* Dynamic Status Banner */}
        <div className="flex items-center justify-between py-2 border-t border-slate-50 mt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Paid via {order.paymentMethod}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">₹{order.total} • {order.items.length} Items</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 space-y-6 pt-4 pb-48">
        {/* Animated Simulated Map or Fallback UI */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary animate-pulse" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {hasMapPermission ? 'Live Tracking' : 'Status Update'}
              </h3>
            </div>
            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/10">
              {hasMapPermission ? 'Moving Now' : 'GPS Unavailable'}
            </Badge>
          </div>

          <div className="h-80 w-full relative group">
            {hasMapPermission ? (
              <>
                <SimulatedMap progress={rideProgress} />
                {/* Floating ETA Overlay */}
                <div className="absolute top-4 left-4">
                  <Card className="bg-white/90 backdrop-blur-md p-3 border-none shadow-xl rounded-2xl ring-1 ring-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Arriving In</p>
                      <p className="text-lg font-black text-slate-900 leading-none">{Math.round(eta)} mins</p>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <div className="h-full w-full bg-slate-900 rounded-[32px] p-8 flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />

                <div className="w-20 h-20 bg-primary/20 rounded-[32px] flex items-center justify-center relative z-10">
                  <Bike className="w-10 h-10 text-primary animate-bounce" />
                </div>

                <div className="relative z-10 space-y-2">
                  <h4 className="text-2xl font-black text-white">{Math.round(eta)} Minutes Away</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rider is {((1 - rideProgress) * 3).toFixed(1)} km from your location</p>
                </div>

                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative z-10">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${rideProgress * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] relative z-10">Real-time status tracking active</p>
              </div>
            )}
          </div>
        </section>

        {/* Status Timeline */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-l-4 border-primary pl-3">Delivery Timeline</h3>
          <Card className="p-6 border-none shadow-card rounded-[32px] bg-white ring-1 ring-slate-100">
            <div className="space-y-8 relative">
              {/* Timeline Line */}
              <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-slate-100" />

              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.id} className={cn("flex items-start gap-4 relative z-10 transition-all duration-500", !isActive && "opacity-30")}>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-all duration-500",
                      isActive ? "bg-primary text-white scale-110" : "bg-slate-50 text-slate-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1.5 flex-1">
                      <h4 className={cn("text-sm font-black leading-tight", isActive ? "text-slate-900" : "text-slate-400")}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">{step.desc}</p>
                      {isCurrent && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                          <span className="text-[8px] font-black uppercase text-primary tracking-widest">Active Status</span>
                        </div>
                      )}
                    </div>
                    {isActive && index < currentStepIndex && (
                      <div className="mt-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Rider Info Card */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-l-4 border-secondary pl-3">Delivery Partner</h3>
          <Card className="p-5 border-none shadow-card rounded-[32px] bg-white ring-1 ring-slate-100 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-slate-100 rounded-[24px] overflow-hidden border-2 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                      alt="Rider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-xl flex items-center justify-center text-[10px] border-2 border-white shadow-sm">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Arjun Singh</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DailyPlate Partner • 4.98★</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge className="bg-success/10 text-success text-[8px] border-none font-black h-5 uppercase">Verified</Badge>
                    <Badge className="bg-primary/10 text-primary text-[8px] border-none font-black h-5 uppercase">Top Rated</Badge>
                  </div>
                </div>
              </div>
              <Button
                size="icon"
                className="w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none"
                onClick={() => toast.info('Connecting to Arjun Singh...')}
              >
                <Phone className="w-6 h-6 text-white" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bike className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Number</p>
                  <p className="text-sm font-black text-slate-900">KA-05-EP-4321</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speed</p>
                <p className="text-sm font-black text-slate-900">32 km/h</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Order OTP Display */}
        <section className="space-y-4">
          <Card className="p-6 border-none shadow-card rounded-[32px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-black leading-tight">Delivery OTP</h3>
                <p className="text-xs text-indigo-100 font-medium opacity-80">Share this with Arjun upon arrival</p>
              </div>
              <ShieldCheck className="w-10 h-10 text-white/40" />
            </div>
            <div className="flex justify-between items-center gap-3 relative z-10">
              {order.deliveryOtp.split('').map((digit: string, i: number) => (
                <div key={i} className="flex-1 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black text-white border border-white/20 shadow-inner">
                  {digit}
                </div>
              ))}
              <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Info className="w-6 h-6" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Item Summary Hook */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900">Order Summary</h3>
          <Card className="border-none bg-white rounded-[32px] overflow-hidden p-6 ring-1 ring-slate-100 divide-y divide-slate-50">
            <div className="pb-4 space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">{item.quantity}x</span>
                    <span className="font-bold text-slate-700">{item.menuItem.name}</span>
                  </div>
                  <span className="font-black text-slate-900">₹{item.menuItem.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[8px] font-black uppercase text-success border-success/20 bg-success/5">
                  Paid
                </Badge>
                <span className="text-xs font-black text-slate-500">{order.paymentMethod}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bill</p>
                <p className="text-lg font-black text-primary">₹{order.total}</p>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Sticky Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-10 shadow-2xl animate-in slide-in-from-bottom-full duration-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center relative">
              <Bike className="w-6 h-6 text-primary animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Arjun is on the way</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last updated: Just now</p>
            </div>
          </div>
          <Button onClick={() => window.location.reload()} variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-slate-50 hover:bg-slate-100">
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </footer>
    </MobileLayout>
  );
}

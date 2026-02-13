import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, ShoppingBag, MapPin, Sparkles, Home, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useApp();
    const order = location.state?.order;

    useEffect(() => {
        // Safety clear cart if not already cleared
        clearCart();
    }, [clearCart]);

    if (!order) {
        return (
            <MobileLayout showNav={false}>
                <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8">
                        <ShoppingBag className="w-12 h-12 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Order Not Found</h2>
                    <Button onClick={() => navigate('/home')} className="mt-6 rounded-2xl px-12 h-12 font-black uppercase tracking-widest bg-primary">
                        Back to Home
                    </Button>
                </div>
            </MobileLayout>
        );
    }

    const restaurantName = order.items[0]?.restaurantName || 'DailyPlate Kitchen';

    return (
        <MobileLayout showNav={false}>
            <div className="min-h-screen bg-white flex flex-col">
                {/* Animated Celebration Section */}
                <div className="pt-20 pb-12 px-8 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-success/20 rounded-[48px] blur-3xl animate-pulse" />
                        <div className="w-32 h-32 bg-success rounded-[40px] flex items-center justify-center relative shadow-2xl animate-in zoom-in duration-500">
                            <CheckCircle2 className="w-16 h-16 text-white" />
                        </div>
                        {/* sparkles */}
                        <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-amber-400 animate-bounce" />
                        <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-primary animate-pulse" />
                    </div>

                    <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Order Placed!</h1>
                        <p className="text-slate-500 font-bold text-lg">Delicious food is coming your way.</p>
                    </div>
                </div>

                {/* Order Info Card */}
                <div className="px-5 space-y-6 flex-1">
                    <Card className="p-6 border-none shadow-card rounded-[32px] bg-slate-50 ring-1 ring-slate-100 animate-in slide-in-from-bottom-6 duration-1000">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Delivering from</p>
                                <h3 className="text-xl font-black text-slate-900">{restaurantName}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Delivering to</p>
                                    <p className="text-sm font-black text-slate-900">{order.deliveryAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Estimated Arrival</p>
                                    <p className="text-sm font-black text-slate-900">{order.estimatedTime} mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Amount Paid</p>
                                <p className="text-lg font-black text-slate-900">₹{order.total.toFixed(2)}</p>
                            </div>
                            <Badge className="bg-success/10 text-success border-none font-black uppercase text-[8px] tracking-widest px-3 py-1">
                                Via {order.paymentMethod === 'Subscription Wallet' ? 'Wallet' : 'Secure Pay'}
                            </Badge>
                        </div>
                    </Card>

                    <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] animate-in fade-in duration-1000 delay-500">
                        Order ID: #{order.id.slice(-6)}
                    </p>
                </div>

                {/* Sticky Actions */}
                <div className="p-6 pb-12 space-y-4 animate-in slide-in-from-bottom-8 duration-1000">
                    <Button
                        size="xl"
                        className="w-full h-16 rounded-[24px] bg-primary hover:bg-primary/95 shadow-xl text-lg font-black uppercase tracking-widest group"
                        onClick={() => navigate('/tracking', { state: { order } })}
                    >
                        <span>Track Order</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="xl"
                        className="w-full h-16 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-600 font-black uppercase tracking-widest flex items-center justify-center gap-3"
                        onClick={() => navigate('/home')}
                    >
                        <Home className="w-5 h-5 text-slate-400" />
                        <span>Back to Home</span>
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}

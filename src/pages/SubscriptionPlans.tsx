import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, Star, Zap, ShieldCheck, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/types/app';

const plans: SubscriptionPlan[] = [
    {
        id: 'plan_3m',
        name: '3 Months Starter',
        price: 6000,
        durationMonths: 3,
        benefits: [
            'Daily meal delivery included',
            'Priority delivery support',
            'No delivery charges',
            'Cancel anytime'
        ]
    },
    {
        id: 'plan_6m',
        name: '6 Months Professional',
        price: 10000,
        durationMonths: 6,
        benefits: [
            'Everything in Starter',
            '10% off on special items',
            'Exclusive weekend menus',
            'Dedicated health coach'
        ]
    },
    {
        id: 'plan_1y',
        name: '1 Year Elite',
        price: 12000,
        durationMonths: 12,
        benefits: [
            'Everything in Professional',
            'Zero platform fees',
            'Complimentary desserts',
            'Priority early-access to new shops'
        ]
    }
];

export default function SubscriptionPlans() {
    const navigate = useNavigate();
    const { setSubscription } = useApp();

    const handleChoosePlan = (plan: SubscriptionPlan) => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + plan.durationMonths);

        const newSubscription = {
            id: `sub_${Date.now()}`,
            type: 'all' as const,
            budget: 500, // Default daily budget for subscribers
            walletBalance: plan.price, // Start with full balance or separate wallet? Usually subscription is pre-paid.
            // Let's assume choosing a plan sets up an active subscription.
            planName: plan.name,
            durationMonths: plan.durationMonths,
            startDate,
            endDate,
            isActive: true,
            mealsDelivered: 0,
            totalMeals: plan.durationMonths * 30 // Approximate
        };

        setSubscription(newSubscription);
        toast.success(`${plan.name} activated!`);
        navigate('/home');
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 bg-white sticky top-0 z-50">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-xl font-black text-slate-900">Subscription Plans</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Upgrade your experience</p>
                </div>
            </header>

            <div className="px-5 space-y-6 pb-20 mt-4">
                {plans.map((plan, index) => (
                    <Card
                        key={plan.id}
                        className={cn(
                            "p-6 border-none shadow-card rounded-[32px] relative overflow-hidden group",
                            index === 1 ? "bg-slate-900 text-white" : "bg-white"
                        )}
                    >
                        {index === 1 && (
                            <div className="absolute top-0 right-0 p-4">
                                <Badge className="bg-primary text-white border-none font-black uppercase text-[10px] tracking-widest">Most Popular</Badge>
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                    index === 0 ? "bg-orange-100 text-orange-600" :
                                        index === 1 ? "bg-primary/20 text-primary" : "bg-emerald-100 text-emerald-600"
                                )}>
                                    {index === 0 ? <Star className="w-6 h-6" /> : index === 1 ? <Crown className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg leading-tight">{plan.name}</h3>
                                    <p className={cn("text-xs font-bold uppercase tracking-widest", index === 1 ? "text-slate-400" : "text-slate-500")}>
                                        {plan.durationMonths} Months Duration
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black">₹{plan.price}</span>
                                <span className={cn("text-sm font-bold opacity-70", index === 1 ? "text-slate-400" : "text-slate-500")}>/ period</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                {plan.benefits.map((benefit, bIndex) => (
                                    <div key={bIndex} className="flex items-center gap-3">
                                        <CheckCircle2 className={cn("w-4 h-4 shrink-0", index === 1 ? "text-primary" : "text-secondary")} />
                                        <span className="text-sm font-medium opacity-90">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => handleChoosePlan(plan)}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-sm",
                                    index === 1 ? "bg-primary text-white hover:bg-primary/90" : "bg-slate-900 text-white hover:bg-slate-800"
                                )}
                            >
                                Choose {plan.durationMonths} Months
                            </Button>
                        </div>

                        {/* Background elements */}
                        <div className={cn(
                            "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20",
                            index === 0 ? "bg-orange-500" : index === 1 ? "bg-primary" : "bg-emerald-500"
                        )} />
                    </Card>
                ))}

                <div className="text-center space-y-2 py-4">
                    <div className="flex items-center justify-center gap-2 text-secondary">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sacure Payment & Auto-Renewal</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium px-8">
                        By choosing a plan, you agree to our Terms of Service. Your subscription will renew automatically at the end of the period.
                    </p>
                </div>
            </div>
        </MobileLayout>
    );
}

// Helper Badge component since it might not be exported from UI
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
            {children}
        </div>
    );
}

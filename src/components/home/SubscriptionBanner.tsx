import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Calendar, ChevronRight, Sparkles, Crown } from 'lucide-react';

export function SubscriptionBanner() {
  const navigate = useNavigate();
  const { subscription } = useApp();

  if (subscription) {
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
      <Card className="bg-gradient-primary text-white border-none shadow-elevated rounded-[32px] overflow-hidden group">
        <div className="p-6 relative">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-12 h-12" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">
                  {subscription.isActive ? 'Active Plan' : 'Subscription'}
                </p>
                <h3 className="font-black text-xl leading-tight">
                  {subscription.planName || 'Standard Plan'}
                </h3>
                <div className="flex items-center gap-2 mt-2 bg-black/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 w-fit">
                  <Calendar className="w-3 h-3 text-white/80" />
                  <p className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
                    Valid till {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/subscriptions')}
              className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-6 h-11 bg-white text-primary hover:bg-white/90 border-none shadow-lg active:scale-95 transition-all"
            >
              Manage
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/60">
                <span>Usage Progress</span>
                <span>{subscription.mealsDelivered} Deliveries</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${Math.min(100, (subscription.mealsDelivered / (subscription.totalMeals || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-secondary text-secondary-foreground border-0 overflow-hidden">
      <button
        onClick={() => navigate('/subscriptions')}
        className="p-5 w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary-foreground/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Monthly Meal Plans</p>
            <p className="text-sm opacity-90">Save up to 30% on daily meals</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 opacity-80" />
      </button>
    </Card>
  );
}

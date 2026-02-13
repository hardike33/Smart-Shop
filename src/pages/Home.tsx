import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { BudgetCard } from '@/components/home/BudgetCard';
import { QuickActions } from '@/components/home/QuickActions';
import { SubscriptionBanner } from '@/components/home/SubscriptionBanner';
import { useApp } from '@/context/AppContext';
import { Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { restaurantsData } from '@/data/restaurants';
import { RestaurantCard } from '@/components/home/RestaurantCard';

export default function Home() {
  const navigate = useNavigate();
  const { user, restaurants } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <MobileLayout>
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-muted-foreground text-sm">{getGreeting()} 👋</p>
            <h1 className="text-2xl font-bold">{user?.name || 'Guest'}</h1>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Deliver to: </span>
            <span className="text-foreground font-medium">Home</span>
          </button>
          <div className="flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full scale-90 origin-right transition-transform hover:scale-95 cursor-default">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-success uppercase tracking-widest">12 Riders Nearby</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 space-y-6">
        {/* Budget Card */}
        <BudgetCard />

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">What would you like?</h2>
          <QuickActions />
        </section>

        {/* Subscription Banner */}
        <section>
          <SubscriptionBanner />
        </section>

        {/* Popular Near You */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Popular Near You</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Recommended for you</p>
            </div>
            <button className="text-primary text-sm font-black uppercase tracking-widest">See All</button>
          </div>
          <div className="grid grid-cols-1 gap-6 pb-24">
            {restaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, SlidersHorizontal, Star, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { RestaurantCard } from '@/components/home/RestaurantCard';

const filters = ['All', 'Home-Made', 'Budget', 'Top Rated', 'Fast Delivery'];

const getCategoryIcon = (category: string) => {
  if (category.includes('Indian')) return '🍛';
  if (category.includes('Healthy')) return '🥗';
  if (category.includes('Home')) return '🍲';
  if (category.includes('Fast')) return '🥪';
  return '🍽️';
};

export default function Restaurants() {
  const navigate = useNavigate();
  const { restaurants } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRestaurants = restaurants.filter(r => {
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilter === 'Home-Made' && !r.isHomeMade) return false;
    if (activeFilter === 'Budget' && r.priceRange > 1) return false;
    if (activeFilter === 'Top Rated' && r.rating < 4.5) return false;
    if (activeFilter === 'Fast Delivery' && parseInt(r.deliveryTime) > 25) return false;
    return true;
  });

  return (
    <MobileLayout>
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Restaurants</h1>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="px-5 space-y-5 pb-20">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          />
        ))}
      </div>
    </MobileLayout>
  );
}

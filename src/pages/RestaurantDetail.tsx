import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/data/restaurants';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, restaurants } = useApp();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-5">
          <p className="text-muted-foreground">Restaurant not found</p>
          <Button className="mt-4" onClick={() => navigate('/restaurants')}>
            Back to Restaurants
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getQuantity = (itemId: string) => quantities[itemId] || 0;

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const qty = getQuantity(item.id);
    if (qty > 0) {
      addToCart({
        menuItem: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          isVeg: item.isVeg,
          isPopular: item.isPopular,
          category: item.category,
        },
        quantity: qty,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  // Group menu items by category
  const categories = [...new Set(restaurant.menu.map((item) => item.category))];

  return (
    <MobileLayout>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-bold truncate">{restaurant.name}</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Restaurant Info Header */}
      <div className="relative h-56">
        <OptimizedImage
          src={restaurant.imageUrl || ''}
          alt={restaurant.name}
          containerClassName="w-full h-full"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
      </div>

      <div className="px-5 -mt-10 relative z-10">
        <Card className="p-5 shadow-xl border-none bg-white rounded-3xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-800">{restaurant.name}</h2>
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-xl">
                <span className="text-sm font-bold">{restaurant.rating}</span>
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {restaurant.cuisines.join(', ')}
            </p>

            <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400">{restaurant.deliveryTime}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400">{restaurant.distance}</span>
              </div>
              {restaurant.isHomeMade && (
                <div className="flex flex-col items-center gap-1">
                  <Badge className="bg-orange-500 text-white border-none shadow-sm text-[10px] font-black uppercase">Home-Made</Badge>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Menu */}
      <div className="px-5 pb-24 space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="font-bold text-lg mb-3">{category}</h3>
            <div className="space-y-3">
              {restaurant.menu
                .filter((item) => item.category === category)
                .map((item) => {
                  const qty = getQuantity(item.id);
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="relative w-28 h-28 flex-shrink-0">
                          <OptimizedImage
                            src={item.image}
                            alt={item.name}
                            containerClassName="w-full h-full"
                          />
                          {item.isPopular && (
                            <Badge
                              variant="warning"
                              className="absolute top-2 left-2 text-[10px] py-0.5 px-2 bg-yellow-400 text-white border-none shadow-sm"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'w-4 h-4 border-2 rounded flex items-center justify-center',
                                  item.isVeg
                                    ? 'border-success'
                                    : 'border-destructive'
                                )}
                              >
                                <span
                                  className={cn(
                                    'w-2 h-2 rounded-full',
                                    item.isVeg ? 'bg-success' : 'bg-destructive'
                                  )}
                                />
                              </span>
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">₹{item.price}</span>
                            <div className="flex items-center gap-2">
                              {qty > 0 ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-6 text-center font-medium">{qty}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8 px-3"
                                    onClick={() => handleAddToCart(item)}
                                  >
                                    Add
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}

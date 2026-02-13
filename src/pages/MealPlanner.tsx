import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Drumstick,
  Heart,
  ChevronDown,
  ChevronUp,
  Flame,
  Scale,
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Cookie
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { CartItem } from '@/types/app';

const dietaryOptions = [
  { id: 'veg', label: 'Veg', icon: Leaf, color: 'text-success' },
  { id: 'nonveg', label: 'Non-Veg', icon: Drumstick, color: 'text-destructive' },
  { id: 'healthy', label: 'Healthy', icon: Heart, color: 'text-accent' },
];

interface MealItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  isVeg: boolean;
  calories: number;
  portion: string;
  emoji: string;
}

interface MealPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  snacks: MealItem[];
  dinner: MealItem[];
}

const mealCategories = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'snacks', label: 'Evening Snacks', icon: Cookie, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
] as const;

const mockDatabase: Record<string, MealItem[]> = {
  breakfast: [
    { id: 'b1', name: 'Masala Dosa', restaurant: 'South Express', price: 80, isVeg: true, calories: 350, portion: '1 Plate', emoji: '🥞' },
    { id: 'b2', name: 'Idli Sambar', restaurant: 'South Express', price: 60, isVeg: true, calories: 220, portion: '2 Pcs', emoji: '⚪' },
    { id: 'b3', name: 'Poha', restaurant: 'Sharma Kitchen', price: 50, isVeg: true, calories: 280, portion: '1 Bowl', emoji: '🥣' },
    { id: 'b4', name: 'Omelette Toast', restaurant: 'Mama\'s Home Food', price: 90, isVeg: false, calories: 420, portion: '2 Eggs', emoji: '🍳' },
  ],
  lunch: [
    { id: 'l1', name: 'Veg Thali', restaurant: 'Sharma Kitchen', price: 150, isVeg: true, calories: 850, portion: 'Full Thali', emoji: '🍛' },
    { id: 'l2', name: 'Chicken Biryani', restaurant: 'Biryani House', price: 220, isVeg: false, calories: 950, portion: 'Regular', emoji: '🍚' },
    { id: 'l3', name: 'Dal Khichdi', restaurant: 'Mama\'s Home Food', price: 120, isVeg: true, calories: 450, portion: '1 Bowl', emoji: '🥘' },
    { id: 'l4', name: 'Grilled Veg Salad', restaurant: 'Fresh Bites Cafe', price: 160, isVeg: true, calories: 320, portion: 'Large', emoji: '🥗' },
  ],
  snacks: [
    { id: 's1', name: 'Vegetable Sandwich', restaurant: 'Fresh Bites Cafe', price: 70, isVeg: true, calories: 240, portion: '2 Slices', emoji: '🥪' },
    { id: 's2', name: 'Fruit Bowl', restaurant: 'Fresh Bites Cafe', price: 110, isVeg: true, calories: 150, portion: 'Small', emoji: '🍎' },
    { id: 's3', name: 'Samosa (2pcs)', restaurant: 'Sharma Kitchen', price: 40, isVeg: true, calories: 380, portion: '2 Pcs', emoji: '🥟' },
    { id: 's4', name: 'Chicken Wrap', restaurant: 'Fresh Bites Cafe', price: 130, isVeg: false, calories: 420, portion: '1 Wrap', emoji: '🌯' },
  ],
  dinner: [
    { id: 'd1', name: 'Paneer Tikka', restaurant: 'Sharma Kitchen', price: 180, isVeg: true, calories: 480, portion: '6 Pcs', emoji: '🍢' },
    { id: 'd2', name: 'Clear Soup & Momos', restaurant: 'Quick Eats', price: 140, isVeg: true, calories: 350, portion: '6 Pcs', emoji: '🥟' },
    { id: 'd3', name: 'Grilled Chicken', restaurant: 'Biryani House', price: 250, isVeg: false, calories: 550, portion: '2 Pcs', emoji: '🍗' },
    { id: 'd4', name: 'Tandoori Roti & Dal', restaurant: 'Sharma Kitchen', price: 110, isVeg: true, calories: 520, portion: '2 Roti', emoji: '🫓' },
  ],
};

export default function MealPlanner() {
  const navigate = useNavigate();
  const { dailyBudget, addToCart, cart, updateQuantity, removeFromCart, cartTotal } = useApp();
  const [budget, setBudget] = useState([dailyBudget]);
  const [selectedDiet, setSelectedDiet] = useState<string[]>(['veg']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['breakfast', 'lunch', 'snacks', 'dinner']);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const getItemQuantity = (id: string) => itemQuantities[id] || 0;

  const updateItemQuantity = (item: MealItem, delta: number) => {
    const newQty = Math.max(0, getItemQuantity(item.id) + delta);
    setItemQuantities(prev => ({ ...prev, [item.id]: newQty }));

    if (newQty > 0) {
      // Find if item already in cart to update it or add new
      const cartItem: CartItem = {
        menuItem: {
          id: item.id,
          name: item.name,
          description: `${item.portion}, ${item.calories} kcal`,
          price: item.price,
          image: '',
          isVeg: item.isVeg,
          category: 'meal',
        },
        quantity: 1, // AppContext's addToCart handles increment if we call it with qty 1 multiple times?
        // Actually AppContext's updateQuantity is better if we have the absolute new quantity
        restaurantId: item.restaurant,
        restaurantName: item.restaurant,
      };

      // If we are increasing by 1, we can use addToCart with quantity 1
      if (delta > 0) {
        addToCart({ ...cartItem, quantity: 1 });
      } else {
        // If we are decreasing, we should use updateQuantity from AppContext
        // We need to find the current quantity in cart and subtract 1
        const inCart = cart.find(i => i.menuItem.id === item.id);
        if (inCart) {
          updateQuantity(item.id, inCart.quantity - 1);
        }
      }
    } else {
      removeFromCart(item.id);
    }
  };

  const handleOrderIndividually = (item: MealItem) => {
    addToCart({
      menuItem: {
        id: item.id,
        name: item.name,
        description: `${item.portion}, ${item.calories} kcal`,
        price: item.price,
        image: '',
        isVeg: item.isVeg,
        category: 'meal',
      },
      quantity: 1,
      restaurantId: item.restaurant,
      restaurantName: item.restaurant,
    });
    navigate('/cart');
  };

  const toggleDiet = (id: string) => {
    setSelectedDiet(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalPlanPrice = useMemo(() => {
    if (!mealPlan) return 0;
    return Object.values(mealPlan).flat().reduce((sum, item) => sum + item.price, 0);
  }, [mealPlan]);

  const totalPlanCalories = useMemo(() => {
    if (!mealPlan) return 0;
    return Object.values(mealPlan).flat().reduce((sum, item) => sum + item.calories, 0);
  }, [mealPlan]);

  const generateMealPlan = () => {
    setIsGenerating(true);

    // Artificial delay for "AI" effect
    setTimeout(() => {
      const isVegOnly = selectedDiet.includes('veg') && !selectedDiet.includes('nonveg');
      const isHealthy = selectedDiet.includes('healthy');

      const filterItems = (items: MealItem[]) => {
        return items.filter(item => {
          if (isVegOnly && !item.isVeg) return false;
          if (isHealthy && item.calories > 600) return false;
          return true;
        });
      };

      const newPlan: MealPlan = {
        breakfast: [filterItems(mockDatabase.breakfast)[0]],
        lunch: [filterItems(mockDatabase.lunch)[0]],
        snacks: [filterItems(mockDatabase.snacks)[0]],
        dinner: [filterItems(mockDatabase.dinner)[0]],
      };

      setMealPlan(newPlan);
      setIsGenerating(false);
      // Ensure results are visible
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1500);
  };

  const handleOrderAll = () => {
    if (!mealPlan) return;
    Object.values(mealPlan).flat().forEach(item => {
      addToCart({
        menuItem: {
          id: item.id,
          name: item.name,
          description: `AI Recommended: ${item.portion}, ${item.calories} kcal`,
          price: item.price,
          image: '',
          isVeg: item.isVeg,
          category: 'meal',
        },
        quantity: 1,
        restaurantId: item.restaurant,
        restaurantName: item.restaurant,
      });
    });
    navigate('/cart');
  };

  return (
    <MobileLayout>
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-center gap-4 bg-white sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Meal Planner</h1>
          <p className="text-xs text-slate-500 font-medium">Personalized nutrition based on budget</p>
        </div>
      </header>

      <div className="px-5 pb-24 space-y-6">
        {/* Budget Selector */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Target Daily Budget</h3>
          </div>
          <Card className="p-6 border-none shadow-premium bg-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-400 text-sm font-medium">Daily Limit</span>
              <span className="text-3xl font-black text-primary">₹{budget[0]}</span>
            </div>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={100}
              max={1500}
              step={50}
              className="py-4"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
              <span>₹100</span>
              <span>₹1500</span>
            </div>
          </Card>
        </section>

        {/* Preferences */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-success" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Dietary Style</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {dietaryOptions.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => toggleDiet(id)}
                className={cn(
                  'relative group flex flex-col items-center justify-center p-4 rounded-[24px] border-2 transition-all duration-300',
                  selectedDiet.includes(id)
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110',
                  selectedDiet.includes(id) ? 'bg-primary text-white' : 'bg-slate-50 ' + color
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  'text-xs font-bold transition-colors',
                  selectedDiet.includes(id) ? 'text-primary' : 'text-slate-500'
                )}>{label}</span>
                {selectedDiet.includes(id) && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Generate Action */}
        <Button
          size="xl"
          variant="gradient"
          className="w-full h-16 rounded-[24px] shadow-xl shadow-primary/20"
          onClick={generateMealPlan}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="font-bold">Analyzing Nutrition...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-white/20" />
              <span className="font-bold text-lg">Generate Full Daily Plan</span>
            </div>
          )}
        </Button>

        {/* Results Section */}
        {mealPlan && !isGenerating && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Plan Summary Card */}
            <Card className="p-5 border-none bg-slate-900 text-white rounded-[28px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1">Plan Overview</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="text-sm font-bold">{totalPlanCalories} kcal</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-sm font-bold">₹{totalPlanPrice} Total</span>
                  </div>
                </div>
                <Button
                  onClick={handleOrderAll}
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold rounded-xl h-11 px-6"
                >
                  Order All
                </Button>
              </div>
            </Card>

            {/* Detailed Meal List */}
            <div className="space-y-4">
              {mealCategories.map(({ id, label, icon: Icon, color, bgColor }) => {
                const items = mealPlan[id as keyof MealPlan];
                const isExpanded = expandedSections.includes(id);

                return (
                  <div key={id} className="space-y-3">
                    <button
                      onClick={() => toggleSection(id)}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor)}>
                          <Icon className={cn("w-4 h-4", color)} />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight">{label}</h3>
                        <Badge variant="outline" className="bg-white border-slate-100 text-[10px] h-5">
                          {items.length} Item
                        </Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {items.map(item => {
                          const qty = getItemQuantity(item.id);
                          return (
                            <Card key={item.id} className="p-4 border-none shadow-sm rounded-[24px] bg-white group hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                  {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="font-bold text-slate-900 truncate pr-2">{item.name}</h4>
                                    <span className="font-black text-primary text-sm whitespace-nowrap">₹{item.price}</span>
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-2 truncate">
                                    {item.restaurant}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-lg">
                                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">{item.calories} Cal</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg">
                                      <UtensilsCrossed className="w-3 h-3 text-blue-500" />
                                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{item.portion}</span>
                                    </div>
                                    {item.isVeg ? (
                                      <Badge variant="veg" className="h-4 px-1.5 text-[9px] uppercase">Veg</Badge>
                                    ) : (
                                      <Badge variant="nonveg" className="h-4 px-1.5 text-[9px] uppercase">Non-Veg</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <button
                                      onClick={() => handleOrderIndividually(item)}
                                      className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline"
                                    >
                                      Order Individually
                                    </button>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
                                      {qty > 0 ? (
                                        <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                                          <button
                                            onClick={() => updateItemQuantity(item, -1)}
                                            className="px-2 py-1 text-primary hover:bg-slate-50 font-bold"
                                          >
                                            −
                                          </button>
                                          <span className="px-2 text-xs font-black min-w-[20px] text-center">{qty}</span>
                                          <button
                                            onClick={() => updateItemQuantity(item, 1)}
                                            className="px-2 py-1 text-primary hover:bg-slate-50 font-bold"
                                          >
                                            +
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => updateItemQuantity(item, 1)}
                                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                        >
                                          <span className="text-xl font-bold">+</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Information Footer */}
            <div className="p-5 bg-blue-50 rounded-[28px] border-2 border-blue-100/50">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm mb-1">AI Nutrition Tip</h4>
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    This plan covers approximately 85% of your daily recommended intake while staying within your budget. Consider adding a fresh fruit as a morning snack for fiber.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Floating Cart Bar - Swiggy Style */}
        {cart.length > 0 && (
          <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    {cart.length} Item{cart.length > 1 ? 's' : ''} added
                  </p>
                  <p className="text-lg font-black tracking-tight leading-none mt-0.5">₹{cartTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black uppercase text-xs tracking-widest">View Cart</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </div>
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

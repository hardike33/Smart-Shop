import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Cookie,
  User,
  Utensils,
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { CartItem } from '@/types/app';

const dietaryOptions = [
  { id: 'veg', label: 'Veg', icon: Leaf, color: 'text-success' },
  { id: 'nonveg', label: 'Non-Veg', icon: Drumstick, color: 'text-destructive' },
  { id: 'healthy', label: 'Healthy', icon: Heart, color: 'text-accent' },
  { id: 'vegan', label: 'Vegan', icon: Leaf, color: 'text-success' },
  { id: 'fever', label: 'Fever', icon: Stethoscope, color: 'text-blue-500' },
];

interface MealItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  isVeg: boolean;
  isVegan: boolean;
  isHealthy: boolean;
  isFeverFriendly: boolean;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
    { id: 'b1', name: 'Masala Dosa', restaurant: 'South Express', price: 80, isVeg: true, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 350, protein: 8, carbs: 55, fat: 12, portion: '1 Plate', emoji: '🥞' },
    { id: 'b2', name: 'Idli Sambar', restaurant: 'South Express', price: 60, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 220, protein: 7, carbs: 45, fat: 2, portion: '2 Pcs', emoji: '⚪' },
    { id: 'b3', name: 'Poha', restaurant: 'Sharma Kitchen', price: 50, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 280, protein: 6, carbs: 50, fat: 6, portion: '1 Bowl', emoji: '🥣' },
    { id: 'b4', name: 'Omelette Toast', restaurant: 'Mama\'s Home Food', price: 90, isVeg: false, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 420, protein: 18, carbs: 32, fat: 24, portion: '2 Eggs', emoji: '🍳' },
    { id: 'b5', name: 'Fruit Platter', restaurant: 'Fresh Bites Cafe', price: 120, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 150, protein: 2, carbs: 35, fat: 1, portion: 'Large', emoji: '🍎' },
    { id: 'b6', name: 'Paneer Paratha', restaurant: 'Sharma Kitchen', price: 100, isVeg: true, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 450, protein: 14, carbs: 58, fat: 18, portion: '1 Pc', emoji: '🫓' },
    { id: 'b7', name: 'Oats & Berries', restaurant: 'Fresh Bites Cafe', price: 140, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 310, protein: 10, carbs: 48, fat: 8, portion: '1 Bowl', emoji: '🥣' },
    { id: 'f_b1', name: 'Ragi Porridge', restaurant: 'Healthy Hub', price: 40, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 180, protein: 4, carbs: 38, fat: 2, portion: '1 Bowl', emoji: '🥣' },
  ],
  lunch: [
    { id: 'l1', name: 'Veg Thali', restaurant: 'Sharma Kitchen', price: 150, isVeg: true, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 850, protein: 22, carbs: 110, fat: 35, portion: 'Full Thali', emoji: '🍛' },
    { id: 'l2', name: 'Chicken Biryani', restaurant: 'Biryani House', price: 220, isVeg: false, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 950, protein: 35, carbs: 120, fat: 38, portion: 'Regular', emoji: '🍚' },
    { id: 'l3', name: 'Dal Khichdi', restaurant: 'Mama\'s Home Food', price: 120, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 450, protein: 14, carbs: 68, fat: 12, portion: '1 Bowl', emoji: '🥘' },
    { id: 'l4', name: 'Grilled Veg Salad', restaurant: 'Fresh Bites Cafe', price: 160, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 320, protein: 8, carbs: 38, fat: 15, portion: 'Large', emoji: '🥗' },
    { id: 'l5', name: 'Paneer Butter Masala', restaurant: 'Sharma Kitchen', price: 210, isVeg: true, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 720, protein: 18, carbs: 24, fat: 58, portion: 'Full', emoji: '🥘' },
    { id: 'l6', name: 'Fish Curry Rice', restaurant: 'Coastal Delights', price: 280, isVeg: false, isVegan: false, isHealthy: true, isFeverFriendly: false, calories: 650, protein: 42, carbs: 75, fat: 18, portion: 'Meal', emoji: '🍛' },
    { id: 'l7', name: 'Quinoa Bowl', restaurant: 'Healthy Hub', price: 240, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 480, protein: 15, carbs: 65, fat: 18, portion: 'Regular', emoji: '🥣' },
    { id: 'f_l1', name: 'Moong Dal Khichdi', restaurant: 'Mama\'s Home Food', price: 90, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 320, protein: 12, carbs: 55, fat: 6, portion: '1 Bowl', emoji: '🥘' },
  ],
  snacks: [
    { id: 's1', name: 'Veg Sandwich', restaurant: 'Fresh Bites Cafe', price: 70, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: false, calories: 240, protein: 6, carbs: 38, fat: 8, portion: '2 Slices', emoji: '🥪' },
    { id: 's2', name: 'Fruit Bowl', restaurant: 'Fresh Bites Cafe', price: 110, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 150, protein: 2, carbs: 35, fat: 1, portion: 'Small', emoji: '🍎' },
    { id: 's3', name: 'Samosa (2pcs)', restaurant: 'Sharma Kitchen', price: 40, isVeg: true, isVegan: true, isHealthy: false, isFeverFriendly: false, calories: 380, protein: 8, carbs: 48, fat: 18, portion: '2 Pcs', emoji: '🥟' },
    { id: 's4', name: 'Chicken Wrap', restaurant: 'Fresh Bites Cafe', price: 130, isVeg: false, isVegan: false, isHealthy: true, isFeverFriendly: false, calories: 420, protein: 28, carbs: 32, fat: 18, portion: '1 Wrap', emoji: '🌯' },
    { id: 's5', name: 'Roasted Almonds', restaurant: 'NutriShop', price: 150, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 180, protein: 8, carbs: 6, fat: 14, portion: 'Handful', emoji: '🥜' },
    { id: 's6', name: 'Paneer Tikka Roll', restaurant: 'Sharma Kitchen', price: 140, isVeg: true, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 480, protein: 16, carbs: 42, fat: 28, portion: '1 Roll', emoji: '🌯' },
    { id: 'f_s1', name: 'Herbal Tea + Banana', restaurant: 'Fresh Bites Cafe', price: 60, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 120, protein: 1, carbs: 28, fat: 0, portion: 'Combo', emoji: '🍵' },
  ],
  dinner: [
    { id: 'd1', name: 'Paneer Tikka', restaurant: 'Sharma Kitchen', price: 180, isVeg: true, isVegan: false, isHealthy: true, isFeverFriendly: false, calories: 480, protein: 22, carbs: 12, fat: 38, portion: '6 Pcs', emoji: '🍢' },
    { id: 'd2', name: 'Clear Soup & Momos', restaurant: 'Quick Eats', price: 140, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 350, protein: 10, carbs: 55, fat: 8, portion: '6 Pcs', emoji: '🥟' },
    { id: 'd3', name: 'Grilled Chicken', restaurant: 'Biryani House', price: 250, isVeg: false, isVegan: false, isHealthy: true, isFeverFriendly: false, calories: 550, protein: 48, carbs: 10, fat: 32, portion: '2 Pcs', emoji: '🍗' },
    { id: 'd4', name: 'Roti & Dal Tadka', restaurant: 'Sharma Kitchen', price: 110, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 520, protein: 18, carbs: 75, fat: 15, portion: '2 Roti', emoji: '🫓' },
    { id: 'd5', name: 'Butter Chicken Rice', restaurant: 'Biryani House', price: 290, isVeg: false, isVegan: false, isHealthy: false, isFeverFriendly: false, calories: 880, protein: 45, carbs: 85, fat: 42, portion: 'Full', emoji: '🍛' },
    { id: 'd6', name: 'Stuffed Bell Peppers', restaurant: 'Healthy Hub', price: 220, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 380, protein: 12, carbs: 45, fat: 15, portion: '2 Pcs', emoji: '🫑' },
    { id: 'f_d1', name: 'Vegetable Soup + Soft Roti', restaurant: 'Healthy Hub', price: 100, isVeg: true, isVegan: true, isHealthy: true, isFeverFriendly: true, calories: 280, protein: 8, carbs: 45, fat: 6, portion: 'Combo', emoji: '🥘' },
  ],
};

export default function MealPlanner() {
  const navigate = useNavigate();
  const { dailyBudget, addToCart, cart, updateQuantity, removeFromCart, cartTotal } = useApp();
  const [budget, setBudget] = useState([dailyBudget]);
  const [selectedDiet, setSelectedDiet] = useState<string>('veg');

  // New User Details State
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<string>('male');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [healthGoal, setHealthGoal] = useState<string>('maintain');

  const [isGenerating, setIsGenerating] = useState(false);

  const bmi = useMemo(() => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }, [weight, height]);

  const dailyCalorieNeed = useMemo(() => {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const activityMultipliers: Record<string, number> = {
      low: 1.2,
      moderate: 1.55,
      high: 1.9,
    };

    let tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    const goalAdjustments: Record<string, number> = {
      loss: -500,
      gain: 500,
      maintain: 0,
      muscle: 300,
    };

    return Math.round(tdee + (goalAdjustments[healthGoal] || 0));
  }, [weight, height, age, gender, activityLevel, healthGoal]);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
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
    setSelectedDiet(id);
    // Trigger re-generation when dietary style changes
    if (mealPlan) {
      setTimeout(() => generateMealPlan(), 100);
    }
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

  const totalPlanMacros = useMemo(() => {
    if (!mealPlan) return { protein: 0, carbs: 0, fat: 0 };
    return Object.values(mealPlan).flat().reduce((acc, item) => ({
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
    }), { protein: 0, carbs: 0, fat: 0 });
  }, [mealPlan]);

  const aiInsight = useMemo(() => {
    if (selectedDiet === 'fever') {
      return {
        tip: "🤒 Fever Recovery Tip: Focus on hydration and light, warm meals. Avoid oily and spicy foods to help your body recover faster.",
        status: 'info' as const
      };
    }

    const diff = totalPlanCalories - dailyCalorieNeed;
    const absDiff = Math.abs(diff);

    let tip = "";
    let status: 'success' | 'warning' | 'info' = 'info';

    if (absDiff < 100) {
      tip = `Spot on! This plan is perfectly aligned with your ${dailyCalorieNeed} kcal target.`;
      status = 'success';
    } else if (diff < 0) {
      tip = `This plan is ${Math.abs(diff)} kcal below your target. Great for faster weight loss, but ensure you don't feel fatigued.`;
      status = 'info';
    } else {
      tip = `This plan exceeds your target by ${diff} kcal. Consider a longer walk or light workout today to stay on track for ${healthGoal.replace('-', ' ')}.`;
      status = 'warning';
    }

    // Add Macro feedback
    if (healthGoal === 'muscle' && totalPlanMacros.protein < 100) {
      tip += " 💡 Tip: Try swapping a snack for a higher protein option to hit your muscle gain goals.";
    } else if (healthGoal === 'loss' && totalPlanMacros.fat > 60) {
      tip += " 💡 Tip: Your fat intake is a bit high for weight loss. Opt for more grilled items.";
    }

    return { tip, status };
  }, [mealPlan, totalPlanCalories, dailyCalorieNeed, healthGoal, totalPlanMacros, selectedDiet]);

  const generateMealPlan = () => {
    setIsGenerating(true);
    setHasGenerated(true);

    setTimeout(() => {
      const targetBudget = budget[0];
      const dietaryStyle = selectedDiet;

      const filterItems = (items: MealItem[]) => {
        return items.filter(item => {
          // Strict Filtering Rules
          if (dietaryStyle === 'veg' && !item.isVeg) return false;
          if (dietaryStyle === 'vegan' && !item.isVegan) return false;
          if (dietaryStyle === 'healthy' && !item.isHealthy) return false;
          if (dietaryStyle === 'fever' && !item.isFeverFriendly) return false;
          // Non-veg can include veg items
          if (dietaryStyle === 'nonveg') return true;

          return true;
        });
      };

      // Helper to shuffle array for "AI" variety
      const shuffle = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

      // Logic to find a plan within budget - Shuffle for dynamic results
      const bItems = shuffle(filterItems(mockDatabase.breakfast));
      const lItems = shuffle(filterItems(mockDatabase.lunch));
      const sItems = shuffle(filterItems(mockDatabase.snacks));
      const dItems = shuffle(filterItems(mockDatabase.dinner));

      let currentTotal = 0;
      const newPlan: MealPlan = {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: []
      };

      // Smart Budget Selection Strategy: Ensures all 4 categories have a meal
      const getCategoryTarget = (cat: keyof MealPlan) => {
        const ratios = { breakfast: 0.22, lunch: 0.33, snacks: 0.12, dinner: 0.33 };
        return targetBudget * ratios[cat];
      };

      const categories: (keyof MealPlan)[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
      const poolsMap = { breakfast: bItems, lunch: lItems, snacks: sItems, dinner: dItems };

      // Step 1: Force fill each category
      for (const cat of categories) {
        const pool = poolsMap[cat];
        if (pool.length === 0) continue;
        const target = getCategoryTarget(cat);
        const pick = pool.find(item => item.price <= target + 30) || [...pool].sort((a, b) => a.price - b.price)[0];
        if (pick) {
          newPlan[cat] = [pick];
          currentTotal += pick.price;
        }
      }

      // Step 2: Budget correction if over budget
      if (currentTotal > targetBudget) {
        for (const cat of categories) {
          const current = newPlan[cat][0];
          if (!current) continue;
          const cheaper = poolsMap[cat].filter(i => i.price < current.price).sort((a, b) => a.price - b.price)[0];
          if (cheaper) {
            currentTotal -= (current.price - cheaper.price);
            newPlan[cat] = [cheaper];
            if (currentTotal <= targetBudget) break;
          }
        }
      }

      // Final completeness check
      const isPlanComplete = categories.every(cat => newPlan[cat].length > 0);
      if (currentTotal > targetBudget || !isPlanComplete) {
        setMealPlan(null);
        setIsGenerating(false);
        return;
      }

      const targetCals = dailyCalorieNeed;

      const optimizeForCalories = () => {
        let bestPlan = { ...newPlan };
        let currentPlanCals = Object.values(bestPlan).flat().reduce((sum, item) => sum + item.calories, 0);
        let currentPlanPrice = currentTotal;

        const pools = {
          lunch: lItems,
          dinner: dItems,
          breakfast: bItems,
          snacks: sItems
        };

        // Try to replace items with ones that get us closer to target calories without breaking budget
        for (const cat of ['lunch', 'dinner', 'breakfast', 'snacks'] as const) {
          const pool = pools[cat];
          const current = bestPlan[cat][0];
          if (!current) continue;

          for (const candidate of pool) {
            const priceDiff = candidate.price - current.price;
            if (priceDiff <= (targetBudget - currentPlanPrice)) {
              const newCals = currentPlanCals - current.calories + candidate.calories;
              // If this candidate gets us closer to calorie target (or maintains it if it's already perfect)
              if (Math.abs(targetCals - newCals) < Math.abs(targetCals - currentPlanCals)) {
                bestPlan[cat] = [candidate];
                currentPlanCals = newCals;
                currentPlanPrice += priceDiff;
              }
            }
          }
        }
        return bestPlan;
      };

      setMealPlan(optimizeForCalories());
      setIsGenerating(false);

      // If no items found at all
      if (currentTotal === 0) {
        setMealPlan(null);
        // Show a message or handling could go here
      }

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
        {/* Personal Details */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Body Stats</h3>
          </div>
          <Card className="p-5 border-none shadow-sm bg-white space-y-4 rounded-3xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={18}
                  max={80}
                  className="rounded-xl h-11 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  defaultValue={gender}
                  onValueChange={setGender}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="text-xs font-bold">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-xs font-bold">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="rounded-xl h-11 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="rounded-xl h-11 border-slate-100"
                />
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-50 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              <span>BMI: <span className="text-foreground">{bmi.toFixed(1)}</span></span>
              <Badge variant="outline" className="bg-primary/5 text-primary border-none">
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
              </Badge>
            </div>
          </Card>
        </section>

        {/* Lifestyle & Goals */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Goals & Activity</h3>
          </div>
          <Card className="p-5 border-none shadow-sm bg-white space-y-4 rounded-3xl">
            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="rounded-xl h-11 border-slate-100">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Sedentary)</SelectItem>
                  <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="high">High (Athlete / Heavy workout)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Health Goal</Label>
              <div className="grid grid-cols-2 gap-2">
                {['maintain', 'loss', 'gain', 'muscle'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setHealthGoal(goal)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                      healthGoal === goal
                        ? "border-primary bg-primary/5 text-primary shadow-inner"
                        : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-100"
                    )}
                  >
                    {goal.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex flex-col items-center justify-center border-t border-slate-50">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">Target Daily Intake</span>
              <span className="text-3xl font-black text-slate-900 leading-none">{dailyCalorieNeed} <span className="text-sm font-bold text-muted-foreground">kcal</span></span>
            </div>
          </Card>
        </section>
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
                  selectedDiet === id
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110',
                  selectedDiet === id ? 'bg-primary text-white' : 'bg-slate-50 ' + color
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  'text-xs font-bold transition-colors',
                  selectedDiet === id ? 'text-primary' : 'text-slate-500'
                )}>{label}</span>
                {selectedDiet === id && (
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

        {/* Empty State / Error State */}
        {!mealPlan && !isGenerating && hasGenerated && (
          <Card className="p-8 border-dashed border-2 bg-slate-50 flex flex-col items-center text-center space-y-3 rounded-[32px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedDiet === 'fever' ? 'Fever plan unavailable' : 'Budget too low'}
              </h3>
              <p className="text-sm text-slate-500 max-w-[240px]">
                {selectedDiet === 'fever'
                  ? `Your budget of ₹${budget[0]} is too low to generate a full fever recovery meal plan.`
                  : `Your budget of ₹${budget[0]} is too low for a full 4-meal plan.`}
                Try increasing the budget or adjusting dietary filters.
              </p>
            </div>
          </Card>
        )}

        {!hasGenerated && !isGenerating && (
          <Card className="p-10 border-none bg-slate-50 flex flex-col items-center text-center space-y-4 rounded-[40px]">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-premium rotate-3 group-hover:rotate-0 transition-transform">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Ready for a Plan?</h3>
              <p className="text-sm text-slate-500 font-medium max-w-[200px]">Adjust your stats above and generate your first AI meal plan.</p>
            </div>
          </Card>
        )}

        {mealPlan && totalPlanPrice > 0 && !isGenerating && (
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
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex flex-col">
                      <span className="text-white">{totalPlanMacros.protein}g</span>
                      <span>Protein</span>
                    </span>
                    <span className="flex flex-col">
                      <span className="text-white">{totalPlanMacros.carbs}g</span>
                      <span>Carbs</span>
                    </span>
                    <span className="flex flex-col">
                      <span className="text-white">{totalPlanMacros.fat}g</span>
                      <span>Fat</span>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleOrderAll}
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold rounded-xl h-11 px-6 shadow-lg shadow-white/10"
                >
                  Order All
                </Button>
              </div>
            </Card>

            {/* AI Insight Section */}
            {aiInsight && (
              <Card className={cn(
                "p-4 border-none rounded-2xl flex gap-3",
                aiInsight.status === 'success' ? 'bg-success/10 text-success' :
                  aiInsight.status === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
              )}>
                <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">AI Nutrition Insight</h4>
                  <p className="text-sm font-medium leading-relaxed">{aiInsight.tip}</p>
                </div>
              </Card>
            )}

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
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400 py-1">
                                      <span>P: <span className="text-slate-700">{item.protein}g</span></span>
                                      <span>C: <span className="text-slate-700">{item.carbs}g</span></span>
                                      <span>F: <span className="text-slate-700">{item.fat}g</span></span>
                                    </div>
                                    {item.isVeg ? (
                                      <Badge variant="veg" className="h-4 px-1.5 text-[9px] uppercase">Veg</Badge>
                                    ) : (
                                      <Badge variant="nonveg" className="h-4 px-1.5 text-[9px] uppercase">Non-Veg</Badge>
                                    )}
                                    {item.isVegan && (
                                      <Badge className="h-4 px-1.5 text-[9px] uppercase bg-green-100 text-green-700 border-none">Vegan</Badge>
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
                    {aiInsight?.tip || "This plan covers your daily nutritional needs while staying within your selected budget."}
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

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Wallet, Minus, Plus } from 'lucide-react';

export function BudgetCard() {
  const { dailyBudget, setDailyBudget, cartTotal } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const remaining = dailyBudget - cartTotal;
  const percentUsed = Math.min((cartTotal / dailyBudget) * 100, 100);

  const adjustBudget = (amount: number) => {
    setDailyBudget(Math.max(50, dailyBudget + amount));
  };

  return (
    <Card className="bg-gradient-hero text-white border-0 overflow-hidden shadow-elevated rounded-[32px] relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-500" />
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Today's Budget</p>
              <p className="text-3xl font-black tracking-tight">₹{dailyBudget}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                onClick={() => adjustBudget(-50)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                onClick={() => adjustBudget(50)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground"
                onClick={() => setIsEditing(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground rounded-full transition-all duration-500"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-90">Spent: ₹{cartTotal}</span>
            <span className="font-semibold">
              {remaining >= 0 ? `₹${remaining} left` : `₹${Math.abs(remaining)} over`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

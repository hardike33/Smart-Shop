import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Wallet, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export default function BudgetSettings() {
    const navigate = useNavigate();
    const { dailyBudget, setDailyBudget } = useApp();
    const [localBudget, setLocalBudget] = useState(dailyBudget);
    const spent = 145; // Mock spent value

    const handleSave = () => {
        setDailyBudget(localBudget);
        navigate('/profile');
    };

    const progress = (spent / dailyBudget) * 100;
    const isOver = spent > dailyBudget;

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 border-b sticky top-0 bg-background z-10">
                <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Budget Settings</h1>
            </header>

            <div className="p-5 space-y-6">
                <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <h2 className="font-bold flex items-center gap-2">
                                Daily Limit <Info className="w-4 h-4 text-muted-foreground" />
                            </h2>
                            <p className="text-sm text-muted-foreground">Adjust your daily spending limit</p>
                        </div>
                        <span className="text-2xl font-black text-primary">₹{localBudget}</span>
                    </div>

                    <Slider
                        value={[localBudget]}
                        max={2000}
                        step={50}
                        onValueChange={(val) => setLocalBudget(val[0])}
                        className="py-4"
                    />

                    <div className="flex justify-between text-xs text-muted-foreground px-1 font-medium">
                        <span>₹100</span>
                        <span>₹500</span>
                        <span>₹1000</span>
                        <span>₹2000</span>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <h2 className="font-bold">Spending Overview</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Spent today</span>
                            <span className="font-bold">₹{spent} / ₹{dailyBudget}</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className={`h-2 ${isOver ? 'bg-destructive/20' : ''}`} />
                    </div>

                    {isOver && (
                        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                            <p className="text-xs text-destructive-foreground font-medium leading-tight">
                                You have exceeded your daily budget limit! We'll alert you on your next checkout.
                            </p>
                        </div>
                    )}

                    {!isOver && (
                        <div className="bg-primary/10 p-4 rounded-xl flex gap-3">
                            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                            <p className="text-xs text-primary-foreground font-medium leading-tight">
                                Remaining: ₹{dailyBudget - spent}. Stick to your budget to save ₹1.2k this month!
                            </p>
                        </div>
                    )}
                </Card>

                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full h-14 text-lg font-bold shadow-lg">
                        Update Budget
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}

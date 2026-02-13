import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Bell, Tag, MessageSquare, Volume2, Vibrate } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationSettings() {
    const navigate = useNavigate();
    const { user, updateNotificationSettings } = useApp();

    const settings = user?.notificationSettings || {
        orderUpdates: true,
        offers: true,
        reminders: true,
        sound: true,
        vibration: true
    };

    const handleToggle = (key: keyof typeof settings) => {
        updateNotificationSettings({
            ...settings,
            [key]: !settings[key]
        });
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 border-b sticky top-0 bg-background z-10">
                <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Notifications</h1>
            </header>

            <div className="p-5 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">Push Notifications</h2>
                    <Card className="divide-y">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <Label className="text-base font-bold">Order Updates</Label>
                                    <p className="text-xs text-muted-foreground">Tracking and delivery alerts</p>
                                </div>
                            </div>
                            <Switch checked={settings.orderUpdates} onCheckedChange={() => handleToggle('orderUpdates')} />
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Tag className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <Label className="text-base font-bold">Offers & Promos</Label>
                                    <p className="text-xs text-muted-foreground">Best discounts and daily deals</p>
                                </div>
                            </div>
                            <Switch checked={settings.offers} onCheckedChange={() => handleToggle('offers')} />
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <Label className="text-base font-bold">Reminders</Label>
                                    <p className="text-xs text-muted-foreground">Meal plan and cart reminders</p>
                                </div>
                            </div>
                            <Switch checked={settings.reminders} onCheckedChange={() => handleToggle('reminders')} />
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">Preferences</h2>
                    <Card className="divide-y">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <Label className="text-base font-bold">Sound</Label>
                            </div>
                            <Switch checked={settings.sound} onCheckedChange={() => handleToggle('sound')} />
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    <Vibrate className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <Label className="text-base font-bold">Vibration</Label>
                            </div>
                            <Switch checked={settings.vibration} onCheckedChange={() => handleToggle('vibration')} />
                        </div>
                    </Card>
                </div>
            </div>
        </MobileLayout>
    );
}

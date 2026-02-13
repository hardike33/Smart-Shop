import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Wallet,
  Crown,
} from 'lucide-react';

const menuItems = [
  { icon: MapPin, label: 'Saved Addresses', path: '/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/payments' },
  { icon: Crown, label: 'Subscription Plans', path: '/subscriptions' },
  { icon: Wallet, label: 'Budget Settings', path: '/budget' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  { icon: Settings, label: 'App Settings', path: '/settings' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, setIsLoggedIn, setUser, dailyBudget } = useApp();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('app_user');
    navigate('/login');
  };

  return (
    <MobileLayout>
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black">Profile</h1>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" onClick={() => navigate('/settings')} />
        </div>
      </header>

      <div className="px-5 space-y-6 pb-20">
        {/* User Card */}
        <Card className="p-5 shadow-lg border-none bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-800">{user?.name || 'Guest User'}</h3>
              <p className="text-xs font-medium text-muted-foreground">{user?.email || 'guest@example.com'}</p>
              <p className="text-xs font-medium text-muted-foreground">{user?.phone || '+91 00000 00000'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/edit-profile')} className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold px-4 h-9">
              Edit
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-none shadow-sm bg-blue-50/50">
            <p className="text-xl font-black text-blue-600">₹{dailyBudget}</p>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Daily Budget</p>
          </Card>
          <Card className="p-4 text-center border-none shadow-sm bg-orange-50/50">
            <p className="text-xl font-black text-orange-600">24</p>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Orders</p>
          </Card>
          <Card className="p-4 text-center border-none shadow-sm bg-emerald-50/50">
            <p className="text-xl font-black text-emerald-600">₹1.2k</p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Saved</p>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">My Settings</h2>
          <Card className="divide-y divide-border/50 border-none shadow-xl overflow-hidden">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full p-4 flex items-center gap-4 hover:bg-orange-50/30 active:bg-orange-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="flex-1 text-left font-bold text-gray-700 transition-colors group-hover:text-black">{label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="lg"
          className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/5 font-bold h-14"
          onClick={() => navigate('/settings')}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Settings & Log Out
        </Button>
      </div>
    </MobileLayout>
  );
}

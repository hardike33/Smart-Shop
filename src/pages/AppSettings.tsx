import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Moon, Sun, Globe, Shield, LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function AppSettings() {
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = useApp();
    const [isThemeDark, setIsThemeDark] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('app_user');
        navigate('/login');
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 border-b sticky top-0 bg-background z-10">
                <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">App Settings</h1>
            </header>

            <div className="p-5 space-y-8">
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">Appearance</h2>
                    <Card className="divide-y overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    {isThemeDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-orange-500" />}
                                </div>
                                <span className="font-bold">Dark Mode</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4"
                                onClick={() => setIsThemeDark(!isThemeDark)}
                            >
                                {isThemeDark ? 'On' : 'Off'}
                            </Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-bold">Language</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">English</span>
                                <Badge variant="outline" className="font-normal">Change</Badge>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">Privacy & Data</h2>
                    <Card className="divide-y overflow-hidden">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold">Privacy Policy</p>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Read about how we use your data</p>
                                </div>
                            </div>
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left text-destructive">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="font-bold">Delete Account</p>
                                    <p className="text-[10px] opacity-70 leading-tight">Permanently remove all your data</p>
                                </div>
                            </div>
                        </button>
                    </Card>
                </section>

                <div className="pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-destructive text-destructive hover:bg-destructive/10 h-14 text-lg font-bold"
                        onClick={() => setIsLogoutDialogOpen(true)}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                    </Button>
                </div>
            </div>

            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <AlertDialogContent className="max-w-[85vw] rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will need to login again to access your orders and saved addresses.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2">
                        <AlertDialogCancel className="flex-1 mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleLogout}>
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </MobileLayout>
    );
}

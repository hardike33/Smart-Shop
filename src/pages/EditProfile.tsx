import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useState } from 'react';

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, setUser } = useApp();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSave = () => {
        if (user) {
            setUser({ ...user, ...formData });
            navigate('/profile');
        }
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
            </header>

            <div className="px-5 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-xl">
                            <User className="w-16 h-16 text-primary" />
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Tap to change profile picture</p>
                </div>

                <Card className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                            className="h-12 text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            className="h-12 text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            className="h-12 text-base"
                        />
                    </div>
                </Card>

                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20">
                        Save Changes
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}

import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, MapPin, MoreVertical, Plus, Trash2, Edit2, Home, Briefcase, Map } from 'lucide-react';
import { useState } from 'react';
import { Address } from '@/types/app';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SavedAddresses() {
    const navigate = useNavigate();
    const { user, addAddress, updateAddress, deleteAddress } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        type: 'Home',
        label: '',
        address: '',
        isDefault: false,
    });

    const handleOpenAdd = () => {
        setEditingAddress(null);
        setFormData({ type: 'Home', label: '', address: '', isDefault: false });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData(address);
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (editingAddress) {
            updateAddress({ ...editingAddress, ...formData } as Address);
        } else {
            addAddress({
                ...formData,
                id: Math.random().toString(36).substr(2, 9),
            } as Address);
        }
        setIsDialogOpen(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Home': return <Home className="w-5 h-5" />;
            case 'Work': return <Briefcase className="w-5 h-5" />;
            default: return <MapPin className="w-5 h-5" />;
        }
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Saved Addresses</h1>
                </div>
                <Button size="sm" onClick={handleOpenAdd} className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Plus className="w-4 h-4 mr-1" /> Add New
                </Button>
            </header>

            <div className="p-5 space-y-4">
                {user?.addresses.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Map className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No saved addresses yet</p>
                    </div>
                ) : (
                    user?.addresses.map((address) => (
                        <Card key={address.id} className={`p-4 relative transition-all border-l-4 ${address.isDefault ? 'border-l-primary' : 'border-l-transparent'}`}>
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${address.type === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {getTypeIcon(address.type)}
                                </div>
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold truncate">{address.label || address.type}</h3>
                                        {address.isDefault && <Badge variant="secondary" className="text-[10px] h-4">Default</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{address.address}</p>
                                </div>
                            </div>

                            <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenEdit(address)}>
                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => deleteAddress(address.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[90vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex gap-2">
                            {(['Home', 'Work', 'Other'] as const).map((type) => (
                                <Button
                                    key={type}
                                    type="button"
                                    variant={formData.type === type ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setFormData({ ...formData, type })}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label>Label (Optional)</Label>
                            <Input
                                placeholder="e.g. My Home, Dad's Place"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Full Address</Label>
                            <textarea
                                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm"
                                placeholder="Door No, Street Name, Area, Landmark..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isDefault" className="text-sm font-normal">Set as default address</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave} className="w-full">
                            {editingAddress ? 'Update Address' : 'Save Address'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
}

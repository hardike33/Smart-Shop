import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CreditCard, Plus, Trash2, ShieldCheck, Wallet, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { PaymentMethod } from '@/types/app';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function PaymentMethods() {
    const navigate = useNavigate();
    const { user, deletePaymentMethod } = useApp();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setMethodToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (methodToDelete) {
            deletePaymentMethod(methodToDelete);
            setMethodToDelete(null);
            setIsConfirmOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'UPI': return <Smartphone className="w-5 h-5 text-purple-600" />;
            case 'Card': return <CreditCard className="w-5 h-5 text-blue-600" />;
            case 'Wallet': return <Wallet className="w-5 h-5 text-orange-600" />;
            default: return <Smartphone className="w-5 h-5" />;
        }
    };

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Payment Methods</h1>
                </div>
                <Button variant="ghost" size="icon">
                    <Plus className="w-5 h-5 text-primary" />
                </Button>
            </header>

            <div className="p-5 space-y-6">
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-xs text-green-800 leading-tight">Your payment details are secure with us. We use industry-standard encryption to protect your data.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Saved Methods</h2>
                    {user?.paymentMethods.length === 0 ? (
                        <p className="text-sm text-center py-4 text-muted-foreground">No saved payment methods</p>
                    ) : (
                        user?.paymentMethods.map((method) => (
                            <Card key={method.id} className="p-4 flex items-center gap-4 transition-all">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                                    {getIcon(method.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold truncate">{method.label}</h3>
                                        {method.isDefault && <Badge variant="secondary" className="text-[10px] h-4">Default</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{method.maskedNumber}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDeleteClick(method.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </Card>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Add New</h2>
                    <Card className="divide-y">
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 text-left transition-colors">
                            <Smartphone className="w-6 h-6 text-purple-600" />
                            <span className="font-medium">Add UPI ID</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 text-left transition-colors">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                            <span className="font-medium">Add Card</span>
                        </button>
                        <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 text-left transition-colors">
                            <Wallet className="w-6 h-6 text-orange-600" />
                            <span className="font-medium">Add Wallet</span>
                        </button>
                    </Card>
                </div>
            </div>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-[85vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center">
                        <p className="text-muted-foreground">Are you sure you want to remove this payment method? This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="flex-row gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
}

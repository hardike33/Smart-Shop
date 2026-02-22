import { ShoppingCart, Zap } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <ShoppingCart className="text-white w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Zap className="text-white w-2.5 h-2.5 fill-white" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    SmartShop
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70 leading-none">
                    Digital Market
                </span>
            </div>
        </div>
    );
}

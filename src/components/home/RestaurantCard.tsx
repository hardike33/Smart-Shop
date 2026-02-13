import React from 'react';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { RestaurantData } from '@/data/restaurants';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Star } from 'lucide-react';

interface RestaurantCardProps {
    restaurant: RestaurantData;
    onClick?: () => void;
    className?: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
    restaurant,
    onClick,
    className
}) => {
    return (
        <Card
            className={cn(
                "group overflow-hidden border-none shadow-card rounded-[32px] bg-white active:scale-[1.01] transition-all cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <div className="relative h-52 w-full">
                <OptimizedImage
                    src={restaurant.imageUrl || ''}
                    alt={restaurant.name}
                    containerClassName="h-full w-full rounded-t-[32px]"
                    className="group-hover:scale-105 transition-transform duration-700"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl flex items-center gap-1 z-20">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-slate-900 font-bold text-xs">{restaurant.rating}</span>
                </div>

                {/* Home-Made Badge */}
                {restaurant.isHomeMade && (
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg z-20">
                        <span className="text-white font-bold text-[10px] uppercase tracking-wider">Home-Made</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                            {restaurant.name}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-1 uppercase tracking-tight">
                            {restaurant.cuisines.join(' • ')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="text-[11px] font-bold text-slate-600">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-secondary" />
                        <span className="text-[11px] font-bold text-slate-600">{restaurant.distance}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

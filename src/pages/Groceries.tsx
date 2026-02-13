import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Star, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { GroceryShop, GroceryItem } from '@/data/groceryShops';
import { useApp } from '@/context/AppContext';

export default function Groceries() {
  const navigate = useNavigate();
  const { groceryShops } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase()
            ? <b key={i} className="text-primary">{part}</b>
            : part
        )}
      </span>
    );
  };

  const searchResults = groceryShops.map(shop => {
    const storeNameMatch = shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedItems = shop.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (storeNameMatch) {
      return { shop, matchedItems: shop.items, isStoreMatch: true };
    } else if (matchedItems.length > 0) {
      return { shop, matchedItems, isStoreMatch: false };
    }
    return null;
  }).filter(Boolean) as { shop: GroceryShop, matchedItems: GroceryItem[], isStoreMatch: boolean }[];

  return (
    <MobileLayout>
      {/* Header */}
      <header className="px-5 pt-6 pb-4 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-black">Groceries</h1>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Search for 'Tomato', 'Milk' or store name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-muted/50 border-none rounded-2xl text-base focus-visible:ring-primary/20 focus-visible:bg-white shadow-inner transition-all"
          />
        </div>
      </header>

      {/* Shop List */}
      <div className="px-5 pb-24 space-y-6 mt-2">
        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">No items found</h2>
            <p className="text-muted-foreground mt-1">Try searching for something else</p>
          </div>
        ) : (
          searchResults.map(({ shop, matchedItems }) => (
            <Card
              key={shop.id}
              className="p-5 cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-md rounded-3xl group animate-in fade-in slide-in-from-bottom-4"
              onClick={() => navigate(`/grocery/${shop.id}`)}
            >
              <div className="flex gap-4">
                {/* Shop Image/Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center text-4xl shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                    {shop.emoji}
                  </div>
                </div>

                {/* Shop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-lg text-gray-800 leading-tight">
                      {highlightText(shop.name, searchQuery)}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-lg shrink-0">
                      <span className="text-xs font-bold">{shop.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                    {shop.type}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-[11px] font-black uppercase text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{shop.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{shop.distance}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched/Available Items */}
              <div className="mt-5 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                  {searchQuery ? 'Matching Items' : 'Popular Items'}
                </p>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                  {matchedItems.slice(0, 6).map(item => (
                    <div key={item.id} className="flex-shrink-0 w-20 group/item">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover/item:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/5 rounded-2xl" />
                      </div>
                      <p className="text-[11px] text-center mt-2 font-bold text-gray-700 truncate line-clamp-2">
                        {highlightText(item.name, searchQuery)}
                      </p>
                      <p className="text-[10px] text-center font-black text-primary">₹{item.price}</p>
                    </div>
                  ))}
                  {matchedItems.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No specific items match</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </MobileLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
    containerClassName?: string;
}

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    fallbackSrc = DEFAULT_FOOD_IMAGE,
    className,
    containerClassName,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>('');

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false);
        setError(false);

        // Pre-validate image URL if it's a string
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
            };
            img.onerror = () => {
                setError(true);
                setCurrentSrc(fallbackSrc);
            };
        } else {
            setError(true);
            setCurrentSrc(fallbackSrc);
        }
    }, [src, fallbackSrc]);

    return (
        <div className={cn("relative overflow-hidden", containerClassName)}>
            {!isLoaded && !error && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
            )}

            <img
                src={currentSrc || src}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    isLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setCurrentSrc(fallbackSrc);
                }}
                loading="lazy"
                {...props}
            />

            {/* Subtle Gradient Overlay for readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-60" />
        </div>
    );
};

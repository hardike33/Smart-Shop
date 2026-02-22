import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/layout/Logo';
import { Wallet, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    icon: Wallet,
    title: 'Budget-Based Meals',
    description: 'Set your daily food budget and get personalized meal recommendations that fit your wallet.',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Calendar,
    title: 'Monthly Subscriptions',
    description: 'Subscribe to meal plans and never worry about cooking again. Fresh meals delivered daily.',
    color: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your deliveries in real-time with OTP verification for secure delivery.',
    color: 'bg-accent/10',
    iconColor: 'text-accent',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { setIsOnboarded } = useApp();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setIsOnboarded(true);
      navigate('/login');
    }
  };

  const handleSkip = () => {
    setIsOnboarded(true);
    navigate('/login');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Top Header with Logo */}
      <div className="p-6 flex items-center justify-between">
        <Logo className="scale-75 origin-left" />
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground font-bold">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon container with animation */}
        <div
          className={cn(
            'w-40 h-40 rounded-full flex items-center justify-center mb-12 animate-scale-in',
            slide.color
          )}
          key={currentSlide}
        >
          <Icon className={cn('w-20 h-20', slide.iconColor)} strokeWidth={1.5} />
        </div>

        {/* Text content */}
        <div className="text-center animate-fade-in" key={`text-${currentSlide}`}>
          <h1 className="text-3xl font-bold mb-4">{slide.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-8 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleNext}
          size="xl"
          variant="gradient"
          className="w-full"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

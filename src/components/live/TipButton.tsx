'use client';

import { Gift, Sparkles, Star, Heart, Crown } from 'lucide-react';

interface TipButtonProps {
  amount: number;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'small' | 'large';
}

export default function TipButton({ 
  amount, 
  onClick, 
  disabled = false,
  variant = 'default' 
}: TipButtonProps) {
  const getButtonSize = () => {
    switch (variant) {
      case 'small': return 'px-3 py-1.5 text-sm';
      case 'large': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2';
    }
  };

  const getIcon = () => {
    if (amount >= 500) return <Crown className="w-4 h-4" />;
    if (amount >= 100) return <Sparkles className="w-4 h-4" />;
    if (amount >= 50) return <Star className="w-4 h-4" />;
    if (amount >= 25) return <Heart className="w-4 h-4" />;
    return <Gift className="w-4 h-4" />;
  };

  const getGradient = () => {
    if (amount >= 500) return 'from-yellow-500 to-orange-500';
    if (amount >= 100) return 'from-purple-500 to-pink-500';
    if (amount >= 50) return 'from-blue-500 to-cyan-500';
    if (amount >= 25) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonSize()}
        bg-gradient-to-r ${getGradient()}
        text-white rounded-lg font-semibold
        hover:opacity-90 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
      `}
    >
      {getIcon()}
      <span>{amount} ALT</span>
    </button>
  );
}

"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
  direction: number;
  distance: number;
  duration: number;
  color: string;
}

export const AnimatedHeart = ({
  isLiked,
  onClick,
  size = "h-5 w-5",
}: {
  isLiked: boolean;
  onClick: () => void;
  size?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  const heartColors = [
    "fill-red-500 text-red-500",
    "fill-pink-500 text-pink-500", 
    "fill-rose-500 text-rose-500",
    "fill-red-400 text-red-400",
    "fill-pink-400 text-pink-400",
  ];

  const createFloatingHearts = () => {
    const hearts: FloatingHeart[] = [];
    const numHearts = 12;
    
    for (let i = 0; i < numHearts; i++) {
      const angle = (360 / numHearts) * i + Math.random() * 30 - 15;
      const distance = Math.random() * 80 + 60;
      const radian = (angle * Math.PI) / 180;
      
      hearts.push({
        id: Date.now() + i,
        x: Math.cos(radian) * distance,
        y: Math.sin(radian) * distance,
        scale: Math.random() * 0.8 + 0.6,
        rotation: Math.random() * 720 + 360,
        delay: i * 30 + Math.random() * 50,
        direction: angle,
        distance: distance,
        duration: Math.random() * 0.5 + 1.0,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      });
    }
    
    // Добавляем несколько дополнительных сердечек для хаоса
    for (let i = 0; i < 6; i++) {
      hearts.push({
        id: Date.now() + numHearts + i,
        x: (Math.random() - 0.5) * 200,
        y: -(Math.random() * 120 + 40),
        scale: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 1080,
        delay: Math.random() * 200,
        direction: Math.random() * 360,
        distance: Math.random() * 100 + 50,
        duration: Math.random() * 0.8 + 0.8,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      });
    }
    
    setFloatingHearts(hearts);

    setTimeout(() => {
      setFloatingHearts([]);
    }, 2000);
  };

  const handleClick = () => {
    setIsAnimating(true);
    if (!isLiked) {
      createFloatingHearts();
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    onClick();
  };

  return (
    <div className="relative overflow-visible">
      <Heart
        className={cn(
          size,
          "cursor-pointer transition-all duration-300 transform-gpu",
          isLiked
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400",
          isAnimating && "animate-pulse scale-150"
        )}
        onClick={handleClick}
        style={{
          filter: isLiked 
            ? "drop-shadow(0 0 12px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))" 
            : "none",
          transformOrigin: "center",
        }}
      />
      
      {floatingHearts.map((heart) => (
        <Heart
          key={heart.id}
          className={cn(
            "absolute top-1/2 left-1/2 pointer-events-none",
            heart.color,
            heart.scale > 0.7 ? "h-4 w-4" : "h-3 w-3"
          )}
          style={{
            animationDelay: `${heart.delay}ms`,
            animationDuration: `${heart.duration}s`,
            animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            animationFillMode: "forwards",
            animationName: "epicFloatAndExplode",
            transform: `translate(-50%, -50%) scale(0) rotate(0deg)`,
            "--end-x": `${heart.x}px`,
            "--end-y": `${heart.y}px`,
            "--rotation": `${heart.rotation}deg`,
            "--scale": heart.scale,
            filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))",
          } as any}
        />
      ))}
      
      <style jsx>{`
        @keyframes epicFloatAndExplode {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            transform: translate(-50%, -50%) scale(1.5) rotate(45deg);
            opacity: 1;
          }
          25% {
            transform: translate(-50%, -50%) scale(var(--scale)) rotate(90deg);
            opacity: 1;
          }
          80% {
            transform: translate(calc(-50% + var(--end-x) * 0.8), calc(-50% + var(--end-y) * 0.8)) scale(calc(var(--scale) * 0.7)) rotate(calc(var(--rotation) * 0.8));
            opacity: 0.8;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0) rotate(var(--rotation));
            opacity: 0;
          }
        }
        
        @keyframes epicPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
          }
          50% {
            transform: scale(1.3);
            filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.9)) drop-shadow(0 0 24px rgba(239, 68, 68, 0.5));
          }
        }
      `}</style>
    </div>
  );
}; 
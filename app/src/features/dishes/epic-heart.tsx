"use client";
import { useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
  type: "heart" | "sparkle" | "star";
  velocity: { x: number; y: number };
  gravity: number;
}

export const EpicHeart = ({
  isLiked,
  onClick,
  size = "h-5 w-5",
}: {
  isLiked: boolean;
  onClick: () => void;
  size?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleColors = [
    "fill-red-500 text-red-500",
    "fill-pink-500 text-pink-500", 
    "fill-rose-500 text-rose-500",
    "fill-red-400 text-red-400",
    "fill-pink-400 text-pink-400",
    "fill-orange-500 text-orange-500",
    "fill-yellow-500 text-yellow-500",
    "fill-purple-500 text-purple-500",
  ];

  const createExplosion = () => {
    const allParticles: Particle[] = [];
    
    // Главные сердечки в кольцевом взрыве
    for (let ring = 0; ring < 3; ring++) {
      const heartsInRing = ring === 0 ? 8 : ring === 1 ? 12 : 16;
      const baseDistance = 50 + ring * 35;
      
      for (let i = 0; i < heartsInRing; i++) {
        const angle = (360 / heartsInRing) * i + Math.random() * 20 - 10;
        const distance = baseDistance + Math.random() * 30;
        const radian = (angle * Math.PI) / 180;
        
        allParticles.push({
          id: Date.now() + ring * 1000 + i,
          x: Math.cos(radian) * distance,
          y: Math.sin(radian) * distance,
          scale: Math.random() * 0.8 + 0.5,
          rotation: Math.random() * 720 + 360,
          delay: ring * 50 + i * 20 + Math.random() * 30,
          duration: 1.5 + Math.random() * 0.8,
          color: particleColors[Math.floor(Math.random() * 5)],
          type: "heart",
          velocity: { x: Math.cos(radian) * 2, y: Math.sin(radian) * 2 },
          gravity: Math.random() * 0.5 + 0.3,
        });
      }
    }
    
    // Звездочки и искры для дополнительного эффекта
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * 360;
      const distance = Math.random() * 120 + 40;
      const radian = (angle * Math.PI) / 180;
      
      allParticles.push({
        id: Date.now() + 10000 + i,
        x: Math.cos(radian) * distance,
        y: Math.sin(radian) * distance,
        scale: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * 1080,
        delay: Math.random() * 100,
        duration: Math.random() * 1.2 + 0.8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        type: Math.random() > 0.5 ? "sparkle" : "star",
        velocity: { x: Math.cos(radian) * 1.5, y: Math.sin(radian) * 1.5 },
        gravity: Math.random() * 0.3 + 0.2,
      });
    }
    
    // Хаотичные сердечки для полного безумия
    for (let i = 0; i < 15; i++) {
      allParticles.push({
        id: Date.now() + 20000 + i,
        x: (Math.random() - 0.5) * 300,
        y: -(Math.random() * 150 + 50),
        scale: Math.random() * 0.4 + 0.2,
        rotation: Math.random() * 1440,
        delay: Math.random() * 150,
        duration: Math.random() * 1.5 + 1.0,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        type: "heart",
        velocity: { x: (Math.random() - 0.5) * 4, y: Math.random() * -3 - 1 },
        gravity: Math.random() * 0.8 + 0.4,
      });
    }
    
    setParticles(allParticles);

    setTimeout(() => {
      setParticles([]);
    }, 3000);
  };

  const handleClick = () => {
    setIsAnimating(true);
    if (!isLiked) {
      createExplosion();
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    onClick();
  };

  const renderParticle = (particle: Particle) => {
    const IconComponent = particle.type === "heart" ? Heart : 
                         particle.type === "sparkle" ? Sparkles : Star;
    
    return (
      <IconComponent
        key={particle.id}
        className={cn(
          "absolute pointer-events-none",
          particle.color,
          particle.scale > 0.6 ? "h-4 w-4" : "h-3 w-3"
        )}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          animationDelay: `${particle.delay}ms`,
          animationDuration: `${particle.duration}s`,
          animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          animationFillMode: "forwards",
          animationName: "epicExplosion",
          transform: `translate(-50%, -50%) scale(0) rotate(0deg)`,
          "--end-x": `${particle.x}px`,
          "--end-y": `${particle.y}px`,
          "--rotation": `${particle.rotation}deg`,
          "--scale": particle.scale,
          "--vel-x": particle.velocity.x,
          "--vel-y": particle.velocity.y,
          "--gravity": particle.gravity,
          filter: "drop-shadow(0 0 6px currentColor)",
          zIndex: 9999,
        } as any}
      />
    );
  };

  return (
    <>
      <div className="relative w-full h-full flex items-center justify-center">
        <Heart
          className={cn(
            size,
            "cursor-pointer transition-all duration-500 transform-gpu",
            isLiked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400",
            isAnimating && "animate-bounce scale-150"
          )}
          onClick={handleClick}
          style={{
            filter: isLiked 
              ? "drop-shadow(0 0 16px rgba(239, 68, 68, 0.9)) drop-shadow(0 0 32px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 48px rgba(239, 68, 68, 0.3))" 
              : "none",
            transformOrigin: "center",
            animation: isLiked ? "heartGlow 2s ease-in-out infinite alternate" : "none",
          }}
        />
      </div>
      
      {particles.length > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none" 
          style={{ zIndex: 9998 }}
        >
          {particles.map(renderParticle)}
        </div>
      )}
      
      <style jsx>{`
        @keyframes epicExplosion {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: translate(-50%, -50%) scale(1.8) rotate(60deg);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%) scale(var(--scale)) rotate(120deg);
            opacity: 1;
          }
          60% {
            transform: translate(calc(-50% + var(--end-x) * 0.6), calc(-50% + var(--end-y) * 0.6 + var(--gravity) * -20px)) scale(calc(var(--scale) * 0.8)) rotate(calc(var(--rotation) * 0.6));
            opacity: 0.9;
          }
          85% {
            transform: translate(calc(-50% + var(--end-x) * 0.9), calc(-50% + var(--end-y) * 0.9 + var(--gravity) * 20px)) scale(calc(var(--scale) * 0.4)) rotate(calc(var(--rotation) * 0.9));
            opacity: 0.4;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y) + var(--gravity) * 60px)) scale(0) rotate(var(--rotation));
            opacity: 0;
          }
        }
        
        @keyframes heartGlow {
          0% {
            filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.9)) drop-shadow(0 0 32px rgba(239, 68, 68, 0.6));
            transform: scale(1);
          }
          100% {
            filter: drop-shadow(0 0 24px rgba(239, 68, 68, 1)) drop-shadow(0 0 48px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 64px rgba(239, 68, 68, 0.4));
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}; 
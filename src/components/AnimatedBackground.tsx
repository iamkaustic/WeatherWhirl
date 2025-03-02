import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  theme?: 'light' | 'dark' | 'auto';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Weather elements
    const particles: any[] = [];
    const maxParticles = 100;
    
    // Create particles
    const createParticles = () => {
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(135, 206, 250, 0.5)'
        });
      }
    };
    
    createParticles();
    
    // Animation
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.5', particle.opacity.toString());
        ctx.fill();
        
        // Move particles
        particle.y += particle.speed;
        
        // Reset particles when they reach bottom
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // Draw cloud-like shapes
      for (let i = 0; i < 5; i++) {
        const time = Date.now() * 0.0005;
        const x = Math.sin(time + i * 0.5) * (canvas.width * 0.4) + canvas.width * 0.5;
        const y = Math.cos(time + i * 0.3) * (canvas.height * 0.2) + canvas.height * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, 30 + Math.sin(time) * 10, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' 
          ? 'rgba(50, 50, 70, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;

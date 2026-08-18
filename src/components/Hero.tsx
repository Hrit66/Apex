"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Mouse, ArrowRight, Sparkles, Target, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MagneticButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
  | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  | 'onTransitionStart' | 'onTransitionEnd' | 'onTransitionCancel' | 'onTransitionRun'
  | 'whileHover' | 'whileTap' | 'whileFocus' | 'whileDrag'
  | 'drag' | 'dragConstraints' | 'dragElastic' | 'dragMomentum' | 'dragPropagation' | 'dragSnapToOrigin'
  | 'layout' | 'layoutId' | 'layoutRoot' | 'layoutDependency'
  | 'animate' | 'initial' | 'exit' | 'transition' | 'variants' | 'custom' | 'inheritVariant'
> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseGlobal, setMouseGlobal] = useState({ x: 0, y: 0 });
  const gpuRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const rotateXSpring = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGlobal({ x: e.clientX, y: e.clientY });
      
      if (!gpuRef.current) return;
      
      const rect = gpuRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      const maxRotate = 15;
      setMousePosition({
        x: Math.max(-maxRotate, Math.min(maxRotate, deltaX * maxRotate)),
        y: Math.max(-maxRotate, Math.min(maxRotate, deltaY * maxRotate))
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!gpuRef.current) return;
    
    const animate = () => {
      rotateX.set(mousePosition.y);
      rotateY.set(-mousePosition.x);
      requestAnimationFrame(animate);
    };
    animate();
  }, [mousePosition, rotateX, rotateY]);

  const gpuStyleX = useTransform(rotateYSpring, (r) => `${r}deg`);
  const gpuStyleY = useTransform(rotateXSpring, (r) => `${r}deg`);

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.6 + 0.1,
    delay: Math.random() * 10,
    duration: 6 + Math.random() * 8,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 30,
  }));

  const glowParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * Math.PI * 2,
    radius: 120 + Math.random() * 80,
    speed: 0.005 + Math.random() * 0.01,
    size: 60 + Math.random() * 100,
    opacity: 0.05 + Math.random() * 0.1,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.08)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(112,0,255,0.06)_0%,_transparent_60%)]" />
      
      <MouseGlowTracker mousePos={mouseGlobal} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {glowParticles.map((p) => (
          <OrbitingGlow key={p.id} {...p} />
        ))}
        
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [p.opacity, 0, p.opacity],
              scale: [0, 1, 0],
              y: [0, -150, 0],
              x: [0, p.driftX, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism neon-border mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,240,255,0.3)" }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-cyan-300 tracking-wide uppercase">
                New Architecture: X900 Series
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="block">Engineered for</span>
              <span className="block text-gradient-cyan">Extreme Performance.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-300/80 max-w-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Push the boundaries of compute with precision-engineered components.
              Zero compromises. Pure performance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <MagneticButton 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold text-lg overflow-hidden"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Explore Parts
              </MagneticButton>

              <MagneticButton
                variant="ghost"
                className="px-8 py-4 rounded-xl glassmorphism-strong text-foreground font-semibold text-lg border border-border hover:border-cyan-500/50 flex items-center gap-2"
                icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
                iconPosition="left"
              >
                Build Custom Rig
              </MagneticButton>
            </motion.div>

            <motion.div
              className="flex items-center gap-8 mt-12 text-sm text-slate-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Mouse className="w-4 h-4 text-cyan-400" />
                <span>Hover & move to inspect</span>
              </div>
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Real-time 3D preview</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative perspective-1000"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "blur(60px)" }}
              />
              
              <GPUCardContainer 
                rotateX={gpuStyleY} 
                rotateY={gpuStyleX}
                mousePos={mousePosition}
              />
            </div>

            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { label: "Core Clock", value: "2.85 GHz", color: "text-cyan-400" },
                { label: "Memory", value: "24 GB", color: "text-purple-400" },
                { label: "Bandwidth", value: "1.15 TB/s", color: "text-amber-400" },
                { label: "Ray Tracing", value: "4th Gen", color: "text-pink-400" },
              ].map((spec, i) => (
                <StatPill key={spec.label} {...spec} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <motion.div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ y: [0, 20, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function MouseGlowTracker({ mousePos }: { mousePos: { x: number; y: number } }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const currentX = x.get();
      const currentY = y.get();
      const targetX = mousePos.x;
      const targetY = mousePos.y;
      
      const newX = currentX + (targetX - currentX) * 0.1;
      const newY = currentY + (targetY - currentY) * 0.1;
      
      x.set(newX);
      y.set(newY);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [mousePos, x, y]);

  const styleX = useTransform(x, (v) => `${v}px`);
  const styleY = useTransform(y, (v) => `${v}px`);

  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{ x: styleX, y: styleY, transformOrigin: "center center" }}
    >
      <div className="w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-[150px]" />
      <div className="w-[200px] h-[200px] rounded-full -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-[100px]" />
    </motion.div>
  );
}

function OrbitingGlow({ 
  id, angle, radius, speed, size, opacity 
}: { 
  id: number; 
  angle: number; 
  radius: number; 
  speed: number; 
  size: number; 
  opacity: number; 
}) {
  const orbitAngle = useMotionValue(angle);
  
  useEffect(() => {
    let frame: number;
    const animate = () => {
      orbitAngle.set(orbitAngle.get() + speed);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [orbitAngle, speed]);

  const x = useTransform(orbitAngle, (a: number) => Math.cos(a) * radius);
  const y = useTransform(orbitAngle, (a: number) => Math.sin(a) * radius);
  const styleX = useTransform(x, (v) => `${v}px`);
  const styleY = useTransform(y, (v) => `${v}px`);

  const colors = [
    "from-cyan-500/30 to-transparent",
    "from-purple-500/30 to-transparent",
    "from-pink-500/30 to-transparent",
    "from-blue-500/30 to-transparent",
  ];

  return (
    <motion.div
      className="fixed pointer-events-none z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ x: styleX, y: styleY }}
    >
      <div 
        className="rounded-full blur-[100px]"
        style={{ 
          width: size, 
          height: size, 
          opacity,
          background: `radial-gradient(circle, ${colors[id % colors.length]})`
        }}
      />
    </motion.div>
  );
}

function MagneticButton({ 
  children, 
  className = "", 
  variant = "primary",
  icon,
  iconPosition = "right",
  ...props 
}: MagneticButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const currentX = magneticX.get();
      const currentY = magneticY.get();
      const targetX = hovered ? mousePos.x * 0.3 : 0;
      const targetY = hovered ? mousePos.y * 0.3 : 0;
      
      const newX = currentX + (targetX - currentX) * 0.3;
      const newY = currentY + (targetY - currentY) * 0.3;
      
      magneticX.set(newX);
      magneticY.set(newY);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [hovered, mousePos, magneticX, magneticY]);

  const styleX = useTransform(magneticX, (v) => `${v}px`);
  const styleY = useTransform(magneticY, (v) => `${v}px`);

  const baseClass = "relative group flex items-center gap-2 z-10";
  const variantClass = variant === "primary" 
    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold"
    : "glassmorphism-strong text-foreground font-semibold border border-border hover:border-cyan-500/50";

  return (
    <motion.button
      ref={ref}
      className={`${baseClass} ${variantClass} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      whileTap={{ scale: 0.97 }}
      style={{ x: styleX, y: styleY }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {iconPosition === "left" && icon && <motion.span whileHover={{ x: -4 }}>{icon}</motion.span>}
        <span>{children}</span>
        {iconPosition === "right" && icon && <motion.span whileHover={{ x: 4 }}>{icon}</motion.span>}
      </span>
      
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ x: styleX, y: styleY }}
        />
      )}
      
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          boxShadow: "0 0 40px rgba(0,240,255,0.4), 0 0 80px rgba(112,0,255,0.2)",
          x: styleX, 
          y: styleY 
        }}
      />
    </motion.button>
  );
}

function StatPill({ label, value, color, index }: { label: string; value: string; color: string; index: number }) {
  return (
    <motion.div
      className="glassmorphism px-4 py-2.5 rounded-lg text-xs text-center min-w-[100px] neon-border relative overflow-hidden group"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.9 + index * 0.08 }}
      whileHover={{ y: -4, scale: 1.05 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0"
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      <div className={`font-mono font-bold text-lg ${color}`}>{value}</div>
      <div className="text-slate-400">{label}</div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 scale-x-0 origin-left"
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function GPUCardContainer({ 
  rotateX, 
  rotateY, 
  mousePos,
  children 
}: { 
  rotateX: any; 
  rotateY: any; 
  mousePos: { x: number; y: number };
  children?: React.ReactNode;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const glowIntensity = useMotionValue(0);
  
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const current = glowIntensity.get();
      const target = isHovering ? 1 : 0;
      const newVal = current + (target - current) * 0.15;
      glowIntensity.set(newVal);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [isHovering, glowIntensity]);

  const glowOpacity = useTransform(glowIntensity, [0, 1], [0, 1]);
  const glowBlur = useTransform(glowIntensity, [0, 1], [0, 40]);
  
  const boxShadow1 = useTransform(glowIntensity, (intensity: number) => {
    const blur = intensity * 40;
    const op = intensity;
    return `0 0 ${blur.toFixed(1)}px rgba(0,240,255,${(op * 0.4).toFixed(3)})`;
  });
  const boxShadow2 = useTransform(glowIntensity, (intensity: number) => {
    const blur = intensity * 40 * 1.5;
    const op = intensity;
    return `0 0 ${blur.toFixed(1)}px rgba(112,0,255,${(op * 0.2).toFixed(3)})`;
  });
  const borderColor = useTransform(glowIntensity, (intensity: number) => 
    `rgba(0,240,255,${(intensity * 0.3).toFixed(3)})`
  );

  return (
    <motion.div
      className="relative preserve-3d animate-float"
      style={{ 
        transformStyle: "preserve-3d",
        transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{ 
          boxShadow: `${boxShadow1}, ${boxShadow2}`,
          border: `1px solid ${borderColor}`,
          borderRadius: "1.5rem",
          opacity: glowOpacity,
        }}
      />
      
      <GPUCard3D rotateX={rotateX} rotateY={rotateY} />
      
      <motion.div
        className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 pointer-events-none"
        animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 text-xs">
          <Monitor className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300 font-mono">Interactive 3D Model</span>
        </div>
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-4 h-4 text-cyan-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function GPUCard3D({ rotateX, rotateY }: { rotateX: any; rotateY: any }) {
  return (
    <div className="relative w-full aspect-[4/3] max-w-[500px] mx-auto preserve-3d" style={{ transformStyle: "preserve-3d" }}>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateY(0deg) translateZ(80px)` }}>
        <GPUFace />
      </div>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateY(180deg) translateZ(80px)` }}>
        <GPUFace isBack />
      </div>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateY(90deg) translateZ(80px)` }}>
        <GPUSide />
      </div>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateY(-90deg) translateZ(80px)` }}>
        <GPUSide isRight />
      </div>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateX(90deg) translateZ(80px)` }}>
        <GPUSide isTop />
      </div>
      <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d", transform: `rotateX(-90deg) translateZ(80px)` }}>
        <GPUSide isBottom />
      </div>
    </div>
  );
}

function GPUFace({ isBack = false }: { isBack?: boolean }) {
  return (
    <div className="relative w-full h-full rounded-2xl preserve-3d" style={{ 
      transformStyle: "preserve-3d",
      background: "linear-gradient(145deg, #14181F 0%, #0D0F12 50%, #1E242D 100%)",
      border: "1px solid rgba(42, 48, 58, 0.5)",
      boxShadow: "0 0 60px rgba(0, 240, 255, 0.1), inset 0 0 60px rgba(0, 240, 255, 0.05)"
    }}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      
      {!isBack && (
        <>
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glassmorphism neon-border">
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-mono text-cyan-300">APEX X900</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glassmorphism neon-border-purple">
              <span className="text-xs font-mono text-purple-300">24GB GDDR6X</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center neon-border">
                <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">GPU Die</div>
                <div className="text-sm font-mono font-bold text-cyan-400">AD102-300</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center neon-border-purple">
                <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Boost Clock</div>
                <div className="text-sm font-mono font-bold text-purple-400">2.85 GHz</div>
              </div>
            </div>
          </div>
        </>
      )}

      {isBack && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl font-bold font-mono text-gradient-cyan mb-4">APEX</div>
            <div className="text-xl text-gradient-purple mb-2">HARDWARE</div>
            <div className="text-slate-400 text-sm uppercase tracking-widest">Engineered for Extreme Performance</div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl border border-cyan-500/10" />
      
      {!isBack && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          <motion.div
            className="w-2 h-2 rounded bg-cyan-400/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, delay: 0, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 rounded bg-cyan-400/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 rounded bg-cyan-400/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 rounded bg-purple-400/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
}

function GPUSide({ isRight = false, isTop = false, isBottom = false }: { isRight?: boolean; isTop?: boolean; isBottom?: boolean }) {
  const height = isTop || isBottom ? "160px" : "100%";
  const width = isTop || isBottom ? "100%" : "160px";
  
  return (
    <div className="relative preserve-3d" style={{ 
      transformStyle: "preserve-3d",
      width,
      height,
      background: "linear-gradient(145deg, #14181F 0%, #0D0F12 50%, #1E242D 100%)",
      border: "1px solid rgba(42, 48, 58, 0.5)",
    }}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,240,255,0.03)_8px,rgba(0,240,255,0.03)_16px)]" />
      {isTop && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center"
            animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-16 h-16 text-cyan-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <path d="M6 12h12M12 6v12" />
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  );
}
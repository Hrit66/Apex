"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Cpu, MemoryStick, Fan, Zap, Search, ChevronRight, Filter, RotateCcw, ShoppingCart, Eye } from "lucide-react";

interface Component {
  id: string;
  name: string;
  category: string;
  price: string;
  specs: string[];
  image: string;
  badge?: string;
  badgeColor?: string;
}

const components: Component[] = [
  {
    id: "gpu-1",
    name: "Apex X900 Titan",
    category: "GPUs",
    price: "$1,999",
    specs: ["24GB GDDR6X", "2.8 GHz Boost", "450W TDP", "3.5 Slot"],
    image: "gpu",
    badge: "Flagship",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500"
  },
  {
    id: "gpu-2",
    name: "Apex X900 Pro",
    category: "GPUs",
    price: "$1,299",
    specs: ["16GB GDDR6X", "2.6 GHz Boost", "380W TDP", "3 Slot"],
    image: "gpu",
    badge: "High-End",
    badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-500"
  },
  {
    id: "gpu-3",
    name: "Apex X800 XT",
    category: "GPUs",
    price: "$899",
    specs: ["12GB GDDR6", "2.4 GHz Boost", "320W TDP", "2.5 Slot"],
    image: "gpu"
  },
  {
    id: "cpu-1",
    name: "Apex Ryzen 9 9950X3D",
    category: "Processors",
    price: "$699",
    specs: ["16C/32T", "5.7 GHz Boost", "128MB L3", "170W TDP"],
    image: "cpu",
    badge: "Gaming King",
    badgeColor: "bg-gradient-to-r from-red-500 to-pink-500"
  },
  {
    id: "cpu-2",
    name: "Apex Core i9-14900K",
    category: "Processors",
    price: "$589",
    specs: ["24C/32T", "6.0 GHz Boost", "36MB L3", "253W TDP"],
    image: "cpu",
    badge: "Performance",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    id: "cpu-3",
    name: "Apex Ryzen 7 9800X3D",
    category: "Processors",
    price: "$449",
    specs: ["8C/16T", "5.2 GHz Boost", "96MB L3", "120W TDP"],
    image: "cpu"
  },
  {
    id: "ram-1",
    name: "Apex DDR5-8000 CL34",
    category: "Memory (RAM)",
    price: "$299",
    specs: ["32GB (2x16GB)", "8000 MT/s", "CL34-44-44", "1.4V"],
    image: "ram",
    badge: "OC Ready",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500"
  },
  {
    id: "ram-2",
    name: "Apex DDR5-7200 CL32",
    category: "Memory (RAM)",
    price: "$229",
    specs: ["32GB (2x16GB)", "7200 MT/s", "CL32-42-42", "1.35V"],
    image: "ram"
  },
  {
    id: "ram-3",
    name: "Apex DDR5-6400 CL30",
    category: "Memory (RAM)",
    price: "$179",
    specs: ["32GB (2x16GB)", "6400 MT/s", "CL30-38-38", "1.25V"],
    image: "ram"
  },
  {
    id: "cooling-1",
    name: "Apex FrostFlow 420 ARGB",
    category: "Cooling",
    price: "$189",
    specs: ["420mm Radiator", "3x 140mm Fans", "ARGB Lighting", "Offset Mount"],
    image: "cooling",
    badge: "Best Cooling",
    badgeColor: "bg-gradient-to-r from-cyan-500 to-teal-500"
  },
  {
    id: "cooling-2",
    name: "Apex Glacier 360",
    category: "Cooling",
    price: "$149",
    specs: ["360mm Radiator", "3x 120mm Fans", "White/Black", "Infinity Mirror"],
    image: "cooling"
  },
  {
    id: "cooling-3",
    name: "Apex AirForce Dual Tower",
    category: "Cooling",
    price: "$99",
    specs: ["Dual Tower", "2x 140mm Fans", "6 Heatpipes", "170mm Height"],
    image: "cooling"
  },
  {
    id: "psu-1",
    name: "Apex Titan 1600W ATX 3.0",
    category: "Power Supplies",
    price: "$499",
    specs: ["1600W", "80+ Titanium", "ATX 3.0", "12VHPWR x2"],
    image: "psu",
    badge: "Titanium",
    badgeColor: "bg-gradient-to-r from-amber-500 to-yellow-500"
  },
  {
    id: "psu-2",
    name: "Apex Prime 1200W ATX 3.0",
    category: "Power Supplies",
    price: "$349",
    specs: ["1200W", "80+ Platinum", "ATX 3.0", "12VHPWR"],
    image: "psu"
  },
  {
    id: "psu-3",
    name: "Apex Core 1000W ATX 3.0",
    category: "Power Supplies",
    price: "$249",
    specs: ["1000W", "80+ Gold", "ATX 3.0", "12VHPWR"],
    image: "psu"
  },
];

const categories = ["All", "GPUs", "Processors", "Memory (RAM)", "Cooling", "Power Supplies"];

const categoryIcons: Record<string, any> = {
  "GPUs": Cpu,
  "Processors": Cpu,
  "Memory (RAM)": MemoryStick,
  "Cooling": Fan,
  "Power Supplies": Zap,
};

const categoryColors: Record<string, string> = {
  "GPUs": "from-cyan-500 to-purple-500",
  "Processors": "from-amber-500 to-orange-500",
  "Memory (RAM)": "from-green-500 to-emerald-500",
  "Cooling": "from-blue-500 to-cyan-500",
  "Power Supplies": "from-purple-500 to-pink-500",
};

export default function ComponentCategories() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const filteredComponents = components.filter(comp => {
    const matchesCategory = activeCategory === "All" || comp.category === activeCategory;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.specs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="components" ref={containerRef} className="relative py-24 px-6 bg-gradient-to-b from-slate-950/50 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.03)_0%,_transparent_70%)]" />
      
      <BackgroundOrbs />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism neon-border text-sm mb-6">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Component Catalog</span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Choose Your <span className="text-gradient-cyan">Weapon</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Hand-picked components engineered for extreme performance. Filter by category or search specifications.
          </p>
        </motion.div>

        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          categoryIcons={categoryIcons}
          categoryColors={categoryColors}
        />

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
              exit: { opacity: 0, transition: { staggerChildren: 0.02, staggerDirection: -1 } },
            }}
          >
            {filteredComponents.map((comp, index) => (
              <ComponentCard
                key={comp.id}
                comp={comp}
                index={index}
                isHovered={hoveredCard === comp.id}
                onHover={() => setHoveredCard(comp.id)}
                onLeave={() => setHoveredCard(null)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredComponents.length === 0 && (
          <motion.div
            className="text-center py-20 glassmorphism rounded-2xl neon-border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Search className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No components found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function BackgroundOrbs() {
  const orbs = [
    { x: 10, y: 20, size: 300, color: "rgba(0,240,255,0.03)", delay: 0 },
    { x: 80, y: 80, size: 400, color: "rgba(112,0,255,0.03)", delay: 2 },
    { x: 50, y: 50, size: 200, color: "rgba(0,240,255,0.02)", delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[150px]"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function CategoryTabs({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  categoryIcons,
  categoryColors
}: { 
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categoryIcons: Record<string, any>;
  categoryColors: Record<string, string>;
}) {
  return (
    <motion.div
      className="flex flex-wrap gap-3 justify-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {categories.map((cat, i) => {
        const Icon = categoryIcons[cat];
        const isActive = activeCategory === cat;
        const color = categoryColors[cat] || "from-cyan-500 to-purple-500";
        
        return (
          <CategoryTab
            key={cat}
            cat={cat}
            isActive={isActive}
            Icon={Icon}
            color={color}
            onClick={() => setActiveCategory(cat)}
            index={i}
          />
        );
      })}
    </motion.div>
  );
}

function CategoryTab({ 
  cat, 
  isActive, 
  Icon, 
  color,
  onClick,
  index
}: { 
  cat: string;
  isActive: boolean;
  Icon?: any;
  color: string;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const scale = useMotionValue(1);
  const glowOpacity = useMotionValue(0);
  
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 30 });
  const glowSpring = useSpring(glowOpacity, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const animate = () => {
      scale.set(isActive ? 1.02 : (hovered ? 1.03 : 1));
      glowOpacity.set(isActive ? 1 : (hovered ? 0.6 : 0));
      requestAnimationFrame(animate);
    };
    animate();
  }, [isActive, hovered, scale, glowOpacity]);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 overflow-hidden ${
        isActive
          ? "text-white"
          : "glassmorphism text-slate-400 hover:text-foreground"
      }`}
      whileTap={{ scale: 0.96 }}
      style={{ 
        background: isActive ? `linear-gradient(135deg, ${color})` : undefined,
        boxShadow: isActive ? `0 0 30px ${color.replace('from-', '').replace(' to-', ', ').split(',')[0]}80` : undefined,
        scale: scaleSpring,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{ 
          background: `linear-gradient(135deg, ${color})`,
          opacity: glowOpacity,
        }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {cat !== "All" && Icon && (
          <motion.span
            whileHover={{ rotate: 180, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-4 h-4" />
          </motion.span>
        )}
        {cat}
      </span>
      
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      )}
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0"
        whileHover={{ opacity: 0.2 }}
      />
    </motion.button>
  );
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const [focused, setFocused] = useState(false);
  const glowWidth = useMotionValue(0);
  const glowSpring = useSpring(glowWidth, { stiffness: 200, damping: 20 });

  useEffect(() => {
    glowWidth.set(focused ? 1 : 0);
  }, [focused, glowWidth]);

  return (
    <motion.div
      className="max-w-xl mx-auto mb-12 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="relative glassmorphism neon-border rounded-xl overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-px"
          style={{ 
            background: `linear-gradient(to bottom, ${focused ? 'transparent' : 'rgba(0,240,255,0)'}, ${focused ? '#00F0FF' : 'transparent'})`,
            opacity: glowWidth,
          }}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors" style={{ color: focused ? '#00F0FF' : 'inherit' }} />
        <input
          type="text"
          placeholder="Search components, specs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-12 py-4 pl-12 bg-transparent text-foreground placeholder-slate-500 outline-none text-base"
        />
        {searchQuery && (
          <motion.button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg glassmorphism hover:neon-border transition-all text-slate-400 hover:text-cyan-400"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function ComponentCard({ 
  comp, 
  index, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  comp: Component;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowIntensity = useMotionValue(0);
  const glowSpring = useSpring(glowIntensity, { stiffness: 200, damping: 20 });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const animate = () => {
      glowIntensity.set(isHovered ? 1 : 0);
      requestAnimationFrame(animate);
    };
    animate();
  }, [isHovered, glowIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    const maxRotate = 8;
    rotateX.set(Math.max(-maxRotate, Math.min(maxRotate, -deltaY * maxRotate)));
    rotateY.set(Math.max(-maxRotate, Math.min(maxRotate, deltaX * maxRotate)));
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const transformX = useTransform(rotateX, (r: number) => `rotateX(${r}deg)`);
  const transformY = useTransform(rotateY, (r: number) => `rotateY(${r}deg)`);

  return (
    <motion.div
      ref={cardRef}
      className="group card-hover glassmorphism-strong rounded-2xl overflow-hidden neon-border relative"
      variants={{
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
        boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 60px rgba(0,240,255,0.2), inset 0 0 60px rgba(0,240,255,0.05)",
        borderColor: "rgba(0, 240, 255, 0.4)",
      }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={onHover}
      onMouseLeave={() => { onLeave(); handleMouseLeave(); }}
      onMouseMove={handleMouseMove}
      style={{
        transform: `perspective(1000px) ${transformX} ${transformY}`,
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ComponentVisual3D type={comp.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
          style={{ opacity: glowSpring }}
          transition={{ duration: 0.3 }}
        />

        {comp.badge && (
          <motion.div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-black"
            style={{ background: comp.badgeColor }}
            initial={{ opacity: 0, scale: 0.8, x: -20, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          >
            {comp.badge}
          </motion.div>
        )}

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ActionButton 
            icon={<Eye className="w-4 h-4" />}
            label="Quick View"
            delay={0.1}
          />
          <ActionButton 
            icon={<ShoppingCart className="w-4 h-4" />}
            label="Add to Build"
            delay={0.15}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 glassmorphism rounded border border-border">In Stock</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          <motion.h3
            className="text-xl font-bold text-foreground group-hover:text-cyan-300 transition-colors pr-4"
            whileHover={{ x: 6 }}
          >
            {comp.name}
          </motion.h3>
          <span className="text-lg font-bold font-mono text-cyan-400 whitespace-nowrap">{comp.price}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {comp.specs.slice(0, 3).map((spec, i) => (
            <motion.span
              key={i}
              className="px-2.5 py-1 text-xs rounded-lg glassmorphism border border-border text-slate-300 font-mono cursor-default"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              whileHover={{ 
                scale: 1.05, 
                background: "rgba(0,240,255,0.1)",
                borderColor: "rgba(0,240,255,0.3)",
                color: "#00F0FF"
              }}
            >
              {spec}
            </motion.span>
          ))}
          {comp.specs.length > 3 && (
            <motion.span
              className="px-2.5 py-1 text-xs rounded-lg glassmorphism border border-border text-slate-400 cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ color: "#00F0FF" }}
            >
              +{comp.specs.length - 3} more
            </motion.span>
          )}
        </div>

        <motion.button
          className="w-full px-4 py-3 rounded-xl glassmorphism border border-border text-slate-300 font-medium transition-all hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/5 flex items-center justify-center gap-2 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.span className="relative z-10">View Details</motion.span>
          <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 -translate-x-full"
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, delay }: { icon: React.ReactNode; label: string; delay: number }) {
  return (
    <motion.button
      className="glassmorphism p-2 rounded-lg hover:neon-border transition-all text-cyan-400 flex items-center gap-1 px-3"
      whileHover={{ scale: 1.1, x: 4 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {icon}
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    </motion.button>
  );
}

function ComponentVisual3D({ type }: { type: string }) {
  const gradientMap = {
    gpu: "from-cyan-500/20 via-purple-500/10 to-pink-500/20",
    cpu: "from-amber-500/20 via-orange-500/10 to-red-500/20",
    ram: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
    cooling: "from-blue-500/20 via-cyan-500/10 to-blue-500/20",
    psu: "from-purple-500/20 via-pink-500/10 to-purple-500/20",
  };

  const iconMap = {
    gpu: (
      <svg className="w-28 h-28 text-cyan-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 12h12M10 8v8M14 8v8" />
        <rect x="4" y="6" width="4" height="4" rx="1" />
        <rect x="16" y="6" width="4" height="4" rx="1" />
      </svg>
    ),
    cpu: (
      <svg className="w-28 h-28 text-amber-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h8" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    ram: (
      <svg className="w-28 h-28 text-green-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <path d="M6 8h12M6 12h12M6 16h12" />
        <rect x="4" y="6" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.3" />
        <rect x="16" y="6" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    cooling: (
      <svg className="w-28 h-28 text-blue-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    psu: (
      <svg className="w-28 h-28 text-purple-400/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8M8 12h8" />
        <circle cx="12" cy="12" r="6" strokeWidth="0.5" />
      </svg>
    ),
  };

  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setFloatOffset({
        x: Math.sin(Date.now() / 3000) * 8,
        y: Math.cos(Date.now() / 2500) * 6,
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ transform: `translate(${floatOffset.x}px, ${floatOffset.y}px)` }}>
        <motion.div
          className="absolute -inset-8 bg-gradient-to-br"
          style={{ background: gradientMap[type as keyof typeof gradientMap] || 'from-cyan-500/20 to-purple-500/20' }}
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10">
          {iconMap[type as keyof typeof iconMap] || iconMap.gpu}
        </div>
      </div>
    </div>
  );
}
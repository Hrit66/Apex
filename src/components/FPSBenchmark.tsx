"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { Monitor, Zap, TrendingUp, Cpu, MemoryStick, Settings, ChevronDown, BarChart2, Target, Trophy, Clock } from "lucide-react";

interface BenchmarkData {
  game: string;
  category: string;
  fps: { [gpu: string]: { [resolution: string]: number } };
}

const benchmarkData: BenchmarkData[] = [
  {
    game: "Cyberpunk 2077",
    category: "Ray Tracing Ultra",
    fps: {
      "X900 Titan": { "1080p": 142, "1440p": 108, "4K": 72 },
      "X900 Pro": { "1080p": 118, "1440p": 89, "4K": 58 },
      "X800 XT": { "1080p": 95, "1440p": 71, "4K": 45 },
      "RTX 4090": { "1080p": 135, "1440p": 102, "4K": 68 },
      "RTX 4080": { "1080p": 112, "1440p": 84, "4K": 54 },
    }
  },
  {
    game: "Alan Wake 2",
    category: "Path Tracing",
    fps: {
      "X900 Titan": { "1080p": 128, "1440p": 96, "4K": 64 },
      "X900 Pro": { "1080p": 104, "1440p": 78, "4K": 51 },
      "X800 XT": { "1080p": 82, "1440p": 61, "4K": 39 },
      "RTX 4090": { "1080p": 122, "1440p": 91, "4K": 60 },
      "RTX 4080": { "1080p": 98, "1440p": 73, "4K": 47 },
    }
  },
  {
    game: "Starfield",
    category: "Ultra Settings",
    fps: {
      "X900 Titan": { "1080p": 165, "1440p": 132, "4K": 98 },
      "X900 Pro": { "1080p": 142, "1440p": 112, "4K": 81 },
      "X800 XT": { "1080p": 118, "1440p": 91, "4K": 64 },
      "RTX 4090": { "1080p": 158, "1440p": 126, "4K": 92 },
      "RTX 4080": { "1080p": 135, "1440p": 106, "4K": 76 },
    }
  },
  {
    game: "Baldur's Gate 3",
    category: "Ultra Settings",
    fps: {
      "X900 Titan": { "1080p": 245, "1440p": 208, "4K": 156 },
      "X900 Pro": { "1080p": 218, "1440p": 184, "4K": 136 },
      "X800 XT": { "1080p": 185, "1440p": 154, "4K": 112 },
      "RTX 4090": { "1080p": 238, "1440p": 201, "4K": 150 },
      "RTX 4080": { "1080p": 210, "1440p": 176, "4K": 130 },
    }
  },
  {
    game: "Call of Duty MW3",
    category: "Competitive Low",
    fps: {
      "X900 Titan": { "1080p": 485, "1440p": 398, "4K": 285 },
      "X900 Pro": { "1080p": 442, "1440p": 362, "4K": 258 },
      "X800 XT": { "1080p": 385, "1440p": 312, "4K": 220 },
      "RTX 4090": { "1080p": 472, "1440p": 385, "4K": 275 },
      "RTX 4080": { "1080p": 428, "1440p": 348, "4K": 248 },
    }
  },
];

const gpus = ["X900 Titan", "X900 Pro", "X800 XT", "RTX 4090", "RTX 4080"];
const resolutions = ["1080p", "1440p", "4K"];

const gpuColors: Record<string, string> = {
  "X900 Titan": "from-cyan-400 to-purple-500",
  "X900 Pro": "from-cyan-300 to-blue-500",
  "X800 XT": "from-blue-400 to-cyan-500",
  "RTX 4090": "from-green-400 to-emerald-500",
  "RTX 4080": "from-green-300 to-teal-500",
};

const gpuGradients: Record<string, string> = {
  "X900 Titan": "linear-gradient(135deg, #00F0FF 0%, #7000FF 100%)",
  "X900 Pro": "linear-gradient(135deg, #06D6E6 0%, #3B82F6 100%)",
  "X800 XT": "linear-gradient(135deg, #0EA5E9 0%, #06D6E6 100%)",
  "RTX 4090": "linear-gradient(135deg, #22C55E 0%, #10B981 100%)",
  "RTX 4080": "linear-gradient(135deg, #4ADE80 0%, #14B8A6 100%)",
};

export default function FPSBenchmark() {
  const [selectedGPU, setSelectedGPU] = useState("X900 Titan");
  const [selectedResolution, setSelectedResolution] = useState("1440p");
  const [selectedGame, setSelectedGame] = useState(0);
  const [animateBars, setAnimateBars] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentGameData = benchmarkData[selectedGame];
  const maxFPS = useMemo(() => 
    Math.max(...gpus.map(gpu => currentGameData.fps[gpu]?.[selectedResolution] || 0))
  , [currentGameData, selectedResolution]);

  const handleGPUChange = (gpu: string) => {
    setSelectedGPU(gpu);
    triggerReanimate();
  };

  const handleResolutionChange = (res: string) => {
    setSelectedResolution(res);
    triggerReanimate();
  };

  const handleGameChange = (index: number) => {
    setSelectedGame(index);
    triggerReanimate();
  };

  const triggerReanimate = () => {
    setAnimateBars(false);
    setTimeout(() => setAnimateBars(true), 50);
  };

  return (
    <section id="benchmarks" className="relative py-24 px-6 bg-gradient-to-b from-slate-950/50 to-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.04)_0%,_transparent_60%)]" />
      
      <BenchmarkOrbs />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism neon-border text-sm mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Real-time Benchmarks</span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            FPS Performance <span className="text-gradient-cyan">Analyzer</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select a GPU and resolution to see real-time frame rate comparisons across popular titles.
          </p>
        </motion.div>

        <BenchmarkControls
          selectedGPU={selectedGPU}
          setSelectedGPU={handleGPUChange}
          selectedResolution={selectedResolution}
          setSelectedResolution={handleResolutionChange}
          selectedGame={selectedGame}
          setSelectedGame={handleGameChange}
          gpus={gpus}
          resolutions={resolutions}
          gpuColors={gpuColors}
          benchmarkData={benchmarkData}
        />

        <BenchmarkChart
          currentGameData={currentGameData}
          selectedGPU={selectedGPU}
          selectedResolution={selectedResolution}
          gpus={gpus}
          maxFPS={maxFPS}
          animateBars={animateBars}
          hoveredBar={hoveredBar}
          setHoveredBar={setHoveredBar}
          gpuColors={gpuColors}
          gpuGradients={gpuGradients}
        />

        <BenchmarkStats
          currentGameData={currentGameData}
          selectedGPU={selectedGPU}
          selectedResolution={selectedResolution}
          gpus={gpus}
          gpuColors={gpuColors}
        />

        <GameSelector
          benchmarkData={benchmarkData}
          selectedGame={selectedGame}
          setSelectedGame={handleGameChange}
          selectedResolution={selectedResolution}
          gpuColors={gpuColors}
        />
      </div>
    </section>
  );
}

function BenchmarkOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[150px]"
          style={{
            left: `${15 + i * 35}%`,
            top: `${10 + i * 30}%`,
            width: 200 + i * 100,
            height: 200 + i * 100,
            background: i % 2 === 0 ? "rgba(0,240,255,0.03)" : "rgba(112,0,255,0.03)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 20 * (i % 2 === 0 ? -1 : 1), 0],
          }}
          transition={{
            duration: 10 + i * 3,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function BenchmarkControls({ 
  selectedGPU, setSelectedGPU, 
  selectedResolution, setSelectedResolution,
  selectedGame, setSelectedGame,
  gpus, resolutions, gpuColors, benchmarkData
}: {
  selectedGPU: string; setSelectedGPU: (g: string) => void;
  selectedResolution: string; setSelectedResolution: (r: string) => void;
  selectedGame: number; setSelectedGame: (i: number) => void;
  gpus: string[]; resolutions: string[]; gpuColors: Record<string, string>;
  benchmarkData: BenchmarkData[];
}) {
  return (
    <motion.div
      className="glassmorphism-strong rounded-2xl p-6 md:p-8 neon-border mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ControlGroup
          label="GPU Selection"
          icon={<Cpu className="w-4 h-4" />}
        >
          <GPUSelector 
            selected={selectedGPU}
            onChange={setSelectedGPU}
            options={gpus}
            gpuColors={gpuColors}
          />
        </ControlGroup>

        <ControlGroup
          label="Resolution"
          icon={<Monitor className="w-4 h-4" />}
        >
          <ResolutionTabs
            selected={selectedResolution}
            onChange={setSelectedResolution}
            options={resolutions}
          />
        </ControlGroup>

        <ControlGroup
          label="Test Scenario"
          icon={<Settings className="w-4 h-4" />}
        >
          <GameSelectorDropdown
            selected={selectedGame}
            onChange={setSelectedGame}
            options={benchmarkData}
          />
        </ControlGroup>
      </div>
    </motion.div>
  );
}

function ControlGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function GPUSelector({ selected, onChange, options, gpuColors }: { 
  selected: string; onChange: (g: string) => void; 
  options: string[]; gpuColors: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl glassmorphism border border-border flex items-center justify-between text-left transition-all hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        whileHover={{ borderColor: "rgba(0,240,255,0.5)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: gpuGradients[selected] }}>
            {selected.split(" ")[1] || selected[0]}
          </div>
          <span className="font-medium">{selected}</span>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 glassmorphism-strong rounded-xl border border-border overflow-hidden z-10"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                onMouseEnter={() => setHoveredOption(opt)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${
                  selected === opt 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300" 
                    : "hover:bg-cyan-500/5 hover:text-foreground"
                }`}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: gpuGradients[opt] }}>
                  {opt.split(" ")[1] || opt[0]}
                </div>
                <span className="font-medium">{opt}</span>
                {selected === opt && <CheckMark className="ml-auto w-4 h-4 text-cyan-400" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ResolutionTabs({ selected, onChange, options }: { 
  selected: string; onChange: (r: string) => void; options: string[];
}) {
  return (
    <div className="flex gap-2">
      {options.map(res => (
        <motion.button
          key={res}
          onClick={() => onChange(res)}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${
            selected === res
              ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-black shadow-lg shadow-cyan-500/25"
              : "glassmorphism text-slate-400 hover:text-foreground hover:neon-border"
          }`}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="relative z-10">{res}</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
            whileHover={{ opacity: 1 }}
          />
        </motion.button>
      ))}
    </div>
  );
}

function GameSelectorDropdown({ selected, onChange, options }: { 
  selected: number; onChange: (i: number) => void; options: BenchmarkData[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl glassmorphism border border-border flex items-center justify-between text-left transition-all hover:border-cyan-500/50"
        whileHover={{ borderColor: "rgba(0,240,255,0.5)" }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-medium truncate pr-8">{options[selected]?.game}</span>
        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 glassmorphism-strong rounded-xl border border-border overflow-hidden z-10 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => { onChange(i); setOpen(false); }}
                className={`w-full px-4 py-3 text-left transition-all ${
                  selected === i 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300" 
                    : "hover:bg-cyan-500/5 hover:text-foreground"
                }`}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
              >
                <div className="font-medium">{opt.game}</div>
                <div className="text-xs text-slate-400">{opt.category}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BenchmarkChart({ 
  currentGameData, selectedGPU, selectedResolution, gpus, maxFPS, 
  animateBars, hoveredBar, setHoveredBar, gpuColors, gpuGradients 
}: {
  currentGameData: BenchmarkData;
  selectedGPU: string; selectedResolution: string; gpus: string[]; maxFPS: number;
  animateBars: boolean; hoveredBar: string | null; setHoveredBar: (g: string | null) => void;
  gpuColors: Record<string, string>; gpuGradients: Record<string, string>;
}) {
  return (
    <motion.div
      className="glassmorphism-strong rounded-2xl p-6 md:p-8 neon-border mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: gpuGradients[selectedGPU] }}>
            <BarChart2 className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{currentGameData.game}</h3>
            <p className="text-sm text-slate-400">{currentGameData.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-cyan-400">{selectedResolution}</span>
        </div>
      </div>

      <motion.div
        className="relative h-[340px] pt-4"
        animate={{ opacity: animateBars ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <ChartYAxis maxFPS={maxFPS} />
        
        <div className="flex items-end h-full gap-3 px-2 relative">
          <ChartGridLines maxFPS={maxFPS} />
          
          <div className="flex-1 flex items-end gap-2 h-full">
            {gpus.map((gpu, gpuIndex) => {
              const fps = currentGameData.fps[gpu]?.[selectedResolution] || 0;
              const height = maxFPS > 0 ? (fps / maxFPS) * 100 : 0;
              const isSelected = gpu === selectedGPU;
              const isHovered = hoveredBar === gpu;
              
              return (
                <ChartBar
                  key={gpu}
                  gpu={gpu}
                  fps={fps}
                  height={height}
                  isSelected={isSelected}
                  isHovered={isHovered || isSelected}
                  gpuIndex={gpuIndex}
                  gpuColors={gpuColors}
                  gpuGradients={gpuGradients}
                  animateBars={animateBars}
                  onHover={() => setHoveredBar(gpu)}
                  onLeave={() => setHoveredBar(null)}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChartYAxis({ maxFPS }: { maxFPS: number }) {
  const values = [maxFPS, Math.round(maxFPS * 0.75), Math.round(maxFPS * 0.5), Math.round(maxFPS * 0.25), 0];
  
  return (
    <div className="flex flex-col items-end w-16 pr-2 h-full justify-between">
      {values.map((val, i) => (
        <motion.div
          key={i}
          className="w-full text-right text-xs text-slate-500 font-mono"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          style={{ height: `${100 / (values.length - 1)}%` }}
        >
          {val > 0 ? val : "0"}
        </motion.div>
      ))}
    </div>
  );
}

function ChartGridLines({ maxFPS }: { maxFPS: number }) {
  const lines = 4;
  
  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className="w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
          style={{ transformOrigin: "left" }}
        />
      ))}
    </div>
  );
}

function ChartBar({ 
  gpu, fps, height, isSelected, isHovered, gpuIndex,
  gpuColors, gpuGradients, animateBars, onHover, onLeave
}: {
  gpu: string; fps: number; height: number; isSelected: boolean; isHovered: boolean; gpuIndex: number;
  gpuColors: Record<string, string>; gpuGradients: Record<string, string>;
  animateBars: boolean; onHover: () => void; onLeave: () => void;
}) {
  const barScale = useMotionValue(0);
  const glowIntensity = useMotionValue(0);
  const labelScale = useMotionValue(1);

  const barSpring = useSpring(barScale, { stiffness: 150, damping: 18 });
  const glowSpring = useSpring(glowIntensity, { stiffness: 200, damping: 20 });
  const labelSpring = useSpring(labelScale, { stiffness: 300, damping: 25 });

  useEffect(() => {
    const animate = () => {
      barScale.set(animateBars ? height / 100 : 0);
      glowIntensity.set(isHovered ? 1 : 0);
      labelScale.set(isHovered ? 1.1 : 1);
      requestAnimationFrame(animate);
    };
    animate();
  }, [animateBars, height, isHovered, barScale, glowIntensity, labelScale]);

  const barHeight = useTransform(barSpring, (s: number) => `${s * 100}%`);
  const glowOpacity = useTransform(glowSpring, [0, 1], [0, 0.6]);
  const glowBlur = useTransform(glowSpring, [0, 1], [0, 30]);

  return (
    <div className="flex-1 flex flex-col items-center relative group" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className="relative w-full flex-1 flex items-end">
        <motion.div
          className="w-full rounded-t relative overflow-hidden"
          style={{
            background: gpuGradients[gpu],
            height: barHeight,
            boxShadow: `
              0 -4px 20px rgba(0,0,0,0.3),
              inset 0 2px 4px rgba(255,255,255,0.1),
              0 0 ${glowBlur}px ${gpuGradients[gpu].replace('linear-gradient(135deg, ', '').replace(' 100%)', '')}${glowOpacity}
            `,
          }}
          initial={{ height: 0 }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/30 to-transparent rounded-t"
            style={{ opacity: glowIntensity }}
          />
          
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-black/80 whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {fps} FPS
          </motion.div>

          {isSelected && (
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-cyan-500/30 to-transparent"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>
      
      <motion.div
        className={`mt-3 px-3 py-1.5 rounded-lg text-xs font-medium text-center whitespace-nowrap transition-all ${
          isSelected
            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
            : "glassmorphism text-slate-400 hover:text-foreground"
        }`}
        style={{ transform: `scale(${labelScale.get()})` }}
        whileHover={{ scale: 1.05 }}
      >
        {gpu}
        {isSelected && <span className="ml-1 text-cyan-400 animate-bounce">▲</span>}
      </motion.div>
    </div>
  );
}

function BenchmarkStats({ 
  currentGameData, selectedGPU, selectedResolution, gpus, gpuColors 
}: {
  currentGameData: BenchmarkData;
  selectedGPU: string; selectedResolution: string; gpus: string[]; gpuColors: Record<string, string>;
}) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {gpus.map((gpu, i) => {
        const fps = currentGameData.fps[gpu]?.[selectedResolution] || 0;
        const selectedFps = currentGameData.fps[selectedGPU]?.[selectedResolution] || 0;
        const diff = gpu === selectedGPU ? 0 : fps - selectedFps;
        const isSelected = gpu === selectedGPU;
        
        return (
          <StatCard
            key={gpu}
            gpu={gpu}
            fps={fps}
            diff={diff}
            isSelected={isSelected}
            index={i}
            gpuColors={gpuColors}
            selectedGPU={selectedGPU}
          />
        );
      })}
    </motion.div>
  );
}

function StatCard({ gpu, fps, diff, isSelected, index, gpuColors, selectedGPU }: { 
  gpu: string; fps: number; diff: number; isSelected: boolean; index: number; gpuColors: Record<string, string>; selectedGPU: string;
}) {
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    if (isSelected) {
      const interval = setInterval(() => setPulse(p => !p), 2000);
      return () => clearInterval(interval);
    }
  }, [isSelected]);

  return (
    <motion.div
      className={`p-4 rounded-xl text-center transition-all relative overflow-hidden group ${
        isSelected
          ? "glassmorphism-strong neon-border"
          : "glassmorphism hover:neon-border"
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      whileHover={{ y: -4, scale: isSelected ? 1 : 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
          animate={{ opacity: pulse ? 1 : 0.5 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      <div className="relative font-bold text-sm text-slate-400 mb-1">{gpu}</div>
      <motion.div
        className="relative text-3xl md:text-4xl font-bold font-mono"
        style={{ background: gpuColors[gpu] ? `linear-gradient(135deg, ${gpuColors[gpu]})` : 'linear-gradient(135deg, #00F0FF 0%, #7000FF 100%)', WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {fps}
        <span className="text-lg font-normal block text-slate-400" style={{ WebkitTextFillColor: "inherit" }}>FPS</span>
      </motion.div>
      {!isSelected && diff !== 0 && (
        <motion.div
          className="mt-2 text-sm font-medium"
          style={{ color: diff > 0 ? "#22c55e" : "#ef4444" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
        >
          {diff > 0 ? "+" : ""}{diff} vs {selectedGPU.split(" ")[1]}
        </motion.div>
      )}
    </motion.div>
  );
}

function GameSelector({ 
  benchmarkData, selectedGame, setSelectedGame, 
  selectedResolution, gpuColors 
}: {
  benchmarkData: BenchmarkData[];
  selectedGame: number; setSelectedGame: (i: number) => void;
  selectedResolution: string; gpuColors: Record<string, string>;
}) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {benchmarkData.map((game, i) => (
        <GameCard
          key={game.game}
          game={game}
          index={i}
          isSelected={selectedGame === i}
          onClick={() => setSelectedGame(i)}
          selectedResolution={selectedResolution}
          gpuColors={gpuColors}
        />
      ))}
    </motion.div>
  );
}

function GameCard({ game, index, isSelected, onClick, selectedResolution, gpuColors }: {
  game: BenchmarkData; index: number; isSelected: boolean; onClick: () => void;
  selectedResolution: string; gpuColors: Record<string, string>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative p-6 rounded-2xl text-left transition-all overflow-hidden group ${
        isSelected
          ? "glassmorphism-strong"
          : "glassmorphism hover:neon-border"
      }`}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: hovered ? 1.02 : 1,
        borderColor: `rgba(0,240,255,${isSelected ? 0.5 : (hovered ? 0.3 : 0)})`,
        boxShadow: `0 0 ${isSelected ? 30 : (hovered ? 15 : 0)}px rgba(0,240,255,${isSelected ? 0.2 : (hovered ? 0.1 : 0)})`,
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"
        animate={{ opacity: isSelected ? 1 : (hovered ? 0.5 : 0) }}
        transition={{ duration: 0.3 }}
      />
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      <div className="relative flex items-start justify-between mb-4">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${gpuColors["X900 Titan"]})` }}
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Monitor className="w-6 h-6 text-black" />
        </motion.div>
        <motion.div
          className={`w-2.5 h-2.5 rounded-full transition-all ${isSelected ? "bg-cyan-400 scale-100" : "bg-slate-600 scale-50"}`}
          animate={{ scale: isSelected ? 1 : 0.5 }}
        />
      </div>
      
      <motion.h4 className="font-bold text-lg mb-1">{game.game}</motion.h4>
      <p className="text-sm text-slate-400 mb-4">{game.category}</p>
      
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {["1080p", "1440p", "4K"].map(res => (
          <motion.span
            key={res}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${selectedResolution === res ? "bg-cyan-500/20 text-cyan-300" : ""}`}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,240,255,0.1)" }}
          >
            {res}: {game.fps["X900 Titan"]?.[res] || 0}
          </motion.span>
        ))}
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 scale-x-0 origin-left"
        animate={{ scaleX: isSelected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
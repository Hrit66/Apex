"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Target, Info, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface ExplodedPart {
  id: string;
  name: string;
  description: string;
  specs: string[];
  color: string;
  initialPosition: { x: number; y: number; z: number; rotateX: number; rotateY: number; rotateZ: number };
  explodedPosition: { x: number; y: number; z: number; rotateX: number; rotateY: number; rotateZ: number };
}

const parts: ExplodedPart[] = [
  {
    id: "fan-shroud",
    name: "Triple Fan Shroud",
    description: "Optimized airflow geometry with 0dB semi-passive mode",
    specs: ["3x 100mm Fans", "0dB Mode", "Claw Texture", "ARGB Ring"],
    color: "from-slate-700 to-slate-900",
    initialPosition: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: -180, y: -120, z: 100, rotateX: -15, rotateY: 20, rotateZ: -10 },
  },
  {
    id: "heatsink",
    name: "3D Vapor Chamber",
    description: "Sintered wick structure with 12mm vapor chamber base",
    specs: ["12mm Vapor Chamber", "8 Heatpipes", "Nickel Plated", "1.2kg Copper"],
    color: "from-cyan-500/30 to-cyan-700/30",
    initialPosition: { x: 0, y: 0, z: 20, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: 180, y: -100, z: 80, rotateX: 10, rotateY: -15, rotateZ: 5 },
  },
  {
    id: "pcb",
    name: "14-Layer PCB",
    description: "Server-grade 2oz copper with dedicated power planes",
    specs: ["14 Layers", "2oz Copper", "DrMOS 90A", "PCIe 5.0 Ready"],
    color: "from-emerald-500/20 to-emerald-700/20",
    initialPosition: { x: 0, y: 0, z: 40, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: 0, y: 150, z: 120, rotateX: -20, rotateY: 10, rotateZ: 0 },
  },
  {
    id: "die",
    name: "AD102 GPU Die",
    description: "4nm process with 18,432 CUDA cores and 144 SMs",
    specs: ["4nm TSMC", "18,432 Cores", "144 SMs", "76.3B Transistors"],
    color: "from-purple-500/30 to-pink-500/30",
    initialPosition: { x: 0, y: 0, z: 50, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: -100, y: 120, z: 150, rotateX: 15, rotateY: 30, rotateZ: -5 },
  },
  {
    id: "memory",
    name: "24GB GDDR6X",
    description: "Micron 24Gbps modules with ECC support",
    specs: ["24GB Total", "24 Gbps", "384-bit Bus", "ECC Enabled"],
    color: "from-amber-500/30 to-orange-500/30",
    initialPosition: { x: 0, y: 0, z: 55, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: 120, y: 100, z: 130, rotateX: -10, rotateY: -25, rotateZ: 10 },
  },
  {
    id: "backplate",
    name: "Reinforced Backplate",
    description: "Die-cast aluminum with thermal pad contact",
    specs: ["Aluminum Alloy", "Thermal Pads", "Structural Rigidity", "Laser Etched"],
    color: "from-slate-600 to-slate-800",
    initialPosition: { x: 0, y: 0, z: 60, rotateX: 0, rotateY: 0, rotateZ: 0 },
    explodedPosition: { x: 60, y: -80, z: -80, rotateX: 25, rotateY: 0, rotateZ: 15 },
  },
];

const tooltips = [
  { partId: "fan-shroud", label: "0dB Semi-Passive", position: { x: -200, y: -150 } },
  { partId: "heatsink", label: "3D Vapor Chamber", position: { x: 200, y: -130 } },
  { partId: "pcb", label: "14-Layer PCB", position: { x: 20, y: 200 } },
  { partId: "die", label: "AD102-300 GPU", position: { x: -130, y: 170 } },
  { partId: "memory", label: "24GB GDDR6X", position: { x: 150, y: 130 } },
  { partId: "backplate", label: "Thermal Backplate", position: { x: 80, y: -100 } },
];

export default function ExplodedView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="exploded" ref={containerRef} className="relative py-32 px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(112,0,255,0.04)_0%,_transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism neon-border-purple text-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Engineering Breakdown</span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Exploded View: <span className="text-gradient-purple">X900 Architecture</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Scroll to disassemble the X900 Titan. Every component engineered with precision.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="relative">
            <div className="relative aspect-square max-w-xl mx-auto perspective-1000">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative preserve-3d"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    rotateX: useTransform(progress, [0, 1], [0, 15]),
                    rotateY: useTransform(progress, [0, 1], [0, -20]),
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {parts.map((part, index) => (
                    <ExplodedPart3D
                      key={part.id}
                      part={part}
                      progress={progress}
                      index={index}
                      total={parts.length}
                    />
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"
                style={{ filter: "blur(20px)" }}
              />
            </div>

            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <ChevronDown className="w-5 h-5 animate-bounce" />
              <span>Scroll to explode</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              className="glassmorphism-strong rounded-2xl p-6 neon-border-purple sticky top-24"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center neon-border-purple">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Interactive Specs</h3>
                  <p className="text-sm text-slate-400">Hover parts to reveal details</p>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
                {parts.map((part, index) => (
                  <PartInfoCard
                    key={part.id}
                    part={part}
                    progress={progress}
                    index={index}
                    isActive={useTransform(progress, [index / parts.length, (index + 1) / parts.length], [0, 1])}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="glassmorphism rounded-2xl p-6 neon-border sticky top-24 mt-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Key Innovations
              </h3>
              <div className="space-y-3">
                {[
                  "3D Vapor Chamber: 40% better heat dissipation vs traditional",
                  "14-Layer PCB: Cleanest power delivery in class",
                  "0dB Fan Mode: Silent until 60°C junction temp",
                  "Die-Cast Frame: Eliminates PCB flex under heavy coolers",
                ].map((innovation, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 p-3 glassmorphism rounded-xl border border-border/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  >
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-cyan-400/50" />
                    <span className="text-sm text-slate-300">{innovation}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"
        />
      </div>
    </section>
  );
}

function ExplodedPart3D({ part, progress, index, total }: { part: ExplodedPart; progress: any; index: number; total: number }) {
  const partProgress = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
  
  const x = useTransform(partProgress, [0, 1], [part.initialPosition.x, part.explodedPosition.x]);
  const y = useTransform(partProgress, [0, 1], [part.initialPosition.y, part.explodedPosition.y]);
  const z = useTransform(partProgress, [0, 1], [part.initialPosition.z, part.explodedPosition.z]);
  const rotateX = useTransform(partProgress, [0, 1], [part.initialPosition.rotateX, part.explodedPosition.rotateX]);
  const rotateY = useTransform(partProgress, [0, 1], [part.initialPosition.rotateY, part.explodedPosition.rotateY]);
  const rotateZ = useTransform(partProgress, [0, 1], [part.initialPosition.rotateZ, part.explodedPosition.rotateZ]);

  const opacity = useTransform(partProgress, [0, 0.1, 0.9, 1], [1, 1, 0.8, 1]);

  return (
    <motion.div
      className="absolute preserve-3d"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        x,
        y,
        z,
        rotateX,
        rotateY,
        rotateZ,
        opacity,
      }}
    >
      <PartMesh part={part} />
    </motion.div>
  );
}

function PartMesh({ part }: { part: ExplodedPart }) {
  const meshes: Record<string, React.ReactNode> = {
    "fan-shroud": (
      <div className="w-64 h-64 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br {part.color} border border-slate-600/50" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.3)" }} />
        <div className="absolute inset-4 flex items-center justify-center gap-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-20 h-20 rounded-xl bg-slate-800/80 border border-slate-600 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900" />
            </motion.div>
          ))}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50 blur-lg" />
      </div>
    ),
    "heatsink": (
      <div className="w-56 h-48 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 rounded-t-xl bg-gradient-to-r from-cyan-500/30 to-cyan-700/30 border border-cyan-500/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-40 flex justify-between px-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-1.5 h-full rounded-t bg-gradient-to-t from-cyan-400/50 to-cyan-700/30" />
          ))}
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-transparent border border-cyan-500/20" />
      </div>
    ),
    "pcb": (
      <div className="w-56 h-44 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-700/10 border border-emerald-500/20" />
        <div className="absolute inset-4 grid grid-cols-4 grid-rows-3 gap-1 p-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-emerald-500/20 rounded border border-emerald-500/10" />
          ))}
        </div>
        <div className="absolute bottom-2 right-2 w-16 h-8 rounded bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/30" />
      </div>
    ),
    "die": (
      <div className="w-24 h-24 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30" />
        <div className="absolute inset-2 grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-purple-400/50 to-pink-400/50 rounded"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono text-purple-400 text-center whitespace-nowrap">
          AD102-300
        </div>
      </div>
    ),
    "memory": (
      <div className="w-40 h-20 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 flex gap-1 p-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 h-full bg-gradient-to-t from-amber-500/30 to-orange-500/30 rounded-t border border-amber-500/20" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800 border-t border-slate-600 flex items-center justify-center gap-1 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded bg-cyan-400/50" />
          ))}
        </div>
      </div>
    ),
    "backplate": (
      <div className="w-64 h-48 relative preserve-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600" />
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-gradient-cyan mb-1">APEX</div>
            <div className="text-xs text-slate-400 tracking-widest">HARDWARE</div>
          </div>
        </div>
        <div className="absolute inset-4 border-2 border-dashed border-cyan-500/20 rounded-lg" />
      </div>
    ),
  };

  return meshes[part.id] || null;
}

function PartInfoCard({ part, progress, index, isActive }: { part: ExplodedPart; progress: any; index: number; isActive: any }) {
  const activeProgress = useTransform(isActive, [0, 1], [0, 1]);
  const isVisible = useTransform(progress, [index / 6 - 0.1, index / 6 + 0.1], [0, 1]);

  return (
    <motion.div
      className="group relative overflow-hidden"
      style={{
        opacity: isVisible,
        background: `linear-gradient(135deg, ${part.color})`,
        borderColor: activeProgress,
        boxShadow: activeProgress,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
        style={{ opacity: activeProgress }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative p-4">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: part.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Target className="w-4 h-4" />
          </motion.div>
          <div>
            <h4 className="font-bold text-white">{part.name}</h4>
            <p className="text-xs text-slate-300/80">{part.description}</p>
          </div>
        </div>

        <motion.div
          className="flex flex-wrap gap-1.5"
          style={{ opacity: activeProgress }}
          transition={{ duration: 0.3 }}
        >
          {part.specs.map((spec, i) => (
            <motion.span
              key={i}
              className="px-2 py-1 text-xs rounded bg-white/10 border border-white/20 text-white/90 backdrop-blur"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
            >
              {spec}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, ChevronRight, Award, Zap, MemoryStick, Thermometer, DollarSign, Star, Shield } from "lucide-react";

interface SpecRow {
  label: string;
  icon: any;
  unit?: string;
  highlight?: boolean;
  gpus: { [key: string]: string | number };
}

const specRows: SpecRow[] = [
  { label: "GPU Architecture", icon: Award, gpus: { "X900 Titan": "Blackwell Ultra", "X900 Pro": "Blackwell Ultra", "X800 XT": "Blackwell", "RTX 4090": "Ada Lovelace", "RTX 4080": "Ada Lovelace" } },
  { label: "Process Node", icon: Zap, gpus: { "X900 Titan": "4nm TSMC", "X900 Pro": "4nm TSMC", "X800 XT": "4nm TSMC", "RTX 4090": "4nm TSMC", "RTX 4080": "4nm TSMC" } },
  { label: "CUDA Cores / Stream Processors", icon: Star, gpus: { "X900 Titan": "18,432", "X900 Pro": "14,592", "X800 XT": "10,240", "RTX 4090": "16,384", "RTX 4080": "9,728" } },
  { label: "Tensor Cores (AI)", icon: Star, gpus: { "X900 Titan": "576 (5th Gen)", "X900 Pro": "456 (5th Gen)", "X800 XT": "320 (5th Gen)", "RTX 4090": "512 (4th Gen)", "RTX 4080": "304 (4th Gen)" } },
  { label: "RT Cores", icon: Star, gpus: { "X900 Titan": "144 (4th Gen)", "X900 Pro": "114 (4th Gen)", "X800 XT": "80 (4th Gen)", "RTX 4090": "128 (3rd Gen)", "RTX 4080": "76 (3rd Gen)" } },
  { label: "Base Clock", icon: Zap, unit: "MHz", gpus: { "X900 Titan": "2,235", "X900 Pro": "2,100", "X800 XT": "1,950", "RTX 4090": "2,230", "RTX 4080": "2,205" } },
  { label: "Boost Clock", icon: Zap, unit: "MHz", highlight: true, gpus: { "X900 Titan": "2,850", "X900 Pro": "2,650", "X800 XT": "2,480", "RTX 4090": "2,520", "RTX 4080": "2,505" } },
  { label: "Memory Size", icon: MemoryStick, unit: "GB", highlight: true, gpus: { "X900 Titan": "24", "X900 Pro": "16", "X800 XT": "12", "RTX 4090": "24", "RTX 4080": "16" } },
  { label: "Memory Type", icon: MemoryStick, gpus: { "X900 Titan": "GDDR6X", "X900 Pro": "GDDR6X", "X800 XT": "GDDR6", "RTX 4090": "GDDR6X", "RTX 4080": "GDDR6X" } },
  { label: "Memory Speed", icon: MemoryStick, unit: "Gbps", gpus: { "X900 Titan": "24", "X900 Pro": "22", "X800 XT": "18", "RTX 4090": "21", "RTX 4080": "22.4" } },
  { label: "Memory Bus Width", icon: MemoryStick, unit: "bit", gpus: { "X900 Titan": "384", "X900 Pro": "256", "X800 XT": "192", "RTX 4090": "384", "RTX 4080": "256" } },
  { label: "Memory Bandwidth", icon: Zap, unit: "GB/s", highlight: true, gpus: { "X900 Titan": "1,152", "X900 Pro": "704", "X800 XT": "432", "RTX 4090": "1,008", "RTX 4080": "716.8" } },
  { label: "TDP / Total Graphics Power", icon: Thermometer, unit: "W", gpus: { "X900 Titan": "450", "X900 Pro": "380", "X800 XT": "320", "RTX 4090": "450", "RTX 4080": "320" } },
  { label: "Power Connectors", icon: Zap, gpus: { "X900 Titan": "12VHPWR x2", "X900 Pro": "12VHPWR", "X800 XT": "12VHPWR", "RTX 4090": "12VHPWR", "RTX 4080": "12VHPWR" } },
  { label: "PCIe Interface", icon: Shield, gpus: { "X900 Titan": "PCIe 5.0 x16", "X900 Pro": "PCIe 5.0 x16", "X800 XT": "PCIe 5.0 x16", "RTX 4090": "PCIe 4.0 x16", "RTX 4080": "PCIe 4.0 x16" } },
  { label: "Display Outputs", icon: Award, gpus: { "X900 Titan": "3x DP 2.1, 1x HDMI 2.1a", "X900 Pro": "3x DP 2.1, 1x HDMI 2.1a", "X800 XT": "3x DP 2.1, 1x HDMI 2.1a", "RTX 4090": "3x DP 1.4a, 1x HDMI 2.1a", "RTX 4080": "3x DP 1.4a, 1x HDMI 2.1a" } },
  { label: "MSRP", icon: DollarSign, unit: "$", gpus: { "X900 Titan": "1,999", "X900 Pro": "1,299", "X800 XT": "899", "RTX 4090": "1,599", "RTX 4080": "1,199" } },
];

const gpuOrder = ["X900 Titan", "X900 Pro", "X800 XT", "RTX 4090", "RTX 4080"];
const gpuColors: Record<string, string> = {
  "X900 Titan": "from-cyan-400 to-purple-500",
  "X900 Pro": "from-cyan-300 to-blue-500",
  "X800 XT": "from-blue-400 to-cyan-500",
  "RTX 4090": "from-green-400 to-emerald-500",
  "RTX 4080": "from-green-300 to-teal-500",
};

export default function SpecComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [hoveredGPU, setHoveredGPU] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <section id="specs" ref={containerRef} className="relative py-24 px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(112,0,255,0.04)_0%,_transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism neon-border-purple text-sm mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Technical Specifications</span>
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Spec <span className="text-gradient-purple">Comparison Matrix</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Side-by-side comparison of every critical specification. Hover rows for detailed analysis.
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl glassmorphism-strong neon-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="sticky left-0 z-10 w-64 px-6 py-4 text-left font-medium text-slate-400 uppercase tracking-wider text-xs bg-slate-950/80 backdrop-blur">
                    Specification
                  </th>
                  {gpuOrder.map((gpu, i) => (
                    <motion.th
                      key={gpu}
                      className="px-6 py-4 text-left font-bold relative"
                      style={{ minWidth: "160px" }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${gpuColors[gpu]})` }}>
                          {gpu.split(" ")[1] || gpu[0]}
                        </div>
                        <span className="text-sm">{gpu}</span>
                      </div>
                      {i < gpuOrder.length - 1 && (
                        <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent" />
                      )}
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row, rowIndex) => (
                  <motion.tr
                    key={row.label}
                    className={`group border-b border-border/30 transition-all duration-300 ${
                      row.highlight ? "bg-cyan-500/5" : ""
                    } ${hoveredGPU ? "opacity-50" : ""}`}
                    style={{
                      background: row.highlight ? "linear-gradient(90deg, rgba(0,240,255,0.03) 0%, transparent 100%)" : "transparent",
                    }}
                    onMouseEnter={() => setExpandedRow(row.label)}
                    onMouseLeave={() => setExpandedRow(null)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: rowIndex * 0.02 }}
                  >
                    <td className="sticky left-0 z-10 w-64 px-6 py-4 font-medium text-slate-300 bg-slate-950/80 backdrop-blur relative">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400" style={{ background: `linear-gradient(135deg, ${gpuColors["X900 Titan"]})` }}>
                          <row.icon className="w-4 h-4" />
                        </div>
                        <span>{row.label}</span>
                      </div>
                      {row.highlight && (
                        <motion.div
                          className="absolute right-0 top-0 bottom-0 w-1"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="h-full bg-gradient-to-b from-cyan-500 to-purple-500" />
                        </motion.div>
                      )}
                    </td>
                    {gpuOrder.map((gpu, gpuIndex) => {
                      const value = row.gpus[gpu];
                      const isBest = gpuIndex === 0 && typeof value === "number";
                      const displayValue = typeof value === "number" && row.unit 
                        ? `${value.toLocaleString()} ${row.unit}` 
                        : typeof value === "number" && row.label.includes("MSRP")
                        ? `$${value.toLocaleString()}`
                        : String(value);
                      
                      return (
                        <motion.td
                          key={gpu}
                          className="px-6 py-4 relative group"
                          onMouseEnter={() => setHoveredGPU(gpu)}
                          onMouseLeave={() => setHoveredGPU(null)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: rowIndex * 0.02 + gpuIndex * 0.01 }}
                        >
                          <div className="flex items-center gap-3 min-h-[48px]">
                            <div className={`font-mono font-bold text-lg transition-colors ${
                              gpu.startsWith("X900") ? "text-cyan-300" : "text-green-300"
                            } ${isBest ? "text-cyan-400" : ""}`}>
                              {displayValue}
                            </div>
                            {isBest && (
                              <motion.div
                                className="flex items-center gap-1 text-xs text-cyan-400"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Check className="w-3 h-3" />
                                <span>Best</span>
                              </motion.div>
                            )}
                          </div>
                          
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 pointer-events-none"
                            animate={{ opacity: hoveredGPU === gpu ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                          
                          <motion.div
                            className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 opacity-0"
                            animate={{ opacity: hoveredGPU === gpu ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { title: "Performance per Dollar", value: "X900 Pro", desc: "Best value flagship", icon: DollarSign, color: "from-amber-500 to-orange-500" },
            { title: "Raw Performance", value: "X900 Titan", desc: "Absolute maximum FPS", icon: Zap, color: "from-cyan-500 to-purple-500" },
            { title: "Efficiency", value: "X800 XT", desc: "Best perf/watt ratio", icon: Shield, color: "from-green-500 to-emerald-500" },
          ].map((item, i) => (
            <motion.div
              className="glassmorphism-strong rounded-2xl p-6 neon-border relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.color})` }}>
                  <item.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <p className="font-bold text-lg">{item.value}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm relative">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 glassmorphism rounded-2xl p-8 neon-border-purple"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center neon-border-purple">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Why Choose Apex X900 Series?</h3>
              <p className="text-slate-400">Engineered advantages over the competition</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "PCIe 5.0 native support for 2x bandwidth",
              "5th Gen Tensor Cores: 2x AI throughput",
              "4th Gen RT Cores: 2x ray tracing perf",
              "24 Gbps GDDR6X: World's fastest memory",
              "3D Vapor Chamber: 40% better thermals",
              "ATX 3.0 / 12VHPWR native power delivery",
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 glassmorphism rounded-xl border border-border/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.05 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
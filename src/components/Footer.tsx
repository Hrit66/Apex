"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Mail, ArrowRight, Check, X, Loader2, Sparkles, Cpu, Shield, Truck, Headphones, Globe, ChevronRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    
    setStatus("submitting");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  const glowX = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const footerLinks = {
    Products: [
      { label: "Graphics Cards", href: "#" },
      { label: "Processors", href: "#" },
      { label: "Memory (RAM)", href: "#" },
      { label: "Cooling Solutions", href: "#" },
      { label: "Power Supplies", href: "#" },
      { label: "Custom Builds", href: "#" },
    ],
    Support: [
      { label: "Drivers & Downloads", href: "#" },
      { label: "Warranty Registration", href: "#" },
      { label: "RMA Service", href: "#" },
      { label: "Compatibility Checker", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Contact Support", href: "#" },
    ],
    Company: [
      { label: "About ApexHardware", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Investor Relations", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    Community: [
      { label: "Discord Community", href: "#" },
      { label: "Reddit", href: "#" },
      { label: "YouTube Channel", href: "#" },
      { label: "Twitter / X", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Developer Program", href: "#" },
    ],
  };

  const features = [
    { icon: Shield, title: "Lifetime Warranty", desc: "On select X900 series" },
    { icon: Truck, title: "Free Express Shipping", desc: "Orders over $299" },
    { icon: Headphones, title: "24/7 Expert Support", desc: "Real engineers, not bots" },
    { icon: Globe, title: "Global Availability", desc: "Ships to 120+ countries" },
  ];

  return (
    <footer id="build" ref={containerRef} className="relative bg-slate-950/50 border-t border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(0,240,255,0.03)_0%,_transparent_60%)]" />
      
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none -translate-y-1/2"
        style={{
          background: "linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(112,0,255,0.06) 100%)",
          transform: `translate(-50%, -50%) translate(${glowX}px, ${glowY}px)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold tracking-tight">ApexHardware</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-xs leading-relaxed">
              Engineered for extreme performance. Pushing the boundaries of compute since 2019.
            </p>
            
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                <motion.input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status !== "idle"}
                  className="w-full px-12 py-4 pl-12 rounded-xl glassmorphism border border-border focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-foreground placeholder-slate-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-medium text-sm transition-all hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status !== "idle"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {status === "submitting" && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {status === "idle" && <ArrowRight className="w-5 h-5" />}
                  {status === "success" && <Check className="w-5 h-5" />}
                  {status === "error" && <X className="w-5 h-5" />}
                </motion.button>
              </div>
              
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    className="absolute bottom-full left-0 right-0 mb-3 p-4 rounded-xl glassmorphism-strong neon-border text-green-400 text-sm flex items-center gap-2 animate-slide-up"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Thanks for subscribing! Early access confirmed.</span>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    className="absolute bottom-full left-0 right-0 mb-3 p-4 rounded-xl glassmorphism-strong border-red-500/50 text-red-400 text-sm flex items-center gap-2 animate-slide-up"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span>Please enter a valid email address</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="text-xs text-slate-500 mt-4 max-w-xs">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 + catIndex * 0.05 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.15 + catIndex * 0.05 + linkIndex * 0.03 }}
                  >
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"
                    >
                      {link.label}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glassmorphism rounded-2xl p-6 neon-border group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(0, 240, 255, 0.3)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? "rgba(0,240,255,0.2)" : "rgba(112,0,255,0.2)"})` }}>
                  <feature.icon className="w-6 h-6" style={{ color: i % 2 === 0 ? "#00F0FF" : "#7000FF" }} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">{feature.title}</h5>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="pt-8 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span className="font-mono text-cyan-400">© 2025 ApexHardware</span>
              <span>All rights reserved.</span>
              <span className="hidden sm:inline">Engineered with precision.</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="glassmorphism p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:neon-border transition-all" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="glassmorphism p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:neon-border transition-all" aria-label="Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.38-.444.87-.608 1.25a18.27 18.27 0 0 0-5.075 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.997 4.668.078.078 0 0 0 .085-.028c.466-.62.904-1.32 1.296-2.063a.077.077 0 0 1 .082-.028h.077a.074.074 0 0 1 .072.04c.676 1.3 2.07 3.74 5.148 3.74 3.082 0 4.49-2.78 5.165-3.74a.077.077 0 0 1 .082.028c.39.743.83 1.446 1.298 2.063a.077.077 0 0 0 .084.028 19.839 19.839 0 0 0 6.001-4.668.077.077 0 0 0 .031-.057c.413-4.545-.496-9.146-3.564-13.66a.061.061 0 0 0-.031-.027zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="#" className="glassmorphism p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:neon-border transition-all" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.5.46 8.5.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" className="glassmorphism p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:neon-border transition-all" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
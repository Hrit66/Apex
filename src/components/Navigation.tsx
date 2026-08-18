"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Cpu, ChevronDown } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Components", href: "#components" },
  { label: "Technology", href: "#exploded" },
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "Specs", href: "#specs" },
  { label: "Build Custom", href: "#build" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({
    target: navRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });
    return unsubscribe;
  }, [scrollY]);

  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.9]);
  const blurAmount = useTransform(scrollY, [0, 50], [0, 20]);

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: `rgba(13, 15, 18, ${bgOpacity.get()})`,
        backdropFilter: `blur(${blurAmount.get()}px)`,
        WebkitBackdropFilter: `blur(${blurAmount.get()}px)`,
        borderBottom: scrolled ? "1px solid rgba(42, 48, 58, 0.5)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">ApexHardware</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                whileHover={{ color: "#00F0FF" }}
              >
                {link.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            
            <motion.a
              href="#build"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold text-sm transition-all hover:from-cyan-400 hover:to-purple-500"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,240,255,0.4)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Build Custom Rig
            </motion.a>
          </div>

          <motion.button
            className="lg:hidden p-2 rounded-xl glassmorphism text-slate-300 hover:text-foreground transition-colors z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="lg:hidden overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-6 space-y-4 border-t border-border/50">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.03 }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#build"
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold text-center transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  onClick={() => setMobileOpen(false)}
                >
                  Build Custom Rig
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
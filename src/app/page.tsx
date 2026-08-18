"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";

const Navigation = dynamic(() => import("@/components/Navigation"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const ComponentCategories = dynamic(() => import("@/components/ComponentCategories"), { ssr: false });
const ExplodedView = dynamic(() => import("@/components/ExplodedView"), { ssr: false });
const FPSBenchmark = dynamic(() => import("@/components/FPSBenchmark"), { ssr: false });
const SpecComparison = dynamic(() => import("@/components/SpecComparison"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  return (
    <MotionConfig transition={{ type: "spring", stiffness: 100, damping: 15 }}>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Hero />
        <ComponentCategories />
        <ExplodedView />
        <FPSBenchmark />
        <SpecComparison />
        <Footer />
      </div>
    </MotionConfig>
  );
}
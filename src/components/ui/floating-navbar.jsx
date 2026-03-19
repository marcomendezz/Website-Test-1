"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "../../lib/utils";
import { Button } from "./moving-border";

export const FloatingNav = ({
  navItems,
  className,
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0.05) {
        // always visible at the very top so users see it initially, or keep hidden?
        // Actually, the user's component hides it at top if not scrolling down. Let's make it visible at top!
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto z-[5000] items-center justify-center",
          className
        )}
      >
        <div className="flex items-center justify-center gap-4 rounded-full border border-white/10 bg-[#111111]/80 backdrop-blur-2xl px-4 py-2 shadow-[0_8px_30px_rgba(255,255,255,0.08)]">
          {/* Logo element inside Nav */}
          {navItems.find(n => n.name === 'Logo') && (
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 mr-2">
              <img src="/logo.svg" alt="HustleMark" className="w-6 h-6 object-contain invert hover:scale-110 transition-transform" />
            </a>
          )}
          
          {/* Nav items container */}
          <div className="flex items-center gap-2">
            {navItems.filter(n => n.name !== 'Logo').map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-primary/70 transition-colors hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="block md:hidden">{navItem.icon}</span>
                <span className="hidden md:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/20 ml-2" />

          {/* CTA Button */}
          <Button as="a" href="#features" duration={3000} borderRadius="9999px" containerClassName="ml-2 magnetic" className="bg-accent px-5 py-2 text-sm font-bold text-background transition-colors hover:bg-white hover:text-black">
            <span>Contact</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, CheckCircle, Activity, ChevronRight, Eye, Shield, Cpu, Box } from 'lucide-react';
import { CometCard } from './components/ui/comet-card';
import { FloatingNav } from './components/ui/floating-navbar';
import { EncryptedText } from './components/ui/encrypted-text';
import { TextGenerateEffect } from './components/ui/text-generate-effect';
import { Button } from './components/ui/moving-border';
import { cn } from './lib/utils';
import { Meteors } from './Meteors';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
});

export default function App() {
  const mainRef = useRef(null);
  const [hoveredArtifact, setHoveredArtifact] = useState(null);
  
  const scrollToTop = (e) => {
    if(e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [protocolProgress, setProtocolProgress] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Navbar Morphing
      ScrollTrigger.create({
        start: 'top -100px',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: '#navbar' }
      });

      // 2. Hero Animation (Apple-style Blur Reveal)
      gsap.from('.hero-element', {
        y: 60,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Global Apple-style Reveal for Section Headings
      const appleReveals = gsap.utils.toArray('.apple-reveal');
      appleReveals.forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          },
          y: 40,
          opacity: 0,
          filter: 'blur(12px)',
          duration: 1.2,
          ease: 'power3.out'
        });
      });

      // 3. Shuffler logic
      // Handled via React state / effects below

      // 4. Philosophy Animation
      gsap.from('.philosophy-line', {
        scrollTrigger: {
          trigger: '#philosophy',
          start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 5. Protocol Stacking (delayed blur + includes last card)
      const protocolCards = gsap.utils.toArray('.protocol-card');
      const card1 = protocolCards[0];
      const card2 = protocolCards[1];
      const card3 = protocolCards[2];

      gsap.to(card1, {
        scale: 0.95, opacity: 0.5,
        scrollTrigger: { trigger: card2, start: "top 60%", end: "top 40%", scrub: true }
      });
      gsap.to(card2, {
        scale: 0.95, opacity: 0.5,
        scrollTrigger: { trigger: card3, start: "top 60%", end: "top 40%", scrub: true }
      });
      gsap.to(card3, {
        scale: 0.95, opacity: 0.5,
        scrollTrigger: { trigger: "#pricing", start: "top 80%", end: "top 60%", scrub: true }
      });

      // Footer Entrance
      gsap.fromTo("#footer",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#footer", start: "top 90%" } }
      );


      // Tracing Beam Animation Trigger
      ScrollTrigger.create({
        trigger: "#protocol",
        start: "top 40%",
        end: "bottom 80%",
        onUpdate: (self) => setProtocolProgress(self.progress)
      });

      // Magnetic Buttons
      const magneticItems = document.querySelectorAll('.magnetic');
      magneticItems.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
      });

      // Mobile Artifact Focus ScrollTriggers
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (isTouch) {
        [0, 1, 2].forEach(index => {
          ScrollTrigger.create({
            trigger: `.artifact-card-mobile-${index}`,
            start: "top center+=100",
            end: "bottom center-=100",
            onEnter: () => setHoveredArtifact(index),
            onEnterBack: () => setHoveredArtifact(index),
            onLeave: () => setHoveredArtifact(null),
            onLeaveBack: () => setHoveredArtifact(null),
          });
        });
      }

      // Final Refresh to align with smooth-scroll
      ScrollTrigger.refresh();

    }, mainRef);
    return () => ctx.revert();
  }, []);

  // Diagnostic Shuffler State
  const [shufflerCards, setShufflerCards] = useState([
    { id: 1, title: 'Business Diagnostics', desc: 'Deep analysis of assets and leaks.' },
    { id: 2, title: 'Acquisition Modeling', desc: 'CAC, LTV, and channel projection.' },
    { id: 3, title: 'Strategic Blueprint', desc: 'Visual mapping of the entire ecosystem.' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShufflerCards(prev => {
        const next = [...prev];
        const last = next.pop();
        next.unshift(last);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry Typewriter State
  const [typeText, setTypeText] = useState('');
  const fullText = "Inicializando Ecosistema de Adquisición...\n> Optimizando Funnel B2B...\n> Sistema Activado. Métricas en Verde.";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i <= fullText.length) {
        setTypeText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 50);
    return () => clearInterval(typing);
  }, []);

  const navItems = [
    { name: "Logo" },
    { name: "Method", link: "#features", icon: <Box className="h-4 w-4 text-primary" /> },
    { name: "Protocol", link: "#protocol", icon: <Activity className="h-4 w-4 text-primary" /> },
    { name: "Fee", link: "#pricing", icon: <Shield className="h-4 w-4 text-primary" /> },
  ];

  return (
    <>
    <div ref={mainRef} className="relative min-h-screen bg-background text-primary selection:bg-accent selection:text-background font-sans overflow-x-hidden">
      <div className="noise-overlay"></div>

      <FloatingNav navItems={navItems} />

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center pt-40 pb-24 px-6 lg:px-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <Meteors number={20} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl text-crisp flex flex-col items-center">
          <div className="hero-element font-playfair text-xl md:text-2xl lg:text-3xl text-primary/80 mb-8 italic apple-reveal text-center drop-shadow-md tracking-wide">
            <TextGenerateEffect words='"We design the system, you execute the growth."' className="font-playfair italic" textClassName="text-primary/80" />
          </div>
          
          <h1 className="leading-[1.05] mb-12 flex flex-col items-center w-full drop-shadow-lg">
            <div className="hero-element text-4xl sm:text-6xl md:text-[8vw] font-bold tracking-tighter text-primary whitespace-nowrap">
              <EncryptedText text="Strategy meets" revealDelayMs={50} encryptedClassName="text-white/20" revealedClassName="text-primary" />
            </div>
            <div className="hero-element text-5xl sm:text-7xl md:text-[9vw] font-bold tracking-tighter text-primary mt-2">
              <EncryptedText text="Precision." revealDelayMs={60} encryptedClassName="text-white/20" revealedClassName="text-primary" />
            </div>
          </h1>
          
          <div className="hero-element relative z-50">
            <Button borderRadius="9999px" duration={3500} className="bg-accent text-background px-8 py-4 text-base font-bold tracking-wide hover:bg-white hover:text-black transition-colors" containerClassName="min-w-[280px] magnetic">
              <span className="relative z-10 flex items-center gap-3">Request your Diagnostics <ArrowRight className="w-5 h-5" /></span>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Value Props) */}
      <section id="features" className="py-32 px-6 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 apple-reveal">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Functional Artifacts</h2>
            <p className="text-primary/60 font-sans tracking-[0.2em] text-xs font-bold uppercase max-w-md">01 // RECONSTRUCTING THE FOUNDATION</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Diagnostic Shuffler */}
            <div 
              onMouseEnter={() => setHoveredArtifact(0)}
              onMouseLeave={() => setHoveredArtifact(null)}
              className={cn("artifact-card-mobile-0 bg-surface rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[400px] transition-all duration-300 ease-out", hoveredArtifact !== null && hoveredArtifact !== 0 ? "blur-sm scale-[0.98]" : "")}
            >
              <div className="mb-auto z-10">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Diagnostics before action</h3>
                <p className="text-sm text-primary/60 leading-relaxed">We don't execute without understanding. The Diagnostics reveal exactly where you are.</p>
              </div>
              <div className="relative h-40 mt-8 perspectives-1000 z-10">
                {shufflerCards.map((card, index) => {
                  const isTop = index === 0;
                  const zIndex = 30 - index * 10;
                  const y = index * 12;
                  const scale = 1 - index * 0.05;
                  const opacity = 1 - index * 0.3;
                  return (
                    <div 
                      key={card.id}
                      className="absolute left-0 right-0 p-4 rounded-xl bg-background border border-white/10 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      style={{ transform: `translateY(${y}px) scale(${scale})`, zIndex, opacity }}
                    >
                      <div className="font-mono text-xs text-accent mb-1">DATA.{card.id}</div>
                      <div className="text-sm font-semibold">{card.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Card 2: Telemetry Typewriter */}
            <div 
              onMouseEnter={() => setHoveredArtifact(1)}
              onMouseLeave={() => setHoveredArtifact(1)}
              className={cn("artifact-card-mobile-1 bg-surface rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[400px] transition-all duration-300 ease-out", hoveredArtifact !== null && hoveredArtifact !== 1 ? "blur-sm scale-[0.98]" : "")}
            >
              <div className="mb-auto z-10">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                  <Cpu size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">System &gt; Tactics</h3>
                <p className="text-sm text-primary/60 leading-relaxed">We design a complete ecosystem, not isolated posts.</p>
              </div>
              <div className="mt-8 h-40 bg-background rounded-xl border border-white/5 p-4 relative z-10 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <svg className="w-full h-full relative z-10" viewBox="0 0 200 100" fill="none">
                  {/* System Architecture */}
                  <rect x="75" y="30" width="50" height="40" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="fill-surface group-hover:stroke-white/30 transition-colors duration-500" />
                  <rect x="80" y="35" width="40" height="30" rx="2" stroke="rgba(255,255,255,0.05)" strokeWidth="1" className="fill-transparent group-hover:stroke-white/20 transition-colors duration-500" />
                  
                  <path d="M 30 50 L 75 50 M 125 50 L 170 50 M 100 15 L 100 30 M 100 70 L 100 85" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 3" className="group-hover:stroke-white/50 transition-colors duration-500" />
                  
                  <circle cx="30" cy="50" r="3" className="fill-white/20 group-hover:fill-white/80 transition-colors duration-500" />
                  <circle cx="170" cy="50" r="3" className="fill-white/20 group-hover:fill-white/80 transition-colors duration-500" />
                  <circle cx="100" cy="15" r="3" className="fill-white/20 group-hover:fill-white/80 transition-colors duration-500" />
                  <circle cx="100" cy="85" r="3" className="fill-white/20 group-hover:fill-white/80 transition-colors duration-500" />

                  {/* Pulsing Core */}
                  <circle cx="100" cy="50" r="6" className="fill-accent/20 animate-ping" />
                  <circle cx="100" cy="50" r="2.5" className="fill-accent" />
                </svg>
              </div>
            </div>

            {/* Card 3: Cursor Protocol Scheduler */}
            <div 
              onMouseEnter={() => setHoveredArtifact(2)}
              onMouseLeave={() => setHoveredArtifact(null)}
              className={cn("artifact-card-mobile-2 bg-surface rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[400px] transition-all duration-300 ease-out", hoveredArtifact !== null && hoveredArtifact !== 2 ? "blur-sm scale-[0.98]" : "")}
            >
              <div className="mb-auto z-10">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Support without <br/>dependency</h3>
                <p className="text-sm text-primary/60 leading-relaxed">Done With You model: you learn, you execute, you grow. Autonomous.</p>
              </div>
              <div className="mt-8 h-40 bg-background rounded-xl border border-white/5 p-4 relative z-10 overflow-hidden group">
                {/* Simulated Grid */}
                <div className="grid grid-cols-7 gap-1 h-full opacity-50">
                  {Array.from({length: 21}).map((_, i) => (
                    <div key={i} className={`rounded-sm border border-white/5 transition-colors duration-500 ${i === 12 ? 'bg-accent/40 group-hover:bg-accent shadow-[0_0_10px_rgba(201,168,76,0.3)]' : 'bg-white/5'}`}></div>
                  ))}
                </div>
                {/* Simulated Cursor */}
                <div className="absolute top-4 left-4 w-5 h-5 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:top-[50%] group-hover:left-[65%]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white drop-shadow-md">
                    <polygon points="3 3 10 21 14 14 21 10 3 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-40 px-6 lg:px-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          <div className="philosophy-line text-sm md:text-xl font-medium tracking-tight text-primary/50 uppercase">
            Most agencies focus on: <span className="text-primary/80 line-through">isolated tactics and long-term dependency.</span>
          </div>
          <div className="philosophy-line flex justify-center text-center max-w-4xl mx-auto">
             <TextGenerateEffect words="We focus on *complete* *ecosystems* and strategic autonomy." className="font-playfair text-4xl md:text-7xl leading-tight" textClassName="text-primary" />
          </div>
        </div>
      </section>

      {/* PROTOCOL SECTION */}
      <section id="protocol" className="bg-background relative py-32">
        <div className="px-6 lg:px-24 mb-16 max-w-7xl mx-auto apple-reveal">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">Operation Protocol</h2>
          <p className="text-primary/60 font-sans tracking-[0.2em] text-xs font-bold uppercase text-center">02 // ARCHIVING THE PROCESS</p>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative">
          
          {/* TRACING BEAM */}
          <div className="absolute left-0 md:left-2 top-10 bottom-32 w-[1px] bg-white/10 hidden md:block rounded-full">
            <div className="w-[3px] -ml-[1px] bg-white rounded-full shadow-[0_0_15px_#fff]" style={{ height: `${protocolProgress * 100}%` }}></div>
          </div>
          
          {/* Stack Card 1 */}
          <div className="protocol-card sticky top-24 md:top-32 min-h-[550px] md:h-[500px] mb-8 bg-surface rounded-[2rem] border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.03)] group will-change-transform">
            <div className="flex-1 z-10">
              <div className="font-mono text-accent text-lg mb-4">01.</div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Initial Diagnostics</h3>
              <p className="text-primary/60 leading-relaxed text-lg">We map <span className="text-primary font-medium tracking-wide">exactly where you are</span>. We evaluate your offer, current system, sales friction, and hidden high-leverage opportunities.</p>
            </div>
            <div className="flex-1 w-full h-full min-h-[200px] relative flex items-center justify-center">
              {/* Radar Scanner Animation */}
              <div className="relative w-[200px] h-[200px] rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
                <div className="absolute inset-0 border border-white/5 rounded-full scale-75"></div>
                <div className="absolute w-1/2 h-full bg-gradient-to-r from-transparent to-accent/20 origin-right animate-[spin_3s_linear_infinite] rounded-r-full left-0"></div>
                <div className="absolute w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#fff] top-1/4 left-1/3 animate-pulse"></div>
                <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-2/3 right-1/4 animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Stack Card 2 */}
          <div className="protocol-card sticky top-28 md:top-36 min-h-[550px] md:h-[500px] mb-8 bg-[#151515] rounded-[3rem] border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.03)] will-change-transform">
            <div className="flex-1 z-10">
              <div className="font-mono text-accent text-lg mb-4">02.</div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ecosystem Architecture</h3>
              <p className="text-primary/60 leading-relaxed text-lg">We design the <span className="text-primary font-medium tracking-wide">entire structure</span>: acquisition funnel, lead magnet, landing pages, nurture emails, and sales scripts. The ultimate blueprint.</p>
            </div>
            <div className="flex-1 w-full h-full min-h-[200px] relative flex items-center justify-center">
              {/* Node Network Animation */}
              <svg className="w-full max-w-[250px] opacity-70" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M40 40 L160 160 M40 160 L160 40 M100 20 L100 180 M20 100 L180 100" className="text-white/10" strokeDasharray="4 4"/>
                <circle cx="100" cy="100" r="8" className="fill-background stroke-accent" strokeWidth="2" />
                <circle cx="40" cy="40" r="5" className="fill-surface stroke-primary/50 text-white animate-pulse" />
                <circle cx="160" cy="160" r="5" className="fill-surface stroke-primary/50 text-white animate-pulse" style={{animationDelay: '1s'}} />
                <circle cx="40" cy="160" r="5" className="fill-surface stroke-primary/50 text-white animate-pulse" style={{animationDelay: '0.5s'}} />
                <circle cx="160" cy="40" r="5" className="fill-surface stroke-primary/50 text-white animate-pulse" style={{animationDelay: '1.5s'}} />
                <path d="M100 100 L160 40" className="text-accent stroke-[2px]" strokeDasharray="100" strokeDashoffset="0">
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M40 160 L100 100" className="text-accent stroke-[2px]" strokeDasharray="100" strokeDashoffset="0">
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" begin="1s"/>
                </path>
              </svg>
            </div>
          </div>

          {/* Stack Card 3 */}
          <div className="protocol-card sticky top-32 md:top-40 min-h-[550px] md:h-[500px] mb-32 bg-surface rounded-[2rem] border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.03)] will-change-transform">
            <div className="flex-1 z-10">
              <div className="font-mono text-accent text-lg mb-4">03.</div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Guided Execution</h3>
              <p className="text-primary/60 leading-relaxed text-lg"><span className="text-primary font-medium tracking-wide">You operate</span>, we guide the implementation step by step. Weekly metric optimization until total autonomy is reached.</p>
            </div>
            <div className="flex-1 w-full h-full min-h-[200px] relative flex items-center justify-center opacity-80">
              <svg className="w-full h-full object-contain p-4" viewBox="0 0 200 100" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                {/* Elegant straight growth lines tracing with native animate */}
                <path d="M 20 80 L 70 80 L 70 50 L 130 50 L 130 20 L 180 20" stroke="rgba(255,255,255,1)" strokeLinecap="square" strokeLinejoin="miter" strokeDasharray="300" strokeDashoffset="300" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,1))' }}>
                  <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze" repeatCount="indefinite" />
                </path>
                
                <circle cx="180" cy="20" r="4" fill="white" stroke="none" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,1))' }} />
                
                {/* Background grid/guides for scale/precision feel */}
                <line x1="20" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
                <line x1="20" y1="50" x2="180" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
                <line x1="20" y1="80" x2="180" y2="80" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
                <line x1="70" y1="20" x2="70" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                <line x1="130" y1="20" x2="130" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>
          
        </div>
      </section>

      {/* PRICING / MEMBERSHIP */}
      <section id="pricing" className="py-32 px-6 lg:px-24 bg-background relative border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 apple-reveal">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Access to the Architecture</h2>
            <p className="text-primary/60 font-sans tracking-[0.2em] text-xs font-bold uppercase">03 // STRATEGIC INVESTMENT</p>
          </div>

          <CometCard className="w-full relative z-10 transition-all duration-500">
            <div className="bg-surface border border-accent/10 rounded-[3rem] p-8 md:p-14 relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] w-full">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 w-full relative z-20">
                  <h3 className="text-3xl font-playfair italic text-accent mb-2">Diagnostics &amp; Setup</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-bold">$8,000</span>
                    <span className="text-primary/50 font-mono text-sm pb-1">MXN + VAT</span>
                  </div>
                  <p className="text-primary/60 mb-8 leading-relaxed">
                    <span className="text-primary font-medium tracking-wide">Kickoff fee.</span> Includes the initial audit of your business and the strategic blueprint. Once validated, we transition to the asynchronous support model.
                  </p>
                  <ul className="space-y-4 font-sans text-lg font-light tracking-tight pb-6">
                    {['Current asset audit.', 'End-to-End Funnel design.', 'Nurture and conversion maps.', 'Execution roadmap (90 days).'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="w-5 h-[2px] bg-white opacity-40"></div>
                        <span className="text-primary/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-none w-full md:w-auto relative z-20">
                  <Button borderRadius="2rem" duration={4000} className="bg-accent hover:bg-white text-background hover:text-black px-8 py-6 text-lg font-bold tracking-wide transition-colors" containerClassName="w-full md:w-[280px]">
                    <span className="flex items-center gap-2 relative w-full justify-center">Start Diagnostics <ArrowRight className="w-5 h-5" /></span>
                  </Button>
                </div>
              </div>
            </div>
          </CometCard>
        </div>
      </section>

      {/* TESTIMONIALS (Prepared for data) */}
      <section id="testimonials" className="py-32 px-6 lg:px-24 bg-background relative border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto apple-reveal">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Strategic Proof</h2>
            <p className="text-primary/60 font-sans tracking-[0.2em] text-xs font-bold uppercase">04 // VALIDATING THE SYSTEM</p>
          </div>
          
          <div className="relative w-[150%] md:w-[130%] -left-[25%] md:-left-[15%]">
             <div className="flex gap-6 animate-marquee w-max">
              {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((i, idx) => (
                <div key={idx} className="w-[380px] md:w-[450px] flex-shrink-0 bg-surface rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6 opacity-50 hover:opacity-100 hover:scale-[1.02] hover:border-white/10 transition-all duration-300">
                  <div className="flex gap-2 text-accent">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-primary/80 font-playfair text-xl italic leading-relaxed">
                    "This architecture completely changed our trajectory. The growth is now a predictable formula rather than a guessing game."
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">HM</div>
                    <div>
                      <div className="font-bold text-sm">Tech Founder {i}</div>
                      <div className="text-xs font-mono text-primary/50">SaaS Company</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-background pt-32 pb-12 px-6 lg:px-24 rounded-t-[4rem] border-t border-white/5 mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="mb-8 max-w-xl">
              <TextGenerateEffect words="We design the system <br/> *you* *execute* *the* *growth.*" className="font-playfair text-5xl md:text-7xl leading-[1.1]" textClassName="text-primary" />
            </div>
            <div className="cursor-pointer mb-2" onClick={scrollToTop}>
              <img src="/logo.svg" alt="HustleMark Logo" className="w-16 h-16 object-contain invert opacity-90 transition-transform duration-300 hover:scale-110 hover:opacity-100" />
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-end space-y-12">
            <div className="flex gap-16">
              <div>
                <h4 className="font-bold mb-6 text-primary/80">Navigation</h4>
                <ul className="space-y-4 text-primary/50 font-mono text-sm">
                  <li><a href="#features" className="hover:text-accent transition-colors">Method</a></li>
                  <li><a href="#protocol" className="hover:text-accent transition-colors">Protocol</a></li>
                  <li><a href="#pricing" className="hover:text-accent transition-colors">Investment</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-primary/80">Contact</h4>
                <ul className="space-y-4 text-primary/50 font-mono text-sm">
                  <li><a href="#" className="hover:text-accent transition-colors">consulting@hustlemark.com</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex items-center justify-center font-mono text-xs text-primary/40">
          <div>&copy; {new Date().getFullYear()} HustleMark. All rights reserved.</div>
        </div>
      </footer>
    </div>
    </>
  );
}

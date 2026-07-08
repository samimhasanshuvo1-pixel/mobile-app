import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AvatarStage } from "../types";

interface AgeAvatarProps {
  stage: AvatarStage;
  age: number;
}

export default function AgeAvatar({ stage, age }: AgeAvatarProps) {
  // Description based on stage
  const getStageLabel = () => {
    switch (stage) {
      case "baby":
        return "শৈশবকাল (Baby) 👶";
      case "child":
        return "বাল্যকাল (Child) 👦";
      case "teenager":
        return "কৈশোরকাল (Teenager) 🧑‍🎤";
      case "young":
        return "প্রাণবন্ত তারুণ্য ও যৌবনকাল (Vibrant Youth) ⚡💼";
      case "middle":
        return "প্রৌঢ়ত্ব (Middle Aged) 👨‍🏫";
      case "elderly":
        return "বার্ধক্য (Elderly) 👴";
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case "baby":
        return "from-amber-100 to-amber-200 text-amber-800 border-amber-300";
      case "child":
        return "from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300";
      case "teenager":
        return "from-blue-100 to-blue-200 text-blue-800 border-blue-300";
      case "young":
        return "from-indigo-600 via-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-105 font-black px-5 py-2 ring-2 ring-indigo-300 animate-pulse-subtle";
      case "middle":
        return "from-rose-100 to-rose-200 text-rose-800 border-rose-300";
      case "elderly":
        return "from-slate-100 to-slate-200 text-slate-800 border-slate-300";
    }
  };

  const toBnNumber = (num: number | string): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => (isNaN(parseInt(digit)) ? digit : bengaliDigits[parseInt(digit)]))
      .join("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl max-w-sm mx-auto relative overflow-hidden group">
      {/* Dynamic Background Sphere */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-rose-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Title & Age Badge */}
      <div className="z-10 mb-4 flex flex-col items-center">
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r border shadow-sm ${getStageColor()} transition-all duration-500`}>
          {getStageLabel()}
        </span>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">বর্তমান বয়স</p>
          <p className="text-4xl md:text-5xl font-black text-indigo-650 tracking-tight mt-1 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            {toBnNumber(age)} বছর
          </p>
        </div>
      </div>

      {/* 3D Styled SVG Avatar Container */}
      <div className="relative w-56 h-56 flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white rounded-full shadow-inner border border-slate-100" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-2 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -4, 0]
            }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 14,
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }
            }}
            className="w-48 h-48 relative flex items-center justify-center"
          >
            {/* SVG Avatars with rich gradients, 3D highlights and shadows */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl select-none">
              <defs>
                {/* 3D Skin Gradients */}
                <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%" fx="40%" fy="30%">
                  <stop offset="0%" stopColor="#ffebd6" />
                  <stop offset="75%" stopColor="#f5cca3" />
                  <stop offset="100%" stopColor="#dd9f67" />
                </radialGradient>
                <radialGradient id="skinOldGrad" cx="50%" cy="40%" r="55%" fx="40%" fy="30%">
                  <stop offset="0%" stopColor="#fff3e6" />
                  <stop offset="75%" stopColor="#ecd2ba" />
                  <stop offset="100%" stopColor="#cba17e" />
                </radialGradient>
                
                {/* 3D Cheek Rosy Gradient */}
                <radialGradient id="rosyCheek" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff5a79" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ff5a79" stopOpacity="0" />
                </radialGradient>

                {/* 3D Baby Hat/Bonnet Gradient */}
                <linearGradient id="babyBonnet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a5f3fc" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                {/* Pacifier Gradients */}
                <linearGradient id="paciGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>

                {/* Child Hair Gradient */}
                <linearGradient id="childHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c2d12" />
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>

                {/* Teen Hair/Cap Gradient */}
                <linearGradient id="teenCap" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                <linearGradient id="teenHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* Young Adult Hair & Suit */}
                <linearGradient id="youngHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>

                {/* Middle Age Hair with grey */}
                <linearGradient id="middleHair" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#71717a" />
                  <stop offset="25%" stopColor="#3f3f46" />
                  <stop offset="75%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#71717a" />
                </linearGradient>

                {/* Elderly Sweater */}
                <linearGradient id="elderSweater" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#115e59" />
                  <stop offset="100%" stopColor="#134e4a" />
                </linearGradient>
              </defs>

              {/* STAGE 1: BABY */}
              {stage === "baby" && (
                <g>
                  {/* Bonnet Background back fold */}
                  <path d="M 40,110 A 62,62 0 0,1 160,110 Z" fill="url(#babyBonnet)" opacity="0.8" />
                  
                  {/* Baby Neck */}
                  <rect x="85" y="125" width="30" height="25" rx="10" fill="url(#skinGrad)" />
                  <path d="M 85,140 Q 100,150 115,140" fill="none" stroke="#b27e52" strokeWidth="2" opacity="0.3" />

                  {/* Baby Head */}
                  <circle cx="100" cy="95" r="50" fill="url(#skinGrad)" />

                  {/* Rosy cheeks */}
                  <circle cx="65" cy="110" r="14" fill="url(#rosyCheek)" />
                  <circle cx="135" cy="110" r="14" fill="url(#rosyCheek)" />

                  {/* Bonnet Hat front ring */}
                  <path d="M 45,95 A 55,55 0 0,1 155,95" fill="none" stroke="url(#babyBonnet)" strokeWidth="12" strokeLinecap="round" />
                  <circle cx="45" cy="95" r="7" fill="#38bdf8" />
                  <circle cx="155" cy="95" r="7" fill="#38bdf8" />

                  {/* Cute Hair curl */}
                  <path d="M 100,45 Q 95,30 108,32" fill="none" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />

                  {/* Big Baby Eyes with dynamic shine */}
                  <circle cx="75" cy="95" r="9" fill="#1e293b" />
                  <circle cx="73" cy="92" r="3" fill="#ffffff" />
                  <circle cx="77" cy="97" r="1.5" fill="#ffffff" />

                  <circle cx="125" cy="95" r="9" fill="#1e293b" />
                  <circle cx="123" cy="92" r="3" fill="#ffffff" />
                  <circle cx="127" cy="97" r="1.5" fill="#ffffff" />

                  {/* Baby Eyelashes */}
                  <path d="M 68,88 Q 74,84 80,88" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 118,88 Q 124,84 130,88" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Baby Brows */}
                  <path d="M 67,82 Q 75,78 82,82" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                  <path d="M 118,82 Q 125,78 133,82" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

                  {/* Cute Nose */}
                  <path d="M 97,105 Q 100,108 103,105" fill="none" stroke="#b27e52" strokeWidth="3" strokeLinecap="round" />

                  {/* Baby Pacifier (চুষনি) - 3D styled */}
                  <g transform="translate(100, 118)">
                    {/* Pacifier handle loop */}
                    <circle cx="0" cy="12" r="10" fill="none" stroke="#06b6d4" strokeWidth="4.5" />
                    {/* Pacifier Base Shield */}
                    <ellipse cx="0" cy="0" rx="20" ry="10" fill="url(#paciGrad)" />
                    <circle cx="-10" cy="0" r="3" fill="#ffffff" opacity="0.6" />
                    {/* Pacifier Center Knob */}
                    <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                  </g>

                  {/* Cute Bib (লালা ঝরানো রুমাল) */}
                  <path d="M 75,142 Q 100,175 125,142 Q 115,135 100,135 Q 85,135 75,142 Z" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="100" cy="155" r="3" fill="#ffffff" />
                </g>
              )}

              {/* STAGE 2: CHILD */}
              {stage === "child" && (
                <g>
                  {/* Child Neck */}
                  <rect x="85" y="125" width="30" height="25" rx="8" fill="url(#skinGrad)" />
                  <path d="M 85,140 Q 100,147 115,140" fill="none" stroke="#b27e52" strokeWidth="2" opacity="0.4" />

                  {/* Child Collar and Shirt */}
                  <path d="M 60,145 L 140,145 L 130,185 L 70,185 Z" fill="#38bdf8" />
                  <path d="M 60,145 L 85,160 L 100,145 L 115,160 L 140,145" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Cute school bag strap */}
                  <path d="M 68,145 Q 82,165 72,185" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 132,145 Q 118,165 128,185" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />

                  {/* Ears */}
                  <circle cx="48" cy="100" r="11" fill="url(#skinGrad)" />
                  <circle cx="152" cy="100" r="11" fill="url(#skinGrad)" />
                  <circle cx="48" cy="100" r="6" fill="#f5cca3" opacity="0.6" />
                  <circle cx="152" cy="100" r="6" fill="#f5cca3" opacity="0.6" />

                  {/* Head */}
                  <circle cx="100" cy="95" r="48" fill="url(#skinGrad)" />

                  {/* Child Hair */}
                  <path d="M 52,90 Q 50,60 70,45 Q 100,35 130,45 Q 150,60 148,90 Q 138,65 115,55 Q 100,55 85,55 Q 62,65 52,90 Z" fill="url(#childHair)" />
                  <path d="M 72,55 Q 85,42 105,44" fill="none" stroke="#a16207" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Smiling cheeks blush */}
                  <circle cx="64" cy="112" r="9" fill="url(#rosyCheek)" />
                  <circle cx="136" cy="112" r="9" fill="url(#rosyCheek)" />

                  {/* Bright playful eyes */}
                  <circle cx="75" cy="95" r="7.5" fill="#1e293b" />
                  <circle cx="73" cy="92.5" r="2.5" fill="#ffffff" />
                  <circle cx="125" cy="95" r="7.5" fill="#1e293b" />
                  <circle cx="123" cy="92.5" r="2.5" fill="#ffffff" />

                  {/* Dynamic Brows */}
                  <path d="M 66,84 Q 75,77 82,81" fill="none" stroke="#431407" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 118,81 Q 125,77 134,84" fill="none" stroke="#431407" strokeWidth="3" strokeLinecap="round" />

                  {/* Nose */}
                  <path d="M 96,104 Q 100,107 104,104" fill="none" stroke="#b27e52" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Big Happy Smile! */}
                  <path d="M 82,112 Q 100,128 118,112" fill="none" stroke="#be123c" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Dimple lines */}
                  <path d="M 79,111 Q 78,114 80,115" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 121,111 Q 122,114 120,115" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />

                  {/* Cute cap on head (slightly tilted) */}
                  <g transform="translate(10, -5) rotate(-6, 100, 50)">
                    {/* Cap Dome */}
                    <path d="M 70,48 A 32,32 0 0,1 130,48 Z" fill="#ef4444" />
                    {/* Cap Visor */}
                    <path d="M 55,48 Q 100,38 145,48" fill="none" stroke="#b91c1c" strokeWidth="7.5" strokeLinecap="round" />
                    {/* Cap Button */}
                    <circle cx="100" cy="16" r="4.5" fill="#facc15" />
                  </g>
                </g>
              )}

              {/* STAGE 3: TEENAGER */}
              {stage === "teenager" && (
                <g>
                  {/* Teen Hoodie and Neck */}
                  <rect x="85" y="125" width="30" height="25" rx="6" fill="url(#skinGrad)" />
                  
                  {/* Neon Hoodie */}
                  <path d="M 52,145 L 148,145 L 138,185 L 62,185 Z" fill="#4f46e5" />
                  {/* Hoodie Collar Drawstrings */}
                  <path d="M 76,145 C 80,165 85,170 85,175" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 124,145 C 120,165 115,170 115,175" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="85" cy="177" r="3" fill="#facc15" />
                  <circle cx="115" cy="177" r="3" fill="#facc15" />

                  {/* Ears */}
                  <circle cx="46" cy="100" r="12" fill="url(#skinGrad)" />
                  <circle cx="154" cy="100" r="12" fill="url(#skinGrad)" />

                  {/* Head */}
                  <circle cx="100" cy="95" r="46" fill="url(#skinGrad)" />

                  {/* Cool Hair (spiky modern trend) */}
                  <path d="M 52,82 Q 45,42 70,30 Q 90,20 115,32 Q 135,28 148,45 Q 155,70 148,85 Q 140,55 125,48 Q 100,45 78,55 Q 60,65 52,82 Z" fill="url(#teenHair)" />
                  {/* Stylized hair strands */}
                  <path d="M 72,35 Q 85,25 98,32" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 108,34 Q 120,25 130,35" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Cool Specs/Glasses (Stylish round black glasses) */}
                  <g>
                    {/* Left Frame */}
                    <circle cx="74" cy="94" r="15" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                    <circle cx="74" cy="94" r="12" fill="#06b6d4" opacity="0.15" />
                    {/* Right Frame */}
                    <circle cx="126" cy="94" r="15" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                    <circle cx="126" cy="94" r="12" fill="#06b6d4" opacity="0.15" />
                    {/* Bridge */}
                    <path d="M 89,94 Q 100,90 111,94" fill="none" stroke="#1e293b" strokeWidth="4.5" />
                    {/* Glasses glare reflections */}
                    <path d="M 67,88 L 77,98" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <path d="M 119,88 L 129,98" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                  </g>

                  {/* Cool Brows */}
                  <path d="M 60,76 Q 73,70 82,76" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 118,76 Q 127,70 140,76" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Nose */}
                  <path d="M 96,102 Q 100,105 104,102" fill="none" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Smirk Smile */}
                  <path d="M 85,114 Q 96,120 112,112" fill="none" stroke="#be123c" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Cool Glow-in-the-dark Neon Headphones */}
                  <g>
                    {/* Headband */}
                    <path d="M 46,75 A 58,58 0 0,1 154,75" fill="none" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />
                    {/* Left Cup */}
                    <rect x="36" y="80" width="14" height="28" rx="6" fill="#ec4899" />
                    <circle cx="43" cy="94" r="3" fill="#ffffff" />
                    {/* Right Cup */}
                    <rect x="150" y="80" width="14" height="28" rx="6" fill="#ec4899" />
                    <circle cx="157" cy="94" r="3" fill="#ffffff" />
                  </g>
                </g>
              )}

              {/* STAGE 4: YOUNG ADULT */}
              {stage === "young" && (
                <g>
                  {/* Smart Neck and Suit */}
                  <rect x="86" y="123" width="28" height="25" rx="4" fill="url(#skinGrad)" />
                  
                  {/* Suit / Formal wear */}
                  <path d="M 52,143 L 148,143 L 138,185 L 62,185 Z" fill="url(#suitGrad)" />
                  {/* White Inner Shirt */}
                  <path d="M 85,143 L 115,143 L 100,165 Z" fill="#ffffff" />
                  {/* Red Tie */}
                  <path d="M 96,155 L 104,155 L 106,182 L 100,187 L 94,182 Z" fill="#dc2626" />
                  <polygon points="94,155 106,155 100,163" fill="#b91c1c" />

                  {/* Ears */}
                  <circle cx="46" cy="100" r="11" fill="url(#skinGrad)" />
                  <circle cx="154" cy="100" r="11" fill="url(#skinGrad)" />

                  {/* Head */}
                  <circle cx="100" cy="94" r="45" fill="url(#skinGrad)" />

                  {/* Professional Sharp Hair */}
                  <path d="M 54,78 Q 48,46 72,34 Q 100,22 128,34 Q 148,44 146,76 Q 138,48 116,42 Q 100,42 84,45 Q 64,52 54,78 Z" fill="url(#youngHair)" />
                  {/* Hair shine */}
                  <path d="M 80,33 Q 100,28 118,33" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />

                  {/* Sharp Intelligent Spectacles */}
                  <g>
                    {/* Frame Left */}
                    <rect x="58" y="84" width="28" height="20" rx="5" fill="none" stroke="#18181b" strokeWidth="3.5" />
                    <rect x="58" y="84" width="28" height="20" rx="5" fill="#a5f3fc" opacity="0.2" />
                    {/* Frame Right */}
                    <rect x="114" y="84" width="28" height="20" rx="5" fill="none" stroke="#18181b" strokeWidth="3.5" />
                    <rect x="114" y="84" width="28" height="20" rx="5" fill="#a5f3fc" opacity="0.2" />
                    {/* Bridge */}
                    <line x1="86" y1="92" x2="114" y2="92" stroke="#18181b" strokeWidth="4.5" />
                    {/* Shine */}
                    <line x1="62" y1="88" x2="72" y2="98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="118" y1="88" x2="128" y2="98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  </g>

                  {/* Professional Brows */}
                  <path d="M 58,76 Q 72,71 82,75" fill="none" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 118,75 Q 128,71 142,76" fill="none" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />

                  {/* Sharp Nose */}
                  <path d="M 97,100 L 100,105 L 103,100" fill="none" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Confident, friendly, clean smile */}
                  <path d="M 84,113 Q 100,123 116,113" fill="none" stroke="#9f1239" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Neatly trimmed stylish small beard outline */}
                  <path d="M 75,130 Q 100,140 125,130" fill="none" stroke="#27272a" strokeWidth="3" strokeDasharray="3,3" opacity="0.4" />
                </g>
              )}

              {/* STAGE 5: MIDDLE AGED */}
              {stage === "middle" && (
                <g>
                  {/* Mature Neck & Shirt */}
                  <rect x="86" y="124" width="28" height="24" rx="4" fill="url(#skinOldGrad)" />
                  
                  {/* Elegant cardigan / sweater vest over shirt */}
                  <path d="M 52,143 L 148,143 L 138,185 L 62,185 Z" fill="#b91c1c" />
                  {/* Inner shirt collar */}
                  <path d="M 84,143 L 100,162 L 116,143 Z" fill="#ffffff" />
                  <path d="M 80,143 L 100,158" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <path d="M 120,143 L 100,158" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  {/* Necktie pattern inside Cardigan */}
                  <path d="M 97,152 L 103,152 L 101,168 L 99,168 Z" fill="#0f172a" />

                  {/* Ears */}
                  <circle cx="46" cy="100" r="11.5" fill="url(#skinOldGrad)" />
                  <circle cx="154" cy="100" r="11.5" fill="url(#skinOldGrad)" />

                  {/* Head */}
                  <circle cx="100" cy="94" r="45" fill="url(#skinOldGrad)" />

                  {/* Mature Hair with grey streaks */}
                  <path d="M 54,78 Q 48,46 72,34 Q 100,22 128,34 Q 148,44 146,76 Q 138,48 116,44 Q 100,44 84,47 Q 64,53 54,78 Z" fill="url(#middleHair)" />
                  {/* Grey temple highlights */}
                  <path d="M 55,72 Q 62,56 70,52" fill="none" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 145,72 Q 138,56 130,52" fill="none" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />

                  {/* Sophisticated Gold Spectacles */}
                  <g>
                    {/* Left lens */}
                    <circle cx="73" cy="95" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
                    <circle cx="73" cy="95" r="12" fill="#e0f2fe" opacity="0.25" />
                    {/* Right lens */}
                    <circle cx="127" cy="95" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
                    <circle cx="127" cy="95" r="12" fill="#e0f2fe" opacity="0.25" />
                    {/* Bridge */}
                    <path d="M 87,95 Q 100,91 113,95" fill="none" stroke="#d97706" strokeWidth="3.5" />
                    {/* Reflection */}
                    <path d="M 68,90 L 76,98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                    <path d="M 122,90 L 130,98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  </g>

                  {/* Brows */}
                  <path d="M 58,77 Q 71,72 81,77" fill="none" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 119,77 Q 129,72 142,77" fill="none" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />

                  {/* Character Lines (Subtle eye smile wrinkles) */}
                  <path d="M 49,94 Q 53,95 55,93" fill="none" stroke="#a16207" strokeWidth="1.5" opacity="0.5" />
                  <path d="M 151,94 Q 147,95 145,93" fill="none" stroke="#a16207" strokeWidth="1.5" opacity="0.5" />
                  <path d="M 94,72 Q 100,74 106,72" fill="none" stroke="#a16207" strokeWidth="1.5" opacity="0.4" />

                  {/* Nose */}
                  <path d="M 96,101 Q 100,105 104,101" fill="none" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Wise Warm Smile */}
                  <path d="M 83,114 Q 100,124 117,114" fill="none" stroke="#9f1239" strokeWidth="3.5" strokeLinecap="round" />
                  
                  {/* Subtle grey moustache (clean & trimmed) */}
                  <path d="M 88,110 Q 100,113 112,110" fill="none" stroke="#71717a" strokeWidth="2" opacity="0.3" />
                </g>
              )}

              {/* STAGE 6: ELDERLY */}
              {stage === "elderly" && (
                <g>
                  {/* Kind Elderly Neck & Sweater */}
                  <rect x="86" y="124" width="28" height="24" rx="4" fill="url(#skinOldGrad)" />
                  
                  {/* Cozy knitted sweater */}
                  <path d="M 52,143 L 148,143 L 138,185 L 62,185 Z" fill="url(#elderSweater)" />
                  {/* Collar details */}
                  <path d="M 78,143 C 90,150 100,150 122,143" fill="none" stroke="#0f766e" strokeWidth="6" />
                  <path d="M 88,143 L 100,165 L 112,143" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />

                  {/* Ears */}
                  <circle cx="45" cy="101" r="12" fill="url(#skinOldGrad)" />
                  <circle cx="155" cy="101" r="12" fill="url(#skinOldGrad)" />
                  <circle cx="45" cy="101" r="6" fill="#ecd2ba" opacity="0.7" />
                  <circle cx="155" cy="101" r="6" fill="#ecd2ba" opacity="0.7" />

                  {/* Head with some character shapes */}
                  <circle cx="100" cy="94" r="45" fill="url(#skinOldGrad)" />

                  {/* Soft Fluffy White Hair */}
                  <g>
                    {/* Fluffy clouds of hair */}
                    <circle cx="56" cy="62" r="18" fill="#f4f4f5" />
                    <circle cx="70" cy="46" r="20" fill="#f4f4f5" />
                    <circle cx="100" cy="38" r="22" fill="#f4f4f5" />
                    <circle cx="130" cy="46" r="20" fill="#f4f4f5" />
                    <circle cx="144" cy="62" r="18" fill="#f4f4f5" />
                    {/* Shadow layer for depth */}
                    <path d="M 50,75 C 40,55 60,35 90,32 C 120,32 140,55 150,75" fill="none" stroke="#e4e4e7" strokeWidth="4" opacity="0.6" />
                  </g>

                  {/* White Wise Brows */}
                  <path d="M 58,78 Q 70,71 81,77" fill="none" stroke="#e4e4e7" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 119,78 Q 130,71 142,78" fill="none" stroke="#e4e4e7" strokeWidth="4.5" strokeLinecap="round" />

                  {/* Soft round metal glasses */}
                  <g>
                    <circle cx="72" cy="96" r="15" fill="none" stroke="#b45309" strokeWidth="2.5" />
                    <circle cx="72" cy="96" r="13" fill="#f0f9ff" opacity="0.3" />
                    <circle cx="128" cy="96" r="15" fill="none" stroke="#b45309" strokeWidth="2.5" />
                    <circle cx="128" cy="96" r="13" fill="#f0f9ff" opacity="0.3" />
                    <line x1="87" y1="96" x2="113" y2="96" stroke="#b45309" strokeWidth="3" />
                    {/* Glare */}
                    <line x1="66" y1="91" x2="74" y2="99" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="122" y1="91" x2="130" y2="99" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  </g>

                  {/* Kind forehead lines & crows feet */}
                  <g stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
                    {/* Forehead */}
                    <path d="M 85,58 Q 100,61 115,58" fill="none" />
                    <path d="M 88,64 Q 100,67 112,64" fill="none" />
                    {/* Left Crows Feet */}
                    <path d="M 48,93 Q 53,95 55,93" fill="none" />
                    <path d="M 47,97 Q 52,98 54,95" fill="none" />
                    {/* Right Crows Feet */}
                    <path d="M 152,93 Q 147,95 145,93" fill="none" />
                    <path d="M 153,97 Q 148,98 146,95" fill="none" />
                    {/* Smile lines around mouth */}
                    <path d="M 76,112 Q 74,122 80,128" fill="none" />
                    <path d="M 124,112 Q 126,122 120,128" fill="none" />
                  </g>

                  {/* Nose */}
                  <path d="M 95,102 Q 100,107 105,102" fill="none" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />

                  {/* Extremely Sweet & Peaceful Grandpa Smile */}
                  <path d="M 82,116 Q 100,127 118,116" fill="none" stroke="#9f1239" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Wise White Beard details (clean grandfatherly mustache) */}
                  <path d="M 86,111 C 95,116 105,116 114,111" fill="none" stroke="#f4f4f5" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                </g>
              )}
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dynamic Fun Status Card under Avatar */}
      <div className="w-full mt-4 bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-center z-10 transition-all duration-500">
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">বয়স ভিত্তিক চারিত্রিক বৈশিষ্ট্য</p>
        <p className="text-xs text-slate-700 font-medium mt-1">
          {stage === "baby" && "খুবই আদুরে, কৌতূহলী এবং অফুরন্ত শক্তির উৎস! চারপাশের নতুন পৃথিবী আবিষ্কারে ব্যস্ত।"}
          {stage === "child" && "খেলাধুলা এবং পড়াশোনায় উৎসাহী। বন্ধুবৎসল, কল্পনাপ্রবণ এবং স্বপ্ন দেখতে ভালোবাসে।"}
          {stage === "teenager" && "নতুন অভিজ্ঞতা অর্জন, ফ্যাশন, বন্ধুবান্ধব এবং প্রযুক্তির প্রতি তীব্র আকর্ষণ থাকে।"}
          {stage === "young" && "কর্মব্যস্ত, উচ্চাকাঙ্ক্ষী এবং ক্যারিয়ার গঠনে মনোযোগী। জীবনের সোনালী সময় পার করছে।"}
          {stage === "middle" && "অভিজ্ঞ, গম্ভীর এবং পারিবারিক দায়িত্ব পালনে সদা তৎপর। অত্যন্ত বিচক্ষণ ব্যক্তিত্ব।"}
          {stage === "elderly" && "পরম শান্ত, স্নেহশীল এবং অগাধ জ্ঞানের অধিকারী। সবাইকে উপদেশ ও ভালোবাসায় আগলে রাখে।"}
        </p>
      </div>
    </div>
  );
}

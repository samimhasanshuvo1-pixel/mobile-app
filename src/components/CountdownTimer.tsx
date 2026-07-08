import React from "react";
import { motion } from "motion/react";
import { BirthdayCountdown, AgeResult } from "../types";

interface CountdownTimerProps {
  countdown: BirthdayCountdown;
  ageResult: AgeResult;
}

export default function CountdownTimer({ countdown, ageResult }: CountdownTimerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Convert English numbers to Bengali numbers for localization
  const toBnNumber = (num: number | string): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => (isNaN(parseInt(digit)) ? digit : bengaliDigits[parseInt(digit)]))
      .join("");
  };

  // Format single digit with leading zero
  const padZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Dynamic Exact Age Live Ticker */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl border border-indigo-500/20"
      >
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-sm font-semibold text-indigo-200 tracking-wider uppercase">
            লাইভ বয়স কাউন্টার (প্রতি সেকেন্ডে বাড়ছে)
          </h3>
        </div>

        {/* Big Grid of Live Age */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "বছর", value: ageResult.actualYears, color: "text-amber-400" },
            { label: "মাস", value: ageResult.actualMonths, color: "text-emerald-400" },
            { label: "দিন", value: ageResult.actualDays, color: "text-blue-400" },
            { label: "ঘণ্টা", value: padZero(ageResult.actualHours), color: "text-purple-400" },
            { label: "মিনিট", value: padZero(ageResult.actualMinutes), color: "text-pink-400" },
            { label: "সেকেন্ড", value: padZero(ageResult.actualSeconds), color: "text-rose-400" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <span className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                {toBnNumber(item.value)}
              </span>
              <span className="text-xs text-slate-400 mt-1 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Countdown to Next Birthday */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`w-full backdrop-blur-md rounded-3xl p-6 border shadow-xl transition-all duration-500 ${
          countdown.isToday 
            ? "bg-gradient-to-b from-pink-50/90 to-rose-50/90 border-pink-200 shadow-pink-150/30" 
            : "bg-gradient-to-b from-white/80 to-slate-50/80 border-white/60 shadow-xl"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className={`text-lg font-bold tracking-tight ${
              countdown.isToday 
                ? "bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent animate-pulse-subtle" 
                : "text-slate-800 bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent"
            }`}>
              {countdown.isToday ? "আজই আপনার শুভ জন্মদিন! 🎂🎈🎉" : "পরবর্তী জন্মদিনের কাউন্টডাউন টাইমার 🎉"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {countdown.isToday 
                ? "আপনার জন্য রইলো অনেক অনেক শুভেচ্ছা ও শুভকামনা!" 
                : <>দিনটি হবে: <span className="font-semibold text-indigo-600">{countdown.nextBirthdayDateStr}</span> ({countdown.nextBirthdayDayOfWeekBn})</>
              }
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-semibold self-start md:self-auto border transition-all duration-300 ${
            countdown.isToday 
              ? "bg-rose-500 text-white border-rose-400 animate-bounce" 
              : "bg-pink-100 text-pink-700 border-pink-200"
          }`}>
            {countdown.isToday ? "শুভ জন্মদিন! 🥳" : `বাকি আছে ${toBnNumber(countdown.totalDaysRemaining)} দিন!`}
          </div>
        </div>

        {/* Beautiful Glowing Cards for Countdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {countdown.isToday ? (
            // Special Birthday Today Ticker (Celebrating!)
            [
              { label: "উৎসব", val: "🎉", desc: "Celebration", bg: "from-pink-100 to-rose-100 border-pink-200 shadow-pink-100" },
              { label: "উপহার", val: "🎁", desc: "Gifts", bg: "from-amber-100 to-orange-100 border-orange-200 shadow-orange-100" },
              { label: "ঘণ্টা বাকি", val: padZero(countdown.hours), desc: "Hours Left", bg: "from-emerald-50 to-teal-50 border-teal-100 hover:shadow-teal-100" },
              { label: "মিনিট বাকি", val: padZero(countdown.minutes), desc: "Mins Left", bg: "from-sky-50 to-blue-50 border-blue-100 hover:shadow-blue-100" },
              { label: "সেকেন্ড বাকি", val: padZero(countdown.seconds), desc: "Secs Left", bg: "from-purple-50 to-violet-50 border-purple-100 hover:shadow-purple-100" },
            ].map((item, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className={`flex flex-col items-center justify-center rounded-2xl p-4 border bg-gradient-to-b shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${item.bg}`}
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full translate-x-3 -translate-y-3 group-hover:scale-150 transition-transform duration-500" />
                <span className={`text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight ${idx < 2 ? "" : "font-sans"}`}>
                  {idx < 2 ? item.val : toBnNumber(item.val)}
                </span>
                <span className="text-xs font-bold text-slate-600 mt-1 text-center">{item.label}</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">{item.desc}</span>
              </motion.div>
            ))
          ) : (
            // Regular Countdown
            [
              { label: "মাস", val: countdown.months, desc: "Months", bg: "from-rose-50 to-pink-50 border-pink-100 hover:shadow-pink-100" },
              { label: "দিন", val: countdown.days, desc: "Days", bg: "from-amber-50 to-orange-50 border-orange-100 hover:shadow-orange-100" },
              { label: "ঘণ্টা", val: padZero(countdown.hours), desc: "Hours", bg: "from-emerald-50 to-teal-50 border-teal-100 hover:shadow-teal-100" },
              { label: "মিনিট", val: padZero(countdown.minutes), desc: "Minutes", bg: "from-sky-50 to-blue-50 border-blue-100 hover:shadow-blue-100" },
              { label: "সেকেন্ড", val: padZero(countdown.seconds), desc: "Seconds", bg: "from-purple-50 to-violet-50 border-purple-100 hover:shadow-purple-100" },
            ].map((item, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className={`flex flex-col items-center justify-center rounded-2xl p-4 border bg-gradient-to-b shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${item.bg}`}
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full translate-x-3 -translate-y-3 group-hover:scale-150 transition-transform duration-500" />
                <span className="text-3xl md:text-4xl font-extrabold font-sans text-slate-800 tracking-tight">
                  {toBnNumber(item.val)}
                </span>
                <span className="text-xs font-bold text-slate-600 mt-1">{item.label}</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">{item.desc}</span>
              </motion.div>
            ))
          )}
        </div>

        {/* Dynamic Celebration Encouragement Message */}
        <div className={`mt-5 p-3.5 rounded-2xl text-center border ${
          countdown.isToday 
            ? "bg-rose-100/50 border-rose-200/60" 
            : "bg-indigo-50/50 border-indigo-100/60"
        }`}>
          <p className="text-xs text-slate-600 font-medium">
            {countdown.isToday ? (
              <>
                🎂 <span className="font-semibold text-rose-700">শুভ জন্মদিন!</span> আপনার জন্মদিনের আনন্দময় সময় আর মাত্র <span className="font-bold text-rose-600">{toBnNumber(countdown.hours)} ঘণ্টা, {toBnNumber(countdown.minutes)} মিনিট, এবং {toBnNumber(countdown.seconds)} সেকেন্ড</span> বাকি রয়েছে! এই বিশেষ দিনটি আপনার জীবনে বয়ে আনুক অনাবিল আনন্দ ও সুস্বাস্থ্য।
              </>
            ) : (
              <>
                💡 <span className="font-semibold text-indigo-700">জেনে রাখা ভালো:</span> আপনার পরবর্তী জন্মদিন আসতে আর মাত্র {toBnNumber(countdown.totalDaysRemaining)} দিন, {toBnNumber(countdown.hours)} ঘণ্টা, এবং {toBnNumber(countdown.minutes)} মিনিট সময় বাকি রয়েছে! নতুন বছরটি হোক সুন্দর সম্ভাবনায় ঘেরা।
              </>
            )}
          </p>
        </div>

      </motion.div>

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  HelpCircle, 
  TrendingUp,
  Smartphone,
  Download,
  Info,
  CheckCircle,
} from "lucide-react";
import { calculateAge, calculateNextBirthday, getAvatarStage } from "./utils/ageCalc";
import { AgeResult, BirthdayCountdown, AvatarStage } from "./types";
import AgeAvatar from "./components/AgeAvatar";
import CountdownTimer from "./components/CountdownTimer";
import HoroscopePanel from "./components/HoroscopePanel";

export default function App() {
  // Default birth date is exactly 25 years ago from current local time to show a good initial state
  const defaultBirthDate = "2001-07-05"; 
  const [birthDate, setBirthDate] = useState<string>(() => {
    const saved = localStorage.getItem("user_birth_date");
    return saved || defaultBirthDate;
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installTab, setInstallTab] = useState<"android" | "ios">("android");
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(true);

  // Save birthDate to local storage on change
  useEffect(() => {
    localStorage.setItem("user_birth_date", birthDate);
  }, [birthDate]);

  // Update current time every second for live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for the PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect if already installed & running standalone
    if (
      window.matchMedia("(display-mode: standalone)").matches || 
      (navigator as any).standalone
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] User installation outcome:", outcome);
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Calculate age results
  const ageResult: AgeResult = calculateAge(birthDate, currentTime);
  const countdownResult: BirthdayCountdown = calculateNextBirthday(birthDate, currentTime);
  const avatarStage: AvatarStage = getAvatarStage(ageResult.roundedYears);

  // Life progress percentage based on 100 years life expectancy
  const lifeExpectancy = 100;
  const progressPercentage = Math.min(100, Math.max(0, (ageResult.actualYears + (ageResult.actualMonths / 12) + (ageResult.actualDays / 365)) * 100 / lifeExpectancy));

  // Preset birthday options for users to test easily
  const presets = [
    { label: "শিশু (২ বছর ৪ মাস)", date: "2024-03-10", icon: "👶" },
    { label: "স্কুল ছাত্র (৯ বছর ৬ মাস ১৫ দিন)", date: "2016-12-20", icon: "👦" },
    { label: "কৈশোর (১৫ বছর ৭ মাস)", date: "2010-12-05", icon: "🧑‍🎤" },
    { label: "যৌবন (২৪ বছর ৮ মাস)", date: "2001-11-15", icon: "👨‍💼" },
    { label: "প্রৌঢ়ত্ব (৪৮ বছর ৩ মাস)", date: "1978-04-05", icon: "👨‍🏫" },
    { label: "বার্ধক্য (৭২ বছর ৯ মাস)", date: "1953-10-12", icon: "👴" },
  ];

  // Convert English numbers to Bengali numbers
  const toBnNumber = (num: number | string): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => (isNaN(parseInt(digit)) ? digit : bengaliDigits[parseInt(digit)]))
      .join("");
  };

  const getProgressColor = (stage: AvatarStage) => {
    switch (stage) {
      case "baby": return "from-amber-400 to-yellow-500 shadow-amber-300/30";
      case "child": return "from-emerald-400 to-teal-500 shadow-emerald-300/30";
      case "teenager": return "from-blue-400 to-indigo-500 shadow-blue-300/30";
      case "young": return "from-purple-400 to-fuchsia-500 shadow-purple-300/30";
      case "middle": return "from-rose-400 to-red-500 shadow-rose-300/30";
      case "elderly": return "from-slate-400 to-slate-600 shadow-slate-300/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white pb-12 relative overflow-x-hidden">
      
      {/* Absolute Decorative Glowing Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Top Header Card */}
        <header className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100/80 rounded-full px-4 py-1.5 mb-3 text-indigo-700 text-xs font-semibold shadow-sm"
          >
            <Sparkles size={14} className="text-indigo-500 animate-spin" style={{ animationDuration: "6s" }} />
            <span>প্রজন্মের সাথে পরিবর্তনশীল ৩ডি রূপান্তর ও রাশিফল</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            উন্নত বয়স ক্যালেন্ডার 🗓️
          </motion.h1>
          <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xl mx-auto font-medium">
            ৬ মাস ১ দিন থাকলে ১ বছর রাউন্ডিং হিসাব, লাইভ কাউন্টডাউন টাইমার, রাশিফল এবং সুন্দর ৩ডি স্টাইলের চেহারা পরিবর্তনশীল মানুষের ছবি সহ।
          </p>
        </header>

        {/* 1. Input Controls Card (সবার উপরে জন্ম তারিখ নির্বাচন করুন) */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg mb-8 max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-indigo-500" />
              আপনার জন্মতারিখ নির্বাচন করুন:
            </label>
            <div className="relative w-full max-w-md">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setBirthDate(e.target.value);
                  }
                }}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-5 py-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-center text-lg shadow-inner cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* PWA Installation & Offline Support Guide Panel */}
        <section className="mb-8 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 md:p-6 border border-indigo-500/20 shadow-xl overflow-hidden relative"
          >
            {/* Background glowing decorations */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 border-b border-indigo-500/20 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-500/20 rounded-2xl text-indigo-300 border border-indigo-500/30">
                  <Smartphone size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                    মোবাইল অ্যাপ হিসেবে ইন্সটল করুন 📱
                  </h3>
                  <p className="text-[11px] text-indigo-200 font-medium mt-0.5">
                    ফোনে ডাউনলোড করে সম্পূর্ণ অফলাইন ও অনলাইনে ব্যবহার করুন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstallGuide(!showInstallGuide)}
                className="text-xs font-bold text-indigo-300 hover:text-indigo-100 px-2.5 py-1.5 bg-white/5 rounded-xl border border-white/10 transition-all"
              >
                {showInstallGuide ? "লুকিয়ে রাখুন" : "বিস্তারিত দেখুন"}
              </button>
            </div>

            <AnimatePresence>
              {showInstallGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {isInstalled ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 mb-4">
                      <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                      <div>
                        <h4 className="text-xs font-extrabold text-emerald-300">অ্যাপটি অলরেডি ইন্সটলড রয়েছে!</h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          আপনার হোম স্ক্রিন থেকে সরাসরি এই আইকন দিয়ে চালু করুন। এটি অফলাইনে সম্পূর্ণ সচল।
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Native Install Button Trigger (Chrome on Android, etc.) */}
                      {isInstallable && (
                        <div className="mb-4">
                          <button
                            onClick={handleNativeInstall}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-2xl text-sm shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98 animate-bounce"
                            style={{ animationDuration: "3s" }}
                          >
                            <Download size={18} />
                            সরাসরি হোম স্ক্রিনে অ্যাপ ইনস্টল করুন 📲
                          </button>
                        </div>
                      )}
                      
                      {/* Manual OS Tabs Guide */}
                      <div>
                        <div className="flex border-b border-indigo-500/15 mb-3.5">
                          <button
                            onClick={() => setInstallTab("android")}
                            className={`flex-1 pb-2 text-xs font-extrabold transition-all border-b-2 ${
                              installTab === "android"
                                ? "border-indigo-400 text-indigo-300"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                            }`}
                          >
                            🤖 Android (Chrome) নির্দেশাবলী
                          </button>
                          <button
                            onClick={() => setInstallTab("ios")}
                            className={`flex-1 pb-2 text-xs font-extrabold transition-all border-b-2 ${
                              installTab === "ios"
                                ? "border-indigo-400 text-indigo-300"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                            }`}
                          >
                            🍎 iPhone / iOS (Safari) নির্দেশাবলী
                          </button>
                        </div>

                        {installTab === "android" ? (
                          <div className="space-y-2 bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-slate-300 font-medium">
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">১</span>
                              <p>ক্রোম (Chrome) ব্রাউজারের উপরে ডান কোণায় থাকা <span className="text-white font-bold">৩-ডট (⋮) মেনু</span> আইকনে ট্যাপ করুন।</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">২</span>
                              <p>তালিকা থেকে <span className="text-white font-bold">"Add to Home screen"</span> অথবা <span className="text-white font-bold">"Install app"</span> সিলেক্ট করুন।</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">৩</span>
                              <p>হোম স্ক্রিনে যুক্ত করে সরাসরি অ্যাপের মতো ব্যবহার শুরু করুন!</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-slate-300 font-medium">
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">১</span>
                              <p>সাফারি (Safari) ব্রাউজারের নিচে থাকা <span className="text-white font-bold">"Share" (শেয়ার 📤)</span> আইকনে ট্যাপ করুন।</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">২</span>
                              <p>তালিকাটি স্ক্রোল করে নিচের দিকে থাকা <span className="text-white font-bold">"Add to Home Screen" (হোম স্ক্রিনে যোগ করুন ➕)</span> সিলেক্ট করুন।</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-300 font-black rounded-lg flex items-center justify-center shrink-0">৩</span>
                              <p>উপরে ডান কোণায় থাকা <span className="text-white font-bold">"Add"</span> বাটনে ট্যাপ করে ইনস্টল সম্পন্ন করুন!</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* App Highlights / PWA Superpowers */}
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-indigo-500/15">
                        <div className="flex items-center gap-2 text-[10px] text-indigo-200">
                          <span className="p-1 bg-emerald-500/20 rounded-lg text-emerald-400">🔌</span>
                          <div>
                            <p className="font-extrabold text-white">১০০% অফলাইন সচল</p>
                            <p className="text-[9px] text-indigo-300/80 mt-0.5">ইন্টারনেট ছাড়াও ওপেন হবে</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-indigo-200">
                          <span className="p-1 bg-purple-500/20 rounded-lg text-purple-400">⚡</span>
                          <div>
                            <p className="font-extrabold text-white">সুপার ফাস্ট লোডিং</p>
                            <p className="text-[9px] text-indigo-300/80 mt-0.5">১ সেকেন্ডে ইন্সট্যান্ট চালু</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* 2. Three.js/SVG Age Avatar View (থ্রিডি অ্যানিমেশনের ছবিটা - জন্ম তারিখের ঠিক পরে) */}
        <section className="mb-8">
          <AgeAvatar stage={avatarStage} age={ageResult.roundedYears} />
        </section>

        {/* 3. Age Rounding Info Card */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg mb-8">
          {/* Age Rounding Information Badge (৬ মাস ১ দিন রাউন্ডিং নিয়ম) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full border border-amber-200">
                বিশেষ নিয়ম সক্রিয় ⚖️
              </div>
              <p className="text-xs text-slate-600 font-semibold">
                ৬ মাস ১ দিন বা তার বেশি অতিবাহিত হলে পরবর্তী বছর যোগ করা হয়েছে।
              </p>
            </div>
            
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 underline transition-all"
            >
              <HelpCircle size={14} /> নিয়মের বিস্তারিত ব্যাখ্যা
            </button>
          </div>

          {/* Collapsible Rules Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/60 text-xs text-slate-700 leading-relaxed font-medium">
                  <h4 className="font-bold text-indigo-800 mb-1.5 flex items-center gap-1">
                    📖 কাস্টম বয়স বৃদ্ধির নিয়মাবলী:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      আপনার প্রকৃত বয়সের অতিরিক্ত সময় যদি <span className="font-bold text-indigo-700">৬ মাস ১ দিন</span> বা তার বেশি হয়, তবে নিয়মানুযায়ী আপনার কাস্টম বয়স হিসেবে পরবর্তী পূর্ণ বছর দেখানো হবে।
                    </li>
                    <li>
                      যেমন: আপনার প্রকৃত বয়স <span className="font-bold text-slate-800">১ বছর ৫ মাস ২৯ দিন</span> হলে, তা রাউন্ড না হয়ে <span className="font-bold text-indigo-600">১ বছর</span> দেখাবে।
                    </li>
                    <li>
                      কিন্তু, আপনার প্রকৃত বয়স <span className="font-bold text-slate-800">১ বছর ৬ মাস ১ দিন</span> হলে, ৬ মাস ও ১ দিন পার হওয়ার কারণে তা রাউন্ড হয়ে সরাসরি <span className="font-bold text-indigo-600">২ বছর</span> দেখাবে।
                    </li>
                    <li>
                      <span className="font-bold text-indigo-700">বর্তমান হিসাব:</span> আপনার প্রকৃত বয়স হলো {toBnNumber(ageResult.actualYears)} বছর {toBnNumber(ageResult.actualMonths)} মাস {toBnNumber(ageResult.actualDays)} দিন। {ageResult.isRoundedUp ? <span className="text-emerald-600 font-bold">এটি ৬ মাস ১ দিন অতিক্রম করায় রাউন্ড আপ হয়ে {toBnNumber(ageResult.roundedYears)} বছর দেখাচ্ছে।</span> : <span className="text-amber-600 font-bold">এটি ৬ মাস ১ দিন অতিক্রম না করায় রাউন্ড আপ ছাড়াই {toBnNumber(ageResult.roundedYears)} বছর দেখাচ্ছে।</span>}
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Dynamic Age Progress Bar Section (রঙিন ব্যাকগ্রাউন্ডে প্রোগ্রেস বার) */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 md:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-widest flex items-center gap-1">
                  <TrendingUp size={12} /> জীবনের অগ্রগতি প্রোগ্রেস বার (শতায়ু হিসেবে)
                </span>
                <h2 className="text-lg font-bold mt-1 text-slate-100">
                  আপনার জীবনের অগ্রগতি: <span className="text-indigo-400">{toBnNumber(progressPercentage.toFixed(2))}%</span> সম্পন্ন
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">বর্তমান বয়স (কাস্টম রাউন্ডেড):</span>
                <p className="text-lg font-black text-amber-400">{toBnNumber(ageResult.roundedYears)} year</p>
              </div>
            </div>

            {/* Glowing Custom Gradient Progress Bar */}
            <div className="w-full h-5 bg-slate-850 rounded-full overflow-hidden p-1 border border-slate-700/50 shadow-inner relative flex items-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(avatarStage)} shadow-[0_0_12px_rgba(0,0,0,0.5)]`}
              />
              {/* Dynamic Tick on the progress bar */}
              <div 
                className="absolute w-2 h-4 bg-white/80 rounded-full blur-[1px]" 
                style={{ left: `calc(${progressPercentage}% - 4px)` }}
              />
            </div>

            {/* Explanatory detail of the progress bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 text-[11px] text-indigo-200/80 font-medium">
              <span>০ বছর (জন্ম)</span>
              <span className="hidden sm:inline">৫০ বছর (অর্ধশতক)</span>
              <span>১০০ বছর (শতবর্ষ)</span>
            </div>
          </div>
        </motion.section>

        {/* 4. Timers & Countdowns (লাইভ কাউন্টার এবং কাউন্টডাউন টাইমার) */}
        <section className="mb-8">
          <CountdownTimer countdown={countdownResult} ageResult={ageResult} />
        </section>

        {/* সহজে বয়স পরিবর্তন করে পরীক্ষা করুন (রাশিফল ও ব্যক্তিত্ব বিশ্লেষণ এর ঠিক উপরে) */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              সহজে বয়স পরিবর্তন করে পরীক্ষা করুন:
            </label>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setBirthDate(preset.date)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                    birthDate === preset.date
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-102"
                      : "bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Full-width Horoscope & Predictions Panel (রাশিফল ও ব্যক্তিত্ব) */}
        <section className="mb-8">
          <HoroscopePanel birthDate={birthDate} ageResult={ageResult} />
        </section>

      </div>

      {/* Footer Details */}
      <footer className="text-center text-xs text-slate-400 border-t border-slate-200 pt-6 mt-12">
        <p className="font-semibold">উন্নত বয়স ক্যালেন্ডার ও রাশিফল অ্যাপলেট</p>
        <p className="mt-1">কাস্টম ৩ডি অভাতর ইঞ্জিন এবং নাছির আহমেদ নাঈম এর বুদ্ধিমত্তা দ্বারা চালিত।</p>
        <p className="mt-2 text-[10px] text-slate-300">© 2026 - সর্বস্বত্ব সংরক্ষিত</p>
      </footer>

    </div>
  );
}

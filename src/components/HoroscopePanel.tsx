import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Heart, Palette, Hash, RefreshCw, AlertCircle } from "lucide-react";
import { HoroscopeData, AgeResult } from "../types";

interface HoroscopePanelProps {
  birthDate: string;
  ageResult: AgeResult | null;
}

// Client-side local astrological database for complete offline capability
function getClientZodiacSign(month: number, day: number) {
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = [
    { name: "Capricorn", nameBn: "মকর (Capricorn)" },
    { name: "Aquarius", nameBn: "কুম্ভ (Aquarius)" },
    { name: "Pisces", nameBn: "মীন (Pisces)" },
    { name: "Aries", nameBn: "মেষ (Aries)" },
    { name: "Taurus", nameBn: "বৃষ (Taurus)" },
    { name: "Gemini", nameBn: "মিথুন (Gemini)" },
    { name: "Cancer", nameBn: "কর্কট (Cancer)" },
    { name: "Leo", nameBn: "সিংহ (Leo)" },
    { name: "Virgo", nameBn: "কন্যা (Virgo)" },
    { name: "Libra", nameBn: "তুলা (Libra)" },
    { name: "Scorpio", nameBn: "বৃশ্চিক (Scorpio)" },
    { name: "Sagittarius", nameBn: "ধনু (Sagittarius)" }
  ];
  
  let index = month - 1;
  if (day < dates[index]) {
    index = (index - 1 + 12) % 12;
  }
  
  return signs[index];
}

function getClientFallbackHoroscope(zodiacName: string, zodiacNameBn: string, roundedAge: number) {
  const fallbacks: Record<string, { personality: string; dailyPrediction: string; birthdayWish: string; luckyColor: string; luckyNumber: number }> = {
    Capricorn: {
      personality: "মকর রাশির জাতক-জাতিকারা সাধারণত অত্যন্ত বাস্তববাদী, শৃঙ্খলাবদ্ধ এবং পরিশ্রমী হয়ে থাকেন। তারা দীর্ঘমেয়াদী লক্ষ্য অর্জনে বিশ্বাসী এবং অত্যন্ত বিশ্বস্ত বন্ধু হিসেবে পরিচিত। জীবনের যেকোনো প্রতিকূল পরিস্থিতিতে তারা ধৈর্য ও একাগ্রতার সাথে লড়াই করতে পারেন।",
      dailyPrediction: "আজ কর্মক্ষেত্রে আপনার সুনাম বৃদ্ধি পাবে। বকেয়া কাজগুলো সফলভাবে সম্পন্ন করতে পারবেন। পরিবারের কোনো বয়োজ্যেষ্ঠ সদস্যের কাছ থেকে ভালো পরামর্শ পেতে পারেন। আর্থিক দিক থেকে আজকের দিনটি শুভ।",
      birthdayWish: `শুভ জন্মদিন! মকর রাশির অবিচল সংকল্প আপনার পথচলাকে আরও সহজ করুক। আপনার বয়স ${roundedAge} বছরে পদার্পণ করছে। আসন্ন নতুন বছরটি আপনার জন্য পেশাদার ও ব্যক্তিগত জীবনে দারুণ সাফল্য নিয়ে আসুক।`,
      luckyColor: "গাঢ় নীল ও ধূসর",
      luckyNumber: 8
    },
    Aquarius: {
      personality: "কুম্ভ রাশির জাতক-জাতিকারা অত্যন্ত স্বাধীনচেতা, প্রগতিশীল এবং মানবতাবাদী হয়ে থাকেন। তারা নতুন কোনো আইডিয়া নিয়ে চিন্তা করতে ভালোবাসেন এবং সমাজ সংস্কারের কাজে বিশেষ আগ্রহী হন। গভীর সংবেদনশীল হলেও মাঝে মাঝে তারা কিছুটা গম্ভীর ও আত্মকেন্দ্রিক হতে পারেন।",
      dailyPrediction: "আজ নতুন কোনো উদ্ভাবনী চিন্তাভাবনা আপনার মাথায় আসতে পারে যা ক্যারিয়ারে লাভজনক হবে। বন্ধুদের সাথে আড্ডা বা সামাজিক কাজে অংশ নেওয়ার যোগ রয়েছে। শরীর ভালো থাকবে এবং মানসিক প্রশান্তি বজায় থাকবে।",
      birthdayWish: `শুভ জন্মদিন! কুম্ভ রাশির ইউনিক দৃষ্টিভঙ্গি ও মহানুভবতা আপনার জীবনকে আলোকিত করুক। আপনার বয়স ${roundedAge} বছর হচ্ছে। নতুন বছরটিতে আপনার সব স্বপ্ন সফল হোক এবং নতুন উচ্চতায় পৌঁছান।`,
      luckyColor: "আকাশি ও বেগুনি",
      luckyNumber: 4
    },
    Pisces: {
      personality: "মীন রাশির ব্যক্তিরা অত্যন্ত সহানুভূতিশীল, সংবেদনশীল এবং কল্পনাপ্রবণ হয়ে থাকেন। তারা শিল্পমনা এবং অন্যের দুঃখ-কষ্ট সহজেই অনুধাবন করতে পারেন। মাঝে মাঝে বাস্তব জগত থেকে নিজের কল্পনার জগতে হারিয়ে যাওয়া এদের একটি সাধারণ বৈশিষ্ট্য।",
      dailyPrediction: "আজ আপনার সৃজনশীলতা অত্যন্ত উচ্চ স্তরে থাকবে। কোনো শিল্পচর্চা বা সাহিত্যচর্চায় আজ চমৎকার সাফল্য পেতে পারেন। সম্পর্কের ক্ষেত্রে ছোটখাটো ভুল বোঝানুভুতি দূর হবে। অতিরিক্ত সংবেদনশীল হওয়া থেকে বিরত থাকুন।",
      birthdayWish: `শুভ জন্মদিন! মীন রাশির গভীর অন্তর্দৃষ্টি ও সহানুভূতি আপনার জীবনকে আরও সুন্দর করে তুলুক। ${roundedAge} বছর বয়সের এই নতুন অধ্যায়ে আপনার সৃজনশীলতার বিকাশ ও আত্মিক শান্তি কামনা করছি।`,
      luckyColor: "হালকা হলুদ ও সামুদ্রিক সবুজ",
      luckyNumber: 3
    },
    Aries: {
      personality: "মেষ রাশির জাতক-জাতিকারা অত্যন্ত উদ্যমী, সাহসী এবং নেতৃত্বদানে পারদর্শী হয়ে থাকেন। তারা যেকোনো কাজে প্রথম উদ্যোগ নিতে ভালোবাসেন এবং অত্যন্ত আত্মবিশ্বাসী হন। তবে মাঝে মাঝে কিছুটা অধৈর্য ও জেদি স্বভাব প্রকাশ পেতে পারে।",
      dailyPrediction: "আজ আপনার মধ্যে অতিরিক্ত প্রাণশক্তি ও কাজের স্পৃহা দেখা যাবে। নতুন কোনো প্রজেক্ট শুরু করার জন্য আজকের দিনটি দারুণ। প্রতিযোগিতামূলক যেকোনো কাজে আপনার বিজয় নিশ্চিত। রাগের ওপর নিয়ন্ত্রণ রাখুন।",
      birthdayWish: `শুভ জন্মদিন! মেষ রাশির সাহসী মনোভাব আপনাকে নতুন সব বিজয় এনে দিক। আপনার বয়স ${roundedAge} বছর হচ্ছে। আগামী দিনগুলো আপনার জীবনে সীমাহীন আনন্দ, সুস্বাস্থ্য এবং অফুরন্ত সম্ভাবনা নিয়ে আসুক।`,
      luckyColor: "লাল ও সোনালী",
      luckyNumber: 9
    },
    Taurus: {
      personality: "বৃষ রাশির জাতক-জাতিকারা অত্যন্ত ধৈর্যশীল, নির্ভরযোগ্য এবং বাস্তবমুখী হয়ে থাকেন। তারা জীবনের আরাম-আয়েশ ও সৌন্দর্য পছন্দ করেন এবং যেকোনো কাজে অনড় ও অবিচল থাকেন। তাদের বিশ্বস্ততা ও নিষ্ঠা সবার কাছে প্রশংসনীয়।",
      dailyPrediction: "আজ আপনার দীর্ঘদিনের কোনো প্রচেষ্টা সফল হতে পারে। আর্থিক লেনদেনে বিশেষ সতর্কতা বজায় রাখুন, ভালো লাভ হতে পারে। পরিবারের সাথে সুস্বাদু খাবার উপভোগের সুযোগ আসবে। রোমান্টিক সম্পর্ক আরও গভীর হবে।",
      birthdayWish: `শুভ জন্মদিন! বৃষ রাশির ধৈর্য ও স্থায়িত্ব আপনার পথচলাকে সমৃদ্ধ করুক। আপনার বয়স ${roundedAge} বছর পূর্ণ হতে চলেছে। এই বিশেষ বয়সে আপনার জীবনে সুখ, সমৃদ্ধি ও অনাবিল শান্তি বর্ষিত হোক।`,
      luckyColor: "সবুজ ও গোলাপি",
      luckyNumber: 6
    },
    Gemini: {
      personality: "মিথুন রাশির ব্যক্তিরা অত্যন্ত বুদ্ধিমান, কৌতূহলী এবং চমৎকার যোগাযোগ দক্ষতাসম্পন্ন হয়ে থাকেন। তারা একসাথে একাধিক কাজ করতে ভালোবাসেন এবং যেকোনো পরিবেশে দ্রুত খাপ খাইয়ে নিতে পারেন। তাদের রসিকতা ও চমৎকার আচরণ সবাইকে মুগ্ধ করে।",
      dailyPrediction: "আজ নতুন মানুষের সাথে পরিচিত হওয়ার ও চমৎকার তথ্য বিনিময় করার সুযোগ আসবে। প্রিয় কোনো বন্ধুর কাছ থেকে অপ্রত্যাশিত খুশির খবর পেতে পারেন। ভ্রমণের জন্য আজকের দিনটি দারুণ উপযুক্ত।",
      birthdayWish: `শুভ জন্মদিন! মিথুন রাশির চঞ্চলতা ও তীক্ষ্ণ মেধা আপনার জীবনের প্রতিটি মুহূর্তকে আনন্দময় করুক। ${roundedAge} বছর বয়সের এই নতুন অধ্যায়ে আপনি আরও নতুন জ্ঞান ও সাফল্যে ভরে উঠুন।`,
      luckyColor: "হলুদ ও হালকা সবুজ",
      luckyNumber: 5
    },
    Cancer: {
      personality: "কর্কট রাশির জাতক-জাতিকারা অত্যন্ত আবেগপ্রবণ, পরিবার-অনুরক্ত এবং যত্নশীল প্রকৃতির হয়ে থাকেন। তারা তাদের আপনজনদের সুরক্ষায় সবসময় নিয়োজিত থাকেন। তাদের তীব্র অন্তর্দৃষ্টি রয়েছে, যার ফলে তারা যেকোনো মানুষের আসল রূপ সহজেই বুঝতে পারেন।",
      dailyPrediction: "আজ আপনার গৃহকোণে সুখ ও শান্তি বজায় থাকবে। মায়ের সুস্বাস্থ্য আপনার আনন্দ বৃদ্ধি করবে। কেনাকাটা বা ঘর সাজানোর কাজে ব্যয় হতে পারে। পুরোনো স্মৃতি রোমন্থন করে আজ আবেগপ্রবণ হতে পারেন।",
      birthdayWish: `শুভ জন্মদিন! কর্কট রাশির গভীর ভালোবাসা ও মমতা আপনার চারপাশকে সুন্দর রাখুক। আপনার বয়স ${roundedAge} বছর হচ্ছে। ঈশ্বরের আশীর্বাদে নতুন বছরে আপনার ও আপনার পরিবারের জীবন সুখে ভরে উঠুক।`,
      luckyColor: "সাদা ও রুপালী",
      luckyNumber: 2
    },
    Leo: {
      personality: "সিংহ রাশির ব্যক্তিরা অত্যন্ত আত্মবিশ্বাসী, উদার এবং জন্মগতভাবে নেতা হয়ে থাকেন। তারা আকর্ষণের কেন্দ্রবিন্দুতে থাকতে ভালোবাসেন এবং যেকোনো কাজে বিশাল হৃদয়ের পরিচয় দেন। তবে মাঝে মাঝে তাদের অতিরিক্ত অহংকার বা আধিপত্যবাদী আচরণ প্রকাশ পেতে পারে।",
      dailyPrediction: "আজ সমাজে আপনার মান-সম্মান ও নেতৃত্ব দেওয়ার ক্ষমতা বৃদ্ধি পাবে। আপনার কাজের চমৎকার প্রশংসা করবেন চারপাশের মানুষ। আজ আত্মবিশ্বাসের সাথে বড় কোনো সিদ্ধান্ত নিতে পারেন। প্রেম জীবন অত্যন্ত মধুর হবে।",
      birthdayWish: `শুভ জন্মদিন! সিংহ রাশির রাজকীয় তেজ ও উদারতা আপনার জীবনে সবসময় গৌরব বয়ে আনুক। আপনার বয়স ${roundedAge} বছরে পদার্পণ করছে। নতুন বছরটি আপনার জন্য রাজকীয় সব সুযোগ আর সাফল্যে পূর্ণ হোক।`,
      luckyColor: "কমলা ও সোনালী",
      luckyNumber: 1
    },
    Virgo: {
      personality: "কন্যা রাশির জাতক-জাতিকারা অত্যন্ত সুশৃঙ্খল, খুঁতখুঁতে, বিনয়ী এবং প্রখর বিশ্লেষণ ক্ষমতার অধিকারী হয়ে থাকেন। তারা প্রতিটি কাজ নিখুঁতভাবে করতে পছন্দ করেন এবং অন্যদের সাহায্য করতে সবসময় প্রস্তুত থাকেন। তারা বাস্তববাদী এবং অত্যন্ত হিসেবী হন।",
      dailyPrediction: "আজ আপনার প্রখর বুদ্ধিমত্তা ও কর্মদক্ষতার কারণে যেকোনো জটিল সমস্যার সমাধান সহজেই হয়ে যাবে। নিজের শরীরের প্রতি বিশেষ যত্ন নিন এবং সুষম খাদ্য গ্রহণ করুন। গবেষণামূলক কাজে আজ চমৎকার ফল মিলবে।",
      birthdayWish: `শুভ জন্মদিন! কন্যা রাশির নিয়মানুবর্তিতা ও কাজের প্রতি নিষ্ঠা আপনার জীবনকে আদর্শ করে তুলুক। আপনার বয়স ${roundedAge} বছর হচ্ছে। এই নতুন বছরে আপনার প্রতিটি কাজ নিখুঁত হোক এবং সাফল্য আসুক।`,
      luckyColor: "সবুজ ও হালকা ধূসর",
      luckyNumber: 5
    },
    Libra: {
      personality: "তুলা রাশির জাতক-জাতিকারা শান্তিপ্রিয়, ন্যায়পরায়ণ এবং অত্যন্ত আকর্ষণীয় ব্যক্তিত্বের অধিকারী হয়ে থাকেন। তারা সম্পর্কে ভারসাম্য ও সামঞ্জস্য বজায় রাখতে ভালোবাসেন এবং যেকোনো সুন্দর জিনিসের প্রতি তাদের বিশেষ দুর্বলতা থাকে। তারা চমৎকার কূটনীতিক ও সহযোগী বন্ধু।",
      dailyPrediction: "আজ অংশীদারিত্বের যেকোনো কাজে চমৎকার সাফল্য পাবেন। দাম্পত্য সম্পর্কে বা প্রিয়জনের সাথে দারুণ বোঝাপড়া তৈরি হবে। বিতর্কিত যেকোনো বিষয় থেকে নিজেকে দূরে রাখুন। আজকের দিনটি শান্তি ও সমঝোতার।",
      birthdayWish: `শুভ জন্মদিন! তুলা রাশির ভারসাম্য ও সৌন্দর্যের সাধনা আপনার চারপাশকে শান্তিময় রাখুক। আপনার বয়স ${roundedAge} বছরে পদার্পণ করছে। আসন্ন নতুন বছরে আপনার জীবন সুখ, শান্তি ও চমৎকার সম্পর্কে পরিপূর্ণ হোক।`,
      luckyColor: "গোলাপি ও হালকা নীল",
      luckyNumber: 6
    },
    Scorpio: {
      personality: "বৃশ্চিক রাশির ব্যক্তিরা অত্যন্ত রহস্যময়, সংকল্পবদ্ধ এবং তীব্র আবেগ ও ক্ষমতার অধিকারী হয়ে থাকেন। তারা অত্যন্ত অনুগত বন্ধু হলেও যদি কখনো বিশ্বাসঘাতকতার শিকার হন তবে সহজে ভুলে যান না। যেকোনো রহস্য উদঘাটনে তাদের জুড়ি মেলা ভার।",
      dailyPrediction: "আজ আপনার অন্তর্দৃষ্টি চমৎকার কাজ করবে, ফলে যেকোনো গোপন তথ্য বা জটিল পরিস্থিতি সহজে বুঝে ফেলবেন। আর্থিক বিনিয়োগের জন্য আজকের দিনটি দারুণ ফলদায়ক হতে পারে। দীর্ঘদিনের কোনো মনোবাসনা পূর্ণ হবে।",
      birthdayWish: `শুভ জন্মদিন! বৃশ্চিক রাশির গভীর সংকল্প ও শক্তি আপনার সকল বাধা অতিক্রম করতে সাহায্য করুক। আপনার বয়স ${roundedAge} বছর পূর্ণ হতে চলেছে। এই বিশেষ অধ্যায়ে আপনার জীবন রূপান্তর ও নতুন সাফল্যে ভরে উঠুক।`,
      luckyColor: "লাল ও কালো",
      luckyNumber: 9
    },
    Sagittarius: {
      personality: "ধনু রাশির জাতক-জাতিকারা অত্যন্ত আশাবাদী, স্বাধীনচেতা, ভ্রমণপিপাসু এবং জ্ঞানপিপাসু হয়ে থাকেন। তারা জীবনের প্রতিটি মুহূর্ত উপভোগ করতে চান এবং সত্যের সন্ধান করতে ভালোবাসেন। তাদের উদার মন ও হাস্যোজ্জ্বল স্বভাব সবাইকে মুগ্ধ করে।",
      dailyPrediction: "আজ নতুন কোনো জ্ঞান অর্জন বা ভ্রমণের পরিকল্পনা বাস্তবায়িত হতে পারে। আধ্যাত্মিক বা উচ্চশিক্ষার কাজে অগ্রগতি হবে। আপনার পজিটিভ মনোভাব আজ চারপাশের মানুষকে উৎসাহিত করবে। ভাগ্য আপনার সহায়।",
      birthdayWish: `শুভ জন্মদিন! ধনু রাশির অফুরন্ত আশাবাদ ও স্বাধীনতার স্পৃহা আপনার জীবনকে রোমাঞ্চকর করে তুলুক। আপনার বয়স ${roundedAge} বছর হচ্ছে। নতুন বছরের প্রতিটি দিন আপনার জন্য বয়ে আনুক নতুন আনন্দ ও চমৎকার অভিজ্ঞতা।`,
      luckyColor: "হলুদ ও বেগুনি",
      luckyNumber: 3
    }
  };

  return {
    zodiacNameBn,
    personality: fallbacks[zodiacName]?.personality || `আপনার রাশি হলো ${zodiacNameBn}। এই রাশির ব্যক্তিরা সাধারণত অত্যন্ত সৃজনশীল, পরিশ্রমী এবং বন্ধুভাবাপন্ন হয়ে থাকেন।`,
    dailyPrediction: fallbacks[zodiacName]?.dailyPrediction || "আজকের দিনটি আপনার জন্য নতুন কোনো সুযোগ নিয়ে আসতে পারে। পরিবার এবং বন্ধুদের সাথে সুন্দর সময় কাটবে।",
    birthdayWish: fallbacks[zodiacName]?.birthdayWish || `পরবর্তী জন্মদিনে আপনার জন্য শুভকামনা! আপনার বয়স হতে চলেছে প্রায় ${roundedAge} বছর। নতুন বছরটি আপনার জীবনে অনাবিল আনন্দ ও সাফল্য বয়ে আনুক।`,
    luckyColor: fallbacks[zodiacName]?.luckyColor || "হালকা নীল ও সাদা",
    luckyNumber: fallbacks[zodiacName]?.luckyNumber || 7
  };
}

interface HoroscopePanelProps {
  birthDate: string;
  ageResult: AgeResult | null;
}

export default function HoroscopePanel({ birthDate, ageResult }: HoroscopePanelProps) {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch or manual trigger for Horoscope with robust offline fallback
  const fetchHoroscope = async () => {
    if (!birthDate || !ageResult) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate,
          roundedAge: ageResult.roundedYears,
          actualYears: ageResult.actualYears,
          actualMonths: ageResult.actualMonths,
          actualDays: ageResult.actualDays,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load from server");
      }

      const data = await response.json();
      
      // If server returned error or offline fallback indicator, use local offline generation
      if (data.error === "offline_fallback") {
        throw new Error("Server is offline");
      }

      setHoroscope({
        ...data,
        isOffline: false
      });
    } catch (err: any) {
      console.warn("[PWA] Server horoscope API failed/offline. Falling back to local device calculation:", err);
      try {
        // Parse birth date safely (avoid timezone shifts)
        const parts = birthDate.split("-");
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        
        const zodiac = getClientZodiacSign(month, day);
        const roundedAge = ageResult.roundedYears;
        const fallbackData = getClientFallbackHoroscope(zodiac.name, zodiac.nameBn, roundedAge);
        
        setHoroscope({
          ...fallbackData,
          isOffline: true
        });
        setError(null); // Clear error because we successfully resolved offline
      } catch (fallbackErr) {
        setError("রাশিফল লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically when birthDate or age changes
  useEffect(() => {
    fetchHoroscope();
  }, [birthDate]);

  // Convert English numbers to Bengali numbers
  const toBnNumber = (num: number | string): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => (isNaN(parseInt(digit)) ? digit : bengaliDigits[parseInt(digit)]))
      .join("");
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50/40 to-purple-50/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl overflow-hidden relative">
      {/* Decorative starry background sparkles */}
      <div className="absolute top-5 left-5 text-indigo-400/20 animate-pulse"><Sparkles size={24} /></div>
      <div className="absolute bottom-5 right-5 text-purple-400/20 animate-pulse"><Sparkles size={32} /></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-indigo-600 animate-spin" size={22} style={{ animationDuration: "8s" }} />
            রাশিফল ও ব্যক্তিত্ব বিশ্লেষণ 🌟
          </h3>
          <p className="text-xs text-indigo-600 mt-1 font-medium">
            Gemini AI-এর মাধ্যমে আপনার জন্মতারিখ অনুযায়ী রাশিফল এবং বৈশিষ্ট্যসমূহ
          </p>
        </div>

        <button
          onClick={fetchHoroscope}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          রাশিফল রিফ্রেশ
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <span className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              <Sparkles className="text-indigo-500 absolute animate-pulse" size={20} />
            </div>
            <p className="text-sm text-slate-600 font-medium">আপনার রাশিফল এবং জন্মদিনের দিনক্ষণ তৈরি করা হচ্ছে...</p>
            <p className="text-xs text-indigo-400 mt-1.5 italic">Gemini AI হিসাব-নিকাশ করছে 🔮</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-center flex flex-col items-center justify-center"
          >
            <AlertCircle className="text-rose-500 mb-2" size={32} />
            <p className="text-sm text-slate-700 font-semibold mb-3">{error}</p>
            <button
              onClick={fetchHoroscope}
              className="px-4 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full text-xs font-bold transition-all"
            >
              আবার চেষ্টা করুন
            </button>
          </motion.div>
        ) : horoscope ? (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* Header info badge */}
            <div className="flex flex-wrap items-center gap-2 bg-indigo-600 text-white rounded-2xl p-4 shadow-md w-full">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 uppercase font-bold tracking-widest">আপনার রাশিফল</p>
                <h4 className="text-lg font-black">{horoscope.zodiacNameBn}</h4>
              </div>
              
              {/* Online/Offline status badge */}
              {horoscope.isOffline ? (
                <div className="ml-auto bg-amber-500/30 backdrop-blur-md text-amber-200 text-[10px] font-black px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  অফলাইন মোড 🔌
                </div>
              ) : (
                <div className="ml-auto bg-emerald-500/20 backdrop-blur-md text-emerald-200 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
                  লাইভ অনলাইন ⚡
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Personality Card */}
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2.5">
                  <div className="p-1 bg-indigo-100/60 rounded-lg text-indigo-700"><Heart size={16} /></div>
                  <h4 className="text-sm text-slate-800 font-extrabold">রাশির বৈশিষ্ট্য ও ব্যক্তিত্ব</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {horoscope.personality}
                </p>
              </div>

              {/* Daily Horoscope */}
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-purple-600 font-bold mb-2.5">
                  <div className="p-1 bg-purple-100/60 rounded-lg text-purple-700"><Calendar size={16} /></div>
                  <h4 className="text-sm text-slate-800 font-extrabold">আজকের রাশিফল</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {horoscope.dailyPrediction}
                </p>
              </div>

              {/* Next Birthday Insight */}
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                <div className="flex items-center gap-2 text-pink-600 font-bold mb-2.5">
                  <div className="p-1 bg-pink-100/60 rounded-lg text-pink-700"><Sparkles size={16} /></div>
                  <h4 className="text-sm text-slate-800 font-extrabold">পরবর্তী জন্মদিনের ভাগ্যফল ও শুভকামনা</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {horoscope.birthdayWish}
                </p>
              </div>
            </div>

            {/* Lucky elements row */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              {/* Lucky Color */}
              <div className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border border-amber-500/15 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-700"><Palette size={18} /></div>
                <div>
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wide">শুভ রঙ</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{horoscope.luckyColor}</p>
                </div>
              </div>

              {/* Lucky Number */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 border border-emerald-500/15 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-700"><Hash size={18} /></div>
                <div>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide">শুভ সংখ্যা</p>
                  <p className="text-sm font-black text-slate-800 mt-0.5">{toBnNumber(horoscope.luckyNumber)}</p>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">আপনার রাশিফল লোড করতে উপরে জন্মতারিখ নির্বাচন করুন।</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

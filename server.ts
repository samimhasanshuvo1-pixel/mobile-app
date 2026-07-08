import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Detailed fallback horoscopes dictionary in elegant, standard Bengali
function getFallbackHoroscope(zodiacName: string, zodiacNameBn: string, roundedAge: number) {
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
      personality: "ধনু রাশির জাতক-জাতিকারা অত্যন্ত আশাবাদী, স্বাধীনচেতা, ভ্রমণপিপাসু এবং জ্ঞানপিপাসু হয়ে থাকেন। তারা জীবনের প্রতিটি মুহূর্ত উপভোগ করতে চান এবং সত্যের সন্ধানে ব্রত থাকেন। তাদের উদার মন ও হাস্যোজ্জ্বল স্বভাব সবাইকে মুগ্ধ করে।",
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

// Calculate Zodiac sign based on month and day
function getZodiacSign(month: number, day: number) {
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ];
  const signsBn = [
    "মকর (Capricorn)", "কুম্ভ (Aquarius)", "মীন (Pisces)", "মেষ (Aries)",
    "বৃষ (Taurus)", "মিথুন (Gemini)", "কর্কট (Cancer)", "সিংহ (Leo)",
    "কন্যা (Virgo)", "তুলা (Libra)", "বৃশ্চিক (Scorpio)", "ধনু (Sagittarius)"
  ];
  
  if (day < dates[month - 1]) {
    return { name: signs[month - 1], nameBn: signsBn[month - 1] };
  } else {
    const nextIdx = month % 12;
    return { name: signs[nextIdx], nameBn: signsBn[nextIdx] };
  }
}

// API endpoint to generate horoscope
// Retry utility to gracefully handle temporary Gemini 503 or 429 errors
async function generateContentWithRetry(params: any, retries = 2, delayMs = 1500): Promise<any> {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      const status = error?.status || error?.code;
      const isTemporary = status === 503 || status === 429 || 
                          (error?.message && (
                            error.message.includes("503") || 
                            error.message.includes("429") || 
                            error.message.includes("demand") ||
                            error.message.includes("UNAVAILABLE")
                          ));
      
      if (isTemporary && attempt <= retries) {
        console.warn(`[Gemini API] Attempt ${attempt} failed with high demand/temporary error (${status || "UNKNOWN"}). Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2; // exponential backoff
        continue;
      }
      throw error;
    }
  }
}

app.get(["/download-android-source", "/download"], (req, res) => {
  const distFile = path.resolve(process.cwd(), "dist", "AgeCalendar_Android_Source.zip");
  const publicFile = path.resolve(process.cwd(), "public", "AgeCalendar_Android_Source.zip");
  
  if (fs.existsSync(distFile)) {
    return res.download(distFile, "AgeCalendar_Android_Source.zip");
  } else if (fs.existsSync(publicFile)) {
    return res.download(publicFile, "AgeCalendar_Android_Source.zip");
  } else {
    return res.status(404).send("File not found on server. Please regenerate the zip file.");
  }
});

app.post("/api/horoscope", async (req, res) => {
  let zodiac = { name: "Aries", nameBn: "মেষ (Aries)" };
  let roundedAgeNum = 0;
  
  try {
    const { birthDate, roundedAge, actualYears, actualMonths, actualDays } = req.body;
    
    if (!birthDate) {
      return res.status(400).json({ error: "birthDate is required" });
    }
    
    // Timezone-safe date parsing (avoid UTC conversion offset)
    const parts = birthDate.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // 1-indexed (1-12)
    const day = parseInt(parts[2], 10);
    
    zodiac = getZodiacSign(month, day);
    roundedAgeNum = roundedAge || actualYears || 0;
    
    // Check if API key is present
    if (!process.env.GEMINI_API_KEY) {
      const fallbackData = getFallbackHoroscope(zodiac.name, zodiac.nameBn, roundedAgeNum);
      return res.json({ ...fallbackData, isOffline: true });
    }

    const prompt = `Generate a highly personalized, beautifully written Bengali horoscope and characteristics based on the following details:
Zodiac Sign: ${zodiac.name} (${zodiac.nameBn})
Birth Date: ${birthDate}
Current Rounded Age: ${roundedAge} years (Exact: ${actualYears} years, ${actualMonths} months, ${actualDays} days)

Provide warm, authentic, and engaging Bengali content for each field specified in the response schema. Keep the tone encouraging, positive, and deeply insightful. Use polished, Standard Bengali (চলিত ভাষা).`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, wise, and intuitive Bengali astrologer and life guide. You provide beautiful, positive, and accurate personality insights and horoscope predictions in elegant Bengali.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zodiacNameBn: {
              type: Type.STRING,
              description: "The Bengali name of the zodiac sign, e.g. মেষ, বৃষ, মিথুন etc."
            },
            personality: {
              type: Type.STRING,
              description: "Detailed personality traits and characteristics of the person based on their zodiac in Bengali (1-2 paragraphs)."
            },
            dailyPrediction: {
              type: Type.STRING,
              description: "Today's daily horoscope prediction in Bengali (2-3 sentences)."
            },
            birthdayWish: {
              type: Type.STRING,
              description: "A beautiful, uplifting message and forecast for their upcoming birthday and the age they are turning in Bengali."
            },
            luckyColor: {
              type: Type.STRING,
              description: "Lucky color for the user in Bengali."
            },
            luckyNumber: {
              type: Type.INTEGER,
              description: "Lucky number for the user."
            }
          },
          required: ["zodiacNameBn", "personality", "dailyPrediction", "birthdayWish", "luckyColor", "luckyNumber"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      res.json({ ...result, isOffline: false });
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini Horoscope Error:", error);
    // Robust local fallback when Gemini is rate-limited, fails, or throws an error
    try {
      const fallbackData = getFallbackHoroscope(zodiac.name, zodiac.nameBn, roundedAgeNum);
      res.json({ ...fallbackData, isOffline: true });
    } catch (fallbackError) {
      res.status(500).json({ error: "রাশিফল তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।" });
    }
  }
});

// Configure Vite middleware / static asset serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve transformed index.html in development for SPA
    const fs = await import("fs");
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      try {
        const templatePath = path.resolve(process.cwd(), "index.html");
        const template = fs.readFileSync(templatePath, "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

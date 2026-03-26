export const PREDEFINED_ANSWERS: Record<string, string> = {
  "পানি": "একজন প্রাপ্তবয়স্ক মানুষের প্রতিদিন গড়ে ২.৫ থেকে ৩ লিটার (৮-১০ গ্লাস) পানি পান করা উচিত। তবে পরিশ্রম ও আবহাওয়ার ওপর ভিত্তি করে এটি কম-বেশি হতে পারে।",
  "ঘুম": "ঘুমের অভাবের প্রধান কারণগুলোর মধ্যে রয়েছে অতিরিক্ত মানসিক চাপ, অনিয়মিত জীবনযাপন, ঘুমানোর আগে মোবাইল বা ল্যাপটপের ব্যবহার এবং ক্যাফেইন জাতীয় পানীয় গ্রহণ। পর্যাপ্ত ঘুমের জন্য প্রতিদিন ৭-৮ ঘণ্টা ঘুমানো জরুরি।",
  "সুস্থ": "সুস্থ থাকতে পুষ্টিকর খাবার গ্রহণ, নিয়মিত ব্যায়াম, পর্যাপ্ত ঘুম এবং প্রচুর পানি পান করা জরুরি। এছাড়া মানসিক চাপ মুক্ত থাকার চেষ্টা করুন এবং নিয়মিত স্বাস্থ্য পরীক্ষা করান।",
  "ওজন": "ওজন কমাতে চিনি ও চর্বিযুক্ত খাবার এড়িয়ে চলুন, প্রচুর শাকসবজি খান এবং প্রতিদিন অন্তত ৩০ মিনিট হাঁটাহাঁটি বা ব্যায়াম করুন। রাতের খাবার ঘুমানোর অন্তত ২ ঘণ্টা আগে শেষ করুন।",
  "ব্যায়াম": "নিয়মিত ব্যায়াম করলে শরীরের রোগ প্রতিরোধ ক্ষমতা বাড়ে, হৃদরোগের ঝুঁকি কমে, মানসিক প্রশান্তি আসে এবং শরীরের ওজন নিয়ন্ত্রণে থাকে। প্রতিদিন অন্তত ২০-৩০ মিনিট ব্যায়াম করার চেষ্টা করুন।",
  "ব্যায়াম": "নিয়মিত ব্যায়াম করলে শরীরের রোগ প্রতিরোধ ক্ষমতা বাড়ে, হৃদরোগের ঝুঁকি কমে, মানসিক প্রশান্তি আসে এবং শরীরের ওজন নিয়ন্ত্রণে থাকে। প্রতিদিন অন্তত ২০-৩০ মিনিট ব্যায়াম করার চেষ্টা করুন।",
};

export function getPredefinedAnswer(query: string): string | null {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes("পানি") && (normalizedQuery.includes("কতটুকু") || normalizedQuery.includes("পরিমাণ"))) {
    return PREDEFINED_ANSWERS["পানি"];
  }
  
  if (normalizedQuery.includes("ঘুম") && (normalizedQuery.includes("অভাব") || normalizedQuery.includes("কারণ") || normalizedQuery.includes("কম"))) {
    return PREDEFINED_ANSWERS["ঘুম"];
  }
  
  if (normalizedQuery.includes("সুস্থ") && (normalizedQuery.includes("উপায়") || normalizedQuery.includes("কিভাবে"))) {
    return PREDEFINED_ANSWERS["সুস্থ"];
  }
  
  if (normalizedQuery.includes("ওজন") && (normalizedQuery.includes("কমানো") || normalizedQuery.includes("উপায়"))) {
    return PREDEFINED_ANSWERS["ওজন"];
  }
  
  if ((normalizedQuery.includes("ব্যায়াম") || normalizedQuery.includes("ব্যায়াম")) && (normalizedQuery.includes("উপকারিতা") || normalizedQuery.includes("কেন"))) {
    return PREDEFINED_ANSWERS["ব্যায়াম"];
  }

  return null;
}

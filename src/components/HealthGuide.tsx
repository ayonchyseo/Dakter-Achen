import React, { useState } from 'react';
import { X, BookOpen, ChevronRight, Thermometer, Wind, AlertCircle, Coffee, Droplets, Activity, Zap, Apple, GlassWater } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Remedy {
  title: string;
  symptoms: string[];
  remedies: string[];
  icon: React.ReactNode;
  color: string;
}

interface HealthGuideProps {
  onClose: () => void;
}

export default function HealthGuide({ onClose }: HealthGuideProps) {
  const [selectedAilment, setSelectedAilment] = useState<Remedy | null>(null);

  const ailments: Remedy[] = [
    {
      title: 'সাধারণ সর্দি-কাশি',
      icon: <Wind size={24} />,
      color: 'bg-blue-500',
      symptoms: ['নাক বন্ধ বা নাক দিয়ে পানি পড়া', 'ঘন ঘন হাঁচি', 'গলা ব্যথা বা খুসখুসে কাশি', 'হালকা শরীর ব্যথা'],
      remedies: [
        'আদা ও লেবু দিয়ে রঙ চা পান করুন।',
        'এক চামচ মধুর সাথে তুলসী পাতার রস মিশিয়ে খান।',
        'কুসুম গরম পানিতে লবণ মিশিয়ে দিনে ২-৩ বার গড়গড়া (Gargle) করুন।',
        'পর্যাপ্ত বিশ্রাম নিন এবং প্রচুর তরল খাবার খান।'
      ]
    },
    {
      title: 'অ্যালার্জি',
      icon: <AlertCircle size={24} />,
      color: 'bg-amber-500',
      symptoms: ['ত্বকে চুলকানি বা লালচে চাকা হওয়া', 'চোখ লাল হওয়া ও পানি পড়া', 'অতিরিক্ত হাঁচি', 'নাক চুলকানো'],
      remedies: [
        'যেসব খাবারে বা পরিবেশে অ্যালার্জি হয় তা এড়িয়ে চলুন।',
        'নিম পাতা ভেজানো পানি দিয়ে গোসল করতে পারেন।',
        'ঘরবাড়ি ধুলোবালি মুক্ত রাখুন এবং নিয়মিত চাদর-বালিশের কভার পরিবর্তন করুন।',
        'অতিরিক্ত সমস্যায় ডাক্তারের পরামর্শে অ্যান্টি-হিস্টামিন জাতীয় ঔষধ সেবন করুন।'
      ]
    },
    {
      title: 'জ্বর',
      icon: <Thermometer size={24} />,
      color: 'bg-rose-500',
      symptoms: ['শরীরের তাপমাত্রা বৃদ্ধি', 'ক্লান্তি ও দুর্বলতা', 'মাথা ব্যথা ও শরীর ব্যথা', 'খাবারে অরুচি'],
      remedies: [
        'মাথায় জলপট্টি দিন এবং শরীর ভেজা কাপড় দিয়ে মুছে দিন।',
        'পর্যাপ্ত পানি ও ফলের রস পান করুন যাতে পানিশূন্যতা না হয়।',
        'ভারী খাবার এড়িয়ে হালকা ও সহজপাচ্য খাবার (যেমন: স্যুপ, সাগু) খান।',
        'তাপমাত্রা ১০১ ডিগ্রির বেশি হলে প্যারাসিটামল সেবন করতে পারেন।'
      ]
    },
    {
      title: 'বদহজম ও এসিডিটি',
      icon: <Droplets size={24} />,
      color: 'bg-emerald-500',
      symptoms: ['বুক জ্বালাপোড়া করা', 'পেট ফাঁপা বা ভারি বোধ হওয়া', 'টক ঢেকুর ওঠা', 'পেটে অস্বস্তি'],
      remedies: [
        'খাওয়ার পর সামান্য আদা কুচি ও লবণ চিবিয়ে খান।',
        'এক গ্লাস পানিতে সামান্য জিরা বা জোয়ান ভিজিয়ে সেই পানি পান করুন।',
        'ভাজা-পোড়া ও অতিরিক্ত মসলাযুক্ত খাবার এড়িয়ে চলুন।',
        'খাওয়ার সাথে সাথে শুয়ে না পড়ে কিছুক্ষণ হাঁটাহাঁটি করুন।'
      ]
    },
    {
      title: 'মাথা ব্যথা',
      icon: <Coffee size={24} />,
      color: 'bg-violet-500',
      symptoms: ['মাথার একপাশে বা পুরো মাথায় টনটনে ব্যথা', 'চোখে অস্বস্তি বা ঝাপসা দেখা', 'শব্দ বা আলোতে বিরক্তি'],
      remedies: [
        'অন্ধকার ও শান্ত ঘরে কিছুক্ষণ চোখ বন্ধ করে বিশ্রাম নিন।',
        'আদা চা বা পুদিনা পাতার চা পান করুন।',
        'মাথায় হালকা ম্যাসাজ করুন বা লবঙ্গের ঘ্রাণ নিন।',
        'পর্যাপ্ত পানি পান করুন, কারণ পানিশূন্যতা থেকেও মাথা ব্যথা হতে পারে।'
      ]
    },
    {
      title: 'ডায়রিয়া',
      icon: <GlassWater size={24} />,
      color: 'bg-cyan-500',
      symptoms: ['পাতলা পায়খানা হওয়া', 'পেটে মোচড় দিয়ে ব্যথা', 'বমি বমি ভাব বা বমি', 'শরীরে পানিশূন্যতা ও দুর্বলতা'],
      remedies: [
        'বারবার ওআরএস (ORS) বা খাবার স্যালাইন পান করুন।',
        'ডাবের পানি, ভাতের মাড় বা পাতলা ডাল খান।',
        'কাঁচকলা সেদ্ধ বা নরম জাউ ভাত দই দিয়ে খেতে পারেন।',
        'অবস্থা গুরুতর হলে বা রক্ত গেলে দ্রুত হাসপাতালে যান।'
      ]
    },
    {
      title: 'কোষ্ঠকাঠিন্য',
      icon: <Apple size={24} />,
      color: 'bg-lime-600',
      symptoms: ['মলত্যাগ করতে কষ্ট হওয়া', 'পেট ভারি বা শক্ত হয়ে থাকা', 'খাবারে অরুচি', 'মাঝে মাঝে পেট ব্যথা'],
      remedies: [
        'প্রচুর পরিমাণে পানি ও আঁশযুক্ত খাবার (শাকসবজি, ফল) খান।',
        'ইসবগুলের ভুষি কুসুম গরম পানিতে মিশিয়ে রাতে ঘুমানোর আগে খান।',
        'পাকা পেঁপে বা বেল খেতে পারেন যা পেট পরিষ্কার করতে সাহায্য করে।',
        'নিয়মিত শারীরিক পরিশ্রম বা হাঁটাচলা করুন।'
      ]
    },
    {
      title: 'আমবাত (Hives)',
      icon: <Zap size={24} />,
      color: 'bg-pink-500',
      symptoms: ['ত্বকে লালচে চাকা ও প্রচণ্ড চুলকানি', 'শরীরের বিভিন্ন স্থানে ফুলে যাওয়া', 'জ্বালাপোড়া ভাব'],
      remedies: [
        'আক্রান্ত স্থানে বরফ বা ঠান্ডা পানি ব্যবহার করুন।',
        'অ্যালোভেরা জেল বা নারকেল তেল লাগালে চুলকানি কমতে পারে।',
        'অ্যালার্জি সৃষ্টিকারী খাবার (যেমন: চিংড়ি, বেগুন) এড়িয়ে চলুন।',
        'সুতি ও ঢিলেঢালা পোশাক পরুন।'
      ]
    },
    {
      title: 'উচ্চ রক্তচাপ (Hypertension)',
      icon: <Activity size={24} />,
      color: 'bg-red-600',
      symptoms: ['মাথা ঘোরা বা ঘাড় ব্যথা', 'বুক ধড়ফড় করা', 'মাঝে মাঝে নাক দিয়ে রক্ত পড়া', 'অতিরিক্ত ক্লান্তি'],
      remedies: [
        'খাবারে লবণের পরিমাণ কমিয়ে দিন (কাঁচা লবণ বর্জন করুন)।',
        'মানসিক চাপ কমানোর জন্য নিয়মিত ধ্যান বা যোগব্যায়াম করুন।',
        'চর্বিযুক্ত ও তৈলাক্ত খাবার এড়িয়ে চলুন।',
        'প্রতিদিন অন্তত ৩০ মিনিট দ্রুত হাঁটার অভ্যাস করুন।'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-primary p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold">সাধারণ স্বাস্থ্য সমস্যা ও প্রতিকার</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!selectedAilment ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {ailments.map((ailment, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAilment(ailment)}
                    className="flex flex-col p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`${ailment.color} text-white p-3 rounded-xl w-fit mb-4 shadow-lg shadow-black/5`}>
                      {ailment.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                      {ailment.title}
                    </h3>
                    <div className="mt-auto flex items-center text-primary text-xs font-bold gap-1">
                      লক্ষণ ও প্রতিকার দেখুন <ChevronRight size={14} />
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setSelectedAilment(null)}
                  className="text-primary text-sm font-bold flex items-center gap-1 mb-4"
                >
                  ← ফিরে যান
                </button>

                <div className="flex items-center gap-4">
                  <div className={`${selectedAilment.color} text-white p-4 rounded-2xl shadow-lg`}>
                    {selectedAilment.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedAilment.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-rose-400 rounded-full" />
                      সাধারণ লক্ষণসমূহ:
                    </h4>
                    <ul className="space-y-2">
                      {selectedAilment.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-slate-400 rounded-full shrink-0 mt-2" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                      ঘরোয়া প্রতিকার:
                    </h4>
                    <ul className="space-y-2">
                      {selectedAilment.remedies.map((remedy, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-2" />
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-blue-800 text-xs leading-relaxed">
                    <strong>সতর্কতা:</strong> ঘরোয়া প্রতিকার শুধুমাত্র প্রাথমিক আরামের জন্য। যদি সমস্যা ৩ দিনের বেশি স্থায়ী হয় বা তীব্র হয়, তবে অবশ্যই বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন।
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

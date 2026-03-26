import React, { useState } from 'react';
import { X, Dumbbell, ChevronRight, Heart, Wind, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Exercise {
  name: string;
  duration: string;
  benefit: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  exercises: Exercise[];
}

interface ExerciseGuideProps {
  onClose: () => void;
}

export default function ExerciseGuide({ onClose }: ExerciseGuideProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories: Category[] = [
    {
      id: 'weight-loss',
      title: 'ওজন কমানো',
      icon: <Dumbbell size={24} />,
      color: 'bg-orange-500',
      description: 'শরীরের অতিরিক্ত মেদ ঝরিয়ে ফিট থাকতে এই ব্যায়ামগুলো করুন।',
      exercises: [
        { name: 'দ্রুত হাঁটা (Brisk Walking)', duration: '৩০-৪০ মিনিট', benefit: 'ক্যালোরি পোড়ায় ও হার্ট ভালো রাখে।' },
        { name: 'দৌড়ানো (Running)', duration: '১৫-২০ মিনিট', benefit: 'দ্রুত ওজন কমাতে কার্যকর।' },
        { name: 'স্কোয়াট (Squats)', duration: '৩ সেট (১২ বার করে)', benefit: 'পায়ের পেশী মজবুত করে ও মেদ কমায়।' },
        { name: 'প্লাঙ্ক (Plank)', duration: '৩০-৬০ সেকেন্ড', benefit: 'পেটের মেদ কমাতে সাহায্য করে।' }
      ]
    },
    {
      id: 'back-pain',
      title: 'পিঠ ও কোমর ব্যথা',
      icon: <User size={24} />,
      color: 'bg-blue-500',
      description: 'দীর্ঘক্ষণ বসে থাকার কারণে হওয়া ব্যথা কমাতে এই স্ট্রেচিংগুলো সহায়ক।',
      exercises: [
        { name: 'ক্যাট-কাউ স্ট্রেচ (Cat-Cow)', duration: '১০-১২ বার', benefit: 'মেরুদণ্ডের নমনীয়তা বাড়ায়।' },
        { name: 'চাইল্ড পোজ (Child\'s Pose)', duration: '১-২ মিনিট', benefit: 'পিঠের নিচের অংশের টান কমায়।' },
        { name: 'পেলভিক টিল্ট (Pelvic Tilt)', duration: '১০-১৫ বার', benefit: 'কোমরের পেশী শিথিল করে।' }
      ]
    },
    {
      id: 'heart-health',
      title: 'হার্টের স্বাস্থ্য',
      icon: <Heart size={24} />,
      color: 'bg-rose-500',
      description: 'রক্ত সঞ্চালন বৃদ্ধি ও হৃদরোগের ঝুঁকি কমাতে নিয়মিত করুন।',
      exercises: [
        { name: 'অ্যারোবিক্স (Aerobics)', duration: '২০-৩০ মিনিট', benefit: 'ফুসফুস ও হার্টের কার্যক্ষমতা বাড়ায়।' },
        { name: 'সাইক্লিং (Cycling)', duration: '২০-৩০ মিনিট', benefit: 'পুরো শরীরের রক্ত সঞ্চালন উন্নত করে।' },
        { name: 'যোগব্যায়াম (Yoga)', duration: '১৫-২০ মিনিট', benefit: 'মানসিক চাপ কমিয়ে হার্ট সুস্থ রাখে।' }
      ]
    },
    {
      id: 'stress-relief',
      title: 'মানসিক প্রশান্তি',
      icon: <Wind size={24} />,
      color: 'bg-emerald-500',
      description: 'মন শান্ত রাখতে এবং দুশ্চিন্তা কমাতে এই অভ্যাসগুলো করুন।',
      exercises: [
        { name: 'গভীর শ্বাস (Deep Breathing)', duration: '৫-১০ মিনিট', benefit: 'তাৎক্ষণিক মানসিক চাপ কমায়।' },
        { name: 'ধ্যান (Meditation)', duration: '১০-১৫ মিনিট', benefit: 'মনোযোগ ও মানসিক স্থিরতা বাড়ায়।' },
        { name: 'শবাসন (Savasana)', duration: '৫ মিনিট', benefit: 'পুরো শরীর ও মনকে শিথিল করে।' }
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
            <Dumbbell size={24} />
            <h2 className="text-xl font-bold">ব্যায়াম ও ফিটনেস গাইড</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="flex flex-col p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`${cat.color} text-white p-3 rounded-xl w-fit mb-4 shadow-lg shadow-black/5`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary text-xs font-bold gap-1">
                      বিস্তারিত দেখুন <ChevronRight size={14} />
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
                  onClick={() => setSelectedCategory(null)}
                  className="text-primary text-sm font-bold flex items-center gap-1 mb-4"
                >
                  ← ফিরে যান
                </button>

                <div className="flex items-center gap-4">
                  <div className={`${selectedCategory.color} text-white p-4 rounded-2xl shadow-lg`}>
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{selectedCategory.title}</h3>
                    <p className="text-slate-500 text-sm">{selectedCategory.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedCategory.exercises.map((ex, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800">{ex.name}</h4>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {ex.duration}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 italic">উপকারিতা: {ex.benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-amber-800 text-xs leading-relaxed">
                    <strong>সতর্কতা:</strong> ব্যায়াম শুরু করার আগে শরীর গরম (Warm-up) করে নিন। যদি আপনার আগে থেকে কোনো শারীরিক সমস্যা থাকে, তবে ব্যায়াম শুরু করার আগে অবশ্যই ডাক্তারের পরামর্শ নিন।
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

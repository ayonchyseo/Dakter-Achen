import React, { useState } from 'react';
import { X, Calculator, Info, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface BMICalculatorProps {
  onClose: () => void;
}

export default function BMICalculator({ onClose }: BMICalculatorProps) {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<{ bmi: number; status: string; color: string; recommendations: string[] } | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert to meters

    if (w > 0 && h > 0) {
      const bmi = parseFloat((w / (h * h)).toFixed(1));
      let status = '';
      let color = '';
      let recommendations: string[] = [];

      if (bmi < 18.5) {
        status = 'আপনার ওজন স্বাভাবিকের চেয়ে কম (Underweight)';
        color = 'text-blue-500';
        recommendations = [
          'পুষ্টিকর ও ক্যালোরিযুক্ত খাবার খান (যেমন: বাদাম, দুধ, ডিম)।',
          'পর্যাপ্ত প্রোটিন গ্রহণ নিশ্চিত করুন।',
          'পেশী গঠনের জন্য হালকা শক্তি-বর্ধক ব্যায়াম করুন।'
        ];
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        status = 'আপনার ওজন আদর্শ (Normal Weight)';
        color = 'text-emerald-500';
        recommendations = [
          'আপনার বর্তমান স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন।',
          'সুষম খাবার এবং নিয়মিত শারীরিক পরিশ্রম চালিয়ে যান।',
          'পর্যাপ্ত পানি পান করুন এবং নিয়মিত ঘুমান।'
        ];
      } else if (bmi >= 25 && bmi <= 29.9) {
        status = 'আপনার ওজন স্বাভাবিকের চেয়ে বেশি (Overweight)';
        color = 'text-amber-500';
        recommendations = [
          'মিষ্টি, ভাজা-পোড়া ও অতিরিক্ত চর্বিযুক্ত খাবার এড়িয়ে চলুন।',
          'প্রতিদিন অন্তত ৩০-৪০ মিনিট দ্রুত হাঁটার অভ্যাস করুন।',
          'খাবারে শাকসবজি ও ফলের পরিমাণ বাড়িয়ে দিন।'
        ];
      } else {
        status = 'অতিরিক্ত ওজন বা স্থূলতা (Obese)';
        color = 'text-rose-500';
        recommendations = [
          'একজন বিশেষজ্ঞ ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।',
          'উচ্চ ক্যালোরিযুক্ত খাবার এবং কোমল পানীয় সম্পূর্ণ বর্জন করুন।',
          'নিয়মিত ব্যায়ামের মাধ্যমে ওজন কমানোর চেষ্টা করুন।'
        ];
      }

      setResult({ bmi, status, color, recommendations });
    }
  };

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-primary p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator size={24} />
            <h2 className="text-xl font-bold">বিএমআই (BMI) ক্যালকুলেটর</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ওজন (কেজি)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="যেমন: ৭০"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">উচ্চতা (সেমি)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="যেমন: ১৭০"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            onClick={calculateBMI}
            disabled={!weight || !height}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
          >
            হিসাব করুন
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <p className="text-sm text-slate-500">আপনার বিএমআই স্কোর:</p>
                <p className={`text-4xl font-black ${result.color}`}>{result.bmi}</p>
                <p className={`font-bold ${result.color}`}>{result.status}</p>
              </div>

              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <p className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <Heart size={16} className="text-emerald-500" />
                  আমাদের পরামর্শ:
                </p>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-emerald-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 mt-1" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
            <p className="text-blue-800 text-xs leading-relaxed">
              বিএমআই (Body Mass Index) হলো শরীরের উচ্চতা ও ওজনের অনুপাত যা দিয়ে বোঝা যায় আপনার ওজন স্বাস্থ্যকর কিনা।
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

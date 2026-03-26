import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, AlertCircle, RefreshCw, Heart, Mic, MicOff, Calculator, Dumbbell, BookOpen, Volume2, Brain, Radio, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getHealthAdvice, generateSpeech, getLiveSession } from './services/geminiService';
import BMICalculator from './components/BMICalculator';
import ExerciseGuide from './components/ExerciseGuide';
import HealthGuide from './components/HealthGuide';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'আসসালামু আলাইকুম। আমি আপনার বাংলা স্বাস্থ্য সহকারী।\n\n⚠️ **গুরুত্বপূর্ণ সতর্কতা:** আমি একজন কৃত্রিম বুদ্ধিমত্তা সম্পন্ন সহকারী। আমি কোনোভাবেই একজন পেশাদার ডাক্তারের বিকল্প নই। আমার দেওয়া পরামর্শগুলো শুধুমাত্র সাধারণ তথ্যের জন্য।\n\nআপনার যদি কোনো গুরুতর শারীরিক সমস্যা থাকে বা জরুরি অবস্থার সৃষ্টি হয়, তবে দেরি না করে দ্রুত একজন বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন।\n\nএখন বলুন, আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showBMI, setShowBMI] = useState(false);
  const [showExerciseGuide, setShowExerciseGuide] = useState(false);
  const [showHealthGuide, setShowHealthGuide] = useState(false);
  const [useThinking, setUseThinking] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const audioQueueRef = useRef<{data: Int16Array, sampleRate: number}[]>([]);
  const isPlayingRef = useRef(false);
  const isLiveModeRef = useRef(false);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bn-BD'; // Bangla (Bangladesh)

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev + ' ' + transcript).trim());
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setLiveError('মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি। দয়া করে ব্রাউজারের অ্যাড্রেস বারের লক (🔒) আইকনে ক্লিক করে মাইক্রোফোন ব্যবহারের অনুমতি (Allow) দিন।');
        } else if (event.error === 'no-speech') {
          setLiveError('কোনো কথা শোনা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
        } else if (event.error === 'network') {
          setLiveError('ইন্টারনেট সংযোগে সমস্যা হচ্ছে।');
        } else {
          setLiveError('ভয়েস ইনপুটে একটি সমস্যা হয়েছে।');
        }
        
        // Auto-clear the error after 5 seconds
        setTimeout(() => setLiveError(null), 5000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          // Explicitly request microphone permission first to force the browser prompt.
          // SpeechRecognition often fails with 'not-allowed' in iframes without this.
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately, we just needed the permission
            stream.getTracks().forEach(track => track.stop());
          }

          recognitionRef.current.start();
          setIsListening(true);
        } catch (error: any) {
          console.error("Microphone permission or Speech recognition error:", error);
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setLiveError('মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি। দয়া করে ব্রাউজারের অ্যাড্রেস বারের লক (🔒) আইকনে ক্লিক করে মাইক্রোফোন ব্যবহারের অনুমতি (Allow) দিন।');
            setTimeout(() => setLiveError(null), 5000);
          } else {
            // Sometimes it throws if already started, just set state
            setIsListening(true);
          }
        }
      } else {
        alert('আপনার ব্রাউজারটি ভয়েস ইনপুট (Speech to Text) সমর্থন করে না। দয়া করে ক্রোম (Chrome) ব্রাউজার ব্যবহার করুন।');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    await handleSendWithText(input);
  };

  const handleSendWithText = async (text: string) => {
    if ((!text.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim() || 'এই ছবিটি দেখুন।',
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const imageToSend = selectedImage;
    removeImage();
    setIsLoading(true);

    try {
      const advice = await getHealthAdvice(userMessage.content, useThinking, imageToSend || undefined);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: advice,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'দুঃখিত, কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async (text: string, messageId: string) => {
    if (isSpeaking === messageId) {
      setIsSpeaking(null);
      if (currentAudioSourceRef.current) {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current = null;
      }
      return;
    }

    setIsSpeaking(messageId);
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    let audioCtx: AudioContext;
    try {
      audioCtx = new AudioContextClass({ sampleRate: 24000 });
    } catch (e) {
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    
    const audioData = await generateSpeech(text);
    if (audioData) {
      try {
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const validLength = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
        const pcmData = new Int16Array(bytes.buffer, 0, validLength / 2);
        
        const audioBuffer = audioCtx.createBuffer(1, pcmData.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < pcmData.length; i++) {
          channelData[i] = pcmData[i] / 0x7FFF;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        currentAudioSourceRef.current = source;
        source.onended = () => {
          setIsSpeaking(null);
          currentAudioSourceRef.current = null;
          audioCtx.close();
        };
        source.start();
      } catch (e) {
        console.error("Error playing TTS audio:", e);
        setIsSpeaking(null);
        audioCtx.close();
      }
    } else {
      setIsSpeaking(null);
      audioCtx.close();
    }
  };

  const startLiveMode = async () => {
    setLiveError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("আপনার ব্রাউজারটি মাইক্রোফোন ব্যবহারের অনুমতি দিচ্ছে না বা এটি একটি সুরক্ষিত সংযোগ (HTTPS) নয়।");
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      let audioContext: AudioContext;
      try {
        audioContext = new AudioContextClass({ sampleRate: 16000 });
      } catch (e) {
        audioContext = new AudioContextClass();
      }
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      audioContextRef.current = audioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsLiveMode(true);
      isLiveModeRef.current = true;
      
      const sessionPromise = getLiveSession({
        onopen: () => {
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            if (!isLiveModeRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }
            let binary = '';
            const bytes = new Uint8Array(pcmData.buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Data = btoa(binary);
            sessionPromise.then(session => {
              session.sendRealtimeInput({ audio: { data: base64Data, mimeType: `audio/pcm;rate=${audioContext.sampleRate}` } });
            }).catch(err => console.error("Error sending audio:", err));
          };
          
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0;
          
          source.connect(processor);
          processor.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          audioSourceRef.current = source;
          audioProcessorRef.current = processor;
        },
        onmessage: async (message: any) => {
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData?.data && part.inlineData?.mimeType?.startsWith('audio/')) {
                const base64Audio = part.inlineData.data;
                const binaryString = atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const validLength = bytes.length % 2 === 0 ? bytes.length : bytes.length - 1;
                const pcmData = new Int16Array(bytes.buffer, 0, validLength / 2);
                
                let sampleRate = 24000; // Default for output
                const match = part.inlineData.mimeType.match(/rate=(\d+)/);
                if (match) {
                  sampleRate = parseInt(match[1], 10);
                }
                
                audioQueueRef.current.push({ data: pcmData, sampleRate });
                playNextChunk();
              }
            }
          }
          
          if (message.serverContent?.interrupted) {
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            if (currentAudioSourceRef.current) {
              currentAudioSourceRef.current.stop();
              currentAudioSourceRef.current = null;
            }
          }
        },
        onerror: (error: any) => {
          console.error("Live session error:", error);
          setLiveError("লাইভ সেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
          stopLiveMode();
        },
        onclose: () => {
          setIsLiveMode(false);
          isLiveModeRef.current = false;
        }
      });
      
      const session = await sessionPromise;
      liveSessionRef.current = session;
    } catch (error: any) {
      console.error("Live mode error:", error);
      let message = "লাইভ মোড চালু করতে সমস্যা হয়েছে।";
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        message = "আপনার ডিভাইসে কোনো মাইক্রোফোন খুঁজে পাওয়া যায়নি। অনুগ্রহ করে নিশ্চিত করুন যে মাইক্রোফোনটি সংযুক্ত আছে।";
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message = "মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি। দয়া করে ব্রাউজারের অ্যাড্রেস বারের লক (🔒) আইকনে ক্লিক করে মাইক্রোফোন ব্যবহারের অনুমতি (Allow) দিন।";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        message = "মাইক্রোফোনটি অন্য কোনো অ্যাপ ব্যবহার করছে। অন্য অ্যাপটি বন্ধ করে আবার চেষ্টা করুন।";
      } else if (error.name === 'SecurityError') {
        message = "নিরাপত্তা জনিত কারণে মাইক্রোফোন ব্যবহার করা যাচ্ছে না।";
      } else if (error.message) {
        message = error.message;
      }
      
      setLiveError(message);
      setIsLiveMode(false);
      isLiveModeRef.current = false;
    }
  };

  const playNextChunk = async () => {
    if (!audioContextRef.current || isPlayingRef.current || audioQueueRef.current.length === 0) return;
    
    isPlayingRef.current = true;
    const item = audioQueueRef.current.shift()!;
    const chunk = item.data;
    const sampleRate = item.sampleRate;
    
    if (chunk.length === 0) {
      isPlayingRef.current = false;
      playNextChunk();
      return;
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    const audioBuffer = audioContextRef.current.createBuffer(1, chunk.length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      channelData[i] = chunk[i] / 0x7FFF;
    }
    
    const source = audioContextRef.current!.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current!.destination);
    currentAudioSourceRef.current = source;
    source.onended = () => {
      isPlayingRef.current = false;
      currentAudioSourceRef.current = null;
      playNextChunk();
    };
    source.start();
  };

  const stopLiveMode = () => {
    setIsLiveMode(false);
    isLiveModeRef.current = false;
    
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.stop();
      currentAudioSourceRef.current = null;
    }
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    liveSessionRef.current?.close();
    liveSessionRef.current = null;
    
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  const commonSymptoms = [
    "গলা ব্যথা", "জ্বর", "কাশি", "মাথা ব্যথা", "পেট ব্যথা"
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dakter Achen</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-emerald-600 text-xs font-medium">সক্রিয়</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setUseThinking(!useThinking)}
              className={`p-2 transition-colors flex items-center gap-1.5 rounded-lg ${useThinking ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'}`}
              title="থিংকিং মোড"
            >
              <Brain size={20} />
              <span className="hidden sm:inline text-xs font-bold">থিংকিং</span>
            </button>
            <button 
              onClick={isLiveMode ? stopLiveMode : startLiveMode}
              className={`p-2 transition-colors flex items-center gap-1.5 rounded-lg ${isLiveMode ? 'text-rose-600 bg-rose-50 animate-pulse' : 'text-slate-400 hover:text-primary'}`}
              title="লাইভ ভয়েস"
            >
              <Radio size={20} />
              <span className="hidden sm:inline text-xs font-bold">লাইভ</span>
            </button>
            <button 
              onClick={() => setShowHealthGuide(true)}
              className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5"
              title="স্বাস্থ্য গাইড"
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline text-xs font-bold">গাইড</span>
            </button>
            <button 
              onClick={() => setShowExerciseGuide(true)}
              className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5"
              title="ব্যায়াম গাইড"
            >
              <Dumbbell size={20} />
              <span className="hidden sm:inline text-xs font-bold">ব্যায়াম</span>
            </button>
            <button 
              onClick={() => setShowBMI(true)}
              className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5"
              title="বিএমআই ক্যালকুলেটর"
            >
              <Calculator size={20} />
              <span className="hidden sm:inline text-xs font-bold">বিএমআই</span>
            </button>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
              title="নতুন চ্যাট"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* BMI Calculator Modal */}
      <AnimatePresence>
        {showBMI && <BMICalculator onClose={() => setShowBMI(false)} />}
      </AnimatePresence>

      {/* Exercise Guide Modal */}
      <AnimatePresence>
        {showExerciseGuide && <ExerciseGuide onClose={() => setShowExerciseGuide(false)} />}
      </AnimatePresence>

      {/* Health Guide Modal */}
      <AnimatePresence>
        {showHealthGuide && <HealthGuide onClose={() => setShowHealthGuide(false)} />}
      </AnimatePresence>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Disclaimer Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm"
          >
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">চিকিৎসা সংক্রান্ত সতর্কতা</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                এই সহকারীটি কোনোভাবেই পেশাদার চিকিৎসা পরামর্শ, রোগ নির্ণয় বা চিকিৎসার বিকল্প নয়। গুরুতর বা জরুরি অবস্থায় অবিলম্বে নিকটস্থ হাসপাতাল বা ডাক্তারের শরণাপন্ন হোন।
              </p>
            </div>
          </motion.div>

          <AnimatePresence initial={false}>
            {liveError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-100 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle size={16} />
                <span>{liveError}</span>
                <button 
                  onClick={() => setLiveError(null)}
                  className="ml-auto text-rose-400 hover:text-rose-600"
                >
                  <RefreshCw size={14} />
                </button>
              </motion.div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-[80%] p-4 rounded-2xl shadow-sm relative group ${
                  message.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {message.image && (
                    <img src={message.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-3" />
                  )}
                  <div className="plain-text-response whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.role === 'model' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleTTS(message.content, message.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${
                          isSpeaking === message.id ? 'text-primary bg-primary/10' : 'text-slate-500 bg-slate-50 hover:text-primary hover:bg-primary/5'
                        }`}
                        title="শুনুন"
                      >
                        <Volume2 size={14} className={isSpeaking === message.id ? 'animate-pulse' : ''} />
                        {isSpeaking === message.id ? 'শুনছেন...' : 'শুনুন'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-400 italic">পরামর্শ তৈরি হচ্ছে...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 pb-6 md:pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Quick Suggestions */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => {
                  const text = `আমার ${symptom} হচ্ছে।`;
                  setInput(text);
                  // Pass the text directly to a modified handleSend or use a helper
                  handleSendWithText(text);
                }}
                className="px-4 py-1.5 bg-slate-100 hover:bg-primary-light text-slate-600 hover:text-primary rounded-full text-sm font-medium transition-all whitespace-nowrap border border-slate-200 hover:border-primary/30"
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="relative">
            {selectedImage && (
              <div className="absolute -top-20 left-0 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-start gap-2 z-10">
                <img src={selectedImage} alt="Selected" className="h-16 w-16 object-cover rounded-lg" />
                <button 
                  onClick={removeImage}
                  className="bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 p-1 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {isListening && (
              <div className="absolute -top-10 left-0 right-0 flex justify-center">
                <div className="bg-rose-500 text-white text-[10px] px-3 py-1 rounded-full animate-pulse flex flex-col items-center gap-0.5 shadow-md">
                  <div className="flex items-center gap-1 font-medium">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    শুনছি... স্পষ্ট করে বলুন
                  </div>
                  <span className="text-[8px] opacity-90">সমস্যা হলে উপরের 'লাইভ' বাটনটি ব্যবহার করুন</span>
                </div>
              </div>
            )}
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="আপনার সমস্যার কথা এখানে লিখুন..."
              className="w-full p-4 pl-12 pr-24 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-base"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary-light rounded-xl transition-all"
                title="ছবি আপলোড করুন"
              >
                <ImageIcon size={20} />
              </button>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-primary-light'
                }`}
                title="ভয়েস ইনপুট"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-sm">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong className="font-semibold text-amber-900">সতর্কবার্তা:</strong> এই সহকারী শুধুমাত্র সাধারণ তথ্যের জন্য। এটি কোনোভাবেই পেশাদার চিকিৎসা পরামর্শ বা চিকিৎসার বিকল্প নয়। গুরুতর সমস্যায় দ্রুত ডাক্তারের শরণাপন্ন হোন।
            </p>
          </div>
          
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs font-bold text-slate-500">Dakter Achen</p>
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              তৈরি করা হয়েছে <Heart size={10} className="text-rose-400 fill-rose-400" /> দিয়ে আপনার সুস্বাস্থ্যের জন্য
            </p>
            <p className="text-[10px] text-slate-400">
              Made by <a href="https://ayonchy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Ayonchy.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

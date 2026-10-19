import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Sparkles, Clock, MapPin, Award } from 'lucide-react';

export const MemoriesTimeline: React.FC = () => {
  // Couple start date (default romantic anniversary, customizable)
  const [startDateStr, setStartDateStr] = useState<string>('2023-11-14');
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  const milestones = [
    {
      date: 'Chapter 1',
      title: 'When Our Worlds Collided 💫',
      description: 'The first conversation that started everything. What began as casual talks quickly became late-night conversations until 3 AM.',
      icon: '✨',
      badge: 'First Spark'
    },
    {
      date: 'Chapter 2',
      title: 'First Holding Hands in Winter ❄️',
      description: 'Wala pa masyado maayos na damit kaya ayan muna sakto winter para di tayo lamigin hahaha, tas holding hands ayieeeee!',
      icon: '🤝',
      badge: 'Sweet Firsts'
    },
    {
      date: 'Chapter 3',
      title: 'The Bird Scanner Mystery 🕊️',
      description: 'Na-discover natin emote sa hato tas hanap tayo ng place ng picture, mali pa yun ginamit ko dyan that time scanner sa ibon imbes na camera! Pure cuteness!',
      icon: '🎮',
      badge: 'Funny Memory'
    },
    {
      date: 'Chapter 4',
      title: 'Our Emo Era & Aesthetic Photos 🖤',
      description: 'Ganda ng kuha natin dito my meowmeoow huehehe. Even in our moody era, your smile shines brighter than any camera flash.',
      icon: '📸',
      badge: 'Iconic Moments'
    },
    {
      date: 'Today & Beyond',
      title: 'Still Falling For You Every Single Day 🤍',
      description: 'And so many more memories waiting for us to create together. Forever grateful to have my meowmeow by my side.',
      icon: '💖',
      badge: 'Forever'
    }
  ];

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-8 pb-20 animate-in fade-in">
      {/* Love Clock Counter */}
      <div className="romantic-card rounded-2xl p-6 text-center relative overflow-hidden border border-pink-500/30 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
        
        <div className="flex items-center justify-center gap-2 mb-2 text-pink-400">
          <Clock className="w-5 h-5 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-widest">Loving You Non-Stop</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-romantic text-pink-300 mb-4">
          Time Spent Together
        </h2>

        {/* Counter Blocks */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto mb-4">
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-2.5 sm:p-3 text-center">
            <span className="text-xl sm:text-3xl font-bold text-pink-400 font-mono">{timeTogether.days}</span>
            <p className="text-[10px] sm:text-xs text-pink-200/60 uppercase tracking-wider mt-1">Days</p>
          </div>
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-2.5 sm:p-3 text-center">
            <span className="text-xl sm:text-3xl font-bold text-pink-400 font-mono">{timeTogether.hours}</span>
            <p className="text-[10px] sm:text-xs text-pink-200/60 uppercase tracking-wider mt-1">Hours</p>
          </div>
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-2.5 sm:p-3 text-center">
            <span className="text-xl sm:text-3xl font-bold text-pink-400 font-mono">{timeTogether.minutes}</span>
            <p className="text-[10px] sm:text-xs text-pink-200/60 uppercase tracking-wider mt-1">Mins</p>
          </div>
          <div className="bg-black/50 border border-pink-500/20 rounded-xl p-2.5 sm:p-3 text-center">
            <span className="text-xl sm:text-3xl font-bold text-pink-400 font-mono">{timeTogether.seconds}</span>
            <p className="text-[10px] sm:text-xs text-pink-200/60 uppercase tracking-wider mt-1">Secs</p>
          </div>
        </div>

        <p className="text-xs text-pink-200/70 font-script text-base sm:text-lg">
          "Every second with you is a gift I will always cherish."
        </p>
      </div>

      {/* Romantic Milestones Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-pink-500/30 flex flex-col gap-8 ml-3 sm:ml-4">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#150009] border-2 border-pink-400 flex items-center justify-center text-xs group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,105,180,0.6)] transition-all">
              {m.icon}
            </div>

            {/* Timeline Card */}
            <div className="romantic-card rounded-2xl p-5 hover:border-pink-500/60 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold text-pink-400/90 tracking-wider">
                  {m.date}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {m.badge}
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg font-bold text-pink-300 font-romantic mb-1.5">
                {m.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed font-sans">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

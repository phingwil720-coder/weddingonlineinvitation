import { useState, useEffect } from 'react';
import { FloralDecoration } from './floral-decoration';

interface CountdownTimerProps {
  targetDate: string;
  primaryColor: string;
  accentColor: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, primaryColor, accentColor }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <div className="px-6 py-16 bg-secondary bg-[#e4cec9] relative overflow-hidden">
      <FloralDecoration variant="flower" position="top-right" size="sm" opacity={0.35} color="#7A9173" />
      <FloralDecoration variant="leaf" position="bottom-left" size="sm" opacity={0.3} color="#C3968C" />
      <div className="max-w-md mx-auto relative z-10">
        <h3 
          className="text-center mb-10 font-['Playfair_Display'] font-semibold text-foreground font-bold text-[#443730] font-[Birthstone] text-[52px]"
        >
          Countdown
        </h3>
        
        <div className="grid grid-cols-4 gap-3">
          {timeUnits.map((unit, index) => (
            <div 
              key={unit.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-border flex flex-col items-center justify-center bg-[#fefcfc]"
            >
              <div 
                className="text-3xl font-bold font-['Playfair_Display'] mb-1 text-foreground text-[#443730]"
              >
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium text-[#443730]">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
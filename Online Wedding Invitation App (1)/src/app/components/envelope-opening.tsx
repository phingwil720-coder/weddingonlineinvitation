import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EnvelopeOpeningProps {
  monogramUrl?: string;
  onOpen: () => void;
}

export function EnvelopeOpening({ monogramUrl, onOpen }: EnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {!isOpening ? (
        <div 
          className="fixed inset-0 z-50 bg-[#F9F4F3] cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          {/* V-line flap - SVG centered */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Shadow under the flap */}
            <defs>
              <linearGradient id="flap-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(92, 74, 71, 0.15)" />
                <stop offset="100%" stopColor="rgba(92, 74, 71, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0,25 L 50,50 L 100,25 L 100,27 L 50,52 L 0,27 Z"
              fill="url(#flap-shadow)"
            />
            {/* V-line - thicker and more visible */}
            <path
              d="M 0,25 L 50,50 L 100,25"
              stroke="#5C4A47"
              strokeWidth="0.8"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Wax seal with monogram at V point */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {/* Flat wax seal with imperfect edges */}
            <div 
              className="relative w-24 h-24 bg-[#C76A6B] flex items-center justify-center"
              style={{
                borderRadius: '38% 62% 41% 59% / 56% 42% 58% 44%',
              }}
            >
              {/* Monogram */}
              <div className="relative w-16 h-16 flex items-center justify-center z-10">
                {monogramUrl ? (
                  <img 
                    src={monogramUrl} 
                    alt="Monogram" 
                    className="w-full h-full object-contain filter brightness-0 invert opacity-90"
                  />
                ) : (
                  <div className="text-3xl font-['Playfair_Display'] font-bold text-white opacity-90">
                    ❤
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Click to open text */}
          <motion.p
            className="absolute left-1/2 top-[calc(50%+80px)] -translate-x-1/2 text-[#5C4A47] text-sm tracking-widest uppercase font-['Montserrat']"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to open
          </motion.p>
        </div>
      ) : (
        <>
          {/* Top half sliding up */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-[#F9F4F3] origin-bottom"
            initial={{ height: '50%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Top part of V-line */}
            <svg
              className="absolute bottom-0 w-full"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              style={{ height: '100px' }}
            >
              <path
                d="M 0,0 L 50,10"
                stroke="#5C4A47"
                strokeWidth="0.8"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>

          {/* Bottom half sliding down */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#F9F4F3] origin-top"
            initial={{ height: '50%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Bottom part of V-line */}
            <svg
              className="absolute top-0 w-full"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              style={{ height: '100px' }}
            >
              <path
                d="M 50,0 L 100,10"
                stroke="#5C4A47"
                strokeWidth="0.8"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
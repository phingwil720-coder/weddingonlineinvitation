interface FloralDecorationProps {
  variant?: 'branch' | 'leaf' | 'flower' | 'vine';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'top-center' | 'bottom-center' | 'left-center' | 'right-center';
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  color?: string;
}

export function FloralDecoration({ 
  variant = 'branch', 
  position = 'top-right',
  size = 'md',
  opacity = 0.3,
  color = '#7A9173'
}: FloralDecorationProps) {
  const sizeMap = {
    sm: 80,
    md: 110,
    lg: 150
  };

  const positionClasses = {
    'top-left': 'absolute -top-4 -left-4',
    'top-right': 'absolute -top-4 -right-4',
    'bottom-left': 'absolute -bottom-4 -left-4',
    'bottom-right': 'absolute -bottom-4 -right-4',
    'center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-center': 'absolute -top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'absolute -bottom-4 left-1/2 -translate-x-1/2',
    'left-center': 'absolute top-1/2 -left-4 -translate-y-1/2',
    'right-center': 'absolute top-1/2 -right-4 -translate-y-1/2'
  };

  const svgSize = sizeMap[size];

  const variants = {
    branch: (
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20 80 Q 35 60, 50 50 Q 65 40, 80 20 M 50 50 Q 45 35, 40 25 M 50 50 Q 55 35, 60 25 M 50 50 Q 35 45, 25 40 M 50 50 Q 65 45, 75 40" 
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="40" cy="25" r="5" fill={color} opacity="0.8" />
        <circle cx="60" cy="25" r="5" fill={color} opacity="0.8" />
        <circle cx="25" cy="40" r="4" fill={color} opacity="0.7" />
        <circle cx="75" cy="40" r="4" fill={color} opacity="0.7" />
        <circle cx="35" cy="32" r="3" fill={color} opacity="0.6" />
        <circle cx="65" cy="32" r="3" fill={color} opacity="0.6" />
      </svg>
    ),
    leaf: (
      <svg 
        width={svgSize} 
        height={svgSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: (() => {
            const rotations = {
              'top-left': 'rotate(135deg)',
              'top-right': 'rotate(-135deg)',
              'bottom-left': 'rotate(45deg)',
              'bottom-right': 'rotate(-45deg)',
              'top-center': 'rotate(180deg)',
              'bottom-center': 'rotate(0deg)',
              'left-center': 'rotate(90deg)',
              'right-center': 'rotate(-90deg)',
              'center': 'rotate(0deg)'
            };
            return rotations[position] || 'rotate(0deg)';
          })(),
          transformOrigin: 'center'
        }}
      >
        <path 
          d="M50 15 Q 75 25, 80 50 Q 75 75, 50 85 Q 25 75, 20 50 Q 25 25, 50 15 Z" 
          fill={color}
          opacity="0.5"
        />
        <path 
          d="M50 15 L 50 85" 
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path 
          d="M50 30 Q 65 35, 70 50 M 50 50 Q 65 55, 70 70 M 50 30 Q 35 35, 30 50 M 50 50 Q 35 55, 30 70" 
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
    flower: (
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="10" fill={color} opacity="0.6" />
        <ellipse cx="50" cy="25" rx="12" ry="18" fill={color} opacity="0.45" />
        <ellipse cx="50" cy="75" rx="12" ry="18" fill={color} opacity="0.45" />
        <ellipse cx="25" cy="50" rx="18" ry="12" fill={color} opacity="0.45" />
        <ellipse cx="75" cy="50" rx="18" ry="12" fill={color} opacity="0.45" />
        <ellipse cx="33" cy="33" rx="14" ry="14" fill={color} opacity="0.4" transform="rotate(-45 33 33)" />
        <ellipse cx="67" cy="33" rx="14" ry="14" fill={color} opacity="0.4" transform="rotate(45 67 33)" />
        <ellipse cx="33" cy="67" rx="14" ry="14" fill={color} opacity="0.4" transform="rotate(45 33 67)" />
        <ellipse cx="67" cy="67" rx="14" ry="14" fill={color} opacity="0.4" transform="rotate(-45 67 67)" />
      </svg>
    ),
    vine: (
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M 10 50 Q 20 30, 30 40 T 50 35 T 70 45 T 90 40" 
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="35" r="6" fill={color} opacity="0.6" />
        <circle cx="40" cy="38" r="5" fill={color} opacity="0.6" />
        <circle cx="60" cy="40" r="6" fill={color} opacity="0.6" />
        <circle cx="80" cy="42" r="5" fill={color} opacity="0.6" />
        <path d="M 20 35 Q 18 25, 15 20 L 12 18" stroke={color} strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        <path d="M 40 38 Q 42 28, 45 23 L 48 20" stroke={color} strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        <path d="M 60 40 Q 58 30, 55 25 L 52 22" stroke={color} strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        <circle cx="12" cy="18" r="3" fill={color} opacity="0.5" />
        <circle cx="48" cy="20" r="3" fill={color} opacity="0.5" />
        <circle cx="52" cy="22" r="3" fill={color} opacity="0.5" />
      </svg>
    )
  };

  return (
    <div 
      className={`${positionClasses[position]} pointer-events-none z-0`}
      style={{ opacity }}
    >
      {variants[variant]}
    </div>
  );
}
import { Sparkles } from 'lucide-react';
import { DressCodeColor } from '../../lib/supabase';
import { FloralDecoration } from './floral-decoration';

interface DressCodeSectionProps {
  dressCode: string;
  dressCodeDescription?: string;
  dressCodeColors?: DressCodeColor[];
  primaryColor: string;
}

export function DressCodeSection({ 
  dressCode, 
  dressCodeDescription, 
  dressCodeColors,
  primaryColor 
}: DressCodeSectionProps) {
  if (!dressCode && !dressCodeDescription && (!dressCodeColors || dressCodeColors.length === 0)) {
    return null;
  }

  return (
    <div className="px-6 py-16 bg-secondary bg-[#e4cec9] relative overflow-hidden">
      <FloralDecoration variant="leaf" position="top-right" size="md" opacity={0.3} color="#7A9173" />
      <FloralDecoration variant="vine" position="bottom-left" size="sm" opacity={0.28} color="#C3968C" />
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Sparkles className="h-8 w-8" style={{ color: primaryColor }} />
          </div>
          
          <h3 className="mb-4 font-[Birthstone] text-[48px] text-[#443730]">
            Dress Code
          </h3>
          
          {dressCode && (
            <p className="text-xl mb-3 font-medium text-foreground text-[#443730]">
              {dressCode}
            </p>
          )}
          
          {dressCodeDescription && (
            <p className="text-base leading-relaxed text-muted-foreground text-[#443730]">
              {dressCodeDescription}
            </p>
          )}
        </div>

        {dressCodeColors && dressCodeColors.length > 0 && (
          <div className="mt-8">
            <p className="text-sm uppercase tracking-wider text-center mb-6 text-muted-foreground text-[#443730]">
              Suggested Colors
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {dressCodeColors.map((colorItem, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <div 
                    className="w-16 h-16 rounded-full shadow-md border-4 border-white"
                    style={{ backgroundColor: colorItem.color }}
                    title={colorItem.name}
                  />
                  <span className="text-xs text-center max-w-[80px] text-muted-foreground text-[#443730]">
                    {colorItem.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
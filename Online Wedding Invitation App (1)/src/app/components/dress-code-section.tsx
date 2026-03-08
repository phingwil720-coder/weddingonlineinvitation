import { Sparkles } from 'lucide-react';
import { DressCodeColor } from '../../lib/supabase';

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
    <div className="px-6 py-16 bg-secondary">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Sparkles className="h-8 w-8" style={{ color: primaryColor }} />
          </div>
          
          <h3 className="text-3xl mb-4 font-['Playfair_Display'] font-semibold text-foreground">
            Dress Code
          </h3>
          
          {dressCode && (
            <p className="text-xl mb-3 font-medium text-foreground">
              {dressCode}
            </p>
          )}
          
          {dressCodeDescription && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {dressCodeDescription}
            </p>
          )}
        </div>

        {dressCodeColors && dressCodeColors.length > 0 && (
          <div className="mt-8">
            <p className="text-sm uppercase tracking-wider text-center mb-6 text-muted-foreground">
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
                  <span className="text-xs text-center max-w-[80px] text-muted-foreground">
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
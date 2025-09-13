import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  sections: string[];
}

export const ProgressBar = ({ currentSection, totalSections, sections }: ProgressBarProps) => {
  const progress = (currentSection / (totalSections - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentSection + 1} of {totalSections}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Section markers */}
        <div className="flex justify-between mt-2">
          {sections.map((section, index) => (
            <div key={section} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  index < currentSection 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : index === currentSection
                    ? "bg-primary-glow text-primary-foreground shadow-medium"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index < currentSection ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1 text-center max-w-20 truncate transition-colors",
                  index <= currentSection 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground"
                )}
                title={section}
              >
                {section}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LikertScaleProps {
  questionId: string;
  question: string;
  value?: number;
  onChange: (questionId: string, value: number) => void;
  labels?: string[];
  reverse?: boolean;
}

const DEFAULT_LABELS = [
  'Strongly Disagree',
  'Disagree', 
  'Neutral',
  'Agree',
  'Strongly Agree'
];

export const LikertScale = ({
  questionId,
  question,
  value,
  onChange,
  labels = DEFAULT_LABELS,
  reverse = false
}: LikertScaleProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  
  const handleSelect = (selectedValue: number) => {
    const finalValue = reverse ? 6 - selectedValue : selectedValue;
    onChange(questionId, finalValue);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">
          {question}
        </h3>
        {reverse && (
          <p className="text-sm text-muted-foreground">
            Note: This question is reverse-scored
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Scale buttons */}
        <div className="grid grid-cols-5 gap-2">
          {labels.map((label, index) => {
            const scaleValue = index + 1;
            const isSelected = value === (reverse ? 6 - scaleValue : scaleValue);
            const isHovered = hoveredValue === scaleValue;
            
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 text-xs font-medium transition-all duration-200",
                  isSelected && "bg-primary text-primary-foreground border-primary shadow-sm",
                  isHovered && !isSelected && "bg-primary/10 border-primary/30",
                  !isSelected && !isHovered && "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(scaleValue)}
                onMouseEnter={() => setHoveredValue(scaleValue)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Numeric scale */}
        <div className="flex justify-between px-2 text-xs text-muted-foreground">
          {[1, 2, 3, 4, 5].map(num => (
            <span key={num} className="w-8 text-center">
              {num}
            </span>
          ))}
        </div>

        {/* Visual indicator */}
        <div className="flex justify-between px-2">
          {[1, 2, 3, 4, 5].map(num => {
            const scaleValue = reverse ? 6 - num : num;
            const isActive = value === scaleValue || hoveredValue === num;
            
            return (
              <div
                key={num}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  isActive ? "bg-primary shadow-sm" : "bg-muted"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
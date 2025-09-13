import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Choice {
  id: string;
  text: string;
  score: number;
}

interface ForcedChoiceProps {
  questionId: string;
  scenario: string;
  choices: Choice[];
  value?: string;
  onChange: (questionId: string, value: string, score: number) => void;
  showConfidence?: boolean;
  confidence?: number;
  onConfidenceChange?: (questionId: string, confidence: number) => void;
}

export const ForcedChoice = ({
  questionId,
  scenario,
  choices,
  value,
  onChange,
  showConfidence = false,
  confidence,
  onConfidenceChange
}: ForcedChoiceProps) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(value || null);

  const handleSelect = (choiceId: string, score: number) => {
    setSelectedChoice(choiceId);
    onChange(questionId, choiceId, score);
  };

  return (
    <div className="space-y-6">
      {/* Scenario */}
      <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Scenario
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {scenario}
        </p>
      </div>

      {/* Question */}
      <div className="text-center">
        <h4 className="text-base font-medium text-foreground">
          What would you most likely do?
        </h4>
      </div>

      {/* Choices */}
      <div className="grid gap-3">
        {choices.map((choice, index) => {
          const isSelected = selectedChoice === choice.id;
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          
          return (
            <Card
              key={choice.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-soft",
                isSelected 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "hover:bg-muted/30 border-border"
              )}
              onClick={() => handleSelect(choice.id, choice.score)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {letter}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed flex-1",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {choice.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confidence Scale */}
      {showConfidence && selectedChoice && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">
            How confident are you in your response?
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Not confident</span>
            <div className="flex-1 px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={confidence || 50}
                onChange={(e) => onConfidenceChange?.(questionId, parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span className="text-xs text-muted-foreground">Very confident</span>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {confidence || 50}% confident
          </div>
        </div>
      )}
    </div>
  );
};
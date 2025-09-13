import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LikertScale } from './questions/LikertScale';
import { AssessmentResponse } from '@/pages/Index';
import { Palette, Shield, Sparkles } from 'lucide-react';

interface PersonalityStyleProps {
  responses: AssessmentResponse[];
  onUpdateResponse: (questionId: string, value: number | string, confidence?: number) => void;
  onNext: () => void;
}

const QUESTIONS = [
  {
    id: 'ps_1',
    text: 'I tend to get anxious when I\'m not sure if people around me like me.',
    theory: 'Attachment - Anxious'
  },
  {
    id: 'ps_2',
    text: 'I prefer to take charge and get things done rather than wait for others.',
    theory: 'DISC - Dominance'
  },
  {
    id: 'ps_3', 
    text: 'I get upset easily, but then return quickly to calm.',
    theory: 'Emotional Temperament'
  },
  {
    id: 'ps_4',
    text: 'I enjoy meeting new people and thrive when social interaction is frequent.',
    theory: 'Big Five - Extraversion'
  },
  {
    id: 'ps_5',
    text: 'I prefer stable routines over unpredictable change.',
    theory: 'Big Five - Openness'
  },
  {
    id: 'ps_6',
    text: 'When under stress, I withdraw and reflect rather than fight or speak up.',
    theory: 'Attachment/Social Style'
  },
  {
    id: 'ps_7',
    text: 'I believe most people are basically trustworthy and well-meaning.',
    theory: 'Attachment - Secure vs Avoidant'
  },
  {
    id: 'ps_8',
    text: 'I enjoy organizing, planning in advance, rather than winging it.',
    theory: 'Conscientiousness'
  }
];

export const PersonalityStyle = ({
  responses,
  onUpdateResponse,
  onNext
}: PersonalityStyleProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isAnswered = () => {
    const response = getResponse(currentQuestion.id);
    return response !== undefined;
  };

  const completedQuestions = responses.filter(r => 
    QUESTIONS.some(q => q.id === r.questionId)
  ).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
          <Palette className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Personality & Emotional Style
          </h2>
          <p className="text-muted-foreground">
            Understanding your temperament, attachment patterns, and social preferences
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </span>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm text-secondary font-medium">
            {currentQuestion.theory}
          </span>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-secondary to-secondary-soft h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <Card className="border-assessment-border">
        <CardContent className="p-6">
          <LikertScale
            questionId={currentQuestion.id}
            question={currentQuestion.text}
            value={getResponse(currentQuestion.id)?.value as number}
            onChange={(id, value) => onUpdateResponse(id, value)}
          />
        </CardContent>
      </Card>

      {/* Theory Context */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-secondary">Assessment Context</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This question explores <strong>{currentQuestion.theory}</strong> patterns that influence how you 
          relate to others, handle stress, and approach new situations.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedQuestions} of {QUESTIONS.length} questions completed
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isAnswered()}
          className="bg-secondary hover:bg-secondary/90"
        >
          {currentQuestionIndex === QUESTIONS.length - 1 ? 'Complete Section' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
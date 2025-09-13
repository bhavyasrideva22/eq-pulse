import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LikertScale } from './questions/LikertScale';
import { ForcedChoice } from './questions/ForcedChoice';
import { AssessmentResponse } from '@/pages/Index';
import { Brain, Heart, Users, Zap, Target } from 'lucide-react';

interface PsychometricFoundationsProps {
  responses: AssessmentResponse[];
  onUpdateResponse: (questionId: string, value: number | string, confidence?: number) => void;
  onNext: () => void;
}

const QUESTIONS = [
  {
    id: 'pf_1',
    type: 'likert',
    text: 'I can clearly name what emotion I\'m feeling in difficult situations.',
    dimension: 'self-awareness'
  },
  {
    id: 'pf_2', 
    type: 'likert',
    text: 'When I\'m upset, I take time to think before I act.',
    dimension: 'self-regulation'
  },
  {
    id: 'pf_3',
    type: 'likert', 
    text: 'I easily sense when others are upset, even if they are trying to hide it.',
    dimension: 'empathy'
  },
  {
    id: 'pf_4',
    type: 'likert',
    text: 'In a group, I usually take part in discussions and help resolve disagreements.',
    dimension: 'social-skills'
  },
  {
    id: 'pf_5',
    type: 'likert',
    text: 'I feel more motivated by my internal values (what I believe) than by external rewards or praise.',
    dimension: 'motivation'
  },
  {
    id: 'pf_6',
    type: 'forced-choice',
    scenario: 'You receive criticism from a coworker unexpectedly.',
    choices: [
      { id: 'a', text: 'Defend yourself immediately', score: 1 },
      { id: 'b', text: 'Ask questions to understand, then respond calmly', score: 5 },
      { id: 'c', text: 'Avoid responding until later when you cool down', score: 3 },
      { id: 'd', text: 'Blame others or external factors', score: 1 }
    ],
    dimension: 'self-regulation'
  },
  {
    id: 'pf_7',
    type: 'forced-choice',
    scenario: 'You\'re working toward a long-term goal, but midway others distract you with urgent tasks.',
    choices: [
      { id: 'a', text: 'Drop the long-term goal and focus on urgent tasks', score: 2 },
      { id: 'b', text: 'Delegate urgent tasks where possible, keep working on long-term goal', score: 5 },
      { id: 'c', text: 'Postpone urgent tasks, focus only on long term', score: 3 },
      { id: 'd', text: 'Let urgent tasks take over, plan to catch up later', score: 1 }
    ],
    dimension: 'motivation'
  },
  {
    id: 'pf_8',
    type: 'likert',
    text: 'I find it easy to express what I feel to somebody I trust.',
    dimension: 'self-awareness'
  },
  {
    id: 'pf_9',
    type: 'likert',
    text: 'When someone disagrees with me, I become defensive.',
    dimension: 'self-regulation',
    reverse: true
  },
  {
    id: 'pf_10',
    type: 'likert',
    text: 'I often imagine how other people feel before I act or speak.',
    dimension: 'empathy'
  },
  {
    id: 'pf_11',
    type: 'likert',
    text: 'Even when faced with setbacks, I bounce back and continue pushing toward my goals.',
    dimension: 'motivation'
  }
];

const DIMENSIONS = {
  'self-awareness': { icon: Brain, name: 'Self-Awareness', color: 'text-primary' },
  'self-regulation': { icon: Zap, name: 'Self-Regulation', color: 'text-secondary' },
  'empathy': { icon: Heart, name: 'Empathy', color: 'text-accent' },
  'social-skills': { icon: Users, name: 'Social Skills', color: 'text-score-good' },
  'motivation': { icon: Target, name: 'Motivation', color: 'text-score-excellent' }
};

export const PsychometricFoundations = ({
  responses,
  onUpdateResponse,
  onNext
}: PsychometricFoundationsProps) => {
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

  if (!currentQuestion) return null;

  const DimensionIcon = DIMENSIONS[currentQuestion.dimension as keyof typeof DIMENSIONS]?.icon || Brain;
  const dimensionInfo = DIMENSIONS[currentQuestion.dimension as keyof typeof DIMENSIONS];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10`}>
          <DimensionIcon className={`w-6 h-6 ${dimensionInfo?.color || 'text-primary'}`} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Psychometric Foundations
          </h2>
          <p className="text-muted-foreground">
            Core emotional intelligence dimensions assessment
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Measuring: 
          </span>
          <span className={`text-sm font-medium ${dimensionInfo?.color || 'text-primary'}`}>
            {dimensionInfo?.name || 'EQ Dimension'}
          </span>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <Card className="border-assessment-border">
        <CardContent className="p-6">
          {currentQuestion.type === 'likert' ? (
            <LikertScale
              questionId={currentQuestion.id}
              question={currentQuestion.text}
              value={getResponse(currentQuestion.id)?.value as number}
              onChange={(id, value) => onUpdateResponse(id, value)}
              reverse={currentQuestion.reverse}
            />
          ) : (
            <ForcedChoice
              questionId={currentQuestion.id}
              scenario={currentQuestion.scenario!}
              choices={currentQuestion.choices!}
              value={getResponse(currentQuestion.id)?.value as string}
              onChange={(id, value, score) => onUpdateResponse(id, value)}
              showConfidence={true}
              confidence={getResponse(currentQuestion.id)?.confidence}
              onConfidenceChange={(id, confidence) => {
                const currentResponse = getResponse(id);
                if (currentResponse) {
                  onUpdateResponse(id, currentResponse.value, confidence);
                }
              }}
            />
          )}
        </CardContent>
      </Card>

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
          className="bg-primary hover:bg-primary/90"
        >
          {currentQuestionIndex === QUESTIONS.length - 1 ? 'Complete Section' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ForcedChoice } from './questions/ForcedChoice';
import { AssessmentResponse } from '@/pages/Index';
import { MessageSquare, Users2, Lightbulb } from 'lucide-react';

interface SituationalEQProps {
  responses: AssessmentResponse[];
  onUpdateResponse: (questionId: string, value: number | string, confidence?: number) => void;
  onNext: () => void;
}

const SCENARIOS = [
  {
    id: 'seq_1',
    category: 'Handling Criticism',
    scenario: 'A peer gives you critical feedback that feels unfair and attacks your competence in front of others.',
    choices: [
      { id: 'a', text: 'Raise your voice and defend your work immediately', score: 1 },
      { id: 'b', text: 'Pause, listen carefully, ask clarifying questions, reflect, then respond thoughtfully', score: 5 },
      { id: 'c', text: 'Stay quiet to avoid conflict, feel upset, later complain to others about the unfairness', score: 2 }
    ]
  },
  {
    id: 'seq_2', 
    category: 'Conflict Resolution',
    scenario: 'Two team members are arguing intensely; their tension is affecting the entire group\'s productivity and morale.',
    choices: [
      { id: 'a', text: 'Ignore the conflict hoping it will resolve itself naturally', score: 2 },
      { id: 'b', text: 'Call a meeting, let both people speak their concerns, facilitate mutual understanding', score: 5 },
      { id: 'c', text: 'Quickly side with one person to end the argument and move forward', score: 3 }
    ]
  },
  {
    id: 'seq_3',
    category: 'Giving Feedback', 
    scenario: 'You notice a co-worker repeatedly doing something that undermines team morale and creates tension.',
    choices: [
      { id: 'a', text: 'Confront them publicly so others can see the issue being addressed', score: 1 },
      { id: 'b', text: 'Talk privately, share what you observed, explain the impact, offer help and support', score: 5 },
      { id: 'c', text: 'Let it go completely; you don\'t want to rock the boat or create drama', score: 2 }
    ]
  },
  {
    id: 'seq_4',
    category: 'Under Pressure',
    scenario: 'An important deadline is approaching rapidly, you feel stressed, and mistakes are starting to creep into your work.',
    choices: [
      { id: 'a', text: 'Push through by working longer hours and ignoring your fatigue and stress', score: 2 },
      { id: 'b', text: 'Take strategic breaks, re-prioritize tasks, ask colleagues for help where appropriate', score: 5 },
      { id: 'c', text: 'Let the deadline slip to avoid making mistakes, even if it disappoints others', score: 3 }
    ]
  },
  {
    id: 'seq_5',
    category: 'Supporting Others',
    scenario: 'A close friend is going through a difficult time and seems withdrawn, avoiding social contact.',
    choices: [
      { id: 'a', text: 'Encourage them to "get over it" and focus on positive thinking', score: 2 },
      { id: 'b', text: 'Show you\'re available to listen, validate their feelings, ask how you can genuinely help', score: 5 },
      { id: 'c', text: 'Give them space and assume they\'ll reach out when they\'re ready', score: 3 }
    ]
  },
  {
    id: 'seq_6',
    category: 'Receiving Praise',
    scenario: 'You achieve something significant and receive public praise and recognition for your accomplishment.',
    choices: [
      { id: 'a', text: 'Brush off the compliments and feel uncomfortable with the attention', score: 2 },
      { id: 'b', text: 'Accept the thanks gracefully, reflect on what you did well and what you can improve', score: 5 },
      { id: 'c', text: 'Take full credit and use the opportunity to highlight your superior abilities', score: 1 }
    ]
  }
];

export const SituationalEQ = ({
  responses,
  onUpdateResponse,
  onNext
}: SituationalEQProps) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = SCENARIOS[currentScenarioIndex];

  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  };

  const handleNext = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(prev => prev - 1);
    }
  };

  const isAnswered = () => {
    const response = getResponse(currentScenario.id);
    return response !== undefined;
  };

  const completedScenarios = responses.filter(r => 
    SCENARIOS.some(s => s.id === r.questionId)
  ).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
          <MessageSquare className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Situational EQ Assessment
          </h2>
          <p className="text-muted-foreground">
            How you handle real-world emotionally charged situations
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Scenario {currentScenarioIndex + 1} of {SCENARIOS.length}
        </span>
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">
            {currentScenario.category}
          </span>
        </div>
      </div>

      {/* Scenario Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentScenarioIndex + 1) / SCENARIOS.length) * 100}%` }}
        />
      </div>

      {/* Scenario Content */}
      <Card className="border-assessment-border">
        <CardContent className="p-6">
          <ForcedChoice
            questionId={currentScenario.id}
            scenario={currentScenario.scenario}
            choices={currentScenario.choices}
            value={getResponse(currentScenario.id)?.value as string}
            onChange={(id, value) => onUpdateResponse(id, value)}
            showConfidence={true}
            confidence={getResponse(currentScenario.id)?.confidence}
            onConfidenceChange={(id, confidence) => {
              const currentResponse = getResponse(id);
              if (currentResponse) {
                onUpdateResponse(id, currentResponse.value, confidence);
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Context Info */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Scenario Focus</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This scenario tests your <strong>{currentScenario.category}</strong> skills - a key component 
          of emotional intelligence in real-world situations.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentScenarioIndex === 0}
        >
          Previous
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedScenarios} of {SCENARIOS.length} scenarios completed
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isAnswered()}
          className="bg-accent hover:bg-accent/90"
        >
          {currentScenarioIndex === SCENARIOS.length - 1 ? 'Complete Section' : 'Next Scenario'}
        </Button>
      </div>
    </div>
  );
};
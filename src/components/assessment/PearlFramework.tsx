import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LikertScale } from './questions/LikertScale';
import { ForcedChoice } from './questions/ForcedChoice';
import { AssessmentResponse } from '@/pages/Index';
import { Gem, Eye, Heart, Zap, Users, Crown } from 'lucide-react';

interface PearlFrameworkProps {
  responses: AssessmentResponse[];
  onUpdateResponse: (questionId: string, value: number | string, confidence?: number) => void;
  onNext: () => void;
}

const PEARL_TRAITS = {
  P: { name: 'Presence', icon: Eye, color: 'text-primary', description: 'Emotional awareness and mindfulness in the moment' },
  E: { name: 'Empathy', icon: Heart, color: 'text-secondary', description: 'Understanding and sharing others\' feelings' },
  A: { name: 'Affect Regulation', icon: Zap, color: 'text-accent', description: 'Ability to manage frustration, anxiety, impulse' },
  R: { name: 'Relational Agility', icon: Users, color: 'text-score-good', description: 'Adaptability in social situations, perspective-taking' },
  L: { name: 'Leadership Mindset', icon: Crown, color: 'text-score-excellent', description: 'Motivation, positivity, influence, inspiring others' }
};

const QUESTIONS = [
  // Presence (P)
  {
    id: 'pearl_p1',
    trait: 'P',
    type: 'likert',
    text: 'I routinely check in with how I\'m feeling in this moment.'
  },
  {
    id: 'pearl_p2',
    trait: 'P', 
    type: 'forced-choice',
    scenario: 'In the middle of a busy day, you notice you are feeling overwhelmed and stressed.',
    choices: [
      { id: 'a', text: 'Push on until you complete all your tasks, ignoring the feeling', score: 2 },
      { id: 'b', text: 'Pause, take a few deep breaths, perhaps do a short mindfulness exercise or take a brief walk', score: 5 },
      { id: 'c', text: 'Distract yourself with something else to get your mind off the stress', score: 3 }
    ]
  },
  // Empathy (E)
  {
    id: 'pearl_e1',
    trait: 'E',
    type: 'likert', 
    text: 'I try to put myself in others\' shoes and imagine their perspective before judging.'
  },
  {
    id: 'pearl_e2',
    trait: 'E',
    type: 'forced-choice',
    scenario: 'A coworker seems unusually quiet and distant during a group meeting.',
    choices: [
      { id: 'a', text: 'Ignore it—maybe they don\'t want to talk and you should respect their space', score: 3 },
      { id: 'b', text: 'After the meeting, privately check in with them, ask if they\'re okay, and listen actively', score: 5 },
      { id: 'c', text: 'Try to cheer them up immediately during the meeting with jokes or light conversation', score: 2 }
    ]
  },
  // Affect Regulation (A)
  {
    id: 'pearl_a1',
    trait: 'A',
    type: 'likert',
    text: 'When I get upset I can often bring myself back to calm fairly quickly.'
  },
  {
    id: 'pearl_a2',
    trait: 'A',
    type: 'forced-choice',
    scenario: 'During a conversation, someone makes a comment that feels like an insult to a project you led.',
    choices: [
      { id: 'a', text: 'You immediately defend yourself and counter-attack their criticism', score: 1 },
      { id: 'b', text: 'You pause, take a breath, and respond with facts and calm reasoning', score: 5 },
      { id: 'c', text: 'You shut down emotionally and stop contributing to the conversation', score: 2 }
    ]
  },
  // Relational Agility (R)
  {
    id: 'pearl_r1',
    trait: 'R',
    type: 'likert',
    text: 'I find it easy to adjust my communication style depending on who I\'m with.'
  },
  {
    id: 'pearl_r2',
    trait: 'R',
    type: 'forced-choice', 
    scenario: 'You are in a team with very diverse personalities and conflict arises due to miscommunication.',
    choices: [
      { id: 'a', text: 'Insist that your communication approach is right and others should adapt', score: 1 },
      { id: 'b', text: 'Listen to everyone\'s perspective and work to find a communication style that works for all', score: 5 },
      { id: 'c', text: 'Avoid taking sides and stay quiet to prevent further conflict', score: 2 }
    ]
  },
  // Leadership Mindset (L)
  {
    id: 'pearl_l1',
    trait: 'L',
    type: 'likert',
    text: 'I believe in inspiring others by example rather than by force or pressure.'
  },
  {
    id: 'pearl_l2', 
    trait: 'L',
    type: 'forced-choice',
    scenario: 'You see a peer struggling with something you have more experience in.',
    choices: [
      { id: 'a', text: 'Let them figure it out themselves; you need to focus on your own responsibilities', score: 2 },
      { id: 'b', text: 'Offer help, share what you\'ve learned from experience, and encourage their efforts', score: 5 },
      { id: 'c', text: 'Take over the task yourself to ensure it\'s completed properly and efficiently', score: 3 }
    ]
  }
];

export const PearlFramework = ({
  responses,
  onUpdateResponse,
  onNext
}: PearlFrameworkProps) => {
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

  const currentTrait = PEARL_TRAITS[currentQuestion.trait as keyof typeof PEARL_TRAITS];
  const TraitIcon = currentTrait.icon;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
          <Gem className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            PEARL Framework Analysis
          </h2>
          <p className="text-muted-foreground">
            Deep dive into your emotional growth dimensions
          </p>
        </div>
      </div>

      {/* Current Trait Focus */}
      <div className="bg-gradient-to-r from-muted/50 to-transparent rounded-lg p-4 border-l-4 border-primary">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
            <TraitIcon className={`w-5 h-5 ${currentTrait.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentQuestion.trait}: {currentTrait.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentTrait.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </span>
        <div className="text-sm text-muted-foreground">
          PEARL Assessment: <span className={`font-medium ${currentTrait.color}`}>
            {currentTrait.name}
          </span>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-primary via-secondary to-score-excellent h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <Card className="border-assessment-border shadow-soft">
        <CardContent className="p-6">
          {currentQuestion.type === 'likert' ? (
            <LikertScale
              questionId={currentQuestion.id}
              question={currentQuestion.text}
              value={getResponse(currentQuestion.id)?.value as number}
              onChange={(id, value) => onUpdateResponse(id, value)}
            />
          ) : (
            <ForcedChoice
              questionId={currentQuestion.id}
              scenario={currentQuestion.scenario!}
              choices={currentQuestion.choices!}
              value={getResponse(currentQuestion.id)?.value as string}
              onChange={(id, value) => onUpdateResponse(id, value)}
              showConfidence={false}
            />
          )}
        </CardContent>
      </Card>

      {/* PEARL Framework Context */}
      <div className="grid md:grid-cols-5 gap-2 text-center">
        {Object.entries(PEARL_TRAITS).map(([letter, trait]) => {
          const isCurrentTrait = letter === currentQuestion.trait;
          const TraitIcon = trait.icon;
          
          return (
            <div 
              key={letter}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isCurrentTrait 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <TraitIcon className={`w-4 h-4 ${isCurrentTrait ? trait.color : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${
                  isCurrentTrait ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {letter}
                </span>
                <span className={`text-xs ${
                  isCurrentTrait ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {trait.name}
                </span>
              </div>
            </div>
          );
        })}
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
            {completedQuestions} of {QUESTIONS.length} PEARL questions completed
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isAnswered()}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          {currentQuestionIndex === QUESTIONS.length - 1 ? 'View Results' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
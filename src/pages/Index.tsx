import { useState } from 'react';
import { AssessmentIntro } from '@/components/assessment/AssessmentIntro';
import { PsychometricFoundations } from '@/components/assessment/PsychometricFoundations';
import { PersonalityStyle } from '@/components/assessment/PersonalityStyle';
import { SituationalEQ } from '@/components/assessment/SituationalEQ';
import { PearlFramework } from '@/components/assessment/PearlFramework';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';
import { ProgressBar } from '@/components/assessment/ProgressBar';
import { Card } from '@/components/ui/card';

export interface AssessmentResponse {
  questionId: string;
  value: number | string;
  confidence?: number;
}

export interface AssessmentData {
  responses: AssessmentResponse[];
  currentSection: number;
  startTime: Date;
  sectionTimes: Record<number, { start: Date; end?: Date }>;
}

const SECTIONS = [
  'Introduction',
  'Psychometric Foundations', 
  'Personality & Style',
  'Situational EQ',
  'PEARL Framework',
  'Results & Recommendations'
];

const Index = () => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    responses: [],
    currentSection: 0,
    startTime: new Date(),
    sectionTimes: { 0: { start: new Date() } }
  });

  const updateResponse = (questionId: string, value: number | string, confidence?: number) => {
    setAssessmentData(prev => {
      const newResponses = prev.responses.filter(r => r.questionId !== questionId);
      return {
        ...prev,
        responses: [...newResponses, { questionId, value, confidence }]
      };
    });
  };

  const nextSection = () => {
    const nextSectionIndex = assessmentData.currentSection + 1;
    setAssessmentData(prev => ({
      ...prev,
      currentSection: nextSectionIndex,
      sectionTimes: {
        ...prev.sectionTimes,
        [prev.currentSection]: {
          ...prev.sectionTimes[prev.currentSection],
          end: new Date()
        },
        [nextSectionIndex]: { start: new Date() }
      }
    }));
  };

  const renderCurrentSection = () => {
    switch (assessmentData.currentSection) {
      case 0:
        return <AssessmentIntro onStart={nextSection} />;
      case 1:
        return (
          <PsychometricFoundations
            responses={assessmentData.responses}
            onUpdateResponse={updateResponse}
            onNext={nextSection}
          />
        );
      case 2:
        return (
          <PersonalityStyle
            responses={assessmentData.responses}
            onUpdateResponse={updateResponse}
            onNext={nextSection}
          />
        );
      case 3:
        return (
          <SituationalEQ
            responses={assessmentData.responses}
            onUpdateResponse={updateResponse}
            onNext={nextSection}
          />
        );
      case 4:
        return (
          <PearlFramework
            responses={assessmentData.responses}
            onUpdateResponse={updateResponse}
            onNext={nextSection}
          />
        );
      case 5:
        return (
          <AssessmentResults
            responses={assessmentData.responses}
            assessmentData={assessmentData}
          />
        );
      default:
        return <AssessmentIntro onStart={nextSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-assessment-bg to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            Personal & Emotional Intelligence Assessment
          </h1>
          <p className="text-lg text-muted-foreground">
            Goal Clarity & Execution Drive
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar 
            currentSection={assessmentData.currentSection}
            totalSections={SECTIONS.length}
            sections={SECTIONS}
          />
        </div>

        {/* Main Content */}
        <Card className="shadow-soft border-assessment-border bg-assessment-card">
          {renderCurrentSection()}
        </Card>
      </div>
    </div>
  );
};

export default Index;
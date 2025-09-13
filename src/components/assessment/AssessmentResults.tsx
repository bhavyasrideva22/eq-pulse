import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssessmentResponse, AssessmentData } from '@/pages/Index';
import { Trophy, Download, RefreshCw, TrendingUp, Target, Star } from 'lucide-react';

interface AssessmentResultsProps {
  responses: AssessmentResponse[];
  assessmentData: AssessmentData;
}

interface ScoreBreakdown {
  selfAwareness: number;
  selfRegulation: number;
  empathy: number;
  socialSkills: number;
  motivation: number;
  overallEQ: number;
  situationalEQ: number;
  pearl: {
    presence: number;
    empathy: number;
    affectRegulation: number;
    relationalAgility: number;
    leadershipMindset: number;
  };
}

export const AssessmentResults = ({ responses, assessmentData }: AssessmentResultsProps) => {
  const scores = useMemo(() => {
    // Calculate scores based on responses
    const calculateDimensionScore = (questionIds: string[]) => {
      const relevantResponses = responses.filter(r => questionIds.includes(r.questionId));
      if (relevantResponses.length === 0) return 0;
      
      const total = relevantResponses.reduce((sum, r) => sum + (typeof r.value === 'number' ? r.value : 0), 0);
      const average = total / relevantResponses.length;
      return Math.round(((average - 1) / 4) * 100);
    };

    // Psychometric foundations dimensions
    const selfAwareness = calculateDimensionScore(['pf_1', 'pf_8']);
    const selfRegulation = calculateDimensionScore(['pf_2', 'pf_6', 'pf_9']);
    const empathy = calculateDimensionScore(['pf_3', 'pf_10']);
    const socialSkills = calculateDimensionScore(['pf_4']);
    const motivation = calculateDimensionScore(['pf_5', 'pf_7', 'pf_11']);
    
    const overallEQ = Math.round((selfAwareness + selfRegulation + empathy + socialSkills + motivation) / 5);

    // Situational EQ
    const situationalResponses = responses.filter(r => r.questionId.startsWith('seq_'));
    const situationalEQ = situationalResponses.length > 0 
      ? Math.round(((situationalResponses.reduce((sum, r) => sum + (typeof r.value === 'number' ? r.value : 3), 0) / situationalResponses.length) - 1) / 4 * 100)
      : 0;

    // PEARL scores
    const pearl = {
      presence: calculateDimensionScore(['pearl_p1', 'pearl_p2']),
      empathy: calculateDimensionScore(['pearl_e1', 'pearl_e2']),
      affectRegulation: calculateDimensionScore(['pearl_a1', 'pearl_a2']),
      relationalAgility: calculateDimensionScore(['pearl_r1', 'pearl_r2']),
      leadershipMindset: calculateDimensionScore(['pearl_l1', 'pearl_l2'])
    };

    return {
      selfAwareness,
      selfRegulation,
      empathy,
      socialSkills,
      motivation,
      overallEQ,
      situationalEQ,
      pearl
    } as ScoreBreakdown;
  }, [responses]);

  const getScoreLevel = (score: number) => {
    if (score >= 81) return { label: 'Very High', color: 'bg-score-excellent', textColor: 'text-score-excellent' };
    if (score >= 61) return { label: 'High', color: 'bg-score-good', textColor: 'text-score-good' };
    if (score >= 41) return { label: 'Moderate', color: 'bg-score-moderate', textColor: 'text-score-moderate' };
    if (score >= 21) return { label: 'Developing', color: 'bg-score-developing', textColor: 'text-score-developing' };
    return { label: 'Low', color: 'bg-score-low', textColor: 'text-score-low' };
  };

  const getEQProfile = () => {
    const { overallEQ, pearl } = scores;
    const highestPearl = Object.entries(pearl).reduce((a, b) => pearl[a[0] as keyof typeof pearl] > pearl[b[0] as keyof typeof pearl] ? a : b);
    
    if (overallEQ >= 75) return 'Emotionally Intelligent Leader';
    if (highestPearl[0] === 'empathy' && scores.empathy > 70) return 'Empathic Connector';
    if (highestPearl[0] === 'leadershipMindset' && scores.motivation > 70) return 'Motivational Catalyst';
    if (scores.selfRegulation > 70) return 'Balanced Regulator';
    return 'Developing EQ Professional';
  };

  const topStrengths = useMemo(() => {
    const dimensionScores = [
      { name: 'Self-Awareness', score: scores.selfAwareness },
      { name: 'Self-Regulation', score: scores.selfRegulation },
      { name: 'Empathy', score: scores.empathy },
      { name: 'Social Skills', score: scores.socialSkills },
      { name: 'Motivation', score: scores.motivation }
    ];
    
    return dimensionScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .filter(d => d.score >= 60);
  }, [scores]);

  const growthAreas = useMemo(() => {
    const dimensionScores = [
      { name: 'Self-Awareness', score: scores.selfAwareness },
      { name: 'Self-Regulation', score: scores.selfRegulation },
      { name: 'Empathy', score: scores.empathy },
      { name: 'Social Skills', score: scores.socialSkills },
      { name: 'Motivation', score: scores.motivation }
    ];
    
    return dimensionScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .filter(d => d.score < 70);
  }, [scores]);

  const completionTime = useMemo(() => {
    const startTime = assessmentData.startTime;
    const endTime = new Date();
    const diffMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    return diffMinutes;
  }, [assessmentData]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full hero-gradient mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your EQ Assessment Results
          </h2>
          <p className="text-lg text-muted-foreground">
            Completed in {completionTime} minutes • {responses.length} responses analyzed
          </p>
        </div>
      </div>

      {/* Overall Profile */}
      <Card className="border-primary/20 shadow-medium">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Your EQ Profile</CardTitle>
          </div>
          <CardDescription className="text-lg font-medium text-foreground">
            {getEQProfile()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall EQ Score */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">
              {scores.overallEQ}
            </div>
            <Badge variant="secondary" className={`${getScoreLevel(scores.overallEQ).color} text-white`}>
              {getScoreLevel(scores.overallEQ).label} Emotional Intelligence
            </Badge>
          </div>

          {/* Core Dimensions */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Strengths
              </h4>
              {topStrengths.length > 0 ? (
                topStrengths.map(strength => (
                  <div key={strength.name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm font-medium">{strength.name}</span>
                    <Badge variant="outline" className={getScoreLevel(strength.score).textColor}>
                      {strength.score}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Continue developing across all areas</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Growth Opportunities
              </h4>
              {growthAreas.length > 0 ? (
                growthAreas.map(area => (
                  <div key={area.name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm font-medium">{area.name}</span>
                    <Badge variant="outline" className={getScoreLevel(area.score).textColor}>
                      {area.score}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Strong performance across all dimensions</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EQ Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Core EQ Dimensions</CardTitle>
            <CardDescription>Your emotional intelligence breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Self-Awareness', score: scores.selfAwareness },
              { name: 'Self-Regulation', score: scores.selfRegulation },
              { name: 'Empathy', score: scores.empathy },
              { name: 'Social Skills', score: scores.socialSkills },
              { name: 'Motivation', score: scores.motivation }
            ].map(dimension => {
              const level = getScoreLevel(dimension.score);
              return (
                <div key={dimension.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dimension.name}</span>
                    <span className={`text-sm font-semibold ${level.textColor}`}>
                      {dimension.score}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${level.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* PEARL Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PEARL Framework</CardTitle>
            <CardDescription>Your emotional growth dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Presence', score: scores.pearl.presence },
              { name: 'Empathy', score: scores.pearl.empathy },
              { name: 'Affect Regulation', score: scores.pearl.affectRegulation },
              { name: 'Relational Agility', score: scores.pearl.relationalAgility },
              { name: 'Leadership Mindset', score: scores.pearl.leadershipMindset }
            ].map(trait => {
              const level = getScoreLevel(trait.score);
              return (
                <div key={trait.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{trait.name}</span>
                    <span className={`text-sm font-semibold ${level.textColor}`}>
                      {trait.score}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${level.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="text-lg">Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Your EQ Readiness Score</h4>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((scores.overallEQ + scores.situationalEQ + Object.values(scores.pearl).reduce((a, b) => a + b, 0) / 5) / 3)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Based on your psychometric foundations, situational responses, and PEARL analysis
                  </p>
                </div>
              </div>
            </div>

            {growthAreas.length > 0 && (
              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <h4 className="font-semibold text-secondary mb-2">Growth Focus</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your assessment, consider focusing on these areas for the next 4 weeks:
                </p>
                <ul className="text-sm space-y-1">
                  {growthAreas.map(area => (
                    <li key={area.name} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0"></span>
                      <strong>{area.name}:</strong> Practice daily self-reflection and mindfulness exercises
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Download Full Report
        </Button>
        <Button variant="outline" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Target, TrendingUp, Users, Zap } from 'lucide-react';

interface AssessmentIntroProps {
  onStart: () => void;
}

export const AssessmentIntro = ({ onStart }: AssessmentIntroProps) => {
  return (
    <div className="p-8 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full hero-gradient mb-4">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Discover Your Emotional Intelligence Profile
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Emotional Intelligence (EQ) is the ability to understand and manage your own emotions, 
          connect with others, and navigate life with resilience and purpose. In every aspect of 
          life—school, work, friendships, family—your emotions influence decisions, relationships, 
          and how well you reach your goals.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-2 gap-6 my-8">
        <Card className="border-primary/20 hover:border-primary/40 transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Goal Clarity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Understand your motivation patterns and discover what truly drives you toward your goals.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 hover:border-secondary/40 transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Execution Drive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Learn how you handle pressure, make decisions, and follow through on commitments.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-accent/20 hover:border-accent/40 transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Relationship Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Discover your empathy levels, social skills, and how you connect with others.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-score-excellent/20 hover:border-score-excellent/40 transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-score-excellent" />
              Growth Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Receive a personalized 4-week development plan with actionable practices and exercises.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Get */}
      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          What You'll Discover
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
            A customized EQ profile with your PEARL radar chart
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></span>
            Your emotional strengths and blind spots
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
            Personality and attachment style insights
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-score-excellent mt-2 flex-shrink-0"></span>
            Career and relationship recommendations
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-score-moderate mt-2 flex-shrink-0"></span>
            Actionable growth practices and weekly focus areas
          </li>
        </ul>
      </div>

      {/* Assessment Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">ℹ</span>
          </div>
          <h4 className="font-semibold text-primary">Assessment Details</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Duration:</strong> 15-20 minutes
          </div>
          <div>
            <strong className="text-foreground">Questions:</strong> ~35 items across 5 sections
          </div>
          <div>
            <strong className="text-foreground">Format:</strong> Scenarios, self-ratings, and reflections
          </div>
          <div>
            <strong className="text-foreground">Results:</strong> Immediate personalized feedback
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={onStart}
          size="lg"
          className="px-8 py-6 text-lg font-semibold hero-gradient hover:shadow-medium transition-all duration-300"
        >
          Begin Assessment
        </Button>
      </div>
    </div>
  );
};
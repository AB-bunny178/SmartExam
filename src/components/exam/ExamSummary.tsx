import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/ui/progress-ring"
import { ExamResult, Question, UserAnswer } from "@/types/exam"
import { Trophy, Clock, Target, BarChart3, Home, RotateCcw } from "lucide-react"

interface ExamSummaryProps {
  result: ExamResult
  questions: Question[]
  userAnswers: UserAnswer[]
  onRetakeExam: () => void
  onBackToDashboard: () => void
}

export function ExamSummary({ 
  result, 
  questions, 
  userAnswers, 
  onRetakeExam, 
  onBackToDashboard 
}: ExamSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "Excellent! Outstanding performance!"
    if (score >= 80) return "Great job! You're well prepared!"
    if (score >= 70) return "Good work! Keep practicing!"
    if (score >= 60) return "Fair performance. Focus on weak areas!"
    if (score >= 50) return "Needs improvement. More practice required!"
    return "Requires significant improvement. Don't give up!"
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Exam Completed!</h1>
          <p className="text-muted-foreground">{result.examTitle}</p>
        </div>
      </div>

      {/* Score Overview */}
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle>Your Score</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <ProgressRing progress={result.score} size={150} strokeWidth={10}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              <div className="text-sm text-muted-foreground">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
            </div>
          </ProgressRing>
          
          <div className="space-y-2">
            <p className={`text-lg font-medium ${getScoreColor(result.score)}`}>
              {getPerformanceMessage(result.score)}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.round(result.timeSpent)} min
              </div>
              <Badge className="capitalize">
                {result.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {result.performanceByLevel.easy.correct}
            </div>
            <div className="text-sm text-muted-foreground">
              Easy ({result.performanceByLevel.easy.total} total)
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(result.performanceByLevel.easy.correct / result.performanceByLevel.easy.total) * 100}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {result.performanceByLevel.medium.correct}
            </div>
            <div className="text-sm text-muted-foreground">
              Medium ({result.performanceByLevel.medium.total} total)
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(result.performanceByLevel.medium.correct / result.performanceByLevel.medium.total) * 100}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-destructive mb-1">
              {result.performanceByLevel.hard.correct}
            </div>
            <div className="text-sm text-muted-foreground">
              Hard ({result.performanceByLevel.hard.total} total)
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-destructive h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(result.performanceByLevel.hard.correct / result.performanceByLevel.hard.total) * 100}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <EnhancedButton
          variant="default"
          size="lg"
          onClick={onRetakeExam}
          className="flex-1"
        >
          <RotateCcw className="h-5 w-5" />
          Retake Exam
        </EnhancedButton>
        
        <EnhancedButton
          variant="outline"
          size="lg"
          onClick={onBackToDashboard}
          className="flex-1"
        >
          <Home className="h-5 w-5" />
          Back to Dashboard
        </EnhancedButton>
      </div>

      {/* Detailed Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id)
              const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer
              
              return (
                <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{question.subject}</p>
                      <p className="text-xs text-muted-foreground capitalize">{question.difficulty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                      {isCorrect ? "Correct" : "Wrong"}
                    </Badge>
                    {userAnswer && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(userAnswer.timeSpent)}s
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
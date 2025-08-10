import { Clock, BookOpen, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { ExamConfig } from "@/types/exam"

interface ExamCardProps {
  exam: ExamConfig
  onStartExam: (examId: string) => void
  isDisabled?: boolean
}

export function ExamCard({ exam, onStartExam, isDisabled = false }: ExamCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground'
      case 'medium': return 'bg-warning text-warning-foreground'
      case 'hard': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <Card className="group relative overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {exam.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {exam.description}
            </p>
          </div>
          <Badge className={getDifficultyColor(exam.difficulty)}>
            {exam.difficulty.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exam.duration} mins</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{exam.totalQuestions} questions</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Question Distribution:</h4>
          <div className="flex gap-2 flex-wrap">
            {exam.questionsPerLevel.easy > 0 && (
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                Easy: {exam.questionsPerLevel.easy}
              </span>
            )}
            {exam.questionsPerLevel.medium > 0 && (
              <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                Medium: {exam.questionsPerLevel.medium}
              </span>
            )}
            {exam.questionsPerLevel.hard > 0 && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                Hard: {exam.questionsPerLevel.hard}
              </span>
            )}
          </div>
        </div>

        <EnhancedButton
          variant="exam"
          size="lg"
          className="w-full"
          onClick={() => onStartExam(exam.id)}
          disabled={isDisabled}
        >
          Start Exam
          <ArrowRight className="h-4 w-4" />
        </EnhancedButton>
      </CardContent>
    </Card>
  )
}
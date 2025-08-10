import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Question } from "@/types/exam"
import { ChevronLeft, ChevronRight, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer?: number
  onAnswerSelect: (answer: number) => void
  onPrevious?: () => void
  onNext?: () => void
  isFirst: boolean
  isLast: boolean
  showExplanation?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  showExplanation = false
}: QuestionCardProps) {
  const [isMarkedForReview, setIsMarkedForReview] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground'
      case 'medium': return 'bg-warning text-warning-foreground'
      case 'hard': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getOptionClass = (optionIndex: number) => {
    if (showExplanation) {
      if (optionIndex === question.correctAnswer) {
        return "border-success bg-success/10 text-success"
      }
      if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
        return "border-destructive bg-destructive/10 text-destructive"
      }
    }
    return selectedAnswer === optionIndex 
      ? "border-primary bg-primary/10 text-primary" 
      : "border-border hover:border-primary/50"
  }

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Question {questionNumber} of {totalQuestions}
              </CardTitle>
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {question.subject}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={() => setIsMarkedForReview(!isMarkedForReview)}
            className={cn(
              "h-8 w-8 p-0",
              isMarkedForReview && "text-warning"
            )}
          >
            <Flag className="h-4 w-4" />
          </EnhancedButton>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3 className="text-lg font-medium leading-relaxed mb-4">
            {question.question}
          </h3>
        </div>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-3">
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                className="mt-1"
                disabled={showExplanation}
              />
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  "flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  "hover:shadow-sm",
                  getOptionClass(index),
                  showExplanation && "cursor-default"
                )}
              >
                <span className="font-medium text-sm mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <h4 className="font-medium text-sm mb-2 text-primary">Explanation:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <EnhancedButton
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </EnhancedButton>

          <div className="flex items-center gap-2">
            {isMarkedForReview && (
              <Badge variant="outline" className="text-warning border-warning">
                <Flag className="h-3 w-3 mr-1" />
                Marked
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {selectedAnswer !== undefined ? "Answered" : "Not Answered"}
            </span>
          </div>

          <EnhancedButton
            variant={isLast ? "default" : "outline"}
            onClick={onNext}
            className="flex items-center gap-2"
          >
            {isLast ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </EnhancedButton>
        </div>
      </CardContent>
    </Card>
  )
}
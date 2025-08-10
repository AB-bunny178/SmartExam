import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Timer } from "@/components/exam/Timer"
import { QuestionCard } from "@/components/exam/QuestionCard"
import { ExamSummary } from "@/components/exam/ExamSummary"
import { sampleQuestions, examConfigs } from "@/data/sampleQuestions"
import { ExamSession, UserAnswer, ExamResult, Question } from "@/types/exam"
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExamInterfaceProps {
  examConfigId: string
  onExamComplete: (result: ExamResult) => void
  onBackToDashboard: () => void
}

export function ExamInterface({ examConfigId, onExamComplete, onBackToDashboard }: ExamInterfaceProps) {
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const { toast } = useToast()

  const examConfig = examConfigs.find(config => config.id === examConfigId)

  // Generate random questions based on exam config
  const examQuestions = useMemo(() => {
    if (!examConfig) return []
    
    const easyQuestions = sampleQuestions.filter(q => q.difficulty === 'easy')
    const mediumQuestions = sampleQuestions.filter(q => q.difficulty === 'medium')
    const hardQuestions = sampleQuestions.filter(q => q.difficulty === 'hard')
    
    const selectedQuestions: Question[] = []
    
    // Randomly select questions for each difficulty
    const addRandomQuestions = (questions: Question[], count: number) => {
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      selectedQuestions.push(...shuffled.slice(0, count))
    }
    
    addRandomQuestions(easyQuestions, examConfig.questionsPerLevel.easy)
    addRandomQuestions(mediumQuestions, examConfig.questionsPerLevel.medium)
    addRandomQuestions(hardQuestions, examConfig.questionsPerLevel.hard)
    
    // Shuffle the final array
    return selectedQuestions.sort(() => Math.random() - 0.5)
  }, [examConfig])

  // Initialize exam session
  useEffect(() => {
    if (examConfig && examQuestions.length > 0) {
      const session: ExamSession = {
        id: `session-${Date.now()}`,
        examConfigId: examConfig.id,
        questions: examQuestions,
        startTime: new Date(),
        answers: [],
        currentQuestionIndex: 0,
        isCompleted: false
      }
      setExamSession(session)
      setQuestionStartTime(Date.now())
    }
  }, [examConfig, examQuestions])

  const handleAnswerSelect = (answer: number) => {
    if (!examSession) return
    
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const questionId = examSession.questions[currentQuestion].id
    
    setExamSession(prev => {
      if (!prev) return prev
      
      const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === questionId)
      const newAnswer: UserAnswer = {
        questionId,
        selectedAnswer: answer,
        timeSpent
      }
      
      const updatedAnswers = existingAnswerIndex >= 0
        ? prev.answers.map((a, i) => i === existingAnswerIndex ? newAnswer : a)
        : [...prev.answers, newAnswer]
      
      return {
        ...prev,
        answers: updatedAnswers
      }
    })
  }

  const handleNext = () => {
    if (currentQuestion < examSession!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setQuestionStartTime(Date.now())
    } else {
      finishExam()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Your exam has been automatically submitted.",
      variant: "destructive"
    })
    finishExam()
  }

  const finishExam = () => {
    if (!examSession || !examConfig) return

    const endTime = new Date()
    const timeSpent = (endTime.getTime() - examSession.startTime.getTime()) / (1000 * 60) // minutes

    // Calculate results
    let correctAnswers = 0
    const performanceByLevel = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    }

    examSession.questions.forEach(question => {
      const userAnswer = examSession.answers.find(a => a.questionId === question.id)
      const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer
      
      if (isCorrect) {
        correctAnswers++
        performanceByLevel[question.difficulty].correct++
      }
      performanceByLevel[question.difficulty].total++
    })

    const score = Math.round((correctAnswers / examSession.questions.length) * 100)

    const result: ExamResult = {
      id: `result-${Date.now()}`,
      examConfigId: examConfig.id,
      examTitle: examConfig.title,
      totalQuestions: examSession.questions.length,
      correctAnswers,
      score,
      timeSpent,
      completedAt: endTime,
      difficulty: examConfig.difficulty,
      performanceByLevel
    }

    // Save to localStorage
    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]')
    existingResults.push(result)
    localStorage.setItem('examResults', JSON.stringify(existingResults))

    setExamResult(result)
    setShowSummary(true)
    onExamComplete(result)
  }

  const retakeExam = () => {
    setShowSummary(false)
    setCurrentQuestion(0)
    setExamSession(null)
    // Reinitialize exam with new questions
    window.location.reload()
  }

  if (!examConfig || !examSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (showSummary && examResult) {
    return (
      <div className="min-h-screen bg-gradient-bg py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <ExamSummary
            result={examResult}
            questions={examSession.questions}
            userAnswers={examSession.answers}
            onRetakeExam={retakeExam}
            onBackToDashboard={onBackToDashboard}
          />
        </div>
      </div>
    )
  }

  const currentQuestionData = examSession.questions[currentQuestion]
  const currentAnswer = examSession.answers.find(a => a.questionId === currentQuestionData.id)
  const answeredCount = examSession.answers.length
  const progress = ((currentQuestion + 1) / examSession.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{examConfig.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Question {currentQuestion + 1} of {examSession.questions.length}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {answeredCount} answered
                </span>
              </div>
            </div>
            
            <Timer
              duration={examConfig.duration}
              onTimeUp={handleTimeUp}
              isActive={true}
              className="w-auto"
            />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <QuestionCard
            question={currentQuestionData}
            questionNumber={currentQuestion + 1}
            totalQuestions={examSession.questions.length}
            selectedAnswer={currentAnswer?.selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentQuestion === 0}
            isLast={currentQuestion === examSession.questions.length - 1}
          />
        </div>
      </div>

      {/* Question Navigation */}
      <div className="fixed bottom-4 right-4">
        <Card className="shadow-elevated">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 max-w-xs">
              {examSession.questions.map((_, index) => {
                const isAnswered = examSession.answers.some(a => a.questionId === examSession.questions[index].id)
                const isCurrent = index === currentQuestion
                
                return (
                  <EnhancedButton
                    key={index}
                    variant={isCurrent ? "default" : isAnswered ? "success" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 text-xs"
                    onClick={() => {
                      setCurrentQuestion(index)
                      setQuestionStartTime(Date.now())
                    }}
                  >
                    {index + 1}
                  </EnhancedButton>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
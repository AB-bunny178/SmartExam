import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { ExamCard } from "@/components/exam/ExamCard"
import { examConfigs } from "@/data/sampleQuestions"
import { ExamResult, UserProgress } from "@/types/exam"
import { Trophy, Clock, Target, BookOpen, TrendingUp, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardProps {
  onStartExam: (examId: string) => void
  onOpenAdmin: () => void
}

export function Dashboard({ onStartExam, onOpenAdmin }: DashboardProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [recentResults, setRecentResults] = useState<ExamResult[]>([])

  useEffect(() => {
    // Load user progress from localStorage
    const savedResults = localStorage.getItem('examResults')
    if (savedResults) {
      const results: ExamResult[] = JSON.parse(savedResults)
      setRecentResults(results.slice(-5)) // Last 5 results
      
      // Calculate user progress
      if (results.length > 0) {
        const totalScore = results.reduce((sum, result) => sum + result.score, 0)
        const averageScore = totalScore / results.length
        
        // Calculate subject performance
        const subjectScores: { [key: string]: number[] } = {}
        results.forEach(result => {
          // This would need to be calculated based on question subjects
          // For now, using mock data
        })
        
        setUserProgress({
          totalExamsTaken: results.length,
          averageScore: Math.round(averageScore),
          strongSubjects: ['Indian Polity'], // Mock data
          weakSubjects: ['Geography'], // Mock data
          recentResults: results.slice(-5)
        })
      }
    }
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartExam
              </h1>
              <p className="text-muted-foreground">Master at COMPITATIVE exams</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back!</p>
                <p className="font-medium">Ready for your next challenge?</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAdmin}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            {userProgress && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userProgress.totalExamsTaken}</div>
                    <div className="text-sm text-muted-foreground">Exams Taken</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getScoreColor(userProgress.averageScore)}`}>
                      {userProgress.averageScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">{userProgress.strongSubjects.length}</div>
                    <div className="text-sm text-muted-foreground">Strong Areas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-warning">{userProgress.weakSubjects.length}</div>
                    <div className="text-sm text-muted-foreground">Focus Areas</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Available Exams */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Exams</h2>
                <Badge variant="outline" className="text-sm">
                  Choose your difficulty level
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examConfigs.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onStartExam={onStartExam}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {userProgress && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Strong Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {userProgress.strongSubjects.map((subject) => (
                        <Badge key={subject} className="text-xs bg-success/10 text-success">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {userProgress.weakSubjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs border-warning text-warning">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Results */}
            {recentResults.length > 0 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{result.examTitle.split(' ').slice(-2).join(' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(result.completedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.correctAnswers}/{result.totalQuestions}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Start with easier tests to build confidence</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Review explanations for wrong answers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Practice time management with timers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Focus on your weak subjects regularly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
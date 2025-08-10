import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ExamConfig } from "@/types/exam"
import { examConfigs } from "@/data/sampleQuestions"
import { Clock, FileText, Trash2, Edit, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const ExamList = () => {
  const { toast } = useToast()
  const [customExams, setCustomExams] = useState<ExamConfig[]>([])
  const [allExams, setAllExams] = useState<ExamConfig[]>([])

  useEffect(() => {
    // Load custom exams from localStorage
    const stored = localStorage.getItem('customExams')
    const custom = stored ? JSON.parse(stored) : []
    setCustomExams(custom)
    
    // Combine default and custom exams
    setAllExams([...examConfigs, ...custom])
  }, [])

  const deleteExam = (examId: string) => {
    // Only allow deletion of custom exams (not default ones)
    const isCustomExam = customExams.some(exam => exam.id === examId)
    
    if (!isCustomExam) {
      toast({
        title: "Cannot Delete",
        description: "Default exams cannot be deleted",
        variant: "destructive"
      })
      return
    }

    const updatedCustomExams = customExams.filter(exam => exam.id !== examId)
    setCustomExams(updatedCustomExams)
    localStorage.setItem('customExams', JSON.stringify(updatedCustomExams))
    
    setAllExams([...examConfigs, ...updatedCustomExams])
    
    toast({
      title: "Exam Deleted",
      description: "The exam has been successfully deleted"
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isCustomExam = (examId: string) => {
    return customExams.some(exam => exam.id === examId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Exams</h3>
          <p className="text-sm text-muted-foreground">
            Manage existing exams ({allExams.length} total)
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {allExams.map((exam) => (
          <Card key={exam.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {exam.title}
                    {isCustomExam(exam.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(exam.difficulty)}>
                    {exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
                  </Badge>
                  
                  {isCustomExam(exam.id) && (
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Delete Exam
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteExam(exam.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{exam.duration} minutes</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{exam.totalQuestions} questions</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Easy: {exam.questionsPerLevel.easy} | 
                  Medium: {exam.questionsPerLevel.medium} | 
                  Hard: {exam.questionsPerLevel.hard}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {allExams.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exams Found</h3>
              <p className="text-muted-foreground text-center">
                No exams have been created yet. Add your first exam to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
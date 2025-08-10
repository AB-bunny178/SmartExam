import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Question } from "@/types/exam"
import { sampleQuestions } from "@/data/sampleQuestions"
import { Search, Filter, Trash2, Edit, AlertTriangle, HelpCircle } from "lucide-react"
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

export const QuestionList = () => {
  const { toast } = useToast()
  const [customQuestions, setCustomQuestions] = useState<Question[]>([])
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")

  useEffect(() => {
    // Load custom questions from localStorage
    const stored = localStorage.getItem('customQuestions')
    const custom = stored ? JSON.parse(stored) : []
    setCustomQuestions(custom)
    
    // Combine default and custom questions
    const combined = [...sampleQuestions, ...custom]
    setAllQuestions(combined)
    setFilteredQuestions(combined)
  }, [])

  useEffect(() => {
    // Filter questions based on search and filters
    let filtered = allQuestions

    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter(question => question.difficulty === difficultyFilter)
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter(question => question.subject === subjectFilter)
    }

    setFilteredQuestions(filtered)
  }, [searchTerm, difficultyFilter, subjectFilter, allQuestions])

  const deleteQuestion = (questionId: string) => {
    // Only allow deletion of custom questions
    const isCustomQuestion = customQuestions.some(q => q.id === questionId)
    
    if (!isCustomQuestion) {
      toast({
        title: "Cannot Delete",
        description: "Default questions cannot be deleted",
        variant: "destructive"
      })
      return
    }

    const updatedCustomQuestions = customQuestions.filter(q => q.id !== questionId)
    setCustomQuestions(updatedCustomQuestions)
    localStorage.setItem('customQuestions', JSON.stringify(updatedCustomQuestions))
    
    const updatedAllQuestions = [...sampleQuestions, ...updatedCustomQuestions]
    setAllQuestions(updatedAllQuestions)
    
    toast({
      title: "Question Deleted",
      description: "The question has been successfully deleted"
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

  const isCustomQuestion = (questionId: string) => {
    return customQuestions.some(q => q.id === questionId)
  }

  const uniqueSubjects = Array.from(new Set(allQuestions.map(q => q.subject)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Question Bank</h3>
          <p className="text-sm text-muted-foreground">
            Manage all questions ({filteredQuestions.length} shown of {allQuestions.length} total)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base leading-relaxed">
                      {question.question}
                    </CardTitle>
                    {isCustomQuestion(question.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline">{question.subject}</Badge>
                  </div>
                </div>
                
                {isCustomQuestion(question.id) && (
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
                            Delete Question
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteQuestion(question.id)}
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
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="grid gap-2">
                  {question.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-md text-sm ${
                        index === question.correctAnswer 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <span className="font-medium">{index + 1}.</span> {option}
                      {index === question.correctAnswer && (
                        <Badge className="ml-2 text-xs bg-green-100 text-green-800">
                          Correct
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-blue-800 mb-1">Explanation</div>
                      <div className="text-sm text-blue-700">{question.explanation}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
              <p className="text-muted-foreground text-center">
                {allQuestions.length === 0 
                  ? "No questions have been created yet. Add your first question to get started."
                  : "No questions match your current search criteria. Try adjusting your filters."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
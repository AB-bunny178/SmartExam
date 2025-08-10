import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { examConfigs } from "@/data/sampleQuestions"
import { ExamConfig } from "@/types/exam"
import { Save, Plus } from "lucide-react"

interface AddExamFormProps {
  onSuccess: () => void
}

export const AddExamForm = ({ onSuccess }: AddExamFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    duration: number;
    totalQuestions: number;
    easyQuestions: number;
    mediumQuestions: number;
    hardQuestions: number;
  }>({
    title: "",
    description: "",
    difficulty: "easy",
    duration: 30,
    totalQuestions: 10,
    easyQuestions: 6,
    mediumQuestions: 3,
    hardQuestions: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that question distribution adds up to total
    const totalQuestionSum = formData.easyQuestions + formData.mediumQuestions + formData.hardQuestions
    if (totalQuestionSum !== formData.totalQuestions) {
      toast({
        title: "Invalid Configuration",
        description: "The sum of questions per difficulty must equal total questions",
        variant: "destructive"
      })
      return
    }

    const newExam: ExamConfig = {
      id: `exam-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      duration: formData.duration,
      totalQuestions: formData.totalQuestions,
      questionsPerLevel: {
        easy: formData.easyQuestions,
        medium: formData.mediumQuestions,
        hard: formData.hardQuestions
      }
    }

    // Save to localStorage (in a real app, this would be an API call)
    const existingExams = localStorage.getItem('customExams')
    const customExams = existingExams ? JSON.parse(existingExams) : []
    customExams.push(newExam)
    localStorage.setItem('customExams', JSON.stringify(customExams))

    toast({
      title: "Exam Created",
      description: `${formData.title} has been successfully created`
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      difficulty: "easy",
      duration: 30,
      totalQuestions: 10,
      easyQuestions: 6,
      mediumQuestions: 3,
      hardQuestions: 1
    })

    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Exam
        </CardTitle>
        <CardDescription>
          Configure a new exam with custom settings and question distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., UPSC Prelims Mock Test 4"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Overall Difficulty</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value: "easy" | "medium" | "hard") => 
                  setFormData(prev => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the exam content and focus areas"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalQuestions">Total Questions *</Label>
              <Input
                id="totalQuestions"
                type="number"
                min="5"
                max="100"
                value={formData.totalQuestions}
                onChange={(e) => setFormData(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) || 10 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Question Distribution</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="easyQuestions">Easy Questions</Label>
                <Input
                  id="easyQuestions"
                  type="number"
                  min="0"
                  value={formData.easyQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, easyQuestions: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediumQuestions">Medium Questions</Label>
                <Input
                  id="mediumQuestions"
                  type="number"
                  min="0"
                  value={formData.mediumQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, mediumQuestions: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hardQuestions">Hard Questions</Label>
                <Input
                  id="hardQuestions"
                  type="number"
                  min="0"
                  value={formData.hardQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, hardQuestions: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Total: {formData.easyQuestions + formData.mediumQuestions + formData.hardQuestions} questions
              {(formData.easyQuestions + formData.mediumQuestions + formData.hardQuestions) !== formData.totalQuestions && 
                <span className="text-destructive ml-2">
                  (Should equal {formData.totalQuestions})
                </span>
              }
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Create Exam
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
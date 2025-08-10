import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Question } from "@/types/exam"
import { Save, Plus, Trash2 } from "lucide-react"

interface AddQuestionFormProps {
  onSuccess: () => void
}

export const AddQuestionForm = ({ onSuccess }: AddQuestionFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: "easy" | "medium" | "hard";
    subject: string;
    explanation: string;
  }>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "easy",
    subject: "",
    explanation: ""
  })

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ""] }))
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData(prev => ({ 
        ...prev, 
        options: newOptions,
        correctAnswer: prev.correctAnswer >= newOptions.length ? 0 : prev.correctAnswer
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.question.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive"
      })
      return
    }

    if (formData.options.some(opt => !opt.trim())) {
      toast({
        title: "Validation Error", 
        description: "All options must be filled",
        variant: "destructive"
      })
      return
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject is required",
        variant: "destructive"
      })
      return
    }

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      question: formData.question.trim(),
      options: formData.options.map(opt => opt.trim()),
      correctAnswer: formData.correctAnswer,
      difficulty: formData.difficulty,
      subject: formData.subject.trim(),
      explanation: formData.explanation.trim() || undefined
    }

    // Save to localStorage (in a real app, this would be an API call)
    const existingQuestions = localStorage.getItem('customQuestions')
    const customQuestions = existingQuestions ? JSON.parse(existingQuestions) : []
    customQuestions.push(newQuestion)
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions))

    toast({
      title: "Question Added",
      description: "New question has been successfully created"
    })

    // Reset form
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      difficulty: "easy",
      subject: "",
      explanation: ""
    })

    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Question
        </CardTitle>
        <CardDescription>
          Create a new question for the question bank
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question text..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Answer Options *</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {formData.options.length < 6 && (
              <Button type="button" variant="outline" onClick={addOption} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Correct Answer *</Label>
            <RadioGroup
              value={formData.correctAnswer.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(value) }))}
            >
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`correct-${index}`} />
                  <Label htmlFor={`correct-${index}`} className="flex-1">
                    Option {index + 1}: {option || `(Option ${index + 1})`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Indian Polity, Geography"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder="Provide an explanation for the correct answer..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Add Question
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
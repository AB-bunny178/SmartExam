import { useState } from "react"
import { Dashboard } from "./Dashboard"
import { ExamInterface } from "./ExamInterface"
import { AdminPanel}  from "./AdminPanel"
import { ExamResult } from "@/types/exam"

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'exam' | 'admin'>('dashboard')
  const [selectedExamId, setSelectedExamId] = useState<string>('')

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId)
    setCurrentView('exam')
  }

  const handleExamComplete = (result: ExamResult) => {
    // Result is already saved in ExamInterface component
    console.log('Exam completed:', result)
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedExamId('')
  }

  const handleOpenAdmin = () => {
    setCurrentView('admin')
  }

  if (currentView === 'exam' && selectedExamId) {
    return (
      <ExamInterface
        examConfigId={selectedExamId}
        onExamComplete={handleExamComplete}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  if (currentView === 'admin') {
    return <AdminPanel onBackToMain={handleBackToDashboard} />
  }

  return <Dashboard onStartExam={handleStartExam} onOpenAdmin={handleOpenAdmin} />
};

export default Index;

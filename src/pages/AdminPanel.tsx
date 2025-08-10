import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen } from "lucide-react";
import { AddExamForm } from "@/components/admin/AddExamForm";
import { AddQuestionForm } from "@/components/admin/AddQuestionForm";
import { ExamList } from "@/components/admin/ExamList";
import { QuestionList } from "@/components/admin/QuestionList";

// ✅ Simple Admin Login Form
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === "thepramodkumar178@gmail.com" &&
      password === "@Abunny178"
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

interface AdminPanelProps {
  onBackToMain: () => void;
}

export const AdminPanel = ({ onBackToMain }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("exams");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToMain}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-foreground">
                Admin Panel
              </h1>
            </div>
            {/* ✅ Logout Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                localStorage.removeItem("isAdminLoggedIn");
                setIsLoggedIn(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Exam Management System
              </CardTitle>
              <CardDescription>
                Manage exams and questions for the SmartExam platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="exams">Manage Exams</TabsTrigger>
                  <TabsTrigger value="add-exam">Add Exam</TabsTrigger>
                  <TabsTrigger value="questions">Manage Questions</TabsTrigger>
                  <TabsTrigger value="add-question">Add Question</TabsTrigger>
                </TabsList>

                <TabsContent value="exams" className="mt-6">
                  <ExamList />
                </TabsContent>

                <TabsContent value="add-exam" className="mt-6">
                  <AddExamForm onSuccess={() => setActiveTab("exams")} />
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                  <QuestionList />
                </TabsContent>

                <TabsContent value="add-question" className="mt-6">
                  <AddQuestionForm
                    onSuccess={() => setActiveTab("questions")}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

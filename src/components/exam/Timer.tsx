import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  duration: number // in minutes
  onTimeUp: () => void
  isActive: boolean
  className?: string
}

export function Timer({ duration, onTimeUp, isActive, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds
  
  useEffect(() => {
    setTimeLeft(duration * 60)
  }, [duration])

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100
  const isWarning = timeLeft <= 300 // 5 minutes
  const isCritical = timeLeft <= 60 // 1 minute

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
      isWarning ? "border-warning bg-warning/5" : "border-border bg-card",
      isCritical && "border-destructive bg-destructive/5 animate-pulse",
      className
    )}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center">
          <div 
            className={cn(
              "absolute inset-0 rounded-full border-4 border-transparent transition-all duration-1000",
              isCritical ? "border-t-destructive" : isWarning ? "border-t-warning" : "border-t-primary"
            )}
            style={{
              transform: `rotate(${progressPercentage * 3.6}deg)`,
              borderRightColor: progressPercentage > 25 ? (isCritical ? 'hsl(var(--destructive))' : isWarning ? 'hsl(var(--warning))' : 'hsl(var(--primary))') : 'transparent',
              borderBottomColor: progressPercentage > 50 ? (isCritical ? 'hsl(var(--destructive))' : isWarning ? 'hsl(var(--warning))' : 'hsl(var(--primary))') : 'transparent',
              borderLeftColor: progressPercentage > 75 ? (isCritical ? 'hsl(var(--destructive))' : isWarning ? 'hsl(var(--warning))' : 'hsl(var(--primary))') : 'transparent'
            }}
          />
          {isCritical ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
          {isWarning && (
            <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning font-medium">
              {isCritical ? "HURRY UP!" : "Warning"}
            </span>
          )}
        </div>
        <div className={cn(
          "text-2xl font-bold font-mono",
          isCritical ? "text-destructive" : isWarning ? "text-warning" : "text-primary"
        )}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  )
}
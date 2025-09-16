import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  value: { question: string; answer: string };
  onChange: (value: { question: string; answer: string }) => void;
  error?: string;
}

export function Captcha({ value, onChange, error }: CaptchaProps) {
  const [question, setQuestion] = useState("");

  const generateQuestion = () => {
    // Generate simple math questions (addition and subtraction)
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2;
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 20) + 1; // 1-20
      num2 = Math.floor(Math.random() * 20) + 1; // 1-20
    } else { // subtraction
      num1 = Math.floor(Math.random() * 30) + 10; // 10-39
      num2 = Math.floor(Math.random() * num1); // 0 to num1-1 (ensures positive result)
    }
    
    const newQuestion = `${num1} ${operation} ${num2}`;
    setQuestion(newQuestion);
    onChange({ question: newQuestion, answer: value.answer });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerChange = (newAnswer: string) => {
    onChange({ question, answer: newAnswer });
  };

  const handleRefresh = () => {
    onChange({ question: "", answer: "" });
    generateQuestion();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha" className="text-sm font-medium">
        Security Check
      </Label>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted p-3 rounded-md min-w-24 justify-center">
          <span className="font-mono text-lg">{question} = ?</span>
        </div>
        <Input
          id="captcha"
          type="number"
          placeholder="Answer"
          value={value.answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-20"
          data-testid="input-captcha"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex-shrink-0"
          data-testid="button-refresh-captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive" data-testid="text-captcha-error">
          {error}
        </p>
      )}
    </div>
  );
}
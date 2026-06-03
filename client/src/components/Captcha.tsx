import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

export interface CaptchaValue {
  question: string;
  answer: string;
  token: string;
  expiresAt: number;
}

interface CaptchaProps {
  value: CaptchaValue;
  onChange: (value: CaptchaValue) => void;
  error?: string;
}

export function Captcha({ value, onChange, error }: CaptchaProps) {
  const [question, setQuestion] = useState("");

  const fetchQuestion = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/captcha');
      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question);
        onChange({
          question: data.question,
          answer: "",
          token: data.token ?? "",
          expiresAt: data.expiresAt ?? 0,
        });
      }
    } catch {
      // silently ignore network errors — the server will reject a missing token
    }
  }, [onChange]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAnswerChange = (newAnswer: string) => {
    onChange({ ...value, question, answer: newAnswer });
  };

  const handleRefresh = () => {
    onChange({ question: "", answer: "", token: "", expiresAt: 0 });
    fetchQuestion();
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

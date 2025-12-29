import { useEffect } from "react";
import Landing from "./Landing";

export default function PreviewOption4() {
  useEffect(() => {
    document.documentElement.style.setProperty('--background', 'hsl(220, 50%, 15%)');
    document.documentElement.style.setProperty('--foreground', 'hsl(0, 0%, 95%)');
    return () => {
      document.documentElement.style.setProperty('--background', 'hsl(0, 0%, 100%)');
      document.documentElement.style.setProperty('--foreground', 'hsl(210, 25%, 7.8431%)');
    };
  }, []);

  return (
    <div>
      <div className="fixed top-20 left-4 z-50 bg-blue-900 border border-blue-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white">Preview: Option 4 - Dark Blue</p>
        <p className="text-xs text-blue-200">This is a temporary preview</p>
      </div>
      <Landing />
    </div>
  );
}

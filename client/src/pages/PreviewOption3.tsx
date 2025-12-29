import { useEffect } from "react";
import Landing from "./Landing";

export default function PreviewOption3() {
  useEffect(() => {
    document.documentElement.style.setProperty('--background', 'hsl(210, 40%, 96%)');
    return () => {
      document.documentElement.style.setProperty('--background', 'hsl(0, 0%, 100%)');
    };
  }, []);

  return (
    <div>
      <div className="fixed top-20 left-4 z-50 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-blue-800">Preview: Option 3 - Light Blue-Gray</p>
        <p className="text-xs text-blue-600">This is a temporary preview</p>
      </div>
      <Landing />
    </div>
  );
}

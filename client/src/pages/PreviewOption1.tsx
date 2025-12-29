import { useEffect } from "react";
import Landing from "./Landing";

export default function PreviewOption1() {
  useEffect(() => {
    document.documentElement.style.setProperty('--background', 'hsl(40, 33%, 98%)');
    return () => {
      document.documentElement.style.setProperty('--background', 'hsl(0, 0%, 100%)');
    };
  }, []);

  return (
    <div>
      <div className="fixed top-20 left-4 z-50 bg-amber-100 border border-amber-300 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-amber-800">Preview: Option 1 - Soft Cream</p>
        <p className="text-xs text-amber-600">This is a temporary preview</p>
      </div>
      <Landing />
    </div>
  );
}

import { useEffect } from "react";
import Landing from "./Landing";

export default function PreviewOption2() {
  useEffect(() => {
    document.documentElement.style.setProperty('--background', 'hsl(210, 17%, 97%)');
    return () => {
      document.documentElement.style.setProperty('--background', 'hsl(0, 0%, 100%)');
    };
  }, []);

  return (
    <div>
      <div className="fixed top-20 left-4 z-50 bg-gray-100 border border-gray-300 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-800">Preview: Option 2 - Light Gray</p>
        <p className="text-xs text-gray-600">This is a temporary preview</p>
      </div>
      <Landing />
    </div>
  );
}

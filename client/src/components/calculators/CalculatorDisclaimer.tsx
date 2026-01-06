import { useState } from "react";

const disclaimerText = "This example is for illustrative purposes only, and actual outcomes may differ. The information provided does not constitute tax, legal, investment, or retirement advice and should not be used to avoid federal tax penalties. Readers are advised to consult an independent tax, legal, or financial professional before making any decisions. While the content is based on sources believed to be reliable, no guarantee is made regarding its accuracy or completeness. Nothing herein should be interpreted as an offer or solicitation to buy or sell any security.";

export default function CalculatorDisclaimer() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="mt-6 p-3 border-t border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p 
        className={`text-red-600 transition-all duration-300 cursor-help ${
          isHovered 
            ? "text-sm leading-relaxed" 
            : "text-xs leading-tight"
        }`}
      >
        {disclaimerText}
      </p>
    </div>
  );
}

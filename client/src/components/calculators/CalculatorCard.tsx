import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  calculators: string[];
  onClick?: () => void;
}

export default function CalculatorCard({
  title,
  description,
  icon: Icon,
  calculators,
  onClick,
}: CalculatorCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group border border-gray-200"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="text-primary h-6 w-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2">
          {calculators.slice(0, 2).map((calculator, index) => (
            <div key={index} className="text-xs text-muted-foreground flex items-center">
              <span className="w-4 h-4 bg-secondary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-secondary text-xs">✓</span>
              </span>
              {calculator}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

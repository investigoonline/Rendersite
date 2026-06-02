import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { Link } from "wouter";

export default function CalculatorCTAs() {
  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href="/contact">
            <Calendar className="h-4 w-4 mr-2" /> Book an Appointment
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
          <Link href="/contact">
            <Phone className="h-4 w-4 mr-2" /> Speak to Expert
          </Link>
        </Button>
      </div>
    </div>
  );
}

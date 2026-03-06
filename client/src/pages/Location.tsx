import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Building, 
  Car,
  Navigation,
  ExternalLink,
  Calendar
} from "lucide-react";

const offices = [
  {
    name: "Global Headquarters",
    address: "Enterprise Software Campus\nBuilding A, Floor 12\nLinköping, Sweden",
    phone: "+46 13 460 40 00",
    email: "headquarters@ifsgroup.com",
    type: "primary",
    description: "Main corporate headquarters and executive offices"
  },
  {
    name: "North American Office", 
    address: "Financial District\n555 Financial Plaza\nNew York, NY 10004",
    phone: "+1 (555) 123-4567",
    email: "americas@investigoonline.com",
    type: "regional",
    description: "Regional headquarters serving North and South America"
  },
  {
    name: "European Operations",
    address: "Canary Wharf\n25 Bank Street\nLondon, E14 5JP, UK",
    phone: "+44 20 7946 0958",
    email: "europe@investigoonline.com", 
    type: "regional",
    description: "European operations and client services center"
  },
  {
    name: "Asia-Pacific Hub",
    address: "Marina Bay Financial Centre\n10 Marina Boulevard\nSingapore 018983",
    phone: "+65 6536 1000",
    email: "apac@investigoonline.com",
    type: "regional",
    description: "Asia-Pacific regional headquarters and operations"
  }
];

const businessHours = [
  { region: "Sweden (HQ)", timezone: "CET", hours: "08:00 - 17:00 Monday-Friday" },
  { region: "New York", timezone: "EST", hours: "08:00 - 18:00 Monday-Friday" },
  { region: "London", timezone: "GMT", hours: "09:00 - 17:30 Monday-Friday" },
  { region: "Singapore", timezone: "SGT", hours: "09:00 - 18:00 Monday-Friday" }
];

export default function Location() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Global Presence
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Global Offices
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With offices across four continents, IFS Group provides local expertise 
            with global reach to serve our clients worldwide.
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">80+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-muted-foreground">Office Locations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-muted-foreground">Global Support</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-muted-foreground">Major Hubs</div>
            </CardContent>
          </Card>
        </div>

        {/* Office Locations */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {offices.map((office, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${
              office.type === 'primary' ? 'border-primary/30 bg-primary/5' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Building className={`h-5 w-5 mr-2 ${
                        office.type === 'primary' ? 'text-primary' : 'text-secondary'
                      }`} />
                      {office.name}
                    </CardTitle>
                    {office.type === 'primary' && (
                      <Badge className="mt-2">Global Headquarters</Badge>
                    )}
                  </div>
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{office.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      {office.address.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${office.phone}`} className="text-sm text-primary hover:underline">
                      {office.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${office.email}`} className="text-sm text-primary hover:underline">
                      {office.email}
                    </a>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Hours */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Global Business Hours
            </CardTitle>
            <p className="text-muted-foreground">
              Our offices operate during local business hours, with 24/7 emergency support available.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessHours.map((schedule, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{schedule.region}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{schedule.timezone}</p>
                  <p className="text-sm font-medium">{schedule.hours}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-secondary" />
                Visiting Our Offices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Appointments Required</h4>
                  <p className="text-sm text-muted-foreground">
                    All office visits require advance scheduling for security and planning purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What to Bring</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valid government-issued photo ID</li>
                    <li>• Confirmation email or appointment details</li>
                    <li>• Any requested financial documents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Parking & Transportation</h4>
                  <p className="text-sm text-muted-foreground">
                    Visitor parking and public transportation information will be provided with your appointment confirmation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-accent" />
                Virtual Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Video Conferencing</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure video meetings available for consultations, reviews, and ongoing support.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phone Consultations</h4>
                  <p className="text-sm text-muted-foreground">
                    Traditional phone meetings for quick check-ins and urgent matters.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Screen Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share documents and review portfolios together in real-time during virtual meetings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Schedule a Visit or Virtual Meeting
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to meet with our team? Schedule an appointment at one of our offices 
              or join us for a virtual consultation from anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule In-Person Visit
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Book Virtual Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/lib/iconMapper";
import UnderConstruction from "@/components/UnderConstruction";
import { HTMLContent } from "@/components/HTMLContent";
import type { PageContent } from "@shared/schema";

export default function About() {
  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'about'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=about', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch content');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pageContent || pageContent.length === 0) {
    return <UnderConstruction />;
  }

  const getContent = (section: string) => {
    return pageContent?.find(p => p.section === section)?.content;
  };

  const header = getContent('about_header');
  const story = getContent('about_story');
  const missionVision = getContent('about_mission_vision');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {header && (
          <div className="text-center mb-20">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6" data-testid="badge-about-header">
              {header.badge}
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-8" data-testid="text-about-title">
              {header.title}
            </h1>
            <HTMLContent content={header.description} className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="text-about-description" />
          </div>
        )}

        {/* Company Story */}
        {story && (
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-10" data-testid="text-story-title">
              {story.title}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {story.paragraphs?.map((paragraph: string, index: number) => (
                <p key={index} data-testid={`text-story-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Mission & Vision */}
        {missionVision && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12" data-testid="text-mission-vision-title">
              {missionVision.title}
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center" data-testid="text-mission-title">
                    {getIconComponent(missionVision.missionIcon) && 
                      (() => {
                        const Icon = getIconComponent(missionVision.missionIcon);
                        return <Icon className="h-7 w-7 text-primary mr-3" />;
                      })()
                    }
                    {missionVision.missionTitle}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed" data-testid="text-mission-content">
                    {missionVision.missionText}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 bg-secondary/5 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center" data-testid="text-vision-title">
                    {getIconComponent(missionVision.visionIcon) && 
                      (() => {
                        const Icon = getIconComponent(missionVision.visionIcon);
                        return <Icon className="h-7 w-7 text-secondary mr-3" />;
                      })()
                    }
                    {missionVision.visionTitle}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed" data-testid="text-vision-content">
                    {missionVision.visionText}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

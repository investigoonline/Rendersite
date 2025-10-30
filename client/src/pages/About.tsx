import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HTMLContent } from "@/components/HTMLContent";
import { getIconComponent } from "@/lib/iconMapper";
import UnderConstruction from "@/components/UnderConstruction";
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
  const stats = getContent('about_stats');
  const story = getContent('about_story');
  const missionVision = getContent('about_mission_vision');
  const values = getContent('about_values');
  const leadership = getContent('about_leadership');
  const headquarters = getContent('about_headquarters');
  const innovation = getContent('about_innovation');
  const security = getContent('about_security');
  const cta = getContent('about_cta');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {header && (
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6" data-testid="badge-about-header">
              {header.badge}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-6" data-testid="text-about-title">
              {header.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto whitespace-pre-wrap" data-testid="text-about-description">
              {header.description}
            </p>
          </div>
        )}

        {/* Company Stats */}
        {stats && stats.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.stats.map((stat: any, index: number) => {
              const Icon = getIconComponent(stat.icon);
              return (
                <Card key={index} data-testid={`card-stat-${index}`}>
                  <CardContent className="p-6 text-center">
                    {Icon && <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />}
                    <div className={`text-3xl font-bold ${stat.color} mb-2`} data-testid={`text-stat-value-${index}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-stat-label-${index}`}>
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Company Story */}
          {story && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="text-story-title">
                {story.title}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {story.paragraphs?.map((paragraph: string, index: number) => (
                  <p key={index} data-testid={`text-story-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Mission & Vision */}
          {missionVision && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="text-mission-vision-title">
                {missionVision.title}
              </h2>
              <div className="space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center" data-testid="text-mission-title">
                      {getIconComponent(missionVision.missionIcon) && 
                        (() => {
                          const Icon = getIconComponent(missionVision.missionIcon);
                          return <Icon className="h-5 w-5 text-primary mr-2" />;
                        })()
                      }
                      {missionVision.missionTitle}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-mission-content">
                      {missionVision.missionText}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 bg-secondary/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center" data-testid="text-vision-title">
                      {getIconComponent(missionVision.visionIcon) && 
                        (() => {
                          const Icon = getIconComponent(missionVision.visionIcon);
                          return <Icon className="h-5 w-5 text-secondary mr-2" />;
                        })()
                      }
                      {missionVision.visionTitle}
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-vision-content">
                      {missionVision.visionText}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Company Values */}
        {values && values.values && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12" data-testid="text-values-title">
              {values.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.values.map((value: any, index: number) => {
                const Icon = getIconComponent(value.icon);
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow" data-testid={`card-value-${index}`}>
                    <CardContent className="p-6">
                      {Icon && <Icon className="h-12 w-12 text-primary mx-auto mb-4" />}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`text-value-title-${index}`}>
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid={`text-value-description-${index}`}>
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Leadership Team */}
        {leadership && leadership.leaders && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12" data-testid="text-leadership-title">
              {leadership.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.leaders.map((leader: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-leader-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">
                        {leader.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-1" data-testid={`text-leader-name-${index}`}>
                      {leader.name}
                    </h3>
                    <p className="text-sm text-primary text-center mb-3" data-testid={`text-leader-title-${index}`}>
                      {leader.title}
                    </p>
                    <p className="text-sm text-muted-foreground text-center whitespace-pre-wrap" data-testid={`text-leader-description-${index}`}>
                      {leader.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Global Presence */}
        {headquarters && (
          <Card className="mb-16">
            <CardContent className="p-12 text-center">
              {getIconComponent(headquarters.icon) && 
                (() => {
                  const Icon = getIconComponent(headquarters.icon);
                  return <Icon className="h-16 w-16 text-primary mx-auto mb-6" />;
                })()
              }
              <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-headquarters-title">
                {headquarters.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6" data-testid="text-headquarters-subtitle">
                {headquarters.subtitle}
              </p>
              <div className="max-w-2xl mx-auto text-muted-foreground">
                <p className="whitespace-pre-wrap" data-testid="text-headquarters-description">{headquarters.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technology & Innovation / Security & Compliance */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {innovation && (
            <Card>
              <CardContent className="p-8">
                {getIconComponent(innovation.icon) && 
                  (() => {
                    const Icon = getIconComponent(innovation.icon);
                    return <Icon className="h-12 w-12 text-primary mb-4" />;
                  })()
                }
                <h3 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-innovation-title">
                  {innovation.title}
                </h3>
                <p className="text-muted-foreground mb-4 whitespace-pre-wrap" data-testid="text-innovation-description">
                  {innovation.description}
                </p>
                {innovation.features && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {innovation.features.map((feature: string, index: number) => (
                      <li key={index} data-testid={`text-innovation-feature-${index}`}>• {feature}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {security && (
            <Card>
              <CardContent className="p-8">
                {getIconComponent(security.icon) && 
                  (() => {
                    const Icon = getIconComponent(security.icon);
                    return <Icon className="h-12 w-12 text-secondary mb-4" />;
                  })()
                }
                <h3 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-security-title">
                  {security.title}
                </h3>
                <p className="text-muted-foreground mb-4 whitespace-pre-wrap" data-testid="text-security-description">
                  {security.description}
                </p>
                {security.features && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {security.features.map((feature: string, index: number) => (
                      <li key={index} data-testid={`text-security-feature-${index}`}>• {feature}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        {cta && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-cta-title">
                {cta.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto whitespace-pre-wrap" data-testid="text-cta-description">
                {cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = cta.primaryButtonHref}
                  data-testid="button-primary-cta"
                >
                  {cta.primaryButtonText}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => window.location.href = cta.secondaryButtonHref}
                  data-testid="button-secondary-cta"
                >
                  {cta.secondaryButtonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

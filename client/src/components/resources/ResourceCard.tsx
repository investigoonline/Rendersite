import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  Mail,
  Book,
  HelpCircle,
  Eye,
  Calendar,
  Download,
  ExternalLink,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: "article" | "video" | "newsletter" | "flipbook" | "faq";
  category?: string;
  url?: string;
  publishDate?: string;
  views?: number;
  author?: string;
  duration?: string;
}

interface ResourceCardProps {
  resource: Resource;
  onView: () => void;
}

const typeConfig = {
  article: { icon: FileText, color: "text-primary", bgColor: "bg-primary/5" },
  video: { icon: Video, color: "text-secondary", bgColor: "bg-secondary/5" },
  newsletter: { icon: Mail, color: "text-accent", bgColor: "bg-accent/5" },
  flipbook: { icon: Book, color: "text-green-600", bgColor: "bg-green-50" },
  faq: { icon: HelpCircle, color: "text-purple-600", bgColor: "bg-purple-50" },
};

export default function ResourceCard({ resource, onView }: ResourceCardProps) {
  const config = typeConfig[resource.type];
  const IconComponent = config.icon;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleView = () => {
    onView();
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${config.bgColor} mb-3`}>
            <IconComponent className={`h-5 w-5 ${config.color}`} />
          </div>
          {resource.views && (
            <Badge variant="secondary" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {resource.views}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {resource.title}
        </CardTitle>
        {resource.category && (
          <Badge variant="outline" className="w-fit text-xs">
            {resource.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col justify-between flex-1">
        <div className="space-y-3 mb-4">
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
              {resource.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {resource.author && (
              <span>By {resource.author}</span>
            )}
            {resource.publishDate && (
              <span>• {formatDate(resource.publishDate)}</span>
            )}
            {resource.duration && resource.type === 'video' && (
              <span>• {resource.duration}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleView}
            className="flex-1 group-hover:bg-primary group-hover:text-white transition-colors"
            variant="outline"
            size="sm"
          >
            {resource.type === 'video' && <Video className="h-4 w-4 mr-2" />}
            {resource.type === 'article' && <FileText className="h-4 w-4 mr-2" />}
            {resource.type === 'newsletter' && <Mail className="h-4 w-4 mr-2" />}
            {resource.type === 'flipbook' && <Book className="h-4 w-4 mr-2" />}
            {resource.type === 'faq' && <HelpCircle className="h-4 w-4 mr-2" />}
            
            {resource.type === 'video' ? 'Watch' : 
             resource.type === 'newsletter' ? 'Read' :
             resource.type === 'flipbook' ? 'View' : 'Read'}
          </Button>
          
          {resource.url && (
            <Button
              onClick={() => window.open(resource.url, '_blank')}
              variant="ghost"
              size="sm"
              className="px-2"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
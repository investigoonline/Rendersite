import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { History, RotateCcw, Eye, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentHistoryEntry {
  id: string;
  contentId: string;
  page: string;
  section: string;
  oldContent: any;
  newContent: any;
  changeType: 'create' | 'update' | 'delete';
  changedBy: string;
  changedByName: string;
  changedByEmail: string;
  changedAt: string;
}

export default function ContentHistoryTab() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [viewingHistory, setViewingHistory] = useState<ContentHistoryEntry | null>(null);

  const { data: history, isLoading } = useQuery<ContentHistoryEntry[]>({
    queryKey: ['/api/content-history', selectedPage],
    queryFn: async () => {
      const params = selectedPage !== "all" ? `?page=${selectedPage}` : '';
      const res = await fetch(`/api/content-history${params}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (historyId: string) => {
      return apiRequest('POST', `/api/content-history/${historyId}/restore`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Content Restored",
        description: "The content has been successfully restored from history",
      });
      setViewingHistory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Restore Failed",
        description: error.message || "Failed to restore content",
        variant: "destructive",
      });
    },
  });

  const pages = ["all", "home", "about", "services", "contact", "resources", "footer", "dashboard"];

  const getChangeTypeBadge = (type: string) => {
    const variants = {
      create: "default",
      update: "secondary",
      delete: "destructive",
    };
    return (
      <Badge variant={variants[type as keyof typeof variants] as any} data-testid={`badge-change-${type}`}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" data-testid="text-history-title">
            <History className="h-6 w-6" />
            Content Change History
          </h2>
          <p className="text-muted-foreground mt-1">
            View and restore previous versions of page content
          </p>
        </div>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-48" data-testid="select-page-filter">
            <SelectValue placeholder="Filter by page" />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page} value={page} data-testid={`option-page-${page}`}>
                {page === 'all' ? 'All Pages' : page.charAt(0).toUpperCase() + page.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {history && history.length > 0 ? (
          history.map((entry) => (
            <Card key={entry.id} data-testid={`card-history-${entry.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {entry.page.charAt(0).toUpperCase() + entry.page.slice(1)} - {entry.section}
                      </CardTitle>
                      {getChangeTypeBadge(entry.changeType)}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.changedByName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(entry.changedAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingHistory(entry)}
                      data-testid={`button-view-${entry.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {entry.changeType === 'update' && entry.oldContent && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => restoreMutation.mutate(entry.id)}
                        disabled={restoreMutation.isPending}
                        data-testid={`button-restore-${entry.id}`}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No content history found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!viewingHistory} onOpenChange={(open) => !open && setViewingHistory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="dialog-history-details">
          <DialogHeader>
            <DialogTitle>Content Change Details</DialogTitle>
            <DialogDescription>
              {viewingHistory && `${viewingHistory.page} - ${viewingHistory.section}`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-6 pr-4">
              {viewingHistory?.oldContent && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Previous Content</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs" data-testid="text-old-content">
                    {JSON.stringify(viewingHistory.oldContent, null, 2)}
                  </pre>
                </div>
              )}
              {viewingHistory?.newContent && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                    {viewingHistory.changeType === 'create' ? 'Created Content' : 'New Content'}
                  </h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs" data-testid="text-new-content">
                    {JSON.stringify(viewingHistory.newContent, null, 2)}
                  </pre>
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Changed By:</span>
                    <p className="font-medium">{viewingHistory?.changedByName}</p>
                    <p className="text-xs text-muted-foreground">{viewingHistory?.changedByEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Changed At:</span>
                    <p className="font-medium">{viewingHistory && formatDate(viewingHistory.changedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

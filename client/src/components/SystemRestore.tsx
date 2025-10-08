import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, RotateCcw, Eye, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PageContentHistory } from "@shared/schema";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SystemRestore() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [previewHistory, setPreviewHistory] = useState<PageContentHistory | null>(null);

  const { data: history, isLoading } = useQuery<PageContentHistory[]>({
    queryKey: ['/api/admin/content-history', selectedPage],
    queryFn: async () => {
      const url = selectedPage === "all" 
        ? '/api/admin/content-history?limit=100'
        : `/api/admin/content-history?page=${selectedPage}&limit=100`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (historyId: string) => {
      return apiRequest('POST', `/api/admin/content-history/${historyId}/restore`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content-history'] });
      toast({
        title: "Content Restored",
        description: "The content has been successfully restored from history",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Restore Failed",
        description: error.message || "Failed to restore content",
        variant: "destructive",
      });
    },
  });

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            System Restore
          </CardTitle>
          <CardDescription>
            View and restore previous versions of page content. All changes are automatically tracked with timestamp and user information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="w-[200px]" data-testid="select-page-filter">
                  <SelectValue placeholder="Filter by page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                {history?.length || 0} history records
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Change Type</TableHead>
                      <TableHead>Changed By</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history && history.length > 0 ? (
                      history.map((item) => (
                        <TableRow key={item.id} data-testid={`history-row-${item.id}`}>
                          <TableCell className="font-medium">{item.page}</TableCell>
                          <TableCell>{item.section}</TableCell>
                          <TableCell>
                            <Badge className={getChangeTypeColor(item.changeType)}>
                              {item.changeType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.changedBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(item.createdAt || ''), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewHistory(item)}
                                data-testid={`button-preview-${item.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {item.changeType !== 'delete' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => restoreMutation.mutate(item.id)}
                                  disabled={restoreMutation.isPending}
                                  data-testid={`button-restore-${item.id}`}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No history records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewHistory} onOpenChange={() => setPreviewHistory(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              {previewHistory?.page} - {previewHistory?.section}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Changed by:</span> {previewHistory?.changedBy}
              </div>
              <div>
                <span className="font-medium">Change type:</span>{" "}
                <Badge className={getChangeTypeColor(previewHistory?.changeType || '')}>
                  {previewHistory?.changeType}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Timestamp:</span>{" "}
                {previewHistory?.createdAt && format(new Date(previewHistory.createdAt), 'PPpp')}
              </div>
              <div>
                <span className="font-medium">Published:</span>{" "}
                {previewHistory?.published ? "Yes" : "No"}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Data:</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(previewHistory?.content, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useLocation } from "wouter";
import { useEffect } from "react";
import { usePagePermissions } from "@/hooks/usePagePermissions";

interface PageProtectedRouteProps {
  children: React.ReactNode;
  pageId: string;
}

export function PageProtectedRoute({ children, pageId }: PageProtectedRouteProps) {
  const { hasPageAccess, isLoading } = usePagePermissions();
  const [, setLocation] = useLocation();
  const hasAccess = hasPageAccess(pageId);

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      setLocation("/");
    }
  }, [hasAccess, isLoading, setLocation]);

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

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

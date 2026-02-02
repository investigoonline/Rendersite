import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFontSettings } from "@/hooks/useFontSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageProtectedRoute } from "@/components/PageProtectedRoute";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import HomeDesignOptions from "@/pages/HomeDesignOptions";
import Register from "@/pages/Register";
import Calculators from "@/pages/Calculators";
import Resources from "@/pages/Resources";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Process from "@/pages/Process";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import FAQ from "@/pages/FAQ";
import BecomeClient from "@/pages/BecomeClient";
import Location from "@/pages/Location";
import Custodian from "@/pages/Custodian";
import ContentManagement from "@/pages/ContentManagement";
import LegalPage from "@/pages/LegalPage";
import ResourceManagement from "@/pages/admin/ResourceManagement";
import Dashboard from "@/pages/Dashboard";
import UnderConstruction from "@/pages/UnderConstruction";
import Profile from "@/pages/Profile";
import BackgroundPreview from "@/pages/BackgroundPreview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Public routes available to everyone */}
        <Route path="/register" component={Register} />
        <Route path="/home-designs" component={HomeDesignOptions} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/resources" component={Resources} />
        <Route path="/blog" component={Blog} />
        <Route path="/about" component={About} />
        <Route path="/about/process" component={Process} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq">
          <PageProtectedRoute pageId="FAQ">
            <FAQ />
          </PageProtectedRoute>
        </Route>
        <Route path="/become-client" component={BecomeClient} />
        <Route path="/location" component={Location} />
        <Route path="/custodian" component={Custodian} />
        
        {/* Legal pages with CMS content */}
        <Route path="/privacy-policy">
          {() => <LegalPage pageType="privacy_policy" />}
        </Route>
        <Route path="/terms-of-service">
          {() => <LegalPage pageType="terms_of_service" />}
        </Route>
        <Route path="/disclosures">
          {() => <LegalPage pageType="disclosures" />}
        </Route>
        <Route path="/background-preview">
          {() => <BackgroundPreview onSelect={(opt) => alert(`You selected Option ${opt}. Tell me which one you want!`)} />}
        </Route>
        
        {/* Profile page */}
        <Route path="/profile" component={Profile} />
        
        {/* Under Construction pages */}
        <Route path="/auth/login" component={UnderConstruction} />
        <Route path="/guest-access" component={UnderConstruction} />
        <Route path="/client-login" component={UnderConstruction} />
        <Route path="/mobile-app" component={UnderConstruction} />
        <Route path="/api-docs" component={UnderConstruction} />
        <Route path="/help-center" component={UnderConstruction} />
        <Route path="/leadership" component={UnderConstruction} />
        <Route path="/careers" component={UnderConstruction} />
        <Route path="/press" component={UnderConstruction} />
        
        {/* Protected routes - Super Admin only */}
        <Route path="/admin-dashboard">
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        
        {/* Protected routes - Super Admin and Content Manager */}
        <Route path="/content-management">
          <ProtectedRoute allowedRoles={['super_admin', 'content_manager']}>
            <ContentManagement />
          </ProtectedRoute>
        </Route>
        
        <Route path="/resource-management">
          <ProtectedRoute allowedRoles={['super_admin', 'content_manager']}>
            <ResourceManagement />
          </ProtectedRoute>
        </Route>
        
        {/* Home route - Landing page for all users */}
        <Route path="/">
          <Landing />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function FontSettingsProvider({ children }: { children: React.ReactNode }) {
  useFontSettings();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FontSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </FontSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;

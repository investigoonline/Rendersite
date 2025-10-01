import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Calculators from "@/pages/Calculators";
import Resources from "@/pages/Resources";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import FAQ from "@/pages/FAQ";
import BecomeClient from "@/pages/BecomeClient";
import Location from "@/pages/Location";
import Disclosures from "@/pages/Disclosures";
import Custodian from "@/pages/Custodian";
import ContentManagement from "@/pages/ContentManagement";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Layout>
      <Switch>
        {/* Public routes available to everyone */}
        <Route path="/register" component={Register} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/resources" component={Resources} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/become-client" component={BecomeClient} />
        <Route path="/location" component={Location} />
        <Route path="/disclosures" component={Disclosures} />
        <Route path="/custodian" component={Custodian} />
        <Route path="/content-management" component={ContentManagement} />
        
        {/* Home route - Landing for guests, Dashboard for authenticated users */}
        <Route path="/">
          {isLoading ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : isAuthenticated ? (
            <Home />
          ) : (
            <Landing />
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

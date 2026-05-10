import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { GameProvider } from "@/hooks/use-game";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import GamePage from "@/pages/game";
import LedgerPage from "@/pages/ledger";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PaymentPage from "@/pages/payment";
import ProfilePage from "@/pages/profile";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/" component={GamePage} />
      <Route path="/blockchain" component={LedgerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            {isAuthenticated ? <Layout><Router /></Layout> : <Router />}
          </WouterRouter>
        </GameProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MissionsPage from "@/pages/MissionsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProgressPage from "@/pages/ProgressPage";
import MotivationPage from "@/pages/MotivationPage";
import SettingsPage from "@/pages/SettingsPage";
import Auth from "@/pages/Auth";
import { useAuth } from "@/context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    window.location.href = "/auth";
    return null;
  }
  
  return <Component />;
}

function App() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/">
        <MainLayout>
          <ProtectedRoute component={Dashboard} />
        </MainLayout>
      </Route>
      <Route path="/missions">
        <MainLayout>
          <ProtectedRoute component={MissionsPage} />
        </MainLayout>
      </Route>
      <Route path="/projects">
        <MainLayout>
          <ProtectedRoute component={ProjectsPage} />
        </MainLayout>
      </Route>
      <Route path="/progress">
        <MainLayout>
          <ProtectedRoute component={ProgressPage} />
        </MainLayout>
      </Route>
      <Route path="/motivation">
        <MainLayout>
          <ProtectedRoute component={MotivationPage} />
        </MainLayout>
      </Route>
      <Route path="/settings">
        <MainLayout>
          <ProtectedRoute component={SettingsPage} />
        </MainLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;

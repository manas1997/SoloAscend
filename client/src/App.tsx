import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MissionsPage from "@/pages/MissionsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProgressPage from "@/pages/ProgressPage";
import MotivationPage from "@/pages/MotivationPage";
import AnimeSurgePage from "@/pages/AnimeSurgePage";
import SettingsPage from "@/pages/SettingsPage";
import SelectTopTasks from "@/pages/SelectTopTasks";
import AuthPage from "@/pages/auth-page";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { MotivationMeteor } from "./components/motivation/MotivationMeteor";

// Only show the motivation meteor on protected routes (not on auth page)
function AppMotivationMeteor() {
  const [location] = useLocation();
  
  // Don't show meteor on the auth page
  if (location === '/auth') {
    return null;
  }
  
  return <MotivationMeteor />;
}

// Wrap components with MainLayout
const ProtectedDashboard = () => (
  <MainLayout>
    <Dashboard />
  </MainLayout>
);

const ProtectedMissions = () => (
  <MainLayout>
    <MissionsPage />
  </MainLayout>
);

const ProtectedProjects = () => (
  <MainLayout>
    <ProjectsPage />
  </MainLayout>
);

const ProtectedProgress = () => (
  <MainLayout>
    <ProgressPage />
  </MainLayout>
);

const ProtectedMotivation = () => (
  <MainLayout>
    <MotivationPage />
  </MainLayout>
);

const ProtectedAnimeSurge = () => (
  <MainLayout>
    <AnimeSurgePage />
  </MainLayout>
);

const ProtectedSettings = () => (
  <MainLayout>
    <SettingsPage />
  </MainLayout>
);

const ProtectedSelectTopTasks = () => (
  <MainLayout>
    <SelectTopTasks />
  </MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={ProtectedDashboard} />
          <ProtectedRoute path="/missions" component={ProtectedMissions} />
          <ProtectedRoute path="/projects" component={ProtectedProjects} />
          <ProtectedRoute path="/progress" component={ProtectedProgress} />
          <ProtectedRoute path="/motivation" component={ProtectedMotivation} />
          <ProtectedRoute path="/anime-surge" component={ProtectedAnimeSurge} />
          <ProtectedRoute path="/settings" component={ProtectedSettings} />
          <ProtectedRoute path="/select-tasks" component={ProtectedSelectTopTasks} />
          <Route component={NotFound} />
        </Switch>
        
        {/* Motivation Meteor - will appear randomly across the app */}
        <AppMotivationMeteor />
      </>
    </AuthProvider>
  );
}

export default App;

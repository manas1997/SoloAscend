import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MissionsPage from "@/pages/MissionsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProgressPage from "@/pages/ProgressPage";
import MotivationPage from "@/pages/MotivationPage";
import AnimeSurgePage from "@/pages/AnimeSurgePage";
import SettingsPage from "@/pages/SettingsPage";
import AuthPage from "@/pages/auth-page";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

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

// Create an Auth wrapper component for the auth page
const AuthPageRoute = () => {
  return <AuthPage />;
};

// Create a separate component for protected routes
const ProtectedRoutes = () => (
  <AuthProvider>
    <Switch>
      <ProtectedRoute path="/" component={ProtectedDashboard} />
      <ProtectedRoute path="/missions" component={ProtectedMissions} />
      <ProtectedRoute path="/projects" component={ProtectedProjects} />
      <ProtectedRoute path="/progress" component={ProtectedProgress} />
      <ProtectedRoute path="/motivation" component={ProtectedMotivation} />
      <ProtectedRoute path="/anime-surge" component={ProtectedAnimeSurge} />
      <ProtectedRoute path="/settings" component={ProtectedSettings} />
    </Switch>
  </AuthProvider>
);

function App() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPageRoute />
      </Route>
      <Route path="/:rest*">
        <ProtectedRoutes />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;

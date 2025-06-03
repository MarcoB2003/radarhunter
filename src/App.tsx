import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadImport from "./pages/leads/LeadImport"; // <-- correto
import Pipeline from "./pages/Pipeline";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Meetings from "./pages/Meetings"; // Nova importação
// Pages
import EmpresasPage from "./pages/EmpresasPage";
import CampaignsPage from "./pages/CampaignsPage";
import SocialPage from "./pages/SocialPage";
import ReportsPage from "./pages/ReportsPage";

// New AI Pages
import AIScoring from "./pages/AIScoring";
import AISdr from "./pages/AISdr";
import AICloser from "./pages/AICloser";
import AIManager from "./pages/AIManager";

// Auth protection
import AuthProvider from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/leads/importar" element={<LeadImport />} /> {/* <-- corrigido aqui */}
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/chatbot" element={<Chatbot />} />
                
                {/* Analytics & Automation routes */}
                <Route path="/empresas" element={<EmpresasPage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                
                {/* AI Routes */}
                <Route path="/ai-scoring" element={<AIScoring />} />
                <Route path="/ai-sdr" element={<AISdr />} />
                <Route path="/ai-closer" element={<AICloser />} />
                <Route path="/ai-manager" element={<AIManager />} />
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

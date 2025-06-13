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
import CompanySearch from "./pages/CompanySearch"; // Nova página de busca com IA
import Leads from "./pages/Leads"; // Importing our new Leads page
import LeadImport from "./pages/leads/LeadImport";
import Pipeline from "./pages/Pipeline";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Meetings from "./pages/Meetings";
// Pages
import Companies from "./pages/Companies";
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
                <Route path="/company-search" element={<CompanySearch />} /> {/* Nova rota de busca com IA */}
                <Route path="/leads" element={<Leads />} /> {/* Using our new Leads page with import UI */}
                <Route path="/leads/importar" element={<LeadImport />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/chatbot" element={<Chatbot />} />
                
                {/* Analytics & Automation routes */}
                <Route path="/companies" element={<Companies />} />
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

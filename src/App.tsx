
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import DropDetails from "./pages/DropDetails";
import Mint from "./pages/Mint";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateDrop from "./pages/dashboard/CreateDrop";
import MyDrops from "./pages/dashboard/MyDrops";
import StatsPage from "./pages/dashboard/StatsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/drop/:slug" element={<DropDetails />} />
            <Route path="/mint/:slug" element={<Mint />} />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<StatsPage />} />
              <Route path="create" element={<CreateDrop />} />
              <Route path="drops" element={<MyDrops />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

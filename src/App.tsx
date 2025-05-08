
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import DropDetails from "./pages/DropDetails";
import Mint from "./pages/Mint";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateDrop from "./pages/dashboard/CreateDrop";
import CreateCollection from "./pages/dashboard/CreateCollection";
import MyDrops from "./pages/dashboard/MyDrops";
import StatsPage from "./pages/dashboard/StatsPage";
import AdminPanel from "./pages/AdminPanel";
import DropSuccessPage from "./pages/dashboard/DropSuccessPage";

// Create a client for react-query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/drop/:slug" element={<DropDetails />} />
            <Route path="/mint/:slug" element={<Mint />} />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Dashboard Routes - No auth required now */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<StatsPage />} />
              <Route path="create" element={<CreateDrop />} />
              <Route path="collection/create" element={<CreateCollection />} />
              <Route path="drops" element={<MyDrops />} />
              <Route path="drops/success" element={<DropSuccessPage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </WalletProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

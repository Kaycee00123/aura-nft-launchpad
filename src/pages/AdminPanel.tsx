
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { Shield, UserCheck, TrendingUp, Ban } from "lucide-react";
import DropApprovalQueue from "@/components/admin/DropApprovalQueue";
import UserVerificationRequests from "@/components/admin/UserVerificationRequests";
import PlatformAnalytics from "@/components/admin/PlatformAnalytics";
import ControlTools from "@/components/admin/ControlTools";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("drops");

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      return;
    }

    if (!user.isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin panel.",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-aura-purple" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <Tabs 
          defaultValue="drops" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="drops" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Drop Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>User Verification</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <span>Control Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drops" className="border rounded-lg p-4">
            <DropApprovalQueue />
          </TabsContent>
          
          <TabsContent value="users" className="border rounded-lg p-4">
            <UserVerificationRequests />
          </TabsContent>
          
          <TabsContent value="analytics" className="border rounded-lg p-4">
            <PlatformAnalytics />
          </TabsContent>
          
          <TabsContent value="control" className="border rounded-lg p-4">
            <ControlTools />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;

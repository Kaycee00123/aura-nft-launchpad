
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { UserCheck, X, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for user verification requests
const mockUsers = [
  {
    id: "user1",
    username: "cryptoartist",
    name: "Alex Turner",
    email: "alex@example.com",
    submitted: "2025-01-15",
    status: "pending",
    verificationDocuments: {
      idCard: "https://placehold.co/400x300",
      selfie: "https://placehold.co/400x300",
      socialProof: "https://twitter.com/cryptoartist"
    }
  },
  {
    id: "user2",
    username: "nftcreator",
    name: "Taylor Smith",
    email: "taylor@example.com",
    submitted: "2025-01-17",
    status: "verified",
    verificationDocuments: {
      idCard: "https://placehold.co/400x300",
      selfie: "https://placehold.co/400x300",
      socialProof: "https://twitter.com/nftcreator"
    }
  },
  {
    id: "user3",
    username: "digitaldesigner",
    name: "Jordan Lee",
    email: "jordan@example.com",
    submitted: "2025-01-18",
    status: "pending",
    verificationDocuments: {
      idCard: "https://placehold.co/400x300",
      selfie: "https://placehold.co/400x300",
      socialProof: "https://twitter.com/digitaldesigner"
    }
  },
  {
    id: "user4",
    username: "artgenerator",
    name: "Casey River",
    email: "casey@example.com",
    submitted: "2025-01-19",
    status: "rejected",
    verificationDocuments: {
      idCard: "https://placehold.co/400x300",
      selfie: "https://placehold.co/400x300",
      socialProof: "https://twitter.com/artgenerator"
    }
  },
];

const UserVerificationRequests = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVerify = (userId: string) => {
    // In a real app, this would call an API endpoint to update the user verification status
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: "verified"
        };
      }
      return user;
    }));

    toast({
      title: "User Verified",
      description: "The user has been successfully verified and notified.",
    });
    
    setIsDialogOpen(false);
  };

  const handleReject = (userId: string) => {
    // In a real app, this would call an API endpoint to update the user verification status
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: "rejected"
        };
      }
      return user;
    }));

    toast({
      title: "Verification Rejected",
      description: "The user's verification request has been rejected.",
    });
    
    setIsDialogOpen(false);
  };

  const openVerificationDialog = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Verification Requests</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${user.username}`} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.submitted}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      user.status === "verified" 
                        ? "default" 
                        : user.status === "rejected" 
                          ? "destructive" 
                          : "outline"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openVerificationDialog(user)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  {user.status === "pending" && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleVerify(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(user.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Verification Documents Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Verification Review</DialogTitle>
            <DialogDescription>
              Review the submitted verification documents for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${selectedUser.username}`} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                  </div>
                </div>
                <Badge 
                  variant={
                    selectedUser.status === "verified" 
                      ? "default" 
                      : selectedUser.status === "rejected" 
                        ? "destructive" 
                        : "outline"
                  }
                >
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">ID Document</h4>
                <img 
                  src={selectedUser.verificationDocuments.idCard} 
                  alt="ID Document" 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Selfie Verification</h4>
                <img 
                  src={selectedUser.verificationDocuments.selfie} 
                  alt="Selfie Verification" 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Social Media Proof</h4>
                <a 
                  href={selectedUser.verificationDocuments.socialProof}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-aura-purple hover:underline"
                >
                  {selectedUser.verificationDocuments.socialProof}
                </a>
              </div>

              {selectedUser.status === "pending" && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleReject(selectedUser.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    variant="default"  
                    onClick={() => handleVerify(selectedUser.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserVerificationRequests;

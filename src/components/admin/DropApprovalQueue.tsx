
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Check, X, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for drop approvals
const mockDrops = [
  {
    id: "drop1",
    title: "Cosmic Creatures",
    creator: "Creator Studios",
    creatorId: "creator1",
    submitted: "2025-01-15",
    status: "pending",
    slug: "cosmic-creatures"
  },
  {
    id: "drop2",
    title: "Digital Dreams",
    creator: "Pixel Perfect",
    creatorId: "creator2",
    submitted: "2025-01-18",
    status: "approved",
    slug: "digital-dreams"
  },
  {
    id: "drop3",
    title: "Neon Nightmares",
    creator: "Glow Labs",
    creatorId: "creator3",
    submitted: "2025-01-20",
    status: "pending",
    slug: "neon-nightmares"
  },
  {
    id: "drop4",
    title: "Abstract Algorithms",
    creator: "Code Artists",
    creatorId: "creator4",
    submitted: "2025-01-22",
    status: "rejected",
    slug: "abstract-algorithms"
  },
];

const DropApprovalQueue = () => {
  const [drops, setDrops] = useState(mockDrops);

  const handleStatusChange = (dropId: string, isApproved: boolean) => {
    // In a real app, this would call an API endpoint to update the drop status
    setDrops(drops.map(drop => {
      if (drop.id === dropId) {
        return {
          ...drop,
          status: isApproved ? "approved" : "pending"
        };
      }
      return drop;
    }));

    toast({
      title: isApproved ? "Drop Approved" : "Drop Unpublished",
      description: `The drop has been ${isApproved ? "approved and published" : "unpublished"}`,
    });
  };

  const handleAction = (dropId: string, action: 'approve' | 'reject') => {
    // In a real app, this would call an API endpoint to update the drop status
    setDrops(drops.map(drop => {
      if (drop.id === dropId) {
        return {
          ...drop,
          status: action === 'approve' ? "approved" : "rejected"
        };
      }
      return drop;
    }));

    toast({
      title: action === 'approve' ? "Drop Approved" : "Drop Rejected",
      description: `The drop has been ${action === 'approve' ? "approved" : "rejected"}`,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Drop Approval Queue</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drop Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drops.map((drop) => (
              <TableRow key={drop.id}>
                <TableCell className="font-medium">{drop.title}</TableCell>
                <TableCell>
                  <Link 
                    to={`/creator/${drop.creatorId}`}
                    className="text-aura-purple hover:underline"
                  >
                    {drop.creator}
                  </Link>
                </TableCell>
                <TableCell>{drop.submitted}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      drop.status === "approved" 
                        ? "default" 
                        : drop.status === "rejected" 
                          ? "destructive" 
                          : "outline"
                    }
                  >
                    {drop.status.charAt(0).toUpperCase() + drop.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={drop.status === "approved"}
                    onCheckedChange={(checked) => handleStatusChange(drop.id, checked)}
                    disabled={drop.status === "rejected"}
                  />
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/drop/${drop.slug}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  {drop.status === "pending" && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleAction(drop.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleAction(drop.id, 'reject')}
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
    </div>
  );
};

export default DropApprovalQueue;


import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { mockNFTDrops, NFTDrop } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

const MyDrops = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dropToDelete, setDropToDelete] = useState<NFTDrop | null>(null);
  
  // Mock data (in a real app, this would filter by the creator's ID)
  const creatorDrops = mockNFTDrops.filter(drop => 
    drop.creator.name === "Creator" || drop.creator.id === "creator1"
  );
  
  // Filter by search term
  const filteredDrops = creatorDrops.filter(drop =>
    drop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteClick = (drop: NFTDrop) => {
    setDropToDelete(drop);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dropToDelete) {
      // In a real app, this would send a delete request to Supabase
      
      toast({
        title: "Drop Deleted",
        description: `"${dropToDelete.title}" has been deleted.`,
      });
      
      setDeleteDialogOpen(false);
      setDropToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Drops</h1>
          <p className="text-gray-500">Manage your NFT collections</p>
        </div>
        
        <Button 
          asChild
          className="bg-aura-purple hover:bg-aura-purple-dark text-white"
        >
          <Link to="/dashboard/create">
            <Plus className="h-4 w-4 mr-2" />
            New Drop
          </Link>
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search drops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {filteredDrops.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p className="mb-4">No drops found</p>
            <Button asChild>
              <Link to="/dashboard/create">Create your first drop</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrops.map((drop) => (
            <Card key={drop.id}>
              <CardHeader className="p-0">
                <div className="relative h-40">
                  <img
                    src={drop.bannerImage}
                    alt={drop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className={`${getStatusColor(drop.status)} border-none`}>
                      {drop.status.charAt(0).toUpperCase() + drop.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl mb-1">{drop.title}</CardTitle>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{drop.minted} / {drop.supply} minted</span>
                  <span>{drop.price} {drop.currency}</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-aura-purple h-1.5 rounded-full"
                      style={{ width: `${(drop.minted / drop.supply) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="ghost" asChild>
                  <Link to={`/drop/${drop.slug}`}>View Details</Link>
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(drop)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Drop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{dropToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDrops;


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
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Ban, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for drops
const mockDrops = [
  {
    id: "drop1",
    title: "Cosmic Creatures",
    creator: "Creator Studios",
    creatorId: "creator1",
    status: "active",
    suspended: false
  },
  {
    id: "drop2",
    title: "Digital Dreams",
    creator: "Pixel Perfect",
    creatorId: "creator2",
    status: "active",
    suspended: false
  },
  {
    id: "drop3",
    title: "Neon Nightmares",
    creator: "Glow Labs",
    creatorId: "creator3",
    status: "ended",
    suspended: false
  },
];

// Mock data for users
const mockUsers = [
  {
    id: "user1",
    username: "cryptoartist",
    name: "Alex Turner",
    email: "alex@example.com",
    flagged: false
  },
  {
    id: "user2",
    username: "nftcreator",
    name: "Taylor Smith",
    email: "taylor@example.com",
    flagged: false
  },
  {
    id: "user3",
    username: "digitaldesigner",
    name: "Jordan Lee",
    email: "jordan@example.com",
    flagged: true
  },
];

const ControlTools = () => {
  const [drops, setDrops] = useState(mockDrops);
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSuspendDrop = (dropId: string, suspended: boolean) => {
    // In a real app, this would call an API endpoint to suspend or unsuspend a drop
    setDrops(drops.map(drop => {
      if (drop.id === dropId) {
        return {
          ...drop,
          suspended
        };
      }
      return drop;
    }));

    toast({
      title: suspended ? "Drop Suspended" : "Drop Unsuspended",
      description: `The drop has been ${suspended ? "suspended" : "unsuspended"} successfully.`,
    });
  };

  const handleFlagUser = (userId: string, flagged: boolean) => {
    // In a real app, this would call an API endpoint to flag or unflag a user
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          flagged
        };
      }
      return user;
    }));

    toast({
      title: flagged ? "User Flagged" : "User Unflagged",
      description: `The user has been ${flagged ? "flagged" : "unflagged"} successfully.`,
    });
  };

  const filteredDrops = searchQuery 
    ? drops.filter(drop => 
        drop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drop.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : drops;

  const filteredUsers = searchQuery
    ? users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Control Tools</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manual Administration Controls</CardTitle>
          <CardDescription>
            These tools let you manually control drops and users on the platform. 
            Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search drops or users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>

          <Tabs defaultValue="drops">
            <TabsList>
              <TabsTrigger value="drops">Manage Drops</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="drops">
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drop Title</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Suspended</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrops.map((drop) => (
                      <TableRow key={drop.id}>
                        <TableCell className="font-medium">{drop.title}</TableCell>
                        <TableCell>{drop.creator}</TableCell>
                        <TableCell>
                          <span className="capitalize">{drop.status}</span>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={drop.suspended}
                            onCheckedChange={(checked) => handleSuspendDrop(drop.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={drop.suspended ? "outline" : "destructive"} 
                            size="sm"
                            onClick={() => handleSuspendDrop(drop.id, !drop.suspended)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            {drop.suspended ? "Unsuspend" : "Suspend"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Flagged</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>@{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Switch
                            checked={user.flagged}
                            onCheckedChange={(checked) => handleFlagUser(user.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={user.flagged ? "outline" : "destructive"} 
                            size="sm"
                            onClick={() => handleFlagUser(user.id, !user.flagged)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            {user.flagged ? "Unflag" : "Flag"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlTools;

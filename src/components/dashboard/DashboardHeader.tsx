
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };
  
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">StudySmart Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personalized learning experience</p>
        </div>
        
        <Card className="glass-card w-full md:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src="" alt={user?.email || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.info("Profile editing coming soon!")}>
                    <User className="mr-1 h-3 w-3" /> Profile
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSignOut}>
                    <LogOut className="mr-1 h-3 w-3" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </header>
  );
};

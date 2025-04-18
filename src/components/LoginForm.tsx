
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn, signUp, user } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const email = (form.querySelector("#" + (activeTab === "login" ? "email" : "signup-email")) as HTMLInputElement).value;
    const password = (form.querySelector("#" + (activeTab === "login" ? "password" : "signup-password")) as HTMLInputElement).value;
    
    try {
      if (activeTab === "login") {
        await signIn(email, password);
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        await signUp(email, password);
        toast.success("Successfully signed up! You can now log in.");
        setActiveTab("login");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[450px] p-1 relative z-10">
      <motion.div 
        className="w-full glass-card rounded-xl p-8 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="login"
              className="text-lg font-medium data-[state=active]:bg-evalio-purple/20 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="text-lg font-medium data-[state=active]:bg-evalio-purple/20 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-6 mt-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  required 
                  className="bg-white/5 border-white/10 h-12 text-base input-glow focus-visible:ring-evalio-purple focus-visible:ring-opacity-30 focus-visible:border-evalio-purple transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                  <a href="#" className="text-sm text-evalio-purple hover:text-evalio-purple-vivid transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="bg-white/5 border-white/10 h-12 text-base input-glow focus-visible:ring-evalio-purple focus-visible:ring-opacity-30 focus-visible:border-evalio-purple transition-all duration-300"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 text-base font-semibold bg-gradient-purple-blue hover:opacity-90 transition-all btn-glow"
              >
                {isLoading ? 
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div> : 
                  "Login"
                }
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-6 mt-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground/80 font-medium">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  required 
                  className="bg-white/5 border-white/10 h-12 text-base input-glow focus-visible:ring-evalio-purple focus-visible:ring-opacity-30 focus-visible:border-evalio-purple transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground/80 font-medium">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="bg-white/5 border-white/10 h-12 text-base input-glow focus-visible:ring-evalio-purple focus-visible:ring-opacity-30 focus-visible:border-evalio-purple transition-all duration-300"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 text-base font-semibold bg-gradient-purple-blue hover:opacity-90 transition-all btn-glow"
              >
                {isLoading ? 
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div> : 
                  "Sign Up"
                }
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default LoginForm;

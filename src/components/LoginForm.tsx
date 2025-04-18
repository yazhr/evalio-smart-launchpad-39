
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
                <Label htmlFor="signup-name" className="text-foreground/80 font-medium">Full Name</Label>
                <Input 
                  id="signup-name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  className="bg-white/5 border-white/10 h-12 text-base input-glow focus-visible:ring-evalio-purple focus-visible:ring-opacity-30 focus-visible:border-evalio-purple transition-all duration-300"
                />
              </div>
              
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

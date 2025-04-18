
import React, { useEffect } from "react";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Particles from "@/components/Particles";
import FloatingElements from "@/components/FloatingElements";

const Index = () => {
  useEffect(() => {
    // Add fade-in animation to the page
    document.body.classList.add("bg-evalio-dark");
    
    const targets = document.querySelectorAll(".animate-fade-in-up");
    targets.forEach((target, index) => {
      (target as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Background elements */}
      <Particles />
      <FloatingElements />

      {/* Header */}
      <header className="w-full py-6 z-10 relative">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <a 
                    href="#" 
                    className="text-foreground/80 hover:text-evalio-purple transition-all duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-foreground/80 hover:text-evalio-purple transition-all duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-foreground/80 hover:text-evalio-purple transition-all duration-300"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            <div className="w-full lg:w-1/2 animate-fade-in-up">
              <Hero />
            </div>
            <div className="w-full lg:w-1/2 flex justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

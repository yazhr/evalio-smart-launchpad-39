
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto relative z-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between px-4">
        <p className="text-sm text-foreground/70">
          © {new Date().getFullYear()} Evalio.AI. All rights reserved.
        </p>
        <div className="flex items-center gap-6 mt-2 sm:mt-0">
          <a 
            href="#" 
            className="text-sm text-foreground/70 hover:text-evalio-purple transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-foreground/70 hover:text-evalio-purple transition-colors duration-300"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            className="text-sm text-foreground/70 hover:text-evalio-purple transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

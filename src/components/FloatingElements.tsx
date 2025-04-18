
import React from "react";

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Floating geometric shapes */}
      <div 
        className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full bg-evalio-purple/5 blur-3xl animate-float"
        style={{ animationDelay: '0s' }}
      ></div>
      
      <div 
        className="absolute bottom-[20%] left-[15%] w-72 h-72 rounded-full bg-evalio-blue-bright/5 blur-3xl animate-float"
        style={{ animationDelay: '1s' }}
      ></div>
      
      <div 
        className="absolute top-[40%] left-[5%] w-48 h-48 rounded-full bg-evalio-purple-vivid/5 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      ></div>
      
      <div 
        className="absolute top-[10%] left-[30%] w-56 h-56 rounded-full bg-evalio-blue-sky/5 blur-3xl animate-float"
        style={{ animationDelay: '3s' }}
      ></div>
      
      {/* Geometric elements */}
      <div className="absolute top-[10%] right-[20%] opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="40" stroke="#9B87F5" strokeWidth="1" />
          <circle cx="60" cy="60" r="50" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>
      
      <div className="absolute bottom-[20%] right-[10%] opacity-20 animate-float" style={{ animationDelay: '2.5s' }}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="30" width="100" height="100" stroke="#33C3F0" strokeWidth="1" />
          <rect x="50" y="50" width="60" height="60" stroke="#1EAEDB" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>
      
      <div className="absolute top-[40%] left-[20%] opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="70,20 110,50 110,90 70,120 30,90 30,50" stroke="#9B87F5" strokeWidth="1" fill="none" />
          <polygon points="70,40 95,55 95,85 70,100 45,85 45,55" stroke="#7E69AB" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
        </svg>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-evalio-purple/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-evalio-blue-sky/20 to-transparent"></div>
    </div>
  );
};

export default FloatingElements;

import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative mx-auto">
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm">
            <div className="flex justify-between items-center px-6 py-3 text-white text-sm font-medium">
              <div className="flex items-center space-x-1">
                <span>{currentTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal size={16} />
                <Wifi size={16} />
                <Battery size={16} />
                <span>100%</span>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="h-full w-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default MobileFrame;

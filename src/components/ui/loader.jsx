import React from "react";

export const LoaderOne = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0D0D12] text-white transition-opacity duration-1000" id="global-loader">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-[3px] border-accent animate-spin" style={{ animationDuration: '1s' }}></div>
          <div className="absolute inset-2 rounded-full border-r-[2px] border-white/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 rounded-full border-b-[2px] border-white animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        <div className="font-mono text-xs tracking-[0.4em] uppercase opacity-70 animate-pulse">Initializing System</div>
      </div>
    </div>
  );
};

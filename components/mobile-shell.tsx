"use client"

import { ReactNode } from "react"

interface MobileShellProps {
  children: ReactNode
  hideBottomNav?: boolean
}

export function MobileShell({ children, hideBottomNav = false }: MobileShellProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-black/10">
        {/* Inner bezel */}
        <div className="absolute inset-[3px] bg-white rounded-[2.75rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-3xl z-50" />
          
          {/* Screen content */}
          <div className="relative w-full h-full overflow-hidden">
            {children}
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/80 rounded-full z-50" />
      </div>
    </div>
  )
}

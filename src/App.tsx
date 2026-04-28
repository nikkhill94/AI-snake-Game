/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans">
      <div className="noise-bg" />
      <div className="crt-overlay" />
      
      {/* Glitched Background Decor */}
      <div className="absolute top-[10%] left-[5%] w-[800px] h-[20px] bg-cyan-500/30 blur-[2px] transform -rotate-12 pointer-events-none screen-tear" />
      <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[40px] bg-fuchsia-500/20 blur-[5px] transform rotate-6 pointer-events-none" />
      
      <div className="z-20 text-center mb-8 w-full screen-tear">
        <h1 
          className="text-4xl md:text-5xl font-mono text-white tracking-widest uppercase glitch-text"
          data-text="SYS.SNAKE_PROTOCOL"
        >
          SYS.SNAKE_PROTOCOL
        </h1>
        <p className="text-cyan-400 font-mono text-sm mt-4 uppercase tracking-[0.3em] font-bold">
          [ UNREGISTERED ENTITY DETECTED ] // AWAITING INPUT
        </p>
      </div>

      <div className="flex flex-col xl:flex-row items-center xl:items-start gap-12 z-20 w-full max-w-6xl justify-center">
        {/* Game Container */}
        <div className="flex justify-center w-full xl:w-auto mt-4">
          <SnakeGame />
        </div>

        {/* Sidebar / Player */}
        <div className="w-full xl:w-96 flex flex-col items-center gap-8 xl:mt-0">
          <MusicPlayer />
          
          <div className="w-full max-w-sm bg-black border-[3px] border-cyan-500/80 p-6 relative overflow-hidden screen-tear group">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-fuchsia-500 mt-2 opacity-50"></div>
             <h3 className="text-lg font-mono text-fuchsia-500 mb-4 font-black uppercase tracking-widest border-b-2 border-cyan-500/30 pb-2">
               DIAGNOSTICS
             </h3>
             <ul className="text-sm font-mono text-gray-300 space-y-4">
               <li className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800">
                 <span>LINK_STATE</span>
                 <span className="text-cyan-400 font-bold drop-shadow-[0_0_5px_cyan]">VULNERABLE</span>
               </li>
               <li className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800">
                 <span>AURAL_FEED</span>
                 <span className="text-white bg-fuchsia-600 px-2 animate-pulse uppercase text-xs">OVERRIDE</span>
               </li>
               <li className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800">
                 <span>SYS_INTEGRITY</span>
                 <span className="text-red-500 font-black tracking-widest text-xs">FAILING</span>
               </li>
             </ul>
             <div className="absolute bottom-2 right-2 flex gap-1">
                <div className="w-2 h-4 bg-cyan-500 animate-bounce"></div>
                <div className="w-2 h-4 bg-fuchsia-500 animate-pulse"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

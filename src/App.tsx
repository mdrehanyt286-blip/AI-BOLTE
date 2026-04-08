/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import HomePage from './components/HomePage';

export default function App() {
  const [view, setView] = useState<'home' | 'chat'>('home');

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Visual Effects */}
      <div className="scanline" />
      <div className="crt-overlay" />
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Main Content */}
      <main className="relative z-10">
        {view === 'home' ? (
          <HomePage onStart={() => setView('chat')} />
        ) : (
          <ChatInterface onBack={() => setView('home')} />
        )}
      </main>
    </div>
  );
}


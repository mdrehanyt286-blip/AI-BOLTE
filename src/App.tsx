/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Visual Effects */}
      <div className="scanline" />
      <div className="crt-overlay" />
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Main Content */}
      <main className="relative z-10">
        <ChatInterface />
      </main>
    </div>
  );
}


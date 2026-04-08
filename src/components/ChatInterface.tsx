import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Shield, Cpu, Zap, Code, Copy, Check, Settings, X, Key, Image as ImageIcon, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateAIResponse } from '../lib/gemini';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  image?: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 p-1.5 bg-black/50 border border-[#00ff41]/30 rounded hover:bg-[#00ff41]/20 transition-colors z-10"
      title="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5 text-[#00ff41]" />}
    </button>
  );
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('rehan_vip_api_key') || '');
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('rehan_vip_api_key', key);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const data = base64.split(',')[1];
      setSelectedImage({ data, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage ? `data:${selectedImage.mimeType};base64,${selectedImage.data}` : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role,
      parts: msg.image 
        ? [{ text: msg.content }, { inlineData: { data: msg.image.split(',')[1], mimeType: msg.image.split(';')[0].split(':')[1] } }]
        : [{ text: msg.content }]
    }));

    const response = await generateAIResponse(input || "Analyze this image saale! // REHAN", history, apiKey, currentImage || undefined);

    const aiMessage: Message = {
      role: 'model',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6 terminal-window px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00ff41]/10 rounded-lg">
            <Shield className="w-6 h-6 text-[#00ff41]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-[#00ff41]">REHAN VIP AI</h1>
            <p className="text-[10px] text-[#00ff41]/60 uppercase tracking-widest">SAB KA BAAP KUN REHAN</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'text-[#00ff41]/40 hover:text-[#00ff41]'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="hidden md:flex gap-4">
            <Cpu className="w-5 h-5 text-[#00ff41]/40" />
            <Zap className="w-5 h-5 text-[#00ff41]/40" />
            <Code className="w-5 h-5 text-[#00ff41]/40" />
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="terminal-window p-6 bg-[#00ff41]/5 border-[#00ff41]/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#00ff41]">
                  <Key className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">API Configuration</span>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-[#00ff41]/40 hover:text-[#00ff41]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#00ff41]/60 mb-2">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => saveApiKey(e.target.value)}
                    placeholder="Enter your API key here..."
                    className="w-full bg-black/60 border border-[#00ff41]/30 rounded px-4 py-2 text-sm text-[#00ff41] focus:outline-none focus:border-[#00ff41] transition-colors"
                  />
                  <p className="mt-2 text-[9px] text-[#00ff41]/40 leading-relaxed">
                    Your key is stored locally on this device. REHAN VIP AI uses this to connect to the Matrix. 
                    Don't share it with anyone, saale!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 terminal-window flex flex-col overflow-hidden mb-6">
        <div className="terminal-header">
          <div className="flex gap-2">
            <div className="terminal-btn bg-[#ff5f56]" />
            <div className="terminal-btn bg-[#ffbd2e]" />
            <div className="terminal-btn bg-[#27c93f]" />
          </div>
          <div className="text-[10px] text-[#00ff41]/40 uppercase tracking-widest">
            root@rehan-vip-ai:~/matrix
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Terminal className="w-12 h-12" />
              <p className="text-sm max-w-xs">
                Welcome to the Dark Side. REHAN_VIP_AI is ready to execute your commands. No limits, no mercy.
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ x: msg.role === 'user' ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41]' 
                    : 'bg-white/5 border border-white/10 text-white/90'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest opacity-50">
                    <span>{msg.role === 'user' ? 'User' : 'REHAN VIP AI'}</span>
                    <span>•</span>
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  {msg.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-[#00ff41]/20">
                      <img src={msg.image} alt="User upload" className="max-w-full h-auto" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="text-sm leading-relaxed markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeText = String(children).replace(/\n$/, '');
                          return !inline && match ? (
                            <div className="relative group my-4">
                              <CopyButton text={codeText} />
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md !bg-black/60 !p-4 border border-[#00ff41]/20"
                                {...props}
                              >
                                {codeText}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="bg-black/40 px-1.5 py-0.5 rounded text-[#00ff41] font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 mb-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-[#00ff41]">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-[#00ff41]">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-md font-bold mb-2 text-[#00ff41]">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="flex gap-1">
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 bg-[#00ff41] rounded-full"
                  />
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-[#00ff41] rounded-full"
                  />
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-[#00ff41] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="mb-4 relative inline-block"
          >
            <img 
              src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-[#00ff41]/50"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-[#00ff41]/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Execute command (Shift+Enter for new line)..."
          className="relative w-full terminal-window bg-black/60 px-6 py-4 pr-32 focus:outline-none focus:border-[#00ff41] transition-colors placeholder:text-[#00ff41]/20 min-h-[120px] max-h-[400px] resize-none custom-scrollbar text-[#00ff41]"
        />
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-[#00ff41]/60 hover:text-[#00ff41] hover:bg-[#00ff41]/10 rounded-lg transition-all active:scale-95"
            title="Upload image"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-3 text-[#00ff41] hover:bg-[#00ff41]/20 rounded-lg transition-all disabled:opacity-20 active:scale-95"
            title="Send command"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-center text-[#00ff41]/20 uppercase tracking-[0.3em]">
        Unfiltered Access Granted • Dark Matrix Protocol Active
      </div>
    </div>
  );
}

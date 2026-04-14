'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { copilotChatFlow } from '@/ai/flows/copilotChatFlow';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts: Record<string, string[]> = {
  '/dashboard': ["Why is my Gravity Score low?", "Show me my top risks", "What's the best local opportunity?"],
  '/skills': ["What should I learn next?", "Which skills are decaying in value?", "How is my skill momentum calculated?"],
  '/career-routes': ["Which path is safest for me?", "How can I reach 'Bold' path salary faster?", "What skills am I missing for senior roles?"],
  '/migration': ["Is London better than NYC for my role?", "Explain the cost of living gap", "Top companies in San Francisco?"],
  default: ["How can I improve my profile?", "What are the trending skills today?", "Recommend a learning path"]
};

export const CopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompts = suggestedPrompts[pathname] || suggestedPrompts.default;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { stream } = await copilotChatFlow({
        messages: [...messages, userMessage],
        pageContext: pathname
      });

      let fullResponse = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: fullResponse }];
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[380px] sm:w-[420px]"
          >
            <Card className="border-purple-500/20 shadow-2xl backdrop-blur-xl bg-background/95">
              <CardHeader className="bg-purple-600 dark:bg-purple-900 text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  SkillMapper Copilot
                </CardTitle>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                  {messages.length === 0 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Hello! I'm your AI career assistant. How can I help you on this page?</p>
                      <div className="flex flex-wrap gap-2">
                        {prompts.map((p) => (
                          <Button key={p} variant="outline" size="sm" className="text-xs border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950" onClick={() => handleSend(p)}>
                            {p}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-muted border border-border'}`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && !messages[messages.length-1]?.content && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl animate-pulse">
                          Thinking...
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                  <Input 
                    placeholder="Ask anything..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    disabled={isLoading}
                    className="focus-visible:ring-purple-500"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    </div>
  );
};

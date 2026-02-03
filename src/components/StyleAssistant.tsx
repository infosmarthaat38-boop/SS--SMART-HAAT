
'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStyleAdvice, type StyleAssistantOutput } from '@/ai/flows/style-assistant-flow';

export function StyleAssistant() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<StyleAssistantOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const advice = await getStyleAdvice({ userQuery: query });
      setResult(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-background/50 backdrop-blur-md">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h4 className="font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> HAAT STYLIST AI
        </h4>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Premium Access</span>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {!result && !loading && (
          <p className="text-muted-foreground text-center mt-12 italic font-light">
            "Ask me anything about your fashion journey..."
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center mt-12 gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-xs uppercase tracking-widest text-primary animate-pulse">Curating your style...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up space-y-4">
            <div className="p-4 bg-primary/5 border-l-2 border-primary">
              <p className="text-sm leading-relaxed">{result.advice}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.suggestedColors.map((color, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded-none border border-white/10 uppercase tracking-tighter">
                  {color}
                </span>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Vibe: {result.vibe}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Summer party-te ki porbo?" 
          className="bg-transparent border-white/10 focus:ring-primary h-12 rounded-none"
        />
        <Button disabled={loading} size="icon" className="h-12 w-12 rounded-none bg-primary hover:bg-primary/90">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

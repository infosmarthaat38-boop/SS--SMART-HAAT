
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Terminal, 
  Info, 
  BookOpen,
  Github,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSettings() {
  const CodeBlock = ({ title, commands, explanation }: { title: string, commands: string[], explanation: string }) => (
    <div className="space-y-6 mb-12 group p-6 border border-white/5 bg-white/[0.01]">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-5 w-1.5 bg-orange-600" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <BookOpen className="h-4 w-4 text-orange-600 shrink-0 mt-1" />
          <p className="text-[11px] text-white/70 uppercase leading-relaxed font-bold">
            {explanation}
          </p>
        </div>
      </div>

      <div className="bg-black/90 border border-white/10 p-6 font-mono text-[11px] text-green-400 space-y-3 relative overflow-hidden group-hover:border-orange-600/30 transition-all shadow-inner">
        <div className="absolute top-0 right-0 p-2 bg-white/5 text-[8px] font-black text-white/20 uppercase tracking-widest">COMMAND TERMINAL</div>
        {commands.map((cmd, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-orange-600 select-none">$</span>
            <span className="break-all">{cmd}</span>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-muted-foreground italic uppercase">
        * উপরের কোডগুলো আপনার প্রজেক্ট ফোল্ডারে টার্মিনাল ওপেন করে একে একে পেস্ট করুন।
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Publishing Operations</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">PUBLISH GUIDE</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-orange-600/10 border-b border-orange-600/20 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                <Terminal className="h-4 w-4" /> ওয়েবসাইট পাবলিশিং পূর্ণাঙ্গ নির্দেশিকা
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              
              <div className="bg-orange-600/5 border border-orange-600/20 p-6 mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-orange-600" />
                  <p className="text-[12px] font-black text-white uppercase tracking-widest">কিভাবে টার্মিনাল ব্যবহার করবেন?</p>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed uppercase font-bold">
                  আপনার পিসির প্রজেক্ট ফোল্ডারের ভেতরে গিয়ে মাউসের রাইট ক্লিক করে "Open in Terminal" বা "Open Command Prompt" এ ক্লিক করুন। এরপর নিচের প্রতিটি ধাপের কমান্ডগুলো কপি করে সেখানে পেস্ট করে এন্টার দিন। প্রতিটি কমান্ড আপনার সাইটকে ইন্টারনেটে লাইভ করার এক একটি ধাপ।
                </p>
              </div>

              {/* GITHUB DETAILED */}
              <CodeBlock 
                title="১. গিটহাবে কোড জমা রাখা (GITHUB VERSION CONTROL)"
                explanation="গিটহাব হলো আপনার ওয়েবসাইটের কোডগুলো নিরাপদে অনলাইনে রাখার একটি জায়গা। এটি করা বাধ্যতামূলক কারণ পরবর্তীতে ভার্সেল বা নেটলিফাই এই গিটহাব থেকেই আপনার কোডগুলো নিয়ে ওয়েবসাইট তৈরি করবে। প্রথমে গিটহাবে একটি নতুন রিপোজিটরি (Repository) তৈরি করুন এবং নিচের কমান্ডগুলো একে একে আপনার টার্মিনালে পেস্ট করুন।"
                commands={[
                  'git init',
                  'git add .',
                  'git commit -m "Initial Build"',
                  'git branch -M main',
                  'git remote add origin [YOUR_GITHUB_REPO_URL]',
                  'git push -u origin main'
                ]}
              />

              {/* VERCEL DETAILED */}
              <CodeBlock 
                title="২. ভার্সেলে সরাসরি পাবলিশ (VERCEL DEPLOYMENT)"
                explanation="ভার্সেল হলো নেক্সট-জেএস সাইটের জন্য সবথেকে দ্রুত এবং সহজ মাধ্যম। এটি সরাসরি আপনার গিটহাব একাউন্টের সাথে কানেক্ট হয়ে সাইট লাইভ করে দেয়। আপনি চাইলে আপনার টার্মিনাল থেকেই সরাসরি নিচের কোডগুলো দিয়ে ভার্সেলের সার্ভারে আপনার সাইটটি আপলোড করতে পারেন। এটি আপনার সাইটের জন্য একটি ফ্রী ডোমেইনও তৈরি করে দিবে।"
                commands={[
                  'npm install -g vercel',
                  'vercel login',
                  'vercel --prod'
                ]}
              />

              {/* NETLIFY DETAILED */}
              <CodeBlock 
                title="৩. নেটলিফায়ে হোস্টিং (NETLIFY HOSTING)"
                explanation="নেটলিফাই ব্যবহার করে সাইট পাবলিশ করতে চাইলে আপনাকে প্রথমে প্রজেক্টের একটি 'বিল্ড' ভার্সন তৈরি করতে হবে। বিল্ড মানে হলো আপনার কোডগুলোকে ব্রাউজারের জন্য পড়ার উপযোগী করা। নিচের কমান্ডগুলো দিয়ে আপনি খুব সহজেই আপনার সাইটটি নেটলিফায়ের প্রিমিয়াম সার্ভারে লাইভ করতে পারবেন।"
                commands={[
                  'npm install netlify-cli -g',
                  'netlify login',
                  'npm run build',
                  'netlify deploy --prod'
                ]}
              />

              {/* FIREBASE DETAILED */}
              <CodeBlock 
                title="৪. ফায়ারবেস হোস্টিং (FIREBASE CLI DEPLOY)"
                explanation="ফায়ারবেস হলো গুগল-এর একটি শক্তিশালী প্ল্যাটফর্ম। আপনার ডাটাবেস যেহেতু ফায়ারবেসে, তাই হোস্টিং এখানে করলে সাইট অনেক বেশি ফাস্ট কাজ করবে। ফায়ারবেস টুলস আপনার পিসিতে না থাকলে প্রথমে সেটি ইন্সটল করতে হবে। এরপর 'init' কমান্ড দিয়ে আপনার প্রজেক্টটি সিলেক্ট করে 'deploy' কমান্ড দিলেই আপনার ওয়েবসাইট ফায়ারবেসের ডোমেইনে লাইভ হয়ে যাবে।"
                commands={[
                  'npm install -g firebase-tools',
                  'firebase login',
                  'firebase init',
                  'npm run build',
                  'firebase deploy'
                ]}
              />

              <div className="pt-8 border-t border-white/5 mt-10">
                 <div className="flex flex-col md:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-14">
                    <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4 text-orange-600" /> CREATE NEW REPO</a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-14">
                    <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer"><Zap className="mr-2 h-4 w-4 text-orange-600" /> VERCEL DASHBOARD</a>
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

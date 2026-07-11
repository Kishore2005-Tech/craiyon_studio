import React, { useState, useEffect } from "react";
import ContentForm from "./components/ContentForm";
import ContentPreview from "./components/ContentPreview";
import HistoryList from "./components/HistoryList";
import { ContentType, ContentTone, ContentLength, Generation } from "./types";
import {
  Sparkles,
  PenTool,
  History,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default function App() {
  // Input Workspace States
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("LinkedIn Post");
  const [tone, setTone] = useState<ContentTone>("Professional");
  const [length, setLength] = useState<ContentLength>("Medium");

  // Output States
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Loading indicator helper message
  const [loadingStep, setLoadingStep] = useState(0);

  // History States
  const [history, setHistory] = useState<Generation[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("creo_generation_history");
      if (cached) {
        setHistory(JSON.parse(cached));
      }
    } catch (err) {
      console.error("Failed to load history from cache:", err);
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (newHistory: Generation[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("creo_generation_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to save history to cache:", err);
    }
  };

  // Staggered loading messages to reassure the user
  useEffect(() => {
    let interval: any = null;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const loadingMessages = [
    "Analyzing topic & platform specifications...",
    "Drafting dynamic content framework...",
    "Matching requested tone constraints...",
    "Polishing ready-to-publish layouts...",
  ];

  // Core API trigger handler
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          contentType,
          tone,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected issue occurred while drafting.");
      }

      const copyResult = data.content;
      setGeneratedContent(copyResult);

      // Save to history list
      const newGen: Generation = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11),
        timestamp: new Date().toISOString(),
        topic: topic.trim(),
        contentType,
        tone,
        length,
        content: copyResult,
      };

      saveHistory([newGen, ...history]);
    } catch (err: any) {
      console.error("Generation failed:", err);
      setErrorMessage(
        err.message || "Failed to reach Creo generation servers. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // History callback events
  const handleSelectHistory = (gen: Generation) => {
    setTopic(gen.topic);
    setContentType(gen.contentType);
    setTone(gen.tone);
    setLength(gen.length);
    setGeneratedContent(gen.content);
    setErrorMessage(null);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((g) => g.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your generation history? This action cannot be undone.")) {
      saveHistory([]);
    }
  };

  const handleInlineContentChange = (val: string) => {
    setGeneratedContent(val);
  };

  return (
    <div id="creo-app" className="min-h-screen bg-dark-bg text-dark-text-primary flex flex-col font-sans selection:bg-gold-200 selection:text-black">
      {/* Visual top premium gold micro-accent line */}
      <div className="h-0.5 w-full bg-gold-500" />

      {/* Sophisticated Top Nav */}
      <header className="bg-dark-bg border-b border-dark-border py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black font-extrabold shadow-md relative overflow-hidden group">
              <span className="text-sm tracking-tight font-mono">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-widest text-white flex items-center gap-2 font-sans uppercase">
                Creo
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
              </span>
              <span className="text-[10px] text-dark-text-secondary tracking-wider uppercase font-semibold">
                Creative Copy Platform
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-[10px] text-dark-text-secondary uppercase tracking-wider font-semibold">
            <div className="flex items-center gap-1.5 bg-dark-sidebar px-3 py-1.5 rounded-md border border-dark-border">
              <Layers className="w-3.5 h-3.5 text-gold-500" />
              <span>Engine: <strong className="text-white">Gemini 3.5</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-dark-sidebar px-3 py-1.5 rounded-md border border-dark-border">
              <TrendingUp className="w-3.5 h-3.5 text-gold-500" />
              <span>Status: <strong className="text-white">Active</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Controls Panel */}
        <div className="lg:col-span-5 space-y-6">
          <ContentForm
            topic={topic}
            setTopic={setTopic}
            contentType={contentType}
            setContentType={setContentType}
            tone={tone}
            setTone={setTone}
            length={length}
            setLength={setLength}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          <HistoryList
            generations={history}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearHistory}
          />
        </div>

        {/* Right Hand: Workspace Outputs */}
        <div className="lg:col-span-7 h-full">
          {isGenerating ? (
            /* Premium Sophisticated Dark Loading State */
            <div id="workspace-loading-card" className="bg-dark-sidebar border border-dark-border rounded-lg p-12 text-center h-full min-h-[480px] flex flex-col justify-center items-center space-y-6">
              {/* Gold Spinner & Glow */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-dark-border border-t-gold-500 animate-spin" />
                <Sparkles className="w-5 h-5 text-gold-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>

              {/* Progress Text */}
              <div className="space-y-2 max-w-md">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                  {loadingMessages[loadingStep]}
                </h3>
                <p className="text-xs text-dark-text-secondary leading-relaxed">
                  Synthesizing platform specifications. Formulating headings, copy tags, and structural metadata under strict design parameters.
                </p>
              </div>

              {/* Dynamic simulated skeleton */}
              <div className="w-full max-w-sm space-y-3 pt-6 opacity-20">
                <div className="h-2 bg-white rounded-full w-3/4 mx-auto animate-pulse" />
                <div className="h-2 bg-white rounded-full w-5/6 mx-auto animate-pulse" />
                <div className="h-2 bg-white rounded-full w-2/3 mx-auto animate-pulse" />
              </div>
            </div>
          ) : errorMessage ? (
            /* Dark Error Display Card */
            <div id="workspace-error-card" className="bg-dark-sidebar border border-red-950/40 rounded-lg p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-red-400">Workspace Generation Error</h3>
                <p className="text-xs text-dark-text-primary max-w-md mx-auto whitespace-pre-wrap leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <div className="bg-dark-input p-4 rounded-md border border-dark-border text-xs text-dark-text-secondary text-left max-w-md mx-auto space-y-2">
                <p className="font-semibold text-white uppercase tracking-wider text-[10px]">Troubleshooting Guide:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Verify that your API keys are set up inside the <strong className="text-gold-500">Settings &gt; Secrets</strong> drawer.</li>
                  <li>Ensure the backend server is running correctly on port 3000.</li>
                  <li>Check your connection or try simplifying your topic scope.</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="py-3 px-6 rounded-md text-xs font-bold bg-gold-500 hover:bg-gold-600 text-black uppercase tracking-wider transition active:scale-[0.98] cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          ) : generatedContent ? (
            /* Content Preview Card */
            <ContentPreview
              content={generatedContent}
              onContentChange={handleInlineContentChange}
              contentType={contentType}
              tone={tone}
              length={length}
              topic={topic}
            />
          ) : (
            /* Sophisticated Dark Empty State */
            <div id="workspace-empty-card" className="bg-dark-sidebar border border-dark-border rounded-lg p-12 text-center h-full min-h-[480px] flex flex-col justify-center items-center space-y-8">
              {/* Central creative Graphic */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-dark-input border border-dark-border flex items-center justify-center text-gold-500 shadow-md">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-[10px] font-bold text-black shadow-md animate-bounce">
                  ★
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2 max-w-md">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ready to draft platform copy
                </h2>
                <p className="text-xs text-dark-text-secondary leading-relaxed">
                  Provide your creative thesis, pick your targeted platform format and tone configurations, then invoke the engine to receive ready-to-publish copy.
                </p>
              </div>

              {/* High-quality Features row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg text-left pt-4">
                <div className="p-4 bg-dark-input rounded-md border border-dark-border space-y-1.5">
                  <span className="text-gold-500 text-[10px] font-bold uppercase tracking-wider block">01 / PLATFORM METRICS</span>
                  <p className="text-[11px] text-dark-text-secondary leading-relaxed">
                    Strictest compliance to length requirements, tagging systems, and layout aesthetics.
                  </p>
                </div>
                <div className="p-4 bg-dark-input rounded-md border border-dark-border space-y-1.5">
                  <span className="text-gold-500 text-[10px] font-bold uppercase tracking-wider block">02 / LIVE MOCKUPS</span>
                  <p className="text-[11px] text-dark-text-secondary leading-relaxed">
                    Visual interfaces showing exactly how draft posts will look on LinkedIn, X, or email platforms.
                  </p>
                </div>
                <div className="p-4 bg-dark-input rounded-md border border-dark-border space-y-1.5">
                  <span className="text-gold-500 text-[10px] font-bold uppercase tracking-wider block">03 / MEMORY LAYER</span>
                  <p className="text-[11px] text-dark-text-secondary leading-relaxed">
                    Persistent caching mechanism keeps your workspace generation history safe for editing later.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sophisticated Footer */}
      <footer className="bg-dark-bg border-t border-dark-border py-6 px-6 mt-12 text-center text-[11px] text-dark-text-secondary tracking-wider font-semibold uppercase">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Creo Content Automation Workspace · Powered by <span className="text-gold-500">Creo-Max v4</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-dark-border">|</span>
            <span>Version 1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

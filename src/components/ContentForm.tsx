import React from "react";
import {
  ContentType,
  ContentTone,
  ContentLength,
  ExampleTemplate,
} from "../types";
import {
  PenTool,
  MessageSquare,
  Sparkles,
  ChevronRight,
  BookOpen,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ShoppingBag,
  Mail,
  Zap,
} from "lucide-react";

interface ContentFormProps {
  topic: string;
  setTopic: (val: string) => void;
  contentType: ContentType;
  setContentType: (val: ContentType) => void;
  tone: ContentTone;
  setTone: (val: ContentTone) => void;
  length: ContentLength;
  setLength: (val: ContentLength) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const EXAMPLE_TEMPLATES: ExampleTemplate[] = [
  {
    title: "🚀 Creo App Launch",
    topic: "Creo is a full-stack AI content generation workspace that helps creators write platform-native copy instantly.",
    contentType: "LinkedIn Post",
    tone: "Persuasive",
    length: "Medium",
  },
  {
    title: "💡 Learning React Generics",
    topic: "Explain React and TypeScript Generics using a real-world gift box analogy to make it simple for beginners.",
    contentType: "Twitter/X Thread",
    tone: "Witty",
    length: "Medium",
  },
  {
    title: "🥗 Weekday Lunch Prep",
    topic: "Three simple time-saving hacks to prep healthy weekday lunches in under an hour without eating the same meal every day.",
    contentType: "Instagram Caption",
    tone: "Casual",
    length: "Short",
  },
  {
    title: "📬 Product Feature Update",
    topic: "A product update announcing the launch of our new instant copy drafts and collaboration workspaces.",
    contentType: "Email",
    tone: "Professional",
    length: "Medium",
  },
];

const CONTENT_TYPES: { type: ContentType; label: string; icon: any; description: string }[] = [
  { type: "Blog Post", label: "Blog Post", icon: BookOpen, description: "Structured article with headings" },
  { type: "Instagram Caption", label: "Instagram Caption", icon: Instagram, description: "Line breaks & smart hashtags" },
  { type: "LinkedIn Post", label: "LinkedIn Post", icon: Linkedin, description: "Professional, clean spacing" },
  { type: "Twitter/X Thread", label: "Twitter/X Thread", icon: Twitter, description: "Sequential under 280-char tweets" },
  { type: "YouTube Script", label: "YouTube Script", icon: Youtube, description: "[INTRO], [CONTENT], [OUTRO]" },
  { type: "Product Description", label: "Product Description", icon: ShoppingBag, description: "Features & clear CTA" },
  { type: "Email", label: "Email", icon: Mail, description: "Subject line and formatted body" },
];

const TONES: { tone: ContentTone; label: string; emoji: string }[] = [
  { tone: "Professional", label: "Professional", emoji: "💼" },
  { tone: "Casual", label: "Casual", emoji: "☕" },
  { tone: "Persuasive", label: "Persuasive", emoji: "🎯" },
  { tone: "Witty", label: "Witty", emoji: "⚡" },
  { tone: "Storytelling", label: "Storytelling", emoji: "📖" },
];

const LENGTHS: { length: ContentLength; label: string; count: string }[] = [
  { length: "Short", label: "Short", count: "~50-150 words" },
  { length: "Medium", label: "Medium", count: "~150-400 words" },
  { length: "Long", label: "Long", count: "~400-800 words" },
];

export default function ContentForm({
  topic,
  setTopic,
  contentType,
  setContentType,
  tone,
  setTone,
  length,
  setLength,
  onGenerate,
  isGenerating,
}: ContentFormProps) {
  const handleApplyTemplate = (tpl: ExampleTemplate) => {
    setTopic(tpl.topic);
    setContentType(tpl.contentType);
    setTone(tpl.tone);
    setLength(tpl.length);
  };

  return (
    <div id="content-form-card" className="bg-dark-sidebar rounded-lg border border-dark-border p-6 space-y-6">
      {/* Templates Section */}
      <div>
        <h2 className="text-[10px] font-bold text-dark-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-gold-500" />
          Quick Start Templates
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          {EXAMPLE_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              id={`template-btn-${i}`}
              onClick={() => handleApplyTemplate(tpl)}
              className="p-3 text-left text-xs bg-dark-input hover:bg-[#202020] rounded-md transition duration-150 border border-dark-border hover:border-gold-500/50 group flex flex-col justify-between"
            >
              <span className="font-semibold text-white group-hover:text-gold-500 transition">
                {tpl.title}
              </span>
              <span className="text-dark-text-secondary text-[10px] truncate w-full mt-1.5 font-mono">
                {tpl.contentType} · {tpl.tone}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-dark-border" />

      {/* Topic Textarea */}
      <div className="space-y-2">
        <label htmlFor="topic-input" className="block text-[10px] uppercase tracking-wider font-bold text-dark-text-secondary flex justify-between">
          <span>What is the topic or core message?</span>
          <span className={`font-mono text-[9px] ${topic.length > 500 ? "text-gold-500" : "text-dark-text-secondary"}`}>
            {topic.length} characters
          </span>
        </label>
        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g. A review of my favorite productivity tools, key takeaways from a book, or an invitation to our webinar..."
          className="w-full h-24 p-3.5 rounded-md border border-dark-border bg-dark-input text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-gold-500/10 focus:border-gold-500 transition placeholder-neutral-600 resize-none font-sans"
        />
      </div>

      {/* Content Type */}
      <div className="space-y-3">
        <label className="block text-[10px] uppercase tracking-wider font-bold text-dark-text-secondary">Content Type</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONTENT_TYPES.map((item) => {
            const IconComponent = item.icon;
            const isSelected = contentType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                id={`content-type-btn-${item.type.replace(/\s+/g, "-")}`}
                onClick={() => setContentType(item.type)}
                className={`flex items-start gap-3 p-3 rounded-md border text-left transition ${
                  isSelected
                    ? "border-gold-500 bg-gold-50/5 text-gold-500 ring-2 ring-gold-500/10"
                    : "border-dark-border bg-dark-input hover:bg-[#202020] text-dark-text-primary"
                }`}
              >
                <div
                  className={`p-1.5 rounded-sm ${
                    isSelected ? "bg-gold-500/10 text-gold-500" : "bg-dark-sidebar text-dark-text-secondary"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white">{item.label}</span>
                  <span className="text-[10px] text-dark-text-secondary truncate mt-0.5">{item.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tone Selection */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-dark-text-secondary">Tone</label>
          <div className="relative">
            <select
              id="tone-select"
              value={tone}
              onChange={(e) => setTone(e.target.value as ContentTone)}
              className="w-full p-3 rounded-md border border-dark-border bg-dark-input text-xs text-white appearance-none focus:outline-hidden focus:ring-2 focus:ring-gold-500/10 focus:border-gold-500 transition cursor-pointer"
            >
              {TONES.map((t) => (
                <option key={t.tone} value={t.tone} className="bg-dark-sidebar text-white">
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text-secondary">
              <ChevronRight className="w-4 h-4 transform rotate-90" />
            </div>
          </div>
        </div>

        {/* Length Selection */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-dark-text-secondary">Length</label>
          <div className="flex bg-dark-input p-1 rounded-md border border-dark-border">
            {LENGTHS.map((item) => {
              const isSelected = length === item.length;
              return (
                <button
                  key={item.length}
                  type="button"
                  id={`length-btn-${item.length}`}
                  onClick={() => setLength(item.length)}
                  className={`flex-1 text-center py-2 px-1 rounded-sm text-xs font-medium transition ${
                    isSelected
                      ? "bg-gold-500 text-black font-extrabold"
                      : "text-dark-text-secondary hover:text-white"
                  }`}
                  title={item.count}
                >
                  <div className="text-[11px]">{item.label}</div>
                  <div className={`text-[8px] font-mono mt-0.5 ${isSelected ? "text-black/70" : "text-dark-text-secondary/70"}`}>{item.count.split(" ")[0]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        id="generate-button"
        onClick={onGenerate}
        disabled={isGenerating || !topic.trim()}
        className={`w-full py-4 px-6 rounded-md font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${
          isGenerating || !topic.trim()
            ? "bg-[#222222] cursor-not-allowed text-neutral-600 border border-neutral-800"
            : "bg-gold-500 hover:bg-gold-600 text-black active:scale-[0.98] cursor-pointer"
        }`}
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Drafting Workspace...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 transition group-hover:scale-110" />
            <span>Generate Platform Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

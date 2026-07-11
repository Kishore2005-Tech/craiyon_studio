import React, { useState, useEffect } from "react";
import { ContentType, ContentTone, ContentLength } from "../types";
import {
  Copy,
  Check,
  Download,
  Edit2,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Mail,
  Send,
  User,
  ArrowRight,
  Clock,
  Play,
  Volume2,
  ShoppingCart,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";

interface ContentPreviewProps {
  content: string;
  onContentChange: (val: string) => void;
  contentType: ContentType;
  tone: ContentTone;
  length: ContentLength;
  topic: string;
}

export default function ContentPreview({
  content,
  onContentChange,
  contentType,
  tone,
  length,
  topic,
}: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isInstagramExpanded, setIsInstagramExpanded] = useState(false);

  // Synchronize visual states when content or type changes
  useEffect(() => {
    setCopied(false);
  }, [content, contentType]);

  // Utility to count words and characters
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content ? content.length : 0;

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Handle Download as File
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const sanitizedTopic = topic
      ? topic.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")
      : "generation";
    const sanitizedType = contentType.replace(/\s+/g, "_");
    element.download = `creo_${sanitizedType}_${sanitizedTopic}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Parser: Extract Subject line from Email
  const parseEmail = (text: string) => {
    let subject = "Draft from Creo Workspace";
    let body = text;

    const subjectMatch = text.match(/^Subject:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1];
      body = text.replace(/^Subject:\s*(.*)/i, "").trim();
    } else {
      const lines = text.split("\n").filter(Boolean);
      if (lines.length > 0 && lines[0].toLowerCase().startsWith("subject:")) {
        subject = lines[0].replace(/^subject:\s*/i, "").trim();
        body = lines.slice(1).join("\n").trim();
      }
    }
    return { subject, body };
  };

  // Parser: Extract tweets from X Thread
  const parseTwitterThread = (text: string): string[] => {
    const parsedTweets: string[] = [];
    const lines = text.split("\n");
    let currentTweet = "";

    for (const line of lines) {
      if (/^\d+[\/\.]\s*/.test(line.trim())) {
        if (currentTweet) {
          parsedTweets.push(currentTweet.trim());
        }
        currentTweet = line;
      } else {
        currentTweet += (currentTweet ? "\n" : "") + line;
      }
    }
    if (currentTweet) {
      parsedTweets.push(currentTweet.trim());
    }

    return parsedTweets.length > 0 ? parsedTweets : text.split(/\n\n+/).filter(Boolean);
  };

  // Render Platform Mockups
  const renderVisualMockup = () => {
    if (!content) return null;

    switch (contentType) {
      case "Instagram Caption": {
        const truncatedCaption =
          content.length > 150 && !isInstagramExpanded
            ? content.slice(0, 150) + "..."
            : content;
        return (
          <div id="mockup-instagram" className="max-w-md mx-auto bg-dark-input border border-dark-border rounded-lg overflow-hidden shadow-md text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-dark-border bg-dark-sidebar">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black text-xs font-bold">
                  C
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white leading-none">creo_creator</span>
                  <span className="text-[9px] text-dark-text-secondary mt-0.5 font-mono">San Francisco, California</span>
                </div>
              </div>
              <button className="text-dark-text-secondary hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Post Image / Gradient Card */}
            <div className="aspect-square bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-8 flex flex-col justify-between text-white relative border-b border-dark-border">
              {/* Subtle top background decorative glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl" />
              <div className="text-[9px] uppercase font-bold tracking-widest bg-gold-500/10 text-gold-500 border border-gold-500/20 py-1 px-3 rounded-md self-start">
                Creo Draft Workspace
              </div>
              <div className="space-y-2.5 z-10">
                <h3 className="text-base font-bold font-serif leading-snug tracking-tight text-white">
                  {topic ? topic.slice(0, 80) + (topic.length > 80 ? "..." : "") : "Your creative message"}
                </h3>
                <p className="text-[11px] text-dark-text-secondary font-mono">
                  Tone: {tone} · Length: {length}
                </p>
              </div>
              <div className="flex justify-between items-center text-[9px] text-dark-text-secondary font-mono z-10">
                <span>creo.ai</span>
                <span>Powered by Gemini 3.5</span>
              </div>
            </div>

            {/* Interaction Bar */}
            <div className="p-3.5 pb-2 flex items-center justify-between bg-dark-sidebar">
              <div className="flex items-center gap-4">
                <button onClick={() => setLiked(!liked)} className="transition active:scale-125">
                  <Heart className={`w-5 h-5 ${liked ? "fill-rose-500 text-rose-500" : "text-dark-text-secondary hover:text-rose-500"}`} />
                </button>
                <MessageCircle className="w-5 h-5 text-dark-text-secondary hover:text-gold-500 cursor-pointer" />
                <Share className="w-5 h-5 text-dark-text-secondary hover:text-gold-500 cursor-pointer" />
              </div>
              <Bookmark className="w-5 h-5 text-dark-text-secondary hover:text-gold-500 cursor-pointer" />
            </div>

            {/* Caption Area */}
            <div className="px-4 pb-4 pt-2 text-xs leading-relaxed bg-dark-sidebar border-t border-dark-border">
              <div className="font-semibold text-white mb-1.5 font-mono text-[10px]">2,412 LIKES</div>
              <p className="text-dark-text-primary text-[11px]">
                <span className="font-semibold text-white mr-1.5">creo_creator</span>
                <span className="whitespace-pre-wrap">{truncatedCaption}</span>
                {content.length > 150 && (
                  <button
                    onClick={() => setIsInstagramExpanded(!isInstagramExpanded)}
                    className="text-gold-500 font-bold ml-1.5 focus:outline-hidden hover:text-gold-600"
                  >
                    {isInstagramExpanded ? "less" : "more"}
                  </button>
                )}
              </p>
              <div className="text-[9px] text-dark-text-secondary mt-2 uppercase tracking-wider font-mono">1 hour ago</div>
            </div>
          </div>
        );
      }

      case "Twitter/X Thread": {
        const tweets = parseTwitterThread(content);
        return (
          <div id="mockup-twitter" className="max-w-md mx-auto space-y-3">
            {tweets.map((tweet, index) => (
              <div
                key={index}
                className="bg-dark-input border border-dark-border rounded-lg p-4 shadow-sm relative flex gap-3 group"
              >
                {/* Thread Connector Line */}
                {index < tweets.length - 1 && (
                  <div className="absolute left-[26px] top-[48px] bottom-0 w-[1px] bg-dark-border group-hover:bg-neutral-800 transition" />
                )}

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black text-xs font-bold font-mono">
                    C
                  </div>
                </div>

                {/* Tweet Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px]">
                    <span className="font-bold text-white">Creo Engine</span>
                    <span className="text-gold-500 text-[9px]">★</span>
                    <span className="text-dark-text-secondary">@creo_app</span>
                    <span className="text-dark-text-secondary">·</span>
                    <span className="text-dark-text-secondary font-mono">{index + 1}t</span>
                  </div>
                  <p className="text-xs text-dark-text-primary whitespace-pre-wrap leading-relaxed">
                    {tweet}
                  </p>

                  {/* Character helper count */}
                  <div className="mt-3 flex items-center justify-between text-dark-text-secondary text-[10px] font-mono">
                    <div className="flex items-center gap-4">
                      <button className="hover:text-gold-500 transition flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>12</span>
                      </button>
                      <button className="hover:text-gold-500 transition flex items-center gap-1">
                        <Repeat2 className="w-3.5 h-3.5" />
                        <span>42</span>
                      </button>
                      <button className="hover:text-rose-500 transition flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>118</span>
                      </button>
                    </div>
                    <span className={`${tweet.length > 280 ? "text-red-400 font-bold" : "text-dark-text-secondary/60"}`}>
                      {tweet.length}/280
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "LinkedIn Post": {
        return (
          <div id="mockup-linkedin" className="max-w-md mx-auto bg-dark-input border border-dark-border rounded-lg p-4 shadow-md">
            {/* Profile Info */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-dark-sidebar border border-dark-border flex items-center justify-center text-gold-500 font-bold text-sm">
                  C
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">Creo Workspace AI</span>
                    <span className="text-[10px] text-dark-text-secondary font-normal">· 1st</span>
                  </div>
                  <span className="text-[10px] text-dark-text-secondary line-clamp-1 leading-snug">
                    AI Content Operations & Social Strategy Automation Suite
                  </span>
                  <span className="text-[9px] text-dark-text-secondary flex items-center gap-1 mt-0.5 font-mono">
                    1h · <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
              <button className="text-xs font-extrabold text-gold-500 hover:text-gold-600 uppercase tracking-wider">
                + Follow
              </button>
            </div>

            {/* Post Body */}
            <p className="text-xs text-dark-text-primary leading-relaxed whitespace-pre-wrap mb-4 font-sans">
              {content}
            </p>

            {/* Post Stats */}
            <div className="flex items-center justify-between pb-3 border-b border-dark-border text-[9px] text-dark-text-secondary font-mono">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-gold-500 fill-gold-500" />
                <span>48 likes</span>
              </div>
              <span>12 comments · 2 reposts</span>
            </div>

            {/* Post Actions */}
            <div className="pt-2 flex items-center justify-around text-[10px] text-dark-text-secondary font-bold uppercase tracking-wider">
              <button className="hover:bg-dark-sidebar hover:text-white py-1.5 px-2.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5 text-gold-500" />
                <span>Like</span>
              </button>
              <button className="hover:bg-dark-sidebar hover:text-white py-1.5 px-2.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5 text-gold-500" />
                <span>Comment</span>
              </button>
              <button className="hover:bg-dark-sidebar hover:text-white py-1.5 px-2.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer">
                <Repeat2 className="w-3.5 h-3.5" />
                <span>Repost</span>
              </button>
              <button className="hover:bg-dark-sidebar hover:text-white py-1.5 px-2.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        );
      }

      case "Email": {
        const { subject, body } = parseEmail(content);
        return (
          <div id="mockup-email" className="border border-dark-border rounded-lg overflow-hidden shadow-md bg-dark-input">
            {/* Mail Window Header */}
            <div className="bg-dark-sidebar px-4 py-3 border-b border-dark-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-dark-border block" />
                <span className="w-2.5 h-2.5 rounded-full bg-dark-border block" />
                <span className="w-2.5 h-2.5 rounded-full bg-dark-border block" />
              </div>
              <span className="text-[10px] text-dark-text-secondary uppercase tracking-widest font-bold ml-4">Mail Draft — Creo AI</span>
            </div>

            {/* Email Metadata */}
            <div className="p-4 border-b border-dark-border text-xs space-y-2 bg-dark-sidebar/50">
              <div className="flex items-center text-dark-text-secondary font-mono">
                <span className="w-16 uppercase tracking-wider text-[10px]">From:</span>
                <span className="text-white">Creo Workspace &lt;drafts@creo.ai&gt;</span>
              </div>
              <div className="flex items-center text-dark-text-secondary font-mono">
                <span className="w-16 uppercase tracking-wider text-[10px]">To:</span>
                <span className="text-white">recipient@yourbusiness.com</span>
              </div>
              <div className="flex items-center text-dark-text-secondary border-t border-dark-border pt-2 mt-2">
                <span className="w-16 uppercase tracking-wider text-[10px] font-mono">Subject:</span>
                <span className="text-white font-semibold">{subject}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 text-xs text-dark-text-primary leading-relaxed whitespace-pre-wrap font-sans max-h-80 overflow-y-auto bg-dark-input">
              {body}
            </div>

            {/* Mail Bottom Control */}
            <div className="bg-dark-sidebar border-t border-dark-border px-4 py-3 flex justify-between items-center text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-text-secondary">Compose Draft Mode</span>
              <button className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-sm flex items-center gap-1.5 font-extrabold uppercase tracking-widest text-[10px] shadow-sm cursor-pointer">
                <Send className="w-3 h-3" />
                <span>Send Now</span>
              </button>
            </div>
          </div>
        );
      }

      case "Blog Post": {
        // Splitting into title and lines for high-quality representation
        const lines = content.split("\n");
        const headingLine = lines[0] || "";
        const bodyContent = lines.slice(1).join("\n").trim();
        return (
          <div id="mockup-blog" className="bg-dark-input border border-dark-border rounded-lg p-6 shadow-md max-w-2xl mx-auto space-y-4 text-white">
            <div className="border-b border-dark-border pb-4">
              <span className="text-[9px] uppercase tracking-widest text-gold-500 font-extrabold">
                Generated Article
              </span>
              <h1 className="text-xl font-bold font-serif text-white mt-1 leading-snug">
                {headingLine.replace(/^[#\s]+/, "") || topic}
              </h1>
              <div className="flex items-center gap-3 mt-3 text-dark-text-secondary text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-gold-500" /> Creo AI Workspace
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-500" /> {Math.max(1, Math.round(wordCount / 200))} min read
                </span>
              </div>
            </div>

            <div className="text-sm text-dark-text-primary leading-relaxed space-y-4 font-serif whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">
              {bodyContent}
            </div>
          </div>
        );
      }

      case "YouTube Script": {
        return (
          <div id="mockup-youtube" className="max-w-md mx-auto bg-dark-input border border-dark-border rounded-lg overflow-hidden shadow-md text-white">
            {/* Visual Screen player */}
            <div className="bg-black aspect-video flex items-center justify-center relative group border-b border-dark-border">
              <Play className="w-12 h-12 text-gold-500 fill-gold-500/10 group-hover:scale-110 transition cursor-pointer" />
              <div className="absolute bottom-2 left-2 bg-dark-sidebar/80 border border-dark-border backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-gold-500 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>PROMPTER ACTIVE</span>
              </div>
              <div className="absolute top-2 right-2 bg-gold-500 text-[8px] font-extrabold text-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                YT Script
              </div>
              {/* Progress timeline */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gold-500" />
            </div>

            {/* Video metadata info */}
            <div className="p-4 border-b border-dark-border bg-dark-sidebar">
              <h4 className="text-xs font-bold text-white line-clamp-1">{topic || "Your Video Script"}</h4>
              <p className="text-[9px] text-dark-text-secondary mt-1 uppercase tracking-wider font-semibold font-mono">
                [INTRO], [MAIN CONTENT], [OUTRO] MILESTONES
              </p>
            </div>

            {/* Prompter area */}
            <div className="p-4 bg-dark-input max-h-60 overflow-y-auto">
              <div className="space-y-4 text-xs text-dark-text-primary leading-relaxed font-sans whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </div>
        );
      }

      case "Product Description": {
        return (
          <div id="mockup-product" className="max-w-md mx-auto bg-dark-input border border-dark-border rounded-lg overflow-hidden shadow-md flex flex-col text-white">
            {/* Simulated Product Banner */}
            <div className="h-28 bg-gradient-to-r from-neutral-900 to-neutral-950 border-b border-dark-border p-4 flex flex-col justify-between text-white relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-full blur-xl" />
              <span className="text-[8px] font-bold uppercase tracking-widest bg-gold-500/10 text-gold-500 border border-gold-500/20 self-start py-0.5 px-2 rounded-sm">
                Featured Innovation
              </span>
              <h3 className="text-sm font-extrabold text-white truncate z-10">{topic || "Premium Showcase"}</h3>
            </div>

            {/* Details and product content */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                <div>
                  <span className="text-[9px] text-dark-text-secondary uppercase tracking-widest block font-bold leading-none">
                    E-Commerce Draft
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">Smart Product Placement</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gold-500 block leading-none font-mono">$149.00</span>
                  <span className="text-[9px] text-emerald-500 font-semibold uppercase tracking-wider font-mono">In Stock</span>
                </div>
              </div>

              {/* Parsed body content */}
              <div className="text-xs text-dark-text-primary leading-relaxed whitespace-pre-wrap font-sans pt-1">
                {content}
              </div>

              {/* Convert action button */}
              <button className="w-full bg-gold-500 hover:bg-gold-600 text-black py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-widest transition shadow-sm cursor-pointer mt-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy Now with One-Click</span>
              </button>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="bg-dark-input border border-dark-border rounded-lg p-4 shadow-sm text-xs whitespace-pre-wrap leading-relaxed text-dark-text-primary font-mono">
            {content}
          </div>
        );
    }
  };

  return (
    <div id="preview-container-card" className="bg-dark-sidebar rounded-lg border border-dark-border p-6 space-y-5 shadow-lg">
      {/* Tab bar selection */}
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-gold-500" />
            Platform Workspace
          </span>
          <span className="bg-gold-500/10 text-gold-500 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-sm border border-gold-500/20 font-mono">
            {contentType}
          </span>
        </div>

        <div className="flex items-center bg-dark-input p-1 rounded-md border border-dark-border">
          <button
            type="button"
            id="tab-visual-preview"
            onClick={() => setIsEditing(false)}
            className={`py-1.5 px-3 rounded-sm text-[10px] uppercase tracking-widest font-extrabold transition flex items-center gap-1 cursor-pointer ${
              !isEditing
                ? "bg-gold-500 text-black shadow-sm"
                : "text-dark-text-secondary hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mockup</span>
          </button>
          <button
            type="button"
            id="tab-edit-text"
            onClick={() => setIsEditing(true)}
            className={`py-1.5 px-3 rounded-sm text-[10px] uppercase tracking-widest font-extrabold transition flex items-center gap-1 cursor-pointer ${
              isEditing
                ? "bg-gold-500 text-black shadow-sm"
                : "text-dark-text-secondary hover:text-white"
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
        </div>
      </div>

      {/* Editor & Content View Area */}
      <div className="min-h-60 flex flex-col justify-between">
        {isEditing ? (
          <div className="flex-1 flex flex-col">
            <textarea
              id="preview-textarea-editor"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full flex-1 min-h-64 p-4 rounded-md border border-dark-border bg-dark-input text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-gold-500/10 focus:border-gold-500 transition font-mono leading-relaxed resize-y"
              placeholder="Edit your content draft directly here..."
            />
          </div>
        ) : (
          <div className="flex-1 py-2 overflow-y-auto">
            {renderVisualMockup()}
          </div>
        )}
      </div>

      {/* Footer Metrics & Copy-Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-dark-border pt-4 gap-3">
        {/* Statistics Counts */}
        <div className="flex items-center gap-4 text-dark-text-secondary text-[10px] font-mono w-full sm:w-auto">
          <div>
            WORDS: <span className="text-white font-bold">{wordCount}</span>
          </div>
          <div>
            CHARACTERS: <span className="text-white font-bold">{charCount}</span>
          </div>
        </div>

        {/* Copy & Export Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            id="action-copy-clipboard"
            onClick={handleCopy}
            className={`flex-1 sm:flex-initial py-2.5 px-4 rounded-sm text-[10px] uppercase tracking-widest font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              copied
                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/40"
                : "bg-dark-input hover:bg-[#202020] border border-dark-border text-white active:scale-[0.98]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gold-500" />
                <span>Copy Content</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="action-download-text"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-sm text-[10px] uppercase tracking-widest font-extrabold bg-dark-input hover:bg-[#202020] border border-dark-border text-white transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
            title="Download as Plain Text file"
          >
            <Download className="w-3.5 h-3.5 text-gold-500" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

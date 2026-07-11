export type ContentType =
  | "Blog Post"
  | "Instagram Caption"
  | "LinkedIn Post"
  | "Twitter/X Thread"
  | "YouTube Script"
  | "Product Description"
  | "Email";

export type ContentTone =
  | "Professional"
  | "Casual"
  | "Persuasive"
  | "Witty"
  | "Storytelling";

export type ContentLength = "Short" | "Medium" | "Long";

export interface Generation {
  id: string;
  timestamp: string;
  topic: string;
  contentType: ContentType;
  tone: ContentTone;
  length: ContentLength;
  content: string;
}

export interface ExampleTemplate {
  title: string;
  topic: string;
  contentType: ContentType;
  tone: ContentTone;
  length: ContentLength;
}

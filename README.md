# 🎨 Craiyon AI Studio

A sleek, full-stack AI text-to-image generator built with **Next.js 16** and **React 19**. Describe anything, and watch it come to life — powered by Pollinations.ai's free image generation API, with zero API keys required on the client.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **Text-to-Image Generation** — Turn any prompt into an AI-generated image in seconds
- **Aspect Ratio Control** — Switch between Square, Portrait, and Landscape outputs
- **Example Prompts** — One-click starter prompts to spark inspiration
- Generation History — Automatically keeps your last 6 generations in a visual grid
- **Download & Copy** — Save any generated image or copy its prompt instantly
- **Regenerate** — Re-run the same prompt for a fresh variation
- **Character-Limited Input** — Live counter keeps prompts within API limits (500 chars)
- **Server-Side Image Proxying** — All image requests are validated through a Next.js API route before reaching the client
- **Responsive, Dark-Themed UI** — Built with Tailwind CSS 4 and a polished purple/pink gradient aesthetic
- **Analytics-Ready** — Integrated with Vercel Analytics out of the box

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + `tw-animate-css` |
| Components | shadcn/ui + Base UI primitives |
| Icons | lucide-react |
| Image API | [Pollinations.ai](https://pollinations.ai/) |
| Analytics | Vercel Analytics |
| Package Manager | pnpm |

---

## 📁 Project Structure

```
craiyon_studio/
├── app/
│   ├── api/generate/route.ts   # Server-side image generation endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main application page
│   └── globals.css             # Global styles & Tailwind config
├── components/
│   ├── PromptInput.tsx         # Prompt textarea, examples, generate button
│   ├── ImageDisplay.tsx        # Generated image viewer
│   ├── HistoryGrid.tsx         # Recent generations grid
│   ├── LoadingState.tsx        # Loading UI
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   └── utils.ts                # Shared utility functions
└── public/                     # Static assets & icons
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended — repo includes a `pnpm-lock.yaml`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kishore2005-Tech/craiyon_studio.git
cd craiyon_studio

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app running.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## ⚙️ How It Works

1. The user enters a prompt in the `PromptInput` component and selects an aspect ratio.
2. On submit, a request is sent to the internal `/api/generate` route.
3. The API route encodes the prompt, builds a Pollinations.ai image URL, and verifies the image is reachable via a `HEAD` request before returning it.
4. The returned image is displayed in `ImageDisplay`, and automatically added to the `HistoryGrid` (capped at the 6 most recent generations).
5. Users can download any image or copy its prompt directly from the history grid.

---

## 🗺️ Roadmap

- [ ] Persistent history (local storage / database)
- [ ] Additional image generation providers
- [ ] Prompt enhancement / auto-suggestions
- [ ] Shareable generation links

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

## 👤 Author
 Kishore P | Full Stack Developer | [GitHub](https://github.com/Kishore2005-Tech)

</div>


<p align="center">Built with Next.js, React, and a bit of imagination ✨</p>

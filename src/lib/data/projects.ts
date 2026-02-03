export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "blkproxy",
    description: "A free, zero-config CORS proxy for developers to instantly access any API during development, without cross-origin restrictions.",
    url: "https://blkproxy.vercel.app",
    tags: ["Proxy", "Development", "Tooling"]
  },
  {
    title: "StockIt",
    description: "A unified REST API that aggregates free stock images from multiple platforms (Unsplash, Pixabay, StockSnap) with built-in format conversion, quality optimization, and filtering capabilities.",
    url: "https://imgstcks.vercel.app",
    tags: ["Flask", "Python", "Web Scraping"]
  },
  {
    title: "Flashified",
    description: "Ultimate tool to download images from any URL, whether in bulk or individually, completely ad-free and efficient.",
    url: "https://flashified.vercel.app",
    tags: ["Images", "React", "Tool"]
  },
  {
    title: "WeatherX",
    description: "Modern weather application with AI-powered insights and real-time forecast visualization.",
    url: "https://wthrx.vercel.app",
    tags: ["Weather", "API", "AI"]
  },
  {
    title: "YTDL",
    description: "A sophisticated, secure, and feature-rich command-line interface for simplifying media downloads.",
    url: "https://github.com/iambhvsh/ytdl",
    tags: ["CLI", "Python", "Automation"]
  },
  {
    title: "PaletteStudio",
    description: "Generate sophisticated and harmonious color palettes for your product designs with PaletteStudio - a simple yet powerful color palette generator.",
    url: "https://plstudio.vercel.app/",
    tags: ["DesignTool", "Colors", "Next.js"]
  },
  {
    title: "AeroX",
    description: "AeroX is your go-to platform for the latest and most reliable aviation news from around the world. With a clean interface and up-to-date news.",
    url: "https://aerox.vercel.app/",
    tags: ["News", "Aviation", "React"]
  },
  {
    title: "Swipe APIs",
    description: "Swipe APIs is a collection of APIs which let's you access data, like Finance, Search and News free and without rate limits.",
    url: "https://swipeapis.vercel.app/",
    tags: ["API", "Backend", "Docs"]
  },
  {
    title: "Stellar",
    description: "A modern, intelligent AI-powered search application built with Google's Gemini AI and integrated Google Programmable Search.",
    url: "https://searchstellar.vercel.app/",
    tags: ["AI", "Gemini", "Search"]
  }
];

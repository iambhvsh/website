import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  DetailedHTMLProps,
  HTMLProps,
  HTMLAttributes,
  OlHTMLAttributes,
} from "react";
import { highlight } from "sugar-high";
import { FiCopy, FiCheck } from "react-icons/fi";
import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiPython,
  SiRust,
  SiGo,
  SiOpenjdk,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiCplusplus,
  SiC,
  SiDotnet,
  SiMarkdown,
  SiJson,
  SiYaml,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiDart,
  SiLua,
  SiPerl,
  SiHaskell,
  SiElixir,
  SiScala,
  SiClojure,
  SiGnubash,
  SiDocker,
  SiKubernetes,
  SiGraphql,
  SiSass,
  SiLess,
  SiStyledcomponents,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiSqlite,
  SiVim,
  SiLatex,
  SiNixos,
  SiToml,
  SiApache,
  SiNginx,
  SiWebassembly,
  SiAssemblyscript,
  SiRescript,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

type PreProps = DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;
type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
type ImgProps = DetailedHTMLProps<
  HTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src?: string;
  alt?: string;
};
type AnchorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  href?: string;
};
type YouTubeProps = {
  id: string;
  title?: string;
  start?: string | number;
  end?: string | number;
  controls?: boolean;
  showInfo?: boolean;
  rel?: boolean;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  containerClassName?: string;
};
type EmbedProps = {
  url: string;
  title?: string;
  className?: string;
  height?: string | number;
  width?: string | number;
  allowFullScreen?: boolean;
};

const languageIcons: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  typescript: { icon: SiTypescript, color: "#3178c6" },
  javascript: { icon: SiJavascript, color: "#f7df1e" },
  html: { icon: SiHtml5, color: "#e34f26" },
  css: { icon: SiCss3, color: "#264de4" },
  python: { icon: SiPython, color: "#3776ab" },
  rust: { icon: SiRust, color: "#000000" },
  go: { icon: SiGo, color: "#00add8" },
  java: { icon: SiOpenjdk, color: "#007396" },
  php: { icon: SiPhp, color: "#777bb4" },
  ruby: { icon: SiRuby, color: "#cc342d" },
  swift: { icon: SiSwift, color: "#f05138" },
  kotlin: { icon: SiKotlin, color: "#7f52ff" },
  cpp: { icon: SiCplusplus, color: "#00599c" },
  c: { icon: SiC, color: "#a8b9cc" },
  csharp: { icon: SiDotnet, color: "#239120" },
  markdown: { icon: SiMarkdown, color: "#000000" },
  json: { icon: SiJson, color: "#000000" },
  yaml: { icon: SiYaml, color: "#cb171e" },
  jsx: { icon: SiReact, color: "#61dafb" },
  tsx: { icon: SiReact, color: "#61dafb" },
  vue: { icon: SiVuedotjs, color: "#4fc08d" },
  angular: { icon: SiAngular, color: "#dd0031" },
  svelte: { icon: SiSvelte, color: "#ff3e00" },
  dart: { icon: SiDart, color: "#0175c2" },
  lua: { icon: SiLua, color: "#2c2d72" },
  perl: { icon: SiPerl, color: "#39457e" },
  haskell: { icon: SiHaskell, color: "#5d4f85" },
  elixir: { icon: SiElixir, color: "#4b275f" },
  scala: { icon: SiScala, color: "#dc322f" },
  clojure: { icon: SiClojure, color: "#5881d8" },
  powershell: { icon: SiGnubash, color: "#5391fe" },
  bash: { icon: SiGnubash, color: "#4eaa25" },
  sh: { icon: SiGnubash, color: "#4eaa25" },
  zsh: { icon: SiGnubash, color: "#4eaa25" },
  docker: { icon: SiDocker, color: "#2496ed" },
  kubernetes: { icon: SiKubernetes, color: "#326ce5" },
  graphql: { icon: SiGraphql, color: "#e10098" },
  sql: { icon: SiPostgresql, color: "#336791" },
  scss: { icon: SiSass, color: "#cc6699" },
  sass: { icon: SiSass, color: "#cc6699" },
  less: { icon: SiLess, color: "#1d365d" },
  "styled-components": { icon: SiStyledcomponents, color: "#db7093" },
  tailwind: { icon: SiTailwindcss, color: "#06b6d4" },
  postgresql: { icon: SiPostgresql, color: "#336791" },
  mongodb: { icon: SiMongodb, color: "#47a248" },
  redis: { icon: SiRedis, color: "#dc382d" },
  mysql: { icon: SiMysql, color: "#4479a1" },
  sqlite: { icon: SiSqlite, color: "#003b57" },
  vim: { icon: SiVim, color: "#019733" },
  latex: { icon: SiLatex, color: "#008080" },
  nix: { icon: SiNixos, color: "#7ebae4" },
  toml: { icon: SiToml, color: "#9c4121" },
  apache: { icon: SiApache, color: "#d22128" },
  nginx: { icon: SiNginx, color: "#009639" },
  wasm: { icon: SiWebassembly, color: "#654ff0" },
  assemblyscript: { icon: SiAssemblyscript, color: "#007acc" },
  rescript: { icon: SiRescript, color: "#e6484f" },
  reactnative: { icon: TbBrandReactNative, color: "#61dafb" },
};

const parseTimestamp = (time: string | number): number => {
  if (typeof time === "number") return time;

  const parts = time.split(":").reverse();
  return parts.reduce((acc, part, index) => {
    return acc + parseInt(part) * Math.pow(60, index);
  }, 0);
};

export const components = {
  pre: ({ children, ...props }: PreProps) => {
    const child = React.Children.only(children) as any;
    const code = child?.props?.children || "";
    const className = child?.props?.className || "";
    const language = className.replace("language-", "");
    const filename = child?.props?.["data-filename"] || child?.props?.filename;

    if (!code || typeof code !== "string") {
      return <pre {...props}>{children}</pre>;
    }

    const highlightedCode = highlight(code);
    const [copied, setCopied] = useState(false);
    const [lineCount, setLineCount] = useState(0);
    const codeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (codeRef.current) {
        const height = codeRef.current.clientHeight;
        const lineHeight = 20; // 1.25rem = 20px
        const calculatedLines = Math.ceil(height / lineHeight);
        setLineCount(calculatedLines);
      }
    }, [code]);

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const LanguageIcon = language && languageIcons[language]?.icon;
    const iconColor = language && languageIcons[language]?.color;

    return (
      <div className="relative my-6 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#090909] border-b border-zinc-800">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            {LanguageIcon && (
              <LanguageIcon className="w-4 h-4" style={{ color: iconColor }} />
            )}
            {filename ? `filename="${filename}"` : language || "Code"}
          </div>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded hover:bg-zinc-700/50 text-zinc-400 transition-colors"
          >
            {copied ? (
              <FiCheck className="w-4 h-4" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="relative bg-[#090909] flex">
          <div
            className="flex-none w-8 pt-4 pb-8 bg-[#090909] text-zinc-500 text-[11px] select-none border-r border-zinc-800/50 mb-2"
            style={{ height: codeRef.current?.clientHeight }}
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="text-right pr-2 leading-5 h-5">
                {i + 1}
              </div>
            ))}
          </div>
          <div ref={codeRef} className="flex-1">
            <pre className="overflow-x-auto p-4 pl-3 m-0">
              <code
                className={`language-${language} leading-5 block rounded-none [&>*]:rounded-none [&>*:last-child]:rounded-br-lg whitespace-pre-wrap break-words`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                style={{ lineHeight: "1.25rem" }}
              />
            </pre>
          </div>
        </div>
      </div>
    );
  },
  code: ({ children, className, ...props }: CodeProps) => {
    if (!className) {
      return (
        <code className="font-mono text-sm px-1.5 py-0.5" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: ({ src, alt }: ImgProps) => {
    if (!src) return null;
    return (
      <span className="block relative aspect-[16/9] w-full my-8">
        <Image
          src={src}
          alt={alt || ""}
          fill
          className="rounded-xl object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
        />
      </span>
    );
  },
  a: ({ href, children }: AnchorProps) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || ""}
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }: HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({
    children,
    ...props
  }: DetailedHTMLProps<
    OlHTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  >) => (
    <ol className="list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: HTMLProps<HTMLLIElement>) => (
    <li className="text-gray-300" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 pl-6 my-8 italic text-gray-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  p: ({ children, ...props }: HTMLProps<HTMLParagraphElement>) => (
    <p className="mb-6 text-gray-300 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  YouTube: ({
    id,
    title,
    start,
    end,
    controls = true,
    showInfo = true,
    rel = false,
    autoplay = false,
    mute = false,
    loop = false,
    playsInline = true,
    className = "",
    containerClassName = "",
  }: YouTubeProps) => {
    let params = new URLSearchParams({
      modestbranding: "1",
      playsinline: playsInline ? "1" : "0",
      rel: rel ? "1" : "0",
      controls: controls ? "1" : "0",
      showinfo: showInfo ? "1" : "0",
      autoplay: autoplay ? "1" : "0",
      mute: mute ? "1" : "0",
      loop: loop ? "1" : "0",
    });

    if (start) params.append("start", parseTimestamp(start).toString());
    if (end) params.append("end", parseTimestamp(end).toString());
    if (loop) params.append("playlist", id);

    const url = `https://www.youtube.com/embed/${id}?${params.toString()}`;

    return (
      <div className={`flex justify-center w-full my-8 ${containerClassName}`}>
        <div className="relative aspect-video w-full max-w-4xl rounded-xl overflow-hidden bg-black">
          <iframe
            src={url}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`absolute top-0 left-0 w-full h-full ${className}`}
          />
        </div>
      </div>
    );
  },
  Embed: ({
    url,
    title,
    className = "",
    height = "100%",
    width = "100%",
    allowFullScreen = true,
  }: EmbedProps) => (
    <div className="relative aspect-video w-full my-8">
      <iframe
        src={url}
        title={title || "Embedded content"}
        width={width}
        height={height}
        allowFullScreen={allowFullScreen}
        className={`rounded-xl ${className}`}
      />
    </div>
  ),
  Tweet: ({
    id,
    className = "",
    theme = "dark",
    align = "center",
  }: {
    id: string;
    className?: string;
    theme?: "light" | "dark";
    align?: "left" | "center" | "right";
  }) => (
    <div
      className={`my-8 flex ${
        align === "center"
          ? "justify-center"
          : align === "right"
            ? "justify-end"
            : "justify-start"
      } ${className}`}
    >
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-align={align}
      >
        <a href={`https://twitter.com/x/status/${id}`} />
      </blockquote>
    </div>
  ),
  CodePen: ({
    id,
    height = 500,
    theme = "dark",
    defaultTab = "result",
  }: {
    id: string;
    height?: number;
    theme?: "light" | "dark";
    defaultTab?: "result" | "js" | "css" | "html";
  }) => (
    <div className="my-8">
      <iframe
        src={`https://codepen.io/embed/${id}?height=${height}&theme-id=${theme}&default-tab=${defaultTab}`}
        height={height}
        className="w-full rounded-xl"
        title="CodePen Embed"
        loading="lazy"
      />
    </div>
  ),
  Stackblitz: ({
    id,
    file,
    theme = "dark",
    className = "",
  }: {
    id: string;
    file?: string;
    theme?: "light" | "dark";
    className?: string;
  }) => (
    <div className={`my-8 aspect-[16/9] ${className}`}>
      <iframe
        src={`https://stackblitz.com/edit/${id}?file=${file || ""}&theme=${theme}`}
        className="w-full h-full rounded-xl"
        title="StackBlitz Embed"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      />
    </div>
  ),
};

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const TELEGRAM_URL = "https://t.me/quietpsalm";
const IMAGE_URL = "https://i.ibb.co/XqN6Q1d/IMG-6891.png";

// Paste a YouTube video URL here to play audio on page load (leave empty for none)
// Example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
const YOUTUBE_URL = "https://youtu.be/wVMrSszssyo?si=K3G_rdsh_e523pYz";

// Browser tab title
const PAGE_TITLE = "dread";

// Favicon — paste any image URL, or use a file you've dropped into public/ (e.g. "/favicon.png")
// Leave empty to keep the default
const FAVICON_URL = "https://i.ibb.co/XqN6Q1d/IMG-6891.png";

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function TelegramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function FolderIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#000",
      animation: "introFadeOut 0.55s ease forwards 1.85s",
    }}>
      <div style={{
        position: "relative",
        width: 140, height: 110,
        animation: "folderZoom 0.55s ease forwards 1.85s",
        perspective: "400px",
      }}>
        {/* Inner glow */}
        <div style={{
          position: "absolute",
          left: "50%", top: "54%",
          transform: "translate(-50%, -50%)",
          width: 120, height: 80,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 50%, transparent 75%)",
          filter: "blur(8px)",
          animation: "glowPulse 1.1s ease forwards 0.6s",
          opacity: 0,
          zIndex: 1,
        }} />

        {/* Folder tab */}
        <div style={{
          position: "absolute",
          top: 0, left: 12,
          width: 48, height: 18,
          borderRadius: "6px 6px 0 0",
          background: "#1a1a1a",
          border: "1.5px solid #cc0000",
          borderBottom: "none",
          boxShadow: "0 0 8px #ff000066",
          animation: "folderAppear 0.35s ease forwards",
          opacity: 0,
          zIndex: 2,
        }} />

        {/* Folder body */}
        <div style={{
          position: "absolute",
          top: 14, left: 0,
          width: 140, height: 96,
          borderRadius: "4px 8px 8px 8px",
          background: "#0d0d0d",
          border: "1.5px solid #cc0000",
          boxShadow: "0 0 16px #ff000055, inset 0 0 20px #ff00000a",
          animation: "folderAppear 0.35s ease forwards",
          opacity: 0,
          zIndex: 2,
        }} />

        {/* Folder flap (opens upward) */}
        <div style={{
          position: "absolute",
          top: 14, left: 0,
          width: 140, height: 48,
          borderRadius: "4px 8px 0 0",
          background: "#161616",
          border: "1.5px solid #cc0000",
          borderBottom: "1px solid #ff000033",
          boxShadow: "0 0 12px #ff000055",
          transformOrigin: "bottom center",
          animation: "flapOpen 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.45s",
          zIndex: 4,
          backfaceVisibility: "hidden",
        }} />
      </div>

      <style>{`
        @keyframes folderAppear {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes flapOpen {
          0%   { transform: perspective(400px) rotateX(0deg); }
          100% { transform: perspective(400px) rotateX(-115deg); }
        }
        @keyframes glowPulse {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          45%  { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes introFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
        @keyframes folderZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.35 + 0.05,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function YouTubeAudio({ videoId }: { videoId: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const start = () => {
      flushSync(() => setActive(true));
    };
    document.addEventListener("touchstart", start, { once: true });
    document.addEventListener("click", start, { once: true });
    return () => {
      document.removeEventListener("touchstart", start);
      document.removeEventListener("click", start);
    };
  }, []);

  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&loop=1&playlist=${videoId}` +
    `&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3`;

  if (!active) return null;
  return (
    <iframe
      src={src}
      allow="autoplay; encrypted-media"
      allowFullScreen={false}
      style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: "none" }}
    />
  );
}

export default function App() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  function handleCopyUsername() {
    const text = "@ft.paradise";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  useEffect(() => {
    if (PAGE_TITLE) document.title = PAGE_TITLE;
    if (FAVICON_URL) {
      const link =
        (document.querySelector("link[rel~='icon']") as HTMLLinkElement) ||
        Object.assign(document.createElement("link"), { rel: "icon" });
      link.href = FAVICON_URL;
      document.head.appendChild(link);
    }
  }, []);

  const videoId = getYouTubeId(YOUTUBE_URL);

  return (
    <div style={{ minHeight: "100dvh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <FolderIntro onDone={() => setIntroComplete(true)} />

      {videoId && <YouTubeAudio videoId={videoId} />}
      <ParticleCanvas />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          padding: "40px 24px",
          opacity: introComplete ? 1 : 0,
          transform: introComplete ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", width: 190, height: 190 }}>
          {/* Outer red pulsing glow */}
          <div style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            background: "transparent",
            border: "2px solid #cc0000",
            animation: "redPulse 1.6s ease-in-out infinite",
          }} />
          {/* Static dark border ring */}
          <div style={{
            position: "absolute", inset: -2, borderRadius: "50%",
            border: "1px solid rgba(255,0,0,0.2)",
            boxShadow: "0 0 30px rgba(255,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.6)",
          }} />
          <img
            src={IMAGE_URL}
            alt="profile"
            onLoad={() => setImgLoaded(true)}
            style={{
              position: "relative", width: 190, height: 190,
              borderRadius: "50%", objectFit: "cover",
              border: "2px solid rgba(255,0,0,0.18)", display: "block",
              opacity: imgLoaded ? 1 : 0, transition: "opacity 0.7s ease",
              boxShadow: "0 0 60px rgba(255,0,0,0.12), 0 0 120px rgba(255,0,0,0.05)",
            }}
          />
        </div>

        {/* Name / handle */}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: "clamp(22px, 5vw, 30px)", letterSpacing: "0.06em", fontFamily: "'QuorthonBlack', sans-serif", lineHeight: 1.1 }}>
            dread
          </div>
          <div
            onClick={handleCopyUsername}
            title="Click to copy"
            style={{
              marginTop: 8,
              color: copied ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.38)",
              fontSize: "clamp(12px, 2.5vw, 14px)",
              letterSpacing: "0.18em",
              fontFamily: "'FallingSkyBlk', sans-serif",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.2s ease",
              userSelect: "none",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            {copied ? "copied!" : "@ft.paradise"}
            {!copied && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </div>
        </div>

        {/* Telegram button */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "13px 32px", borderRadius: "100px",
            border: "1px solid rgba(255,255,255,0.14)",
            background: hovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
            color: "#fff", textDecoration: "none",
            fontSize: "clamp(14px, 2.5vw, 16px)", letterSpacing: "0.08em",
            fontFamily: "'FallingSkyBlk', sans-serif",
            transition: "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
            transform: hovered ? "translateY(-1px)" : "translateY(0)",
            boxShadow: hovered ? "0 8px 32px rgba(255,255,255,0.06)" : "0 2px 12px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <TelegramIcon />
          Telegram
        </a>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes redPulse {
          0%, 100% { filter: blur(2px) drop-shadow(0 0 6px #ff0000aa); opacity: 0.7; }
          50%       { filter: blur(3px) drop-shadow(0 0 22px #ff0000ff) drop-shadow(0 0 40px #ff000088); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

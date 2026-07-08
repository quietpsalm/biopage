import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/* ─── CST Flip Clock Notification Bar ─────────────────────── */

function getTime() {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
  return {
    hours:   d.getHours().toString().padStart(2, "0"),
    minutes: d.getMinutes().toString().padStart(2, "0"),
    seconds: d.getSeconds().toString().padStart(2, "0"),
  };
}

// Schedules a callback to fire at the next exact second boundary,
// then every second after. Returns a cleanup function.
function startAccurateClock(cb: () => void): () => void {
  let tid: ReturnType<typeof setTimeout>;
  function tick() {
    cb();
    const msToNext = 1000 - (Date.now() % 1000);
    tid = setTimeout(tick, msToNext);
  }
  // First fire: align to next second
  const msToNext = 1000 - (Date.now() % 1000);
  tid = setTimeout(tick, msToNext);
  return () => clearTimeout(tid);
}

const CARD_W = 24;
const CARD_H = 32;
const FONT   = 18;

function FlipCard({ digit, prev }: { digit: string; prev: string }) {
  const [flipping, setFlipping] = useState(false);
  const savedPrev = useRef(prev);

  useEffect(() => {
    if (digit !== savedPrev.current) {
      setFlipping(true);
      const t = setTimeout(() => { setFlipping(false); savedPrev.current = digit; }, 360);
      return () => clearTimeout(t);
    }
  }, [digit]);

  const face: React.CSSProperties = {
    position: "absolute", inset: 0,
    background: "#1c1c1c",
    borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff",
    fontSize: FONT, fontWeight: 800,
    fontFamily: "'BFText', system-ui, sans-serif",
    lineHeight: "1",
    fontVariantNumeric: "tabular-nums",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.4)",
  };

  return (
    <div style={{
      position: "relative", width: CARD_W, height: CARD_H,
      display: "inline-block", flexShrink: 0,
      perspective: 200,
    }}>
      {/* Static face — always shows current digit */}
      <div style={face}>{digit}</div>
      {/* Flip overlay — shows old digit, then rotates away */}
      {flipping && (
        <div style={{
          ...face,
          zIndex: 4,
          transformOrigin: "center center",
          animation: "fcFlipAway 0.36s ease-in forwards",
        }}>{savedPrev.current}</div>
      )}
      <style>{`
        @keyframes fcFlipAway {
          0%   { transform: rotateX(0deg);   opacity: 1; }
          45%  { transform: rotateX(-90deg); opacity: 1; }
          46%  { opacity: 0; }
          100% { transform: rotateX(-90deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function DigitPair({ value }: { value: string }) {
  const p0 = useRef(value[0]);
  const p1 = useRef(value[1]);
  const prev0 = p0.current; const prev1 = p1.current;
  useEffect(() => { p0.current = value[0]; p1.current = value[1]; });
  return (
    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
      <FlipCard digit={value[0]} prev={prev0} />
      <FlipCard digit={value[1]} prev={prev1} />
    </div>
  );
}

function CSTFlipClockBar({ visible }: { visible: boolean }) {
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    return startAccurateClock(() => setTime(getTime()));
  }, []);

  const colon: React.CSSProperties = {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18, fontWeight: 700,
    fontFamily: "'BFText', system-ui, sans-serif",
    lineHeight: `${CARD_H}px`,
    height: CARD_H,
    flexShrink: 0, width: 10, textAlign: "center",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: "#cc0000",
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 40,
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.35s ease",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <DigitPair value={time.hours} />
        <span style={colon}>:</span>
        <DigitPair value={time.minutes} />
        <span style={colon}>:</span>
        <DigitPair value={time.seconds} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

const TELEGRAM_URL = "https://t.me/quietpsalm";
const GITHUB_URL = "https://github.com/quietpsalm"; // paste your GitHub URL here, e.g. "https://github.com/yourname"
const IMAGE_URL = "https://i.ibb.co/XqN6Q1d/IMG-6891.png";

// Paste a YouTube video URL here to play audio on page load (leave empty for none)
// Example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
const YOUTUBE_URL = "https://youtu.be/PBKTrq7PgkU?is=jMIY5YYSLmlwMcWi";

// Browser tab title
const PAGE_TITLE = "ØD";

// Favicon — paste any image URL, or use a file you've dropped into public/ (e.g. "/favicon.png")
// Leave empty to keep the default
const FAVICON_URL = "https://i.ibb.co/9HrftrPz/fav.png";

// Location shown under the handle — leave empty to hide
const LOCATION = "Paradise";

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
      tabIndex={-1}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 320,
        height: 180,
        opacity: 0.001,
        pointerEvents: "none",
        border: "none",
      }}
    />
  );
}

export default function App() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);
  const [xmrPrice, setXmrPrice] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket("wss://stream.binance.com:9443/ws/xmrusdt@ticker");
      ws.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          const price = parseFloat(d.c);
          if (!isNaN(price)) {
            setXmrPrice(price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          }
        } catch {}
      };
      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  function handleCopyUsername() {
    const text = "@quietpsalm";
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
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  const videoId = getYouTubeId(YOUTUBE_URL);

  return (
    <div style={{ minHeight: "100dvh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <CSTFlipClockBar visible={clockVisible} />
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
            draggable={false}
            onDragStart={e => e.preventDefault()}
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
          <div
            onMouseEnter={() => setClockVisible(true)}
            onMouseLeave={() => setClockVisible(false)}
            style={{ color: "#fff", fontSize: "clamp(22px, 5vw, 30px)", letterSpacing: "0.06em", fontFamily: "'FamiliesRound', sans-serif", lineHeight: 1.1, cursor: "default" }}
          >
            dread
          </div>

          {/* Monero price row */}
          {xmrPrice && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", marginTop: "10px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18">
                <path fill="#fff" d="M16 0c-8.849 0-16 7.161-16 16.021 0 1.781 0.303 3.473 0.823 5.077h4.771v-13.459l10.407 10.423 10.407-10.423v13.459h4.771c0.516-1.604 0.823-3.296 0.823-5.077 0-8.855-7.151-16.021-16-16.021zM13.615 20.412l-4.552-4.563v8.468h-6.719c2.817 4.6 7.896 7.683 13.656 7.683s10.88-3.083 13.661-7.688h-6.724v-8.463l-4.511 4.557-2.385 2.391-2.416-2.391h-0.011z"/>
              </svg>
              <span style={{
                fontFamily: "'FamiliesRound', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(13px, 2.5vw, 15px)",
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.04em",
              }}>
                ${xmrPrice}
              </span>
            </div>
          )}

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
            {copied ? "username copied!" : "@quietpsalm"}
            {!copied && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </div>
          {LOCATION && (
            <div style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(11px, 2vw, 13px)",
              letterSpacing: "0.14em",
              fontFamily: "'FallingSkyBlk', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
            }}>
              <svg width="11" height="13" viewBox="0 0 24 28" fill="currentColor">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 5.5 8 20 8 20s8-14.5 8-20c0-4.411-3.589-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              {LOCATION}
            </div>
          )}
        </div>

        {/* Telegram button */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="screentone-btn"
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

        {/* GitHub button — only renders if GITHUB_URL is set */}
        {GITHUB_URL && (
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="screentone-btn"
            onMouseEnter={() => setGithubHovered(true)}
            onMouseLeave={() => setGithubHovered(false)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "13px 32px", borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: githubHovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
              color: "#fff", textDecoration: "none",
              fontSize: "clamp(14px, 2.5vw, 16px)", letterSpacing: "0.08em",
              fontFamily: "'FallingSkyBlk', sans-serif",
              transition: "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
              transform: githubHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: githubHovered ? "0 8px 32px rgba(255,255,255,0.06)" : "0 2px 12px rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
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

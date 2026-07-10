import { useEffect, useRef, useState } from "react";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  hue: number;
}

export function IntroFuego() {
  const [visible, setVisible] = useState(() => {
    return sessionStorage.getItem("basados_intro_vista") !== "1";
  });
  const [iniciada, setIniciada] = useState(false);
  const [encendiendo, setEncendiendo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);

  const iniciarIntro = () => {
    setEncendiendo(true);

    const fosforo = new Audio("/fosforo.wav");
    fosforo.volume = 0.7;
    fosforo.currentTime = 7;
    fosforo.play().catch(() => {});

    const detener = () => {
      if (fosforo.currentTime >= 11) {
        fosforo.pause();
        fosforo.removeEventListener("timeupdate", detener);
      }
    };
    fosforo.addEventListener("timeupdate", detener);

    window.setTimeout(() => {
      const fuego = new Audio("/fuego.wav");
      fuego.volume = 0.5;
      fuego.play().catch(() => {});
      setIniciada(true);
    }, 4000);
  };

  useEffect(() => {
    if (!visible || !iniciada) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let embers: Ember[] = [];
    let running = true;
    let t0: number | null = null;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): Ember => ({
      x: Math.random() * W,
      y: H + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.8 + Math.random() * 1.8),
      r: 1 + Math.random() * 2.5,
      life: 0,
      max: 90 + Math.random() * 120,
      hue: 20 + Math.random() * 25,
    });

    for (let i = 0; i < 70; i++) {
      const e = spawn();
      e.y = Math.random() * H;
      embers.push(e);
    }

    const draw = (ts: number) => {
      if (t0 === null) t0 = ts;
      const elapsed = ts - t0;
      ctx.clearRect(0, 0, W, H);

      if (embers.length < 90 && running) embers.push(spawn());

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.vy -= 0.004;
        e.life++;
        const p = e.life / e.max;
        const alpha = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        if (e.life >= e.max || e.y < -10) {
          embers.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue},95%,${55 + Math.random() * 10}%,${Math.max(0, alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue},100%,50%,${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (glowRef.current) {
        const pulse = 12 + Math.sin(ts / 220) * 8;
        glowRef.current.style.boxShadow = `0 0 ${pulse}px ${pulse / 2}px rgba(228,108,10,0.7)`;
      }

      if (running && elapsed > 4000) {
        running = false;
        setFadeOut(true);
        window.setTimeout(() => {
          sessionStorage.setItem("basados_intro_vista", "1");
          setVisible(false);
        }, 1200);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible, iniciada]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.2s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      {iniciada && (
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      )}
      <div
        ref={glowRef}
        style={{
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "#161616",
          border: "2px solid #E46C0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <img
          src="/logo-basados.jpg"
          alt="Basados"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
      <div style={{ fontSize: 34, fontWeight: 500, color: "#f5f0e8", letterSpacing: 3, zIndex: 1 }}>
        BASADOS
      </div>
      <div style={{ fontSize: 13, color: "#E46C0A", letterSpacing: 2, marginTop: 6, zIndex: 1 }}>
        la forma inteligente de hacer asados
      </div>

      {!iniciada && (
        <button
          onClick={iniciarIntro}
          disabled={encendiendo}
          style={{
            marginTop: 28,
            zIndex: 1,
            background: encendiendo ? "#8a4208" : "#E46C0A",
            color: "#0d0d0d",
            border: "none",
            padding: "12px 28px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 500,
            cursor: encendiendo ? "default" : "pointer",
            letterSpacing: 1,
          }}
        >
          {encendiendo ? "Encendiendo..." : "Toca para encender el fuego"}
        </button>
      )}
    </div>
  );
}
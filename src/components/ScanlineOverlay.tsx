import { useEffect, useState } from 'react';

export default function ScanlineOverlay() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="scanlines" />
      <div className="scanline-move animate-scanline" />
      <div className="crt-curve" />
      <div className="noise" />
      {glitchActive && (
        <div className="fixed inset-0 pointer-events-none z-[102] bg-white/5" />
      )}
    </>
  );
}

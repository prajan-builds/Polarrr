"use client";

import { useEffect, useRef, useState } from "react";

type Filter = "original" | "gold" | "bw" | "vintage" | "cool" | "soft" | "dark" | "pixel" | "pastel";
type Frame = "classic" | "soft" | "dark" | "iphone";
type Font = "hand" | "serif" | "type";

const filterNames: { id: Filter; label: string }[] = [
  { id: "original", label: "Original" }, { id: "gold", label: "Golden" },
  { id: "bw", label: "B&W" }, { id: "vintage", label: "Vintage" },
  { id: "cool", label: "Cool" }, { id: "soft", label: "Soft" },
  { id: "dark", label: "Moody" }, { id: "pixel", label: "8-bit" },
  { id: "pastel", label: "Oil pastel" },
];

export default function PolaroidMaker() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("little moments ✳");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [frame, setFrame] = useState<Frame>("classic");
  const [filter, setFilter] = useState<Filter>("original");
  const [font, setFont] = useState<Font>("hand");
  const [textColor, setTextColor] = useState("#36312b");
  const [rotation, setRotation] = useState(-2);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const oldUrl = useRef<string | null>(null);

  useEffect(() => () => { if (oldUrl.current) URL.revokeObjectURL(oldUrl.current); }, []);

  function loadFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    if (oldUrl.current) URL.revokeObjectURL(oldUrl.current);
    const url = URL.createObjectURL(file);
    oldUrl.current = url;
    setPhoto(url);
    setFileName(file.name);
  }

  function reset() {
    setPhoto(null); setFileName(""); setCaption("little moments ✳");
    setDate(new Date().toISOString().slice(0, 10)); setFrame("classic");
    setFilter("original"); setFont("hand"); setTextColor("#36312b"); setRotation(-2);
    if (fileInput.current) fileInput.current.value = "";
  }

  function filterCss(): string {
    switch (filter) {
      case "gold": return "sepia(.28) saturate(1.2) contrast(.95)";
      case "bw": return "grayscale(1)";
      case "vintage": return "sepia(.32) contrast(.9) saturate(.8)";
      case "cool": return "hue-rotate(12deg) saturate(.85)";
      case "soft": return "brightness(1.08) saturate(.8)";
      case "dark": return "brightness(.78) contrast(1.12)";
      case "pastel": return "saturate(.72) contrast(.88) brightness(1.08)";
      default: return "none";
    }
  }

  function download() {
    const img = imageRef.current;
    if (!img || !photo) return;
    const width = 900, photoHeight = 900, bottom = frame === "iphone" ? 150 : 220;
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = photoHeight + bottom;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = frame === "dark" ? "#282522" : frame === "soft" ? "#f4eee5" : "#ffffff";
    ctx.fillRect(0, 0, width, canvas.height);
    const pad = frame === "iphone" ? 28 : 38;
    const side = width - pad * 2;
    ctx.save();
    ctx.filter = filterCss();
    if (filter === "pixel") {
      const small = document.createElement("canvas"); small.width = 75; small.height = 75;
      const sctx = small.getContext("2d");
      if (sctx) { sctx.drawImage(img, 0, 0, 75, 75); ctx.imageSmoothingEnabled = false; ctx.drawImage(small, pad, pad, side, photoHeight - pad * 2); }
    } else {
      const ratio = Math.max(side / img.naturalWidth, (photoHeight - pad * 2) / img.naturalHeight);
      const sw = img.naturalWidth * ratio, sh = img.naturalHeight * ratio;
      ctx.drawImage(img, pad + (side - sw) / 2, pad + (photoHeight - pad * 2 - sh) / 2, sw, sh);
    }
    ctx.restore();
    if (filter === "pastel") {
      ctx.save(); ctx.globalAlpha = .12; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 5;
      for (let i = 0; i < 130; i++) { const x = pad + Math.random() * side, y = pad + Math.random() * (photoHeight - pad * 2); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18, y + 8); ctx.stroke(); }
      ctx.restore();
    }
    ctx.fillStyle = frame === "dark" ? "#f7f1e8" : textColor;
    ctx.textAlign = "center";
    ctx.font = font === "hand" ? "58px cursive" : font === "serif" ? "48px Georgia" : "30px monospace";
    ctx.fillText(caption || "", width / 2, photoHeight + (frame === "iphone" ? 76 : 95), width - 70);
    ctx.fillStyle = frame === "dark" ? "#c9c0b5" : "#8d887f";
    ctx.font = "22px monospace";
    ctx.fillText(date ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "", width / 2, photoHeight + (frame === "iphone" ? 116 : 145));
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "polarrr-memory.png"; a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const dateLabel = date ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "";

  return <section className="workspace">
    <div className="panel">
      <div className="panel-head"><h2>Make your Polaroid</h2><span className="step">01 — EDITOR</span></div>
      <label className={`upload ${dragging ? "drag" : ""}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}>
        <input ref={fileInput} type="file" accept="image/*" onChange={e => loadFile(e.target.files?.[0])} />
        <div><div className="upload-icon">↥</div><strong>{fileName || "Drop a photo here, or browse"}</strong><small>JPG, PNG or WEBP · processed on this device</small></div>
      </label>
      <div className="control-group"><div className="control-title">FRAME <small>01 / STYLE</small></div><div className="choice-row">
        {(["classic", "soft", "dark", "iphone"] as Frame[]).map(v => <button key={v} className={`chip ${frame === v ? "active" : ""}`} onClick={() => setFrame(v)}>{v === "iphone" ? "📱 iPhone" : v[0].toUpperCase() + v.slice(1)}</button>)}
      </div></div>
      <div className="control-group"><div className="control-title">PHOTO EFFECT <small>02 / LOOK</small></div><div className="choice-row">
        {filterNames.map(v => <button key={v.id} className={`chip ${filter === v.id ? "active" : ""}`} onClick={() => setFilter(v.id)}>{v.label}</button>)}
      </div></div>
      <div className="control-group"><div className="control-title">CAPTION <small>03 / WORDS</small></div><input className="text-input" value={caption} maxLength={48} onChange={e => setCaption(e.target.value)} placeholder="Write a little memory..." /></div>
      <div className="two-col control-group">
        <div><div className="control-title">DATE STAMP</div><input className="text-input" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div><div className="control-title">TEXT COLOUR</div><div className="color-row"><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} /><span style={{fontSize:11,color:"#89847b"}}>{textColor.toUpperCase()}</span></div></div>
      </div>
      <div className="control-group"><div className="control-title">CAPTION FONT</div><div className="choice-row">
        {([{id:"hand",label:"Handwritten"},{id:"serif",label:"Classic serif"},{id:"type",label:"Typewriter"}] as {id:Font;label:string}[]).map(v => <button key={v.id} className={`chip ${font === v.id ? "active" : ""}`} onClick={() => setFont(v.id)}>{v.label}</button>)}
      </div></div>
      <div className="control-group"><div className="control-title">TILT <small>{rotation}°</small></div><input className="range" type="range" min="-8" max="8" value={rotation} onChange={e => setRotation(Number(e.target.value))} /></div>
      <div className="action-row"><button className="secondary" onClick={reset}>Reset</button><button className="primary" disabled={!photo} onClick={download}>↓ Save as PNG</button></div>
      <div className="privacy">✳ YOUR PHOTO NEVER LEAVES YOUR DEVICE</div>
    </div>
    <div className="panel preview-panel">
      <div className="panel-head"><h2>Live preview</h2><span className="step">02 — YOUR CREATION</span></div>
      <div className="preview-stage">
        <div className={`polaroid ${frame === "iphone" ? "iphone" : ""}`} style={{transform:`rotate(${rotation}deg)`,background:frame === "dark" ? "#282522" : frame === "soft" ? "#f4eee5" : undefined}}>
          <div className={`photo-window ${filter === "pixel" ? "pixel" : filter === "pastel" ? "pastel" : filter === "gold" ? "gold" : filter === "bw" ? "bw" : filter === "vintage" ? "vintage" : filter === "cool" ? "cool" : filter === "soft" ? "soft" : filter === "dark" ? "dark" : ""}`}>
            {photo ? <img ref={imageRef} src={photo} alt="Your uploaded Polaroid preview" style={{filter:filterCss()}} /> : <div className="preview-empty"><span>▧</span>Your photo will<br/>appear right here</div>}
          </div>
          <div className="caption-area"><div className="caption-text" style={{color:frame === "dark" ? "#f7f1e8" : textColor,fontFamily:font === "hand" ? '"Caveat", cursive' : font === "serif" ? '"Playfair Display", serif' : '"DM Mono", monospace',fontSize:font === "type" ? 12 : undefined}}>{caption || " "}</div><div className="date-text" style={{color:frame === "dark" ? "#c9c0b5" : undefined}}>{dateLabel}</div></div>
        </div>
      </div>
      <div className="privacy">A SMALL FRAME FOR A BIG MEMORY.</div>
    </div>
  </section>;
}

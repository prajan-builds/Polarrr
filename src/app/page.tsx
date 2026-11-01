import PolaroidMaker from "@/components/PolaroidMaker";

export default function Home() {
  return (
    <main>
      <div className="shell">
        <header className="topbar">
          <div className="brand">polar<span>rr</span> ✳</div>
          <div className="top-note">A LITTLE PHOTO STUDIO · 001</div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Your memories, made tangible</div>
            <h1>Make it a<br />little moment.</h1>
            <p>
              Turn your favourite photos into keepsakes. Pick a frame, add a
              note, make it yours — then save it forever.
            </p>
          </div>
          <div className="hero-mark">✳</div>
        </section>

        <PolaroidMaker />

        <footer className="footer">
          <span>POLARRR PHOTO STUDIO</span>
          <span>YOUR PHOTOS STAY ON YOUR DEVICE ↗</span>
        </footer>
      </div>
    </main>
  );
}

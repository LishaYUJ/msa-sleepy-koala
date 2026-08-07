import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Moon, Trophy } from 'lucide-react';
import heroImage from '../assets/hero.png';

export const Landing: React.FC = () => (
  <main className="landing-page">
    <style>{`
      .landing-page { position: relative; z-index: 1; min-height: 100vh; padding: 24px clamp(20px, 5vw, 72px) 56px; color: var(--text-main); }
      .landing-nav { max-width: 1180px; height: 56px; margin: 0 auto; display:flex; align-items:center; justify-content:space-between; }
      .landing-brand { display:flex; align-items:center; gap:10px; color:var(--text-main); font-size:1.2rem; }
      .landing-login { color:var(--text-main); font-weight:600; }
      .landing-hero { max-width:1180px; min-height:calc(100dvh - 136px); margin:0 auto; display:grid; grid-template-columns:1.02fr .98fr; gap:clamp(32px, 7vw, 104px); align-items:center; }
      .landing-copy { max-width:570px; }
      .landing-copy h1 { font-size:clamp(3rem, 6vw, 5.65rem); line-height:.98; margin:18px 0; }
      .landing-copy p { max-width:510px; color:var(--text-muted); font-size:1.14rem; line-height:1.65; }
      .landing-kicker { display:inline-flex; align-items:center; gap:8px; color:#c8cdfc; font-size:.92rem; font-weight:700; }
      .landing-actions { display:flex; flex-wrap:wrap; gap:14px; margin-top:30px; }
      .landing-actions .btn { text-decoration:none; min-height:48px; }
      .landing-secondary { color:var(--text-main); border:1px solid var(--card-border); background:rgba(255,255,255,.04); }
      .landing-secondary:hover { color:var(--text-main); border-color:rgba(255,255,255,.28); }
      .landing-visual { position:relative; min-height:440px; display:flex; align-items:center; justify-content:center; }
      .landing-visual::before { content:''; position:absolute; width:min(42vw, 500px); aspect-ratio:1; border-radius:50%; background:radial-gradient(circle, rgba(129,140,248,.22), transparent 67%); }
      .landing-visual img { position:relative; max-width:100%; max-height:520px; object-fit:contain; filter:drop-shadow(0 22px 34px rgba(0,0,0,.28)); }
      .landing-steps { max-width:1180px; margin:12px auto 0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
      .landing-step { min-height:150px; padding:22px; border:1px solid var(--card-border); border-radius:18px; background:rgba(20,26,54,.48); }
      .landing-step svg { color:var(--primary); margin-bottom:16px; }
      .landing-step h2 { font-size:1.12rem; margin-bottom:8px; }
      .landing-step p { color:var(--text-muted); line-height:1.5; }
      @media (max-width:760px) { .landing-page { padding-top:16px; } .landing-hero { min-height:auto; grid-template-columns:1fr; padding:52px 0 40px; gap:16px; } .landing-copy h1 { font-size:3.2rem; } .landing-visual { min-height:270px; order:-1; } .landing-visual img { max-height:320px; } .landing-steps { grid-template-columns:1fr; } }
    `}</style>
    <nav className="landing-nav" aria-label="Main navigation">
      <Link className="landing-brand brand-font" to="/"><Moon size={25} aria-hidden="true" />Sleepy Koala</Link>
      <Link className="landing-login" to="/login">Log in</Link>
    </nav>
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="landing-kicker"><Moon size={17} aria-hidden="true" />A gentler way to keep a sleep goal</div>
        <h1>Go to sleep on time, with your koala.</h1>
        <p>Set a bedtime goal and check in before you sleep. Each small win helps your koala and your habit grow stronger.</p>
        <div className="landing-actions">
          <Link className="btn btn-primary" to="/login?mode=register">Set my goal <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link className="btn landing-secondary" to="/login">I have an account</Link>
        </div>
      </div>
      <div className="landing-visual"><img src={heroImage} alt="A Sleepy Koala resting peacefully" /></div>
    </section>
    <section className="landing-steps" aria-label="How it works">
      <article className="landing-step"><Moon size={24} aria-hidden="true" /><h2>Set a sleep goal</h2><p>Choose when you want to start getting ready for bed.</p></article>
      <article className="landing-step"><CheckCircle2 size={24} aria-hidden="true" /><h2>Check in before bed</h2><p>Open the app at night and let your koala know you are ready to rest.</p></article>
      <article className="landing-step"><Trophy size={24} aria-hidden="true" /><h2>Build your streak</h2><p>Keep checking in on time to unlock badges and care for your koala.</p></article>
    </section>
  </main>
);

"use client";
import { useState } from "react";
import { analyzeIdea } from "./api";

const agents = [
  { icon: "📊", title: "MARKET", sub: "Demand · Trends · Rivals", color: "#3b82f6", glow: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.2)" },
  { icon: "🧩", title: "PRODUCT", sub: "MVP · Roadmap · UX", color: "#8b5cf6", glow: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.2)" },
  { icon: "💰", title: "FINANCE", sub: "Revenue · ROI · Models", color: "#10b981", glow: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.2)" },
  { icon: "😈", title: "DEVIL", sub: "Risks · Gaps · Threats", color: "#ef4444", glow: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.2)" },
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [location, setLocation] = useState("India");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!idea.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    for (let i = 0; i < agents.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    try {
      const data = await analyzeIdea({ idea, location, category, stage });
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Check your API keys and try again.");
    } finally {
      setLoading(false);
      setActiveStep(-1);
    }
  }

  function handleReset() {
    setResult(null);
    setIdea("");
    setLocation("India");
    setCategory("");
    setStage("");
    setError("");
  }

  return (
    <main className="min-h-screen text-white relative overflow-hidden" style={{ background: "#030303", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.07), transparent)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, #ef4444, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-10">

        {/* Navbar */}
        <nav className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-3">
            <div style={{ width: 32, height: 32, border: "1.5px solid #ef4444", borderRadius: 8, display: "grid", placeItems: "center" }}>
              <div style={{ width: 12, height: 12, background: "linear-gradient(135deg,#ef4444,#dc2626)", borderRadius: 3 }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: "#fff" }}>WAR ROOM</div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: "#374151", marginTop: 1 }}>AI INTELLIGENCE PLATFORM</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "5px 12px" }}>
            <div className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: 1.5, fontWeight: 600 }}>SYSTEM LIVE</span>
          </div>
        </nav>

        {/* Hero — hidden when results showing */}
        {!result && !loading && (
          <div className="text-center mb-12">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
              <div className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: 10, letterSpacing: 3, color: "#ef4444", fontWeight: 700 }}>VENTURE INTELLIGENCE SYSTEM</span>
              <div className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444" }} />
            </div>
            <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, color: "#fff", marginBottom: 8 }}>VALIDATE YOUR</h1>
            <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, marginBottom: 20, background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>STARTUP IDEA</h1>
            <p style={{ color: "#374151", fontSize: 14, maxWidth: 400, margin: "0 auto", lineHeight: 1.9 }}>
              Deploy four elite AI strategists to war-game your startup. Market intelligence, product strategy, financial modeling, and brutal risk analysis — all in 60 seconds.
            </p>
          </div>
        )}

        {/* Input card */}
        {!result && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #141414", borderRadius: 18, padding: 22, marginBottom: 10, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.3),rgba(139,92,246,0.3),transparent)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} />
                <span style={{ fontSize: 10, letterSpacing: 3, color: "#374151", fontWeight: 700 }}>MISSION BRIEFING</span>
              </div>
              <span style={{ fontSize: 10, color: "#1f2937" }}>{idea.length} / 500</span>
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Describe your startup idea... e.g. An AI-powered fitness coaching platform for busy professionals in Mumbai"
              style={{ width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "14px 16px", color: "#9ca3af", fontSize: 14, lineHeight: 1.8, resize: "none", outline: "none", fontFamily: "inherit" }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#1a1a1a"}
            />

            {/* Location + Category + Stage */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginTop: 10 }}>

              {/* Location dropdown */}
              <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#1f2937", fontWeight: 600, marginBottom: 4 }}>LOCATION</div>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#6b7280", width: "100%", fontFamily: "inherit", cursor: "pointer" }}
                  >
                    <option value="India" style={{ background: "#111" }}>🇮🇳 India (Pan-India)</option>
                    <option value="Mumbai" style={{ background: "#111" }}>Mumbai</option>
                    <option value="Bengaluru" style={{ background: "#111" }}>Bengaluru</option>
                    <option value="Delhi NCR" style={{ background: "#111" }}>Delhi NCR</option>
                    <option value="Pune" style={{ background: "#111" }}>Pune</option>
                    <option value="Hyderabad" style={{ background: "#111" }}>Hyderabad</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>🏷️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#1f2937", fontWeight: 600, marginBottom: 4 }}>CATEGORY</div>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="SaaS · HealthTech"
                    style={{ background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#6b7280", width: "100%", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              {/* Stage */}
              <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>🚀</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#1f2937", fontWeight: 600, marginBottom: 4 }}>STAGE</div>
                  <input
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    placeholder="Idea · Pre-seed"
                    style={{ background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#6b7280", width: "100%", fontFamily: "inherit" }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!idea.trim() || loading}
              style={{ marginTop: 10, width: "100%", background: idea.trim() && !loading ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "#0f0f0f", border: "none", borderRadius: 11, padding: 15, color: idea.trim() && !loading ? "#fff" : "#1f2937", fontSize: 12, fontWeight: 800, letterSpacing: 3, cursor: idea.trim() && !loading ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: idea.trim() && !loading ? "0 0 30px rgba(59,130,246,0.2)" : "none", transition: "all 0.3s" }}
            >
              {loading ? "⚡ AGENTS DEPLOYED — ANALYZING..." : "⚡ DEPLOY ALL AGENTS — BEGIN ANALYSIS"}
            </button>
          </div>
        )}

        {/* Agent activation animation */}
        {loading && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #141414", borderRadius: 18, padding: 22, marginBottom: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#374151", fontWeight: 700, marginBottom: 16 }}>DEPLOYING AGENTS</div>
            {agents.map((a, i) => (
              <div key={a.title} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, opacity: activeStep >= i ? 1 : 0.2, transition: "opacity 0.5s" }}>
                <div style={{ width: 32, height: 32, background: activeStep >= i ? a.glow : "transparent", border: `1px solid ${activeStep >= i ? a.color : "#1a1a1a"}`, borderRadius: 8, display: "grid", placeItems: "center", fontSize: 14, transition: "all 0.5s" }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: activeStep >= i ? "#e5e7eb" : "#374151", letterSpacing: 1 }}>{a.title} AGENT</div>
                  <div style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>{activeStep === i ? "Analyzing..." : activeStep > i ? "Complete ✓" : "Waiting..."}</div>
                </div>
                {activeStep === i && <div className="animate-spin" style={{ width: 14, height: 14, border: `2px solid ${a.color}`, borderTopColor: "transparent", borderRadius: "50%" }} />}
                {activeStep > i && <div style={{ fontSize: 12, color: a.color }}>✓</div>}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16, marginBottom: 10, fontSize: 13, color: "#ef4444" }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Report header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#374151", fontWeight: 700 }}>WAR ROOM INTELLIGENCE REPORT</div>
                <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>📍 {result.location} · {result.searches_performed} real-time searches performed</div>
              </div>
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "6px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: 2 }}>{result.scores?.verdict}</div>
              </div>
            </div>

            {/* Main score card */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #141414", borderRadius: 18, padding: 22, marginBottom: 10, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 64, fontWeight: 900, color: "#10b981", letterSpacing: -3, lineHeight: 1 }}>
                    {result.scores?.viability_score}
                    <span style={{ fontSize: 20, color: "#374151" }}>/10</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#374151", marginTop: 6, letterSpacing: 3 }}>VIABILITY SCORE</div>
                </div>
                <div style={{ textAlign: "right", maxWidth: 200 }}>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.8 }}>{result.scores?.one_line}</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>🎯 {result.scores?.entry_strategy}</div>
                </div>
              </div>

              {/* Score breakdown */}
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#1f2937", fontWeight: 700, marginBottom: 12 }}>SCORE BREAKDOWN</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Market Demand", v: result.scores?.market_demand, w: "20%", c: "#3b82f6" },
                  { l: "Market Growth", v: result.scores?.market_growth, w: "10%", c: "#8b5cf6" },
                  { l: "Competition", v: result.scores?.competition, w: "15%", c: "#f59e0b" },
                  { l: "Pain Severity", v: result.scores?.pain_severity, w: "15%", c: "#10b981" },
                  { l: "Revenue Potential", v: result.scores?.revenue_potential, w: "15%", c: "#10b981" },
                  { l: "Scalability", v: result.scores?.scalability, w: "10%", c: "#3b82f6" },
                  { l: `Regional Fit (${result.location})`, v: result.scores?.regional_fit, w: "10%", c: "#8b5cf6" },
                  { l: "Execution Complexity", v: result.scores?.execution_complexity, w: "5%", c: "#ef4444" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "#0a0a0a", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: "#4b5563" }}>{s.l}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9, color: "#1f2937" }}>weight {s.w}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: s.c }}>{s.v}/10</span>
                      </div>
                    </div>
                    <div style={{ height: 3, background: "#111", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(s.v / 10) * 100}%`, background: s.c, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent reports */}
            {[
              { label: "📊 MARKET INTELLIGENCE", content: result.market, color: "#3b82f6", bg: "rgba(59,130,246,0.03)" },
              { label: "🧩 PRODUCT STRATEGY", content: result.product, color: "#8b5cf6", bg: "rgba(139,92,246,0.03)" },
              { label: "💰 BUSINESS & FINANCE", content: result.finance, color: "#10b981", bg: "rgba(16,185,129,0.03)" },
              { label: "😈 DEVIL'S ADVOCATE", content: result.devil, color: "#ef4444", bg: "rgba(239,68,68,0.03)" },
            ].map((r) => (
              <div key={r.label} style={{ background: r.bg, border: "1px solid #141414", borderTop: `2px solid ${r.color}`, borderRadius: 14, padding: 20, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                  <div style={{ fontSize: 10, letterSpacing: 3, color: r.color, fontWeight: 700 }}>{r.label}</div>
                </div>
                <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 2, whiteSpace: "pre-wrap" }}>{r.content}</div>
              </div>
            ))}

            {/* Footer stats */}
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #141414", borderRadius: 14, padding: 16, marginBottom: 10, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#3b82f6" }}>{result.searches_performed}</div>
                <div style={{ fontSize: 9, color: "#374151", letterSpacing: 2, marginTop: 2 }}>WEB SEARCHES</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#8b5cf6" }}>1</div>
                <div style={{ fontSize: 9, color: "#374151", letterSpacing: 2, marginTop: 2 }}>AI MODEL</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981" }}>4</div>
                <div style={{ fontSize: 9, color: "#374151", letterSpacing: 2, marginTop: 2 }}>AGENTS DEPLOYED</div>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{ width: "100%", background: "transparent", border: "1px solid #1f1f1f", borderRadius: 11, padding: 14, color: "#4b5563", fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit" }}
            >
              ↩ ANALYZE ANOTHER IDEA
            </button>
          </div>
        )}

        {/* Agent cards — home only */}
        {!result && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 4 }}>
            {agents.map((a) => (
              <div key={a.title} style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #141414", borderTop: `1.5px solid ${a.color}`, borderRadius: 13, padding: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle,${a.glow},transparent)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, background: a.glow, border: `1px solid ${a.border}`, borderRadius: 7, display: "grid", placeItems: "center", fontSize: 13 }}>{a.icon}</div>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#e5e7eb", letterSpacing: 2, marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 9, color: "#374151" }}>{a.sub}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
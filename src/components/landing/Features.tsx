import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "\u25C8",
    title: "Template Gallery",
    description:
      "Dozens of professionally designed templates for blogs, SaaS, portfolios, and beyond.",
    tag: "Design",
    preview: "template" as const,
  },
  {
    icon: "\u25EB",
    title: "Rich Patterns",
    description:
      "Dots, grids, diagonals, waves, noise \u2014 apply stunning background patterns with a single click.",
    tag: "Patterns",
    preview: "patterns" as const,
  },
  {
    icon: "\u2B21",
    title: "Visual Editor",
    description:
      "Canva-like live editor. Customize fonts, layouts, and every pixel of your image.",
    tag: "Editor",
    preview: "editor" as const,
  },
  {
    icon: "\u2193",
    title: "Instant Export",
    description:
      "Download crisp 1200\u00d7630 PNGs. Share links or copy to clipboard instantly.",
    tag: "Export",
    preview: "export" as const,
  },
  {
    icon: "\u25A3",
    title: "Gradients & Solid Colors",
    description:
      "Linear, radial, conic gradients or flat solid fills \u2014 unlimited palette with a visual color picker.",
    tag: "Colors",
    preview: "colors" as const,
  },
  {
    icon: "\u2726",
    title: "Free to Customize",
    description:
      "Every element \u2014 text, background, shape, border, shadow \u2014 is fully yours to adjust. No locked layers.",
    tag: "Custom",
    preview: "custom" as const,
  },
];

type PreviewType = (typeof FEATURES)[number]["preview"];

const previewBase: React.CSSProperties = {
  borderRadius: 10,
  overflow: "hidden",
  height: 140,
  position: "relative",
  border: "1px solid rgba(255,255,255,0.05)",
};

function DotGridPreview() {
  return (
    <div style={{ ...previewBase, background: "#0d0d12" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(167,139,250,0.5) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(124,58,237,0.07) 0px, rgba(124,58,237,0.07) 1px, transparent 1px, transparent 12px)",
          backgroundSize: "17px 17px",
        }}
      />
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          opacity: 0.35,
        }}
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 C60,0 120,60 180,30 C240,0 300,60 360,30 C390,15 400,22 400,22 L400,60 L0,60 Z"
          fill="rgba(124,58,237,0.6)"
        />
        <path
          d="M0,40 C80,10 160,60 240,35 C300,15 360,50 400,35 L400,60 L0,60 Z"
          fill="rgba(79,70,229,0.4)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "rgba(167,139,250,0.6)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        dot &middot; grid &middot; wave &middot; diagonal &middot; noise
      </div>
    </div>
  );
}

function ColorsPreview() {
  return (
    <div
      style={{ ...previewBase, display: "flex", flexDirection: "column", gap: 0 }}
    >
      <div style={{ display: "flex", height: "55%", flexShrink: 0 }}>
        {[
          "linear-gradient(135deg,#7c3aed,#4f46e5)",
          "linear-gradient(135deg,#0ea5e9,#6366f1)",
          "linear-gradient(135deg,#f59e0b,#ef4444)",
          "linear-gradient(135deg,#10b981,#0ea5e9)",
          "linear-gradient(135deg,#ec4899,#8b5cf6)",
        ].map((g, i) => (
          <div key={i} style={{ flex: 1, background: g }} />
        ))}
      </div>
      <div style={{ display: "flex", height: "45%", flexShrink: 0 }}>
        {[
          "#09090d",
          "#1e1b4b",
          "#4c1d95",
          "#7c3aed",
          "#a78bfa",
          "#e8e8f0",
          "#fbbf24",
          "#ef4444",
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 10,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.1em",
        }}
      >
        linear &middot; radial &middot; conic &middot; solid
      </div>
    </div>
  );
}

function CustomPreview() {
  return (
    <div
      style={{
        ...previewBase,
        background: "#0d0d12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          background:
            "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.08))",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 8,
          padding: "14px 16px",
          position: "relative",
        }}
      >
        {[
          { top: 0, left: 0 },
          { top: 0, right: 0 },
          { bottom: 0, left: 0 },
          { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              background: "#7c3aed",
              borderRadius: 1,
              ...Object.fromEntries(
                Object.entries(pos).map(([k, v]) => [k, -3])
              ),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: -3,
            transform: "translateY(-50%)",
            width: 6,
            height: 6,
            background: "#a78bfa",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: -3,
            transform: "translateY(-50%)",
            width: 6,
            height: 6,
            background: "#a78bfa",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "rgba(167,139,250,0.5)",
            letterSpacing: "0.1em",
            marginBottom: 6,
          }}
        >
          HEADING TEXT
        </div>
        <div
          style={{
            width: "60%",
            height: 5,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            marginBottom: 4,
          }}
        />
        <div
          style={{
            width: "40%",
            height: 5,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -1,
            border: "1px dashed rgba(124,58,237,0.5)",
            borderRadius: 8,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function TemplatePreview() {
  return (
    <div
      style={{
        ...previewBase,
        background: "#0d0d12",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 6,
        padding: 12,
      }}
    >
      {[
        { bg: "linear-gradient(135deg,#1e1b4b,#4c1d95)", accent: "#7c3aed" },
        { bg: "linear-gradient(135deg,#0f172a,#1e3a5f)", accent: "#0ea5e9" },
        { bg: "linear-gradient(135deg,#1a0a0a,#3b1212)", accent: "#ef4444" },
        { bg: "linear-gradient(135deg,#0a1a0a,#0f3322)", accent: "#10b981" },
        { bg: "#111118", accent: "#a78bfa" },
        { bg: "linear-gradient(135deg,#1a1108,#2d1f04)", accent: "#f59e0b" },
      ].map((t, i) => (
        <div
          key={i}
          style={{
            background: t.bg,
            borderRadius: 5,
            padding: 6,
            border: `1px solid ${t.accent}22`,
          }}
        >
          <div
            style={{
              width: "70%",
              height: 3,
              background: t.accent,
              borderRadius: 1,
              marginBottom: 3,
              opacity: 0.8,
            }}
          />
          <div
            style={{
              width: "50%",
              height: 2,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 1,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function EditorPreview() {
  return (
    <div
      style={{
        ...previewBase,
        background: "#0d0d12",
        display: "flex",
      }}
    >
      <div
        style={{
          width: 28,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 10,
          gap: 8,
        }}
      >
        {["T", "\u25AD", "\u25CE", "\u2336"].map((ic, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: i === 0
                ? "rgba(124,58,237,0.3)"
                : "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 7,
              color: i === 0 ? "#a78bfa" : "rgba(255,255,255,0.25)",
            }}
          >
            {ic}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 60% 40%, rgba(124,58,237,0.08) 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            width: "75%",
            aspectRatio: "1200/630",
            background: "linear-gradient(135deg,#161620,#1e1b4b)",
            borderRadius: 4,
            border: "1px solid rgba(124,58,237,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 4,
                background: "rgba(167,139,250,0.5)",
                borderRadius: 2,
                margin: "0 auto 4px",
              }}
            />
            <div
              style={{
                width: 32,
                height: 3,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 2,
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: 36,
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          padding: "8px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"].map((c, i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: 3,
              background: c,
              margin: "0 auto",
              opacity: 0.8,
            }}
          />
        ))}
        <div
          style={{
            width: 20,
            height: 1,
            background: "rgba(255,255,255,0.08)",
            margin: "2px auto",
          }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            border: "1px dashed rgba(255,255,255,0.15)",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}

function ExportPreview() {
  return (
    <div
      style={{
        ...previewBase,
        background: "#0d0d12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 120,
          height: 63,
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
          borderRadius: 6,
          border: "1px solid rgba(124,58,237,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 3,
              background: "rgba(167,139,250,0.5)",
              borderRadius: 2,
              margin: "0 auto 3px",
            }}
          />
          <div
            style={{
              width: 28,
              height: 2,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              margin: "0 auto",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 6,
            padding: "5px 12px",
          }}
        >
          <span style={{ fontSize: 10 }}>&darr;</span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              color: "#a78bfa",
              letterSpacing: "0.08em",
            }}
          >
            PNG
          </span>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.06em",
          }}
        >
          1200 &times; 630
        </div>
      </div>
    </div>
  );
}

function FeaturePreview({ type }: { type: PreviewType }) {
  switch (type) {
    case "patterns":
      return <DotGridPreview />;
    case "colors":
      return <ColorsPreview />;
    case "custom":
      return <CustomPreview />;
    case "template":
      return <TemplatePreview />;
    case "editor":
      return <EditorPreview />;
    case "export":
      return <ExportPreview />;
    default:
      return (
        <div style={{ ...previewBase, background: "rgba(124,58,237,0.05)" }} />
      );
  }
}

const Features = () => {
  return (
    <section id="features" className="py-24 relative scroll-mt-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between gap-6 flex-wrap mb-16"
        >
          <div>
            <div className="font-mono text-xs text-primary tracking-[0.15em] uppercase mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-primary inline-block" />
              Features
            </div>
            <h2
              className="text-3xl md:text-[46px] font-bold leading-[1.1] max-w-[480px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Build faster.{" "}
              <em className="text-primary not-italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Look better.
              </em>
            </h2>
          </div>
          <p className="text-muted-foreground/60 max-w-[300px] leading-relaxed">
            Everything you need to ship polished OG images without opening
            another tool.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-7 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                e.currentTarget.style.background =
                  "rgba(124,58,237,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.03)";
              }}
            >
              <FeaturePreview type={feature.preview} />
              <div className="flex items-start justify-between gap-2 mb-2 mt-5">
                <h3 className="text-base font-semibold text-[#f0f0f8]">
                  {feature.title}
                </h3>
                <span
                  className="font-mono text-[10px] text-primary uppercase tracking-widest shrink-0 mt-0.5 px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  {feature.tag}
                </span>
              </div>
              <p className="text-sm text-muted-foreground/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

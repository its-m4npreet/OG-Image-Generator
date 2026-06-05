import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "Content Creator",
    quote:
      "OG Studio completely transformed my workflow. Beautiful OG images in seconds, no design tool needed.",
  },
  {
    initials: "MJ",
    name: "Marcus Johnson",
    role: "SaaS Founder",
    quote:
      "The API integration was seamless. We generate hundreds of OG images daily. The quality is outstanding.",
  },
  {
    initials: "PP",
    name: "Priya Patel",
    role: "Blogger",
    quote:
      "Beautiful templates, a real visual editor, and total control over every detail. Worth switching for.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative scroll-mt-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="font-mono text-xs text-primary tracking-[0.15em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-5 h-px bg-primary inline-block" />
            Testimonials
          </div>
          <h2
            className="text-3xl md:text-[44px] font-bold leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Loved by <em className="text-primary not-italic" style={{ fontFamily: "'Playfair Display', serif" }}>creators</em> everywhere
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-7 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-primary" style={{ fontSize: 12 }}>
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="text-[14.5px] text-muted-foreground/70 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-mono text-xs text-primary font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground/40 tracking-wide uppercase mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

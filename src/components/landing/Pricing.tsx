import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    sub: "Forever free",
    features: [
      "5 templates",
      "Basic editor",
      "PNG export",
      "Watermark on images",
      "Community support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    sub: "per month",
    features: [
      "All templates",
      "Advanced editor",
      "No watermark",
      "API access",
      "Custom branding",
      "Priority support",
      "URL scraper",
      "Smart color suggestions",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative scroll-mt-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="font-mono text-xs text-primary tracking-[0.15em] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-5 h-px bg-primary inline-block" />
            Pricing
          </div>
          <h2
            className="text-3xl md:text-[44px] font-bold leading-[1.1] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground/60">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-[680px] mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl p-9 transition-transform duration-200 hover:-translate-y-1 relative overflow-hidden"
              style={{
                background: plan.highlight
                  ? "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.06))"
                  : "rgba(255,255,255,0.025)",
                border: plan.highlight
                  ? "1px solid rgba(124,58,237,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {plan.highlight && (
                <>
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, #7c3aed, #4f46e5, #7c3aed)",
                    }}
                  />
                  <div
                    className="absolute top-5 right-5 font-mono text-[9px] text-primary tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.25)",
                    }}
                  >
                    Popular
                  </div>
                </>
              )}

              <div className="mb-2">
                <span className="text-base font-semibold text-foreground/80">
                  {plan.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span
                  className="text-[44px] font-bold text-[#f0f0f8] leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {plan.price}
                </span>
                <span className="font-mono text-xs text-muted-foreground/40">
                  {plan.sub}
                </span>
              </div>

              <div
                className="h-px my-6"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground/70"
                  >
                    <span
                      className="text-xs"
                      style={{
                        color: plan.highlight
                          ? "#7c3aed"
                          : "rgba(255,255,255,0.25)",
                      }}
                    >
                      &#10003;
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "hero" : "hero-outline"}
                className="w-full"
                asChild
              >
                <Link to={plan.highlight ? "/login" : "/signup"}>
                  {plan.cta}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with OG Studio",
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
    period: "/month",
    description: "For creators and teams",
    features: [
      "All templates",
      "Advanced editor",
      "No watermark",
      "API access",
      "Custom branding",
      "Priority support",
      "URL scraper",
      "AI features",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl p-8 border transition-all duration-150 ${
                plan.highlight
                  ? "border-primary/40 bg-card glow-primary"
                  : "border-border bg-card/60"
              }`}
            >
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-secondary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "hero" : "hero-outline"}
                className="w-full"
                asChild
              >
                <Link to={plan.highlight ? "/login" : "/signup"}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

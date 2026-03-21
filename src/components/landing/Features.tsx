import { motion } from "framer-motion";
import { Palette, Wand2, Download, Link2, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Template Gallery",
    description: "Choose from dozens of professionally designed templates for blogs, SaaS, portfolios, and more.",
  },
  {
    icon: Wand2,
    title: "AI Generation",
    description: "Generate titles, color palettes, and layouts with AI. Just provide keywords or a URL.",
  },
  {
    icon: Layers,
    title: "Visual Editor",
    description: "Canva-like editor with live preview. Customize fonts, colors, gradients, and images.",
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Download as PNG at 1200×630 resolution. Copy the link or share directly.",
  },
  {
    icon: Link2,
    title: "URL Scraper",
    description: "Paste any URL to auto-extract title, description, and OG data into your design.",
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Generate OG images programmatically with our REST API. Perfect for automation.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to create <span className="text-gradient">perfect OG images</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From AI-powered generation to pixel-perfect editing, OG Studio has it all.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-150">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

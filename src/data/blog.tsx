export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  content: React.ReactNode;
}

export const posts: BlogPost[] = [
  {
    title: "What Are Open Graph Images and Why They Matter",
    excerpt:
      "Learn how OG images improve link sharing on social media platforms like Twitter, LinkedIn, and Slack.",
    date: "Jun 1, 2026",
    slug: "what-are-open-graph-images",
    content: (
      <>
        <p>
          When you share a link on social media, a preview card appears — the title, description, and image.
          That image is called an Open Graph (OG) image, and it is one of the most impactful pieces of
          metadata you can control.
        </p>
        <p>
          OG images are defined by the <code>og:image</code> meta tag in your HTML. Platforms like Twitter,
          LinkedIn, Facebook, and Slack all use this tag to generate link previews. A well-designed OG image
          can dramatically improve click-through rates.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Why OG Images Matter</h3>
        <p>
          Links with images get significantly more engagement than text-only links. An OG image is often
          the first thing people see before deciding whether to click. It is your content's first impression.
        </p>
        <p>
          Beyond engagement, OG images help establish brand consistency. Using a consistent template with
          your logo, colors, and typography ensures every shared link reinforces your brand identity.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Best Practices</h3>
        <p>
          The standard OG image size is 1200×630 pixels. Use readable fonts, high-contrast text, and
          keep the focal point centered since previews are often cropped differently by each platform.
        </p>
        <p>
          OG Studio makes it easy to create beautiful, on-brand OG images for every piece of content
          you publish — in seconds, not hours.
        </p>
      </>
    ),
  },
  {
    title: "How to Generate OG Images for Your Blog Posts",
    excerpt:
      "A step-by-step guide to creating consistent, branded Open Graph images for every article you publish.",
    date: "May 20, 2026",
    slug: "generate-og-images-for-blog",
    content: (
      <>
        <p>
          Creating OG images for every blog post used to require a designer. With OG Studio, you can
          generate professional-looking social previews in minutes.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Step 1: Choose a Template</h3>
        <p>
          Browse the template library and pick a design that matches your brand. Each template is fully
          customizable — colors, fonts, layouts, and images.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Step 2: Customize</h3>
        <p>
          Edit the title and subtitle to match your post. Adjust the gradient, add your logo, and
          fine-tune the positioning until everything looks perfect.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Step 3: Export</h3>
        <p>
          Download your OG image as a PNG and upload it to your blog's CMS, or add the URL directly
          to your page's <code>og:image</code> meta tag.
        </p>
        <p>
          For automated workflows, check out our API docs to learn how to generate OG images
          programmatically during your build process.
        </p>
      </>
    ),
  },
  {
    title: "Best Practices for Social Media Preview Images",
    excerpt:
      "Design tips and technical guidelines to make your link previews stand out in any feed.",
    date: "May 10, 2026",
    slug: "social-media-preview-best-practices",
    content: (
      <>
        <p>
          Not all OG images are created equal. Here are design and technical best practices to ensure
          your link previews look great everywhere.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Stick to 1200×630</h3>
        <p>
          This is the standard OG image aspect ratio (1.91:1). Most platforms will crop or letterbox
          images that deviate from this ratio.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Keep Text Centered</h3>
        <p>
          Social platforms crop previews differently. Twitter may show a square crop, while LinkedIn shows
          a wider crop. Keep important text and visuals in the center 600×600 safe zone.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Use High Contrast</h3>
        <p>
          Light text on dark backgrounds or dark text on light backgrounds ensures readability at small
          sizes. Avoid low-contrast combinations that may be hard to read on mobile.
        </p>
        <h3 className="text-foreground font-semibold text-base mt-8">Brand Consistently</h3>
        <p>
          Use the same colors, fonts, and logo placement across all OG images. Consistency helps your
          content become instantly recognizable in a crowded feed.
        </p>
      </>
    ),
  },
];

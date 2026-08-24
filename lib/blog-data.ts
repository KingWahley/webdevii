export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: "Web Design" | "Frontend Engineering" | "UI/UX Systems" | "AI & Tech";
  readTime: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  sections: {
    heading?: string;
    paragraphs: string[];
    quote?: string;
    keyTakeaways?: string[];
  }[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "starting-career-web-design",
    slug: "starting-career-web-design",
    title: "Starting and Growing a Career in Web Design",
    category: "Web Design",
    readTime: "6 min read",
    date: "Apr 15, 2026",
    excerpt:
      "An in-depth guide on how to kickstart your creative career, master high-end digital design systems, build an authoritative design portfolio, and attract high-paying clients.",
    tags: ["Design Career", "Portfolio Strategy", "UI Design", "Freelancing"],
    sections: [
      {
        heading: "The Modern Landscape of Web Design",
        paragraphs: [
          "Breaking into web design requires more than just knowing Figma or Photoshop. In today's competitive digital economy, high-performing designers understand business outcomes, conversion metrics, and design systems.",
          "Clients and employers are no longer seeking generic static mockups. They look for professionals who understand how design decisions directly affect user retention, accessibility, and measurable sales conversion.",
        ],
        quote: "Great design is not just what looks good; it's what solves the customer's problem with maximum clarity and zero friction.",
      },
      {
        heading: "Mastering the Fundamentals First",
        paragraphs: [
          "Before diving into complex animations or experimental grids, ensure you possess mastery over the core foundations: typography hierarchy, spatial cadence (the 8pt grid system), contrast ratios (WCAG standards), and responsive layout patterns.",
          "When typography is set with intentional leading and tracking, readability skyrockets. Spend time studying how proportions between H1, H2, and body copy establish instant visual authority.",
        ],
        keyTakeaways: [
          "Establish an 8pt layout grid and adhere to consistent spacing scales.",
          "Design with real copy and authentic content, not Lorem Ipsum.",
          "Prioritize high contrast and accessibility standards across all screen sizes.",
        ],
      },
      {
        heading: "Building a High-Impact Portfolio",
        paragraphs: [
          "Your portfolio should not be a gallery of screenshots. Instead, craft 3 to 4 comprehensive case studies that walk the reader through the challenge, your hypothesis, the design iterations, and the tangible business results.",
          "Include interactive previews, live links, and concise post-mortems discussing what you learned during the build. This demonstrates strategic maturity and craftsmanship.",
        ],
      },
    ],
  },
  {
    id: "create-landing-page",
    slug: "create-landing-page",
    title: "Create a Landing Page That Performs Great",
    category: "UI/UX Systems",
    readTime: "5 min read",
    date: "Mar 12, 2026",
    excerpt:
      "Key design principles and copywriting strategies to maximize conversions. Learn how visual hierarchy, typography sizing, and strategic micro-interactions guide user behavior.",
    tags: ["Conversion Rate", "Landing Page", "UX Strategy", "Copywriting"],
    sections: [
      {
        heading: "The Anatomy of a High-Converting Hero Section",
        paragraphs: [
          "A landing page has one job: communicate value swiftly and guide visitors to a singular desired action with minimal friction.",
          "Structure your hero section with razor-sharp value propositions: an unmissable headline, concise supporting proof, and a high-contrast primary call to action above the fold.",
        ],
        quote: "If a visitor cannot explain what your product does within five seconds of landing on your page, you have lost them.",
      },
      {
        heading: "Reducing Friction & Cognitive Load",
        paragraphs: [
          "Every additional form field, competing button, or vague paragraph increases cognitive load and drops conversion rates.",
          "Use a structured narrative flow: Hero (Value Proposition) → Proof (Logos/Metrics) → Problem & Solution Breakdown → Interactive Showcase → Social Proof (Testimonials) → Irresistible Closing Call to Action.",
        ],
        keyTakeaways: [
          "Stick to one primary call to action per viewport.",
          "Anchor claims with real numbers and verifiable social proof.",
          "Ensure sub-second initial load speeds on mobile networks.",
        ],
      },
    ],
  },
  {
    id: "designers-prepare-future",
    slug: "designers-prepare-future",
    title: "How Can Designers Prepare for the Future?",
    category: "AI & Tech",
    readTime: "7 min read",
    date: "Feb 28, 2026",
    excerpt:
      "Exploring the intersection of AI tools and user interface design. Learn how designers can leverage creative engineering to build unique interactive experiences.",
    tags: ["AI & Design", "Future of Work", "Creative Engineering", "Next.js"],
    sections: [
      {
        heading: "The Rise of the Designer-Engineer",
        paragraphs: [
          "Generative AI and agentic coding tools are transforming the speed at which ideas become interactive reality. The boundary between design and code is blurring faster than ever.",
          "Designers who embrace creative engineering—understanding component architectures, animation libraries like GSAP, and programmatic design tokens—will be best positioned to lead.",
        ],
        quote: "AI will automate repetitive layouts; human taste, deep empathy, and refined art direction remain the true differentiators.",
      },
      {
        heading: "Skills That Will Remain Future-Proof",
        paragraphs: [
          "While boilerplate code and standard UI widgets can be generated instantly, understanding user psychology, nuanced micro-interactions, and brand storytelling cannot be automated.",
          "Invest in mastering frontend frameworks (Next.js, React, Tailwind) alongside your design tooling (Figma). Being able to build what you design makes you 10x more effective as a product builder.",
        ],
        keyTakeaways: [
          "Embrace AI agents as high-velocity co-pilots for prototyping and scaffolding.",
          "Deepen your understanding of web performance, browser APIs, and kinetic animation.",
          "Focus on holistic product systems rather than isolated visual screens.",
        ],
      },
    ],
  },
  {
    id: "mastering-tailwind-v4",
    slug: "mastering-tailwind-v4",
    title: "Modern Component Architecture with Tailwind & Next.js",
    category: "Frontend Engineering",
    readTime: "8 min read",
    date: "Jan 18, 2026",
    excerpt:
      "Architecting scalable, modular design tokens and performant React components without sacrificing visual nuance or runtime efficiency.",
    tags: ["Tailwind CSS", "Next.js", "Architecture", "React"],
    sections: [
      {
        heading: "Token-Driven Design in Code",
        paragraphs: [
          "Modern frontend architecture relies heavily on composable primitives and strict token enforcement. By mapping brand colors and typography into CSS variables and Tailwind themes, design consistency remains effortless.",
          "Leverage React Server Components by default for static sections and isolate client-side boundaries solely for interactive forms, sliders, and animation controllers.",
        ],
        keyTakeaways: [
          "Use CSS variables for theme tokens to simplify dark mode and dynamic theming.",
          "Keep component interfaces small, explicit, and typed with TypeScript.",
        ],
      },
    ],
  },
  {
    id: "micro-interactions-guide",
    slug: "micro-interactions-guide",
    title: "The Art of Subtle Motion & Micro-Interactions",
    category: "UI/UX Systems",
    readTime: "4 min read",
    date: "Jan 04, 2026",
    excerpt:
      "Why the best web animations are felt rather than noticed, and how to implement buttery smooth interactions using Lenis and GSAP.",
    tags: ["GSAP", "Lenis", "Micro-Interactions", "Motion Design"],
    sections: [
      {
        heading: "Kinetic Feedback in Modern Web Apps",
        paragraphs: [
          "Micro-interactions provide kinetic feedback that reassures users their actions are acknowledged. A well-timed easing curve makes an interface feel tangible and responsive.",
          "Avoid jarring transitions. Prioritize performant properties (transform, opacity) and ensure motion respects user preferences for reduced motion.",
        ],
        keyTakeaways: [
          "Stick to transform and opacity for 60fps / 120fps hardware acceleration.",
          "Use exponential ease-out curves for natural deceleration feel.",
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug || post.id === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { getBlogBySlug, getBlogs } from "@/app/actions/blogs";

interface Props {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found - Peter Olawale",
    };
  }

  return {
    title: `${post.title} - Peter Olawale`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetail({ params }: Props) {
  const [post, allBlogs] = await Promise.all([
    getBlogBySlug(params.slug),
    getBlogs(),
  ]);

  if (!post) {
    notFound();
  }

  // Find related posts (other posts)
  const relatedPosts = allBlogs
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="bg-dark text-neutral-100 min-h-screen relative pb-12">
      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-6 pt-28 sm:pt-36 pb-16 space-y-12">
        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#262626] text-[#FF6B35] font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-neutral-500 font-medium">{post.read_time}</span>
            <span className="text-neutral-700">•</span>
            <time className="text-neutral-500 font-medium">{post.date}</time>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.05]">
            {post.title}
          </h1>

          <p className="text-neutral-400 text-lg sm:text-xl font-normal leading-relaxed border-l-2 border-[#FF6B35] pl-4">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#262626]">
            <div className="w-12 h-12 rounded-full overflow-hidden relative border border-neutral-700">
              <Image
                src="/profile_portrait.png"
                alt="Peter Olawale"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">
                Peter Olawale
              </h4>
              <p className="text-xs text-neutral-500 font-medium">
                Software Engineer & UI Designer
              </p>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="space-y-10 border-t border-[#262626] pt-10">
          {(post.sections || []).map((section, idx) => (
            <section key={idx} className="space-y-6">
              {section.heading && (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {section.heading}
                </h2>
              )}

              {(section.paragraphs || []).map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-neutral-300 text-base sm:text-lg leading-relaxed font-sans"
                >
                  {para}
                </p>
              ))}

              {section.quote && (
                <blockquote className="my-8 p-6 bg-[#161616] border-l-4 border-[#FF6B35] rounded-r-2xl text-lg sm:text-xl font-medium text-white italic">
                  &ldquo;{section.quote}&rdquo;
                </blockquote>
              )}

              {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                <div className="my-6 p-6 bg-[#161616] border border-[#262626] rounded-2xl space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B35] font-display">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base text-neutral-300">
                    {section.keyTakeaways.map((item, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-2.5">
                        <span className="text-[#FF6B35] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-[#262626] pt-8">
            <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-4">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#262626] text-xs text-neutral-400 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation to Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-[#262626] pt-12 space-y-6">
            <h3 className="text-2xl font-extrabold text-white font-display">
              More Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((relPost) => (
                <Link
                  key={relPost.slug}
                  href={`/blog/${relPost.slug}`}
                  className="group bg-[#161616] border border-[#262626] rounded-2xl p-6 hover:border-neutral-700 transition duration-300 block space-y-2"
                >
                  <span className="text-[10px] text-[#FF6B35] font-bold uppercase tracking-wider">
                    {relPost.category}
                  </span>
                  <h4 className="text-base font-extrabold text-white group-hover:text-[#FF6B35] transition-colors font-display line-clamp-2">
                    {relPost.title}
                  </h4>
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {relPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Box */}
        <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-[#262626] rounded-3xl p-8 sm:p-12 text-center space-y-6 mt-12">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Ready to build something impactful?
          </h3>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Let&apos;s collaborate to design and develop your next web project.
          </p>
          <a
            href="/#contact"
            className="inline-block bg-[#FF6B35] text-neutral-950 font-black uppercase px-8 py-4 rounded-2xl hover:bg-[#e05a2b] active:scale-95 transition duration-300 tracking-wider text-xs cursor-pointer"
          >
            Get in Touch
          </a>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
